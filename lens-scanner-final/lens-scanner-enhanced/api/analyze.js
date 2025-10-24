import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import Tesseract from 'tesseract.js';
import jsQR from 'jsqr';
import axios from 'axios';
import { createCanvas, loadImage } from 'canvas';

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.json());

app.post('/api/analyze', upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No image uploaded' });
  const imagePath = path.join(process.cwd(), req.file.path);

  let result = {
    product: null,
    object: null,
    qr: null,
    text: null,
    caption: null,
    confidence: null
  };

  try {
    // Load image
    const img = await loadImage(imagePath);
    const canvas = createCanvas(img.width, img.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    // QR / Barcode detection
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, canvas.width, canvas.height);
    if (code) result.qr = code.data;

    // OCR text recognition
    const ocr = await Tesseract.recognize(imagePath, 'eng');
    result.text = ocr.data.text.trim();

    // Object recognition using HuggingFace API (free)
    try {
      if (process.env.HF_API_TOKEN) {
        const imageBuffer = fs.readFileSync(imagePath);
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
        const imageBuffer = fs.readFileSync(imagePath);
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
  } finally {
    // Cleanup uploaded file
    fs.unlinkSync(imagePath);
  }
});

app.listen(3007, () => console.log('API running on http://localhost:3007'));