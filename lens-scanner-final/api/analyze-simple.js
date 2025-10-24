// Simplified analyze.js API
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

// Utility function to decode image buffer for QR detection
async function decodeImageBuffer(buffer) {
  try {
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

app.post("/api/analyze", async (req, res) => {
  if (!req.files || !req.files.image) {
    return res.status(400).json({ error: "No image uploaded" });
  }

  const imageFile = req.files.image;
  const imageBuffer = imageFile.data;
  
  try {
    // ---------- QR Code detection ----------
    let qr = null;
    try {
      const { data, width, height } = await decodeImageBuffer(imageBuffer);
      const qrCode = jsQR(data, width, height);
      qr = qrCode?.data || null;
    } catch (err) {
      console.warn("QR detection failed:", err.message);
    }

    // ---------- OCR ----------
    let text = "";
    try {
      const processedBuffer = await sharp(imageBuffer)
        .rotate()
        .resize(1600, null, { withoutEnlargement: true })
        .greyscale()
        .normalize()
        .toBuffer();
        
      const ocrRes = await Tesseract.recognize(processedBuffer, "eng");
      text = ocrRes.data.text.trim();
    } catch (err) {
      console.warn("OCR failed:", err.message);
    }

    // ---------- Object recognition (HuggingFace API) ----------
    let object = null;
    let objectConfidence = 0;
    if (process.env.HF_API_TOKEN) {
      try {
        const hfRes = await fetch(
          "https://api-inference.huggingface.co/models/google/vit-base-patch16-224",
          {
            method: "POST",
            headers: { 
              "Authorization": `Bearer ${process.env.HF_API_TOKEN}`,
              "Content-Type": "application/octet-stream"
            },
            body: imageBuffer
          }
        );
        const hfData = await hfRes.json();
        object = hfData?.[0]?.label || null;
        objectConfidence = hfData?.[0]?.score || 0;
      } catch (err) {
        console.warn("Object recognition failed:", err.message);
      }
    }

    // ---------- Optional BLIP captions ----------
    let caption = null;
    if (process.env.HF_API_TOKEN && process.env.USE_BLIP === "true") {
      try {
        const hfRes = await fetch(
          "https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-base",
          {
            method: "POST",
            headers: { 
              "Authorization": `Bearer ${process.env.HF_API_TOKEN}`,
              "Content-Type": "application/octet-stream"
            },
            body: imageBuffer
          }
        );
        const hfData = await hfRes.json();
        caption = hfData?.[0]?.generated_text || null;
      } catch (err) {
        console.warn("BLIP API failed:", err.message);
      }
    }

    // ---------- Merge results ----------
    const product = qr || text || object || "Unknown";
    const confidence = Math.max(qr ? 0.99 : 0, text ? 0.8 : 0, objectConfidence);

    res.json({
      product,
      qr,
      text,
      object,
      caption,
      confidence
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to analyze image" });
  }
});

app.listen(3007, () => console.log("API running on http://localhost:3007"));