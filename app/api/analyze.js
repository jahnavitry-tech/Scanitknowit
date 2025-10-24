import express from 'express';
import formidable from 'formidable';
import fs from 'fs';
import Tesseract from 'tesseract.js';
import jsQR from 'jsqr';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import sharp from 'sharp';

dotenv.config();
const PORT = 3007;

// Vercel config for handling multipart/form-data
export const config = {
  api: {
    bodyParser: false, // required for formidable
  },
};

// Helper function to validate file exists
function validateFile(filePath) {
  if (!filePath) {
    throw new Error('File path is undefined');
  }
  
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found at path: ${filePath}`);
  }
  
  const stats = fs.statSync(filePath);
  if (stats.size === 0) {
    throw new Error('File is empty');
  }
  
  return true;
}

// Helper function to decode image buffer for QR detection
async function decodeImageBuffer(buffer) {
  try {
    // Validate buffer
    if (!buffer || buffer.length === 0) {
      throw new Error('Invalid image buffer');
    }
    
    const img = sharp(buffer);
    const { data, info } = await img.raw().ensureAlpha().toBuffer({ resolveWithObject: true });
    return {
      data: new Uint8ClampedArray(data.buffer, data.byteOffset, data.byteLength),
      width: info.width,
      height: info.height
    };
  } catch (err) {
    console.error('Error decoding image buffer:', err);
    throw new Error(`Failed to decode image: ${err.message}`);
  }
}

// Helper function for BLIP captioning
async function generateBLIPCaption(buffer) {
  // Check if HF API token is available
  const HF_API_TOKEN = process.env.HF_API_TOKEN;
  if (!HF_API_TOKEN) {
    console.log('HF_API_TOKEN not set, skipping BLIP caption generation');
    return null;
  }

  try {
    console.log('Generating BLIP caption...');
    
    // Validate buffer
    if (!buffer || buffer.length === 0) {
      throw new Error('Invalid image buffer for BLIP');
    }
    
    // Call Hugging Face Inference API for BLIP image captioning
    const response = await fetch(
      'https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-base',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${HF_API_TOKEN}`,
          'Content-Type': 'application/octet-stream'
        },
        body: buffer
      }
    );

    // Check if the response is successful
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`BLIP API error (${response.status}): ${errorText}`);
    }

    // Parse the JSON response
    const jsonData = await response.json();
    
    // Validate the response structure
    if (Array.isArray(jsonData) && jsonData[0] && jsonData[0].generated_text) {
      console.log('BLIP caption generated successfully');
      return {
        value: jsonData[0].generated_text,
        source: 'BLIP Caption',
        confidence: 0.75
      };
    } else {
      console.warn('Unexpected BLIP API response format:', jsonData);
      return null;
    }
  } catch (error) {
    console.warn('BLIP caption generation failed:', error.message);
    return null;
  }
}

// Helper: read multipart/form-data using formidable, return buffer
async function parseImageFromRequest(req) {
  return new Promise((resolve, reject) => {
    const form = new formidable({ 
      multiples: false, 
      keepExtensions: true, 
      maxFileSize: 10 * 1024 * 1024 // 10MB limit
    });
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
        return;
      }
      // Try common field names
      const file = files.file || files.image || Object.values(files)[0];
      if (!file) {
        reject(new Error("No file uploaded"));
        return;
      }
      // formidable gives path; read into buffer
      fs.readFile(file.filepath || file.path, (readErr, data) => {
        if (readErr) return reject(readErr);
        resolve(data);
      });
    });
  });
}

// Helper: run OCR with tesseract.js
async function runOCR(imageBuffer) {
  try {
    const { data } = await Tesseract.recognize(imageBuffer, "eng", {
      logger: () => {}, // suppress logs
    });
    const text = (data && data.text) ? data.text.trim() : "";
    const confidence = data && data.confidence ? Math.max(0, Math.min(100, data.confidence)) / 100 : (text ? 0.6 : 0.0);
    return { text, confidence };
  } catch (err) {
    console.warn("OCR error:", err);
    return { text: "", confidence: 0, error: String(err) };
  }
}

// Helper: try QR decode via jsqr
async function runQRDecode(imageBuffer) {
  try {
    // Use sharp to produce raw RGBA pixels
    const img = sharp(imageBuffer);
    const { data, info } = await img.raw().ensureAlpha().toBuffer({ resolveWithObject: true });
    const width = info.width;
    const height = info.height;
    const clamped = new Uint8ClampedArray(data.buffer, data.byteOffset, data.byteLength);
    const code = jsQR(clamped, width, height);
    if (code) {
      return { data: code.data, location: code.location };
    } else {
      return { data: null };
    }
  } catch (err) {
    console.warn("QR decode failed:", err && err.message ? err.message : err);
    return { data: null, error: String(err) };
  }
}

// Merge & rank results: create 'guesses' array with value, confidence (0..1), source
function mergeAndRank({ ocr, qr, caption }) {
  const guesses = [];

  // Add QR first (very high confidence if present) - make it the top priority
  if (qr && qr.data) {
    // If QR data looks like a URL or product identifier, use it as the top result
    const isProductIdentifier = /^[\w\-\.]+\/[\w\-\.\/\?=&%]+$/.test(qr.data) || 
                               /^[\d\w]{8,}$/.test(qr.data) || // UPC/EAN-like
                               qr.data.includes("product") || 
                               qr.data.includes("item");
    
    guesses.push({
      value: qr.data,
      confidence: isProductIdentifier ? 0.99 : 0.95, // Even higher confidence for product identifiers
      source: "qr"
    });
  }

  // From OCR — include entire OCR text as a guess and also individual lines that look like product names
  if (ocr && ocr.text) {
    // Clean and split into lines
    const lines = ocr.text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    // Heuristic: product-name-like lines are those with words and capital letters and length between 3 and 60
    lines.forEach((line) => {
      // skip if obviously numeric or ingredient lists
      if (/^[\d\W]+$/.test(line)) return;
      // heuristic score: longer and mixed-case gets higher score
      let score = 0.55;
      if (/[A-Z][a-z]/.test(line)) score += 0.1;
      if (line.length > 20) score -= 0.05;
      if (/[A-Za-z]/.test(line) && line.length <= 120) {
        // Boost confidence for lines that look like product names
        const isProductName = /\b(coke|pepsi|sprite|lays|doritos|kellogg|nestle|unilever|procter|coca[-\s]cola|pepsi[-\s]co)\b/i.test(line) ||
                             /^[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*$/.test(line); // Title case names
        guesses.push({ 
          value: line, 
          confidence: isProductName ? Math.min(0.9, score + 0.2) : Math.min(0.85, score), 
          source: "ocr" 
        });
      }
    });
    // Also push full OCR text as low-confidence context guess
    guesses.push({ 
      value: ocr.text, 
      confidence: Math.min(0.5, (ocr.confidence || 0.4)), 
      source: "ocr_full" 
    });
  }

  // Add caption result if available
  if (caption) {
    guesses.push(caption);
  }

  // Deduplicate by normalized value, keep highest confidence
  const map = new Map();
  for (const g of guesses) {
    const key = String(g.value).trim().toLowerCase().replace(/\s+/g, " ");
    const prev = map.get(key);
    if (!prev || g.confidence > prev.confidence) map.set(key, g);
  }
  const deduped = Array.from(map.values());
  // Sort by confidence desc
  deduped.sort((a, b) => b.confidence - a.confidence);

  return deduped;
}

// Main handler for Vercel
export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ success: false, error: "Only POST allowed" });
    }

    // Parse image buffer
    let imageBuffer;
    try {
      imageBuffer = await parseImageFromRequest(req);
    } catch (err) {
      return res.status(400).json({ success: false, error: "No image or invalid upload", details: String(err) });
    }

    // Run analysis in parallel
    const [ocr, qr, caption] = await Promise.all([
      runOCR(imageBuffer),
      runQRDecode(imageBuffer),
      generateBLIPCaption(imageBuffer)
    ]);

    // Merge and rank results
    const ranked = mergeAndRank({ ocr, qr, caption });

    // Return structured result
    return res.status(200).json({
      success: true,
      source_summary: {
        ocr: !!(ocr && ocr.text),
        qr: !!(qr && qr.data),
        caption: !!(caption)
      },
      results: ranked,
    });
  } catch (err) {
    console.error("Analysis error:", err);
    return res.status(500).json({ success: false, error: String(err) });
  }
}

// Local development server
if (process.env.NODE_ENV !== "production") {
  const app = express();
  app.use(express.json());
  
  // Use our handler function
  app.post("/api/analyze", async (req, res) => {
    // Mock the Vercel request/response objects
    const mockReq = {
      ...req,
      method: req.method,
      headers: req.headers,
    };
    
    const mockRes = {
      status: (code) => ({
        json: (data) => res.status(code).json(data),
      }),
    };
    
    await handler(mockReq, mockRes);
  });
  
  app.listen(PORT, () => {
    console.log(`Local API server running on http://localhost:${PORT}`);
  });
}