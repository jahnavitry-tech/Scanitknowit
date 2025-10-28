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

    // Run OCR first (needed for UPC lookup)
    let ocrResult = null;
    try {
      console.log('Attempting OCR...');
      const ocr = await Tesseract.recognize(imageBuffer, 'eng', {
        logger: info => console.log('OCR progress:', info)
      });
      
      ocrResult = { text: ocr.data.text.trim() };
      result.text = ocrResult.text;
      
      console.log('OCR completed, text length:', result.text.length);
      console.log('Raw text:', result.text);
    } catch (err) {
      console.warn('OCR failed:', err.message);
    }

    // Run all other analysis methods in parallel
    const [upcResult, objectResult, blipResult] = await Promise.allSettled([
      // UPC lookup (depends on OCR)
      (async () => {
        try {
          if (ocrResult && ocrResult.text) {
            console.log('Attempting UPC lookup...');
            const upcCode = extractUPC(ocrResult.text);
            if (upcCode) {
              console.log('Found potential UPC code:', upcCode);
              const upcItem = await lookupUPC(upcCode);
              if (upcItem) {
                console.log('UPC lookup successful:', upcItem.title);
                return { item: upcItem, code: upcCode };
              }
            }
          }
          return null;
        } catch (err) {
          console.warn('UPC lookup failed:', err.message);
          return null;
        }
      })(),
      
      // Object recognition
      (async () => {
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
              return {
                label: hfRes.data[0].label,
                confidence: (hfRes.data[0].score * 100).toFixed(1)
              };
            }
          } else {
            console.log('No HF_API_TOKEN provided, skipping object recognition');
          }
          return null;
        } catch (err) {
          console.warn('Object recognition failed:', err.message);
          return null;
        }
      })(),
      
      // BLIP caption
      (async () => {
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
              return { caption: blipRes.data[0].generated_text };
            }
          } else if (!hfToken) {
            console.log('No HF_API_TOKEN provided, skipping BLIP caption generation');
          }
          return null;
        } catch (err) {
          console.warn('BLIP caption failed:', err.message);
          return null;
        }
      })()
    ]);

    // Process results
    if (upcResult.status === 'fulfilled' && upcResult.value) {
      const upcItem = upcResult.value.item;
      result.candidates.push({ 
        source: 'upc', 
        value: upcItem.title || upcItem.product_name || 'Unknown Product', 
        confidence: 90 
      });
    }
    
    if (objectResult.status === 'fulfilled' && objectResult.value) {
      const obj = objectResult.value;
      result.object = obj.label;
      result.confidence = obj.confidence;
      result.candidates.push({ 
        source: 'object', 
        value: obj.label, 
        confidence: parseFloat(obj.confidence) 
      });
    }
    
    if (blipResult.status === 'fulfilled' && blipResult.value) {
      result.caption = blipResult.value.caption;
      result.candidates.push({ 
        source: 'caption', 
        value: blipResult.value.caption, 
        confidence: 75 
      });
    }

    // Final product name selection
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
    
    // Add timestamp for caching
    result.timestamp = Date.now();
    
    // Save to cache if imageHash is available
    if (req.imageHash) {
      // Create a copy of the result for caching
      const cachedResult = { ...result };
      
      // Set cache expiration
      setTimeout(() => {
        global.analysisCache.delete(req.imageHash);
      }, 60 * 60 * 1000); // 1 hour
      
      // Save to cache (if global.analysisCache is available)
      if (global.analysisCache) {
        global.analysisCache.set(req.imageHash, cachedResult);
      }
    }
    
    res.json(result);
  } catch (err) {
    console.error('Analysis failed:', err);
    res.status(500).json({ error: 'Failed to analyze image', details: err.message });
  }
});

module.exports = router;