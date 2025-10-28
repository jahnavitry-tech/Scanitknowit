import formidable from "formidable";
import fs from "fs";
import Tesseract from "tesseract.js";
import jsQR from "jsqr";
import fetch from "node-fetch";
import * as tf from "@tensorflow/tfjs-node";
import * as mobilenet from "@tensorflow-models/mobilenet";
import sharp from "sharp";

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  
  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const form = formidable({ multiples: false });

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: "Failed to parse file" });
    const file = files.file;
    if (!file) return res.status(400).json({ error: "No file uploaded" });

    try {
      // Read image buffer
      const imageBuffer = fs.readFileSync(file.filepath);
      
      // QR detection
      const img = sharp(imageBuffer);
      const { data, info } = await img.raw().ensureAlpha().toBuffer({ resolveWithObject: true });
      const width = info.width;
      const height = info.height;
      const clamped = new Uint8ClampedArray(data.buffer, data.byteOffset, data.byteLength);
      const qr = jsQR(clamped, width, height);
      
      let results = [];
      if (qr) results.push({ value: qr.data, source: "QR Code", confidence: 0.99 });

      // OCR
      const { data: { text } } = await Tesseract.recognize(imageBuffer, "eng");
      if (text) results.push({ value: text.trim().substring(0, 150), source: "Text Detection", confidence: 0.85 });

      // Object recognition
      const tensor = tf.node.decodeImage(imageBuffer);
      const model = await mobilenet.load();
      const predictions = await model.classify(tensor);
      predictions.forEach((p) => results.push({ value: p.className, source: "Object Recognition", confidence: p.probability }));

      // Optional BLIP captions (Hugging Face)
      if (process.env.HF_API_TOKEN) {
        const hfRes = await fetch("https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-base", {
          method: "POST",
          headers: { Authorization: `Bearer ${process.env.HF_API_TOKEN}` },
          body: imageBuffer,
        });
        const hfJson = await hfRes.json();
        if (hfJson[0]?.generated_text) {
          results.push({ value: hfJson[0].generated_text, source: "Caption", confidence: 0.75 });
        }
      }

      res.status(200).json({ results: results.sort((a, b) => b.confidence - a.confidence) });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to analyze image" });
    } finally {
      // Clean up temporary file
      try {
        fs.unlinkSync(file.filepath);
      } catch (e) {
        console.warn("Failed to clean up temporary file:", e);
      }
    }
  });
}