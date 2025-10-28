const express = require("express");
const multer = require("multer");
const axios = require("axios");
const Tesseract = require("tesseract.js");

const router = express.Router();
const upload = multer();

// UPC lookup function using free UPCitemdb API
async function lookupUPC(upc) {
  try {
    // Use the trial endpoint (no API key required)
    const baseURL = process.env.UPCITEMDB_BASE_URL || 'https://api.upcitemdb.com/prod/trial';
    const response = await axios.get(`${baseURL}/lookup?upc=${upc}`);
    
    if (response.data && response.data.items && response.data.items.length > 0) {
      return response.data.items[0]; // Return the first item found
    }
    return null;
  } catch (err) {
    console.warn('UPC lookup failed:', err.message);
    return null;
  }
}

// Extract potential UPC codes from text
function extractUPC(text) {
  if (!text) return null;
  
  // Regular expressions for different barcode formats
  const upcPatterns = [
    /\b(\d{12})\b/,     // Standard UPC-A (12 digits)
    /\b(\d{13})\b/,     // EAN-13 (13 digits)
    /\b(\d{8})\b/       // EAN-8 (8 digits)
  ];
  
  for (const pattern of upcPatterns) {
    const match = text.match(pattern);
    if (match) {
      return match[1]; // Return the captured group
    }
  }
  
  return null;
}

router.post("/analyze", upload.single("image"), async (req, res) => {
  try {
    // Validate input
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    const imageBuffer = req.file.buffer;

    console.log('Received image for analysis, size:', imageBuffer.length, 'bytes');

    let result = {
      product: null,
      object: null,
      qr: null,
      text: null,
      caption: null,
      confidence: null,
      candidates: [] // Store all candidates for better decision making
    };

    // OCR text recognition
    try {
      console.log('Attempting OCR...');
      const ocr = await Tesseract.recognize(imageBuffer, 'eng', {
        logger: info => console.log('OCR progress:', info)
      });
      
      const rawText = ocr.data.text.trim();
      result.text = rawText;
      
      console.log('OCR completed, text length:', result.text.length);
      console.log('Raw text:', result.text);
    } catch (err) {
      console.warn('OCR failed:', err.message);
    }

    // UPC lookup using free UPCitemdb API
    try {
      if (result.text) {
        console.log('Attempting UPC lookup...');
        const upcCode = extractUPC(result.text);
        if (upcCode) {
          console.log('Found potential UPC code:', upcCode);
          const upcItem = await lookupUPC(upcCode);
          if (upcItem) {
            result.candidates.push({ 
              source: 'upc', 
              value: upcItem.title || upcItem.product_name || 'Unknown Product', 
              confidence: 90 
            });
            console.log('UPC lookup successful:', upcItem.title);
          } else {
            console.log('No product found for UPC:', upcCode);
          }
        } else {
          console.log('No UPC code found in text');
        }
      }
    } catch (err) {
      console.warn('UPC lookup failed:', err.message);
    }

    // Object recognition - only if token is provided
    try {
      // Use the HF_API_TOKEN from environment variables
      const hfToken = process.env.HF_API_TOKEN;
      
      if (hfToken) {
        console.log('Attempting object recognition with HuggingFace...');
        const hfRes = await axios.post(
          'https://api-inference.huggingface.co/models/google/vit-base-patch16-224',
          imageBuffer,
          {
            headers: {
              Authorization: `Bearer ${hfToken}`,
              'Content-Type': 'application/octet-stream'
            }
          }
        );
        if (hfRes.data && hfRes.data.length) {
          result.object = hfRes.data[0].label;
          result.confidence = (hfRes.data[0].score * 100).toFixed(1);
          result.candidates.push({ 
            source: 'object', 
            value: hfRes.data[0].label, 
            confidence: parseFloat(result.confidence) 
          });
          console.log('Object detected:', result.object, 'with confidence:', result.confidence);
        }
      } else {
        console.log('No HF_API_TOKEN provided, skipping object recognition');
      }
    } catch (err) {
      console.warn('Object recognition failed:', err.message);
    }

    // Optional BLIP caption - only if token is provided and enabled
    try {
      // Use the HF_API_TOKEN from environment variables
      const hfToken = process.env.HF_API_TOKEN;
      const useBlip = process.env.USE_BLIP === 'true';
      
      if (useBlip && hfToken) {
        console.log('Attempting BLIP caption generation...');
        const blipRes = await axios.post(
          'https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-base',
          imageBuffer,
          {
            headers: {
              Authorization: `Bearer ${hfToken}`,
              'Content-Type': 'application/octet-stream'
            }
          }
        );
        if (blipRes.data && blipRes.data[0]?.generated_text) {
          result.caption = blipRes.data[0].generated_text;
          result.candidates.push({ source: 'caption', value: blipRes.data[0].generated_text, confidence: 75 });
          console.log('Caption generated:', result.caption);
        }
      } else if (!hfToken) {
        console.log('No HF_API_TOKEN provided, skipping BLIP caption generation');
      }
    } catch (err) {
      console.warn('BLIP caption failed:', err.message);
    }

    // Final product name selection: UPC > OCR text > object
    if (result.candidates.length > 0) {
      // Sort by confidence (highest first)
      result.candidates.sort((a, b) => b.confidence - a.confidence);
      
      // Select the best candidate
      result.product = result.candidates[0].value;
      result.confidence = result.candidates[0].confidence;
      console.log('Selected product name:', result.product, 'with confidence:', result.confidence);
    } else if (result.text) {
      // Fallback to first line of OCR text
      result.product = result.text.split('\n')[0] || 'Unknown';
      result.confidence = 50;
    } else {
      result.product = result.object || 'Unknown';
      result.confidence = result.object ? 70 : 0;
    }

    console.log('Analysis completed successfully');
    res.json(result);
  } catch (err) {
    console.error('Analysis failed:', err);
    res.status(500).json({ error: 'Failed to analyze image', details: err.message });
  }
});

module.exports = router;