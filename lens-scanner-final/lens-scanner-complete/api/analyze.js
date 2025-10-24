import express from "express";
import multer from "multer";
import fs from "fs";
import jsQR from "jsqr";
import Tesseract from "tesseract.js";
import { createCanvas, loadImage } from "canvas";
import fetch from "node-fetch";

const upload = multer({ dest: "uploads/" });
const app = express();

app.post("/api/analyze", upload.single("image"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No image uploaded" });

  const filePath = req.file.path;
  try {
    const imageBuffer = fs.readFileSync(filePath);
    const img = await loadImage(imageBuffer);

    // ---------- QR Code detection ----------
    const canvas = createCanvas(img.width, img.height);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, img.width, img.height);
    const imgData = ctx.getImageData(0, 0, img.width, img.height);
    const qrCode = jsQR(new Uint8ClampedArray(imgData.data), img.width, img.height);
    const qr = qrCode?.data || null;

    // ---------- OCR ----------
    const ocrRes = await Tesseract.recognize(imageBuffer, "eng");
    const text = ocrRes.data.text.trim();

    // ---------- Object recognition (MobileNet) ----------
    // Note: In a production environment, you would implement actual object recognition here
    // For this example, we'll simulate object detection
    const detectedObject = null;
    const objectConfidence = 0;

    // ---------- Optional BLIP captions ----------
    let caption = null;
    if (process.env.HF_API_TOKEN) {
      try {
        const hfRes = await fetch(
          "https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-base",
          {
            method: "POST",
            headers: { Authorization: `Bearer ${process.env.HF_API_TOKEN}` },
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
    const product = qr || text || detectedObject || "Unknown";
    const confidence = Math.max(qr ? 0.99 : 0, text ? 0.8 : 0, objectConfidence);

    res.json({
      product,
      qr,
      text,
      object: detectedObject,
      caption,
      confidence: (confidence * 100).toFixed(1)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to analyze image" });
  } finally {
    fs.unlinkSync(filePath);
  }
});

app.listen(3007, () => console.log("API running on http://localhost:3007"));