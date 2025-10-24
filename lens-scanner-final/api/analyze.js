import express from "express";
import fileUpload from "express-fileupload";
import Tesseract from "tesseract.js";
import jsQR from "jsqr";
import fs from "fs";
import fetch from "node-fetch";
import dotenv from "dotenv";
import sharp from "sharp";

dotenv.config();
const app = express();
app.use(fileUpload());

const PORT = process.env.PORT || 3007;
const USE_BLIP = process.env.USE_BLIP === "true";
const HF_API_TOKEN = process.env.HF_API_TOKEN;

// Utility function to decode image buffer for QR detection
async function decodeImageBuffer(buffer) {
  try {
    // Use sharp to process the image
    const img = sharp(buffer);
    const metadata = await img.metadata();
    
    // Resize image for QR detection if it's too large
    const resized = await img
      .resize({ width: Math.min(metadata.width, 1000), withoutEnlargement: true })
      .raw()
      .ensureAlpha()
      .toBuffer({ resolveWithObject: true });
    
    const { data, info } = resized;
    const clamped = new Uint8ClampedArray(data.buffer, data.byteOffset, data.byteLength);
    return { data: clamped, width: info.width, height: info.height };
  } catch (err) {
    console.error("Error decoding image buffer:", err);
    throw err;
  }
}

async function scanQR(imageBuffer) {
  try {
    const { data, width, height } = await decodeImageBuffer(imageBuffer);
    const code = jsQR(data, width, height);
    return code ? code.data : null;
  } catch (err) {
    console.warn("QR detection failed:", err.message);
    return null;
  }
}

async function runOCR(imageBuffer) {
  try {
    // Preprocess image for better OCR results
    const processedBuffer = await sharp(imageBuffer)
      .rotate() // Auto-rotate based on EXIF
      .resize(1600, null, { withoutEnlargement: true })
      .greyscale()
      .normalize()
      .toBuffer();
      
    const { data: { text } } = await Tesseract.recognize(processedBuffer, "eng", {
      logger: m => {
        // Optionally log progress
      }
    });
    return text.trim();
  } catch (err) {
    console.warn("OCR failed:", err.message);
    return "";
  }
}

async function runObjectRecognition(imageBuffer) {
  // Simple example using HuggingFace inference API
  if (!HF_API_TOKEN) return null;
  
  try {
    const res = await fetch("https://api-inference.huggingface.co/models/google/vit-base-patch16-224", {
      method: "POST",
      headers: { 
        "Authorization": `Bearer ${HF_API_TOKEN}`,
        "Content-Type": "application/octet-stream"
      },
      body: imageBuffer,
    });
    
    if (!res.ok) {
      console.warn(`Object recognition API error: ${res.status} ${res.statusText}`);
      return null;
    }
    
    const data = await res.json();
    if (data && data.length > 0 && data[0].label) {
      return { 
        object: data[0].label, 
        confidence: data[0].score || 0.8 
      };
    }
    return null;
  } catch (err) {
    console.warn("Object recognition failed:", err.message);
    return null;
  }
}

async function runBLIPCaption(imageBuffer) {
  if (!USE_BLIP || !HF_API_TOKEN) return null;
  
  try {
    const res = await fetch("https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-base", {
      method: "POST",
      headers: { 
        "Authorization": `Bearer ${HF_API_TOKEN}`,
        "Content-Type": "application/octet-stream"
      },
      body: imageBuffer,
    });
    
    if (!res.ok) {
      console.warn(`BLIP caption API error: ${res.status} ${res.statusText}`);
      return null;
    }
    
    const data = await res.json();
    if (data && data.generated_text) {
      return data.generated_text;
    }
    return null;
  } catch (err) {
    console.warn("BLIP caption failed:", err.message);
    return null;
  }
}

// Merge results intelligently with priority ranking
function mergeResults(qr, ocr, obj, caption) {
  // Priority 1: QR code (highest confidence)
  if (qr) {
    return {
      product_name: qr,
      source: "qr",
      confidence: 0.99
    };
  }
  
  // Priority 2: Object recognition with high confidence
  if (obj && obj.confidence > 0.8) {
    return {
      product_name: obj.object,
      source: "object",
      confidence: obj.confidence
    };
  }
  
  // Priority 3: OCR text if substantial
  if (ocr && ocr.length > 3) {
    // Extract potential product names from OCR text
    const lines = ocr.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
    if (lines.length > 0) {
      // Return the first substantial line as the product name
      const productName = lines[0].substring(0, 100); // Limit length
      return {
        product_name: productName,
        source: "ocr",
        confidence: Math.min(0.8, lines[0].length / 50) // Confidence based on length
      };
    }
  }
  
  // Priority 4: Object recognition with any confidence
  if (obj) {
    return {
      product_name: obj.object,
      source: "object",
      confidence: obj.confidence
    };
  }
  
  // Priority 5: BLIP caption
  if (caption) {
    return {
      product_name: caption,
      source: "caption",
      confidence: 0.7
    };
  }
  
  // Fallback: Unknown
  return {
    product_name: "Unknown",
    source: "unknown",
    confidence: 0.1
  };
}

app.post("/api/analyze", async (req, res) => {
  try {
    if (!req.files || !req.files.image) {
      return res.status(400).json({ error: "No image uploaded" });
    }
    
    const imageFile = req.files.image;
    const imageBuffer = imageFile.data;

    // Run all analyses in parallel
    const [qr, ocr, obj, caption] = await Promise.all([
      scanQR(imageBuffer),
      runOCR(imageBuffer),
      runObjectRecognition(imageBuffer),
      runBLIPCaption(imageBuffer)
    ]);

    // Merge results intelligently
    const result = mergeResults(qr, ocr, obj, caption);

    res.json({
      product_name: result.product_name,
      qr_code: qr,
      text: ocr,
      object: obj?.object,
      object_confidence: obj?.confidence,
      caption,
      source: result.source,
      confidence: result.confidence,
      details: {
        qr_detected: !!qr,
        ocr_extracted: !!ocr,
        object_detected: !!obj,
        caption_generated: !!caption
      }
    });
  } catch (err) {
    console.error("Analysis failed:", err);
    res.status(500).json({ error: "Failed to analyze image", details: err.message });
  }
});

app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));