import express from 'express';
import fileUpload from 'express-fileupload';
import fs from 'fs';
import path from 'path';
import Tesseract from 'tesseract.js';
import jsQR from 'jsqr';
import axios from 'axios';
import sharp from 'sharp';

const app = express();
app.use(fileUpload());

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

app.use(express.json());

app.post('/api/analyze', async (req, res) => {
  if (!req.files || !req.files.image) return res.status(400).json({ error: 'No image uploaded' });
  const imageFile = req.files.image;
  const imageBuffer = imageFile.data;

  let result = {
    product: null,
    object: null,
    qr: null,
    text: null,
    caption: null,
    confidence: null
  };

  try {
    // QR / Barcode detection
    try {
      const { data, width, height } = await decodeImageBuffer(imageBuffer);
      const code = jsQR(data, width, height);
      if (code) result.qr = code.data;
    } catch (err) {
      console.warn('QR detection failed:', err.message);
    }

    // OCR text recognition
    try {
      // Preprocess image for better OCR results
      const processedBuffer = await sharp(imageBuffer)
        .rotate() // Auto-rotate based on EXIF
        .resize(1600, null, { withoutEnlargement: true })
        .greyscale()
        .normalize()
        .toBuffer();
        
      const ocr = await Tesseract.recognize(processedBuffer, 'eng');
      result.text = ocr.data.text.trim();
    } catch (err) {
      console.warn('OCR failed:', err.message);
    }

    // Object recognition using HuggingFace API (free)
    try {
      if (process.env.HF_API_TOKEN) {
        const hfRes = await axios.post(
          'https://api-inference.huggingface.co/models/google/vit-base-patch16-224',
          imageBuffer,
          {
            headers: {
              Authorization: `Bearer ${process.env.HF_API_TOKEN}`,
              'Content-Type': 'application/octet-stream'
            }
          }
        );
        if (hfRes.data && hfRes.data.length) {
          result.object = hfRes.data[0].label;
          result.confidence = (hfRes.data[0].score * 100).toFixed(1);
        }
      }
    } catch (err) {
      console.warn('Object recognition failed', err.message);
    }

    // Optional BLIP caption
    try {
      if (process.env.USE_BLIP === 'true' && process.env.HF_API_TOKEN) {
        const blipRes = await axios.post(
          'https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-base',
          imageBuffer,
          {
            headers: {
              Authorization: `Bearer ${process.env.HF_API_TOKEN}`,
              'Content-Type': 'application/octet-stream'
            }
          }
        );
        if (blipRes.data && blipRes.data[0]?.generated_text) {
          result.caption = blipRes.data[0].generated_text;
        }
      }
    } catch (err) {
      console.warn('BLIP caption failed', err.message);
    }

    // Final product name fallback: use QR > OCR text > object
    if (!result.product) {
      result.product = result.qr || result.text.split('\n')[0] || result.object || 'Unknown';
    }

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to analyze image' });
  }
});

app.listen(3007, () => console.log('API running on http://localhost:3007'));