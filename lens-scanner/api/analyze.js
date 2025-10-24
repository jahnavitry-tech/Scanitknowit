/**
 * api/analyze.js
 *
 * Express-compatible handler that:
 * - Accepts image uploads (multipart/form-data or raw binary)
 * - Runs QR detection (jsQR)
 * - Runs OCR (tesseract.js)
 * - Runs MobileNet object recognition (optional)
 * - Calls Hugging Face BLIP for captioning (optional)
 * - Merges & ranks results and returns JSON
 *
 * Note: this file uses CommonJS (node). If your project expects ESM adapt imports accordingly.
 */

const express = require("express");
const formidable = require("formidable");
const { createWorker } = require("tesseract.js");
const jsQR = require("jsqr");
const sharp = require("sharp");
const fetch = require("node-fetch"); // Node 18+ has global fetch - adjust if necessary
const fs = require("fs");
const path = require("path");

const HF_API_TOKEN = process.env.HF_API_TOKEN || "";
const USE_BLIP = (process.env.USE_BLIP || "true").toLowerCase() === "true";
const OPENFOODFACTS = (process.env.OPENFOODFACTS || "false").toLowerCase() === "true";

let mobilenetModel = null;
let tf = null;
async function tryLoadMobileNet() {
  if (mobilenetModel || process.env.SKIP_MOBILENET === "true") return;
  try {
    tf = require("@tensorflow/tfjs-node");
    const mobilenet = require("@tensorflow-models/mobilenet");
    mobilenetModel = await mobilenet.load({ version: 2, alpha: 1.0 });
    console.log("MobileNet loaded.");
  } catch (err) {
    console.warn("MobileNet / tf failed to load (optional). Object recognition disabled.", err.message || err);
    mobilenetModel = null;
    tf = null;
  }
}

// Utility: parse multipart/form-data (returns Buffer)
function parseForm(req) {
  return new Promise((resolve, reject) => {
    const form = formidable({ multiples: false });
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      // file may be under files.file or files.image
      const file =
        files?.file || files?.image || Object.values(files || {})[0] || null;
      if (!file) {
        // Maybe request body is raw binary
        let data = [];
        req.on("data", (chunk) => data.push(chunk));
        req.on("end", () => {
          const buf = Buffer.concat(data);
          if (buf.length === 0) return reject(new Error("No file uploaded"));
          resolve({ buffer: buf, fields });
        });
        req.on("error", (e) => reject(e));
        return;
      }
      // formidable stores file path - read it
      fs.readFile(file.filepath || file.path, (fsErr, data) => {
        if (fsErr) return reject(fsErr);
        resolve({ buffer: data, fields });
      });
    });
  });
}

// QR detection
async function detectQRCode(buffer) {
  try {
    // downscale large images for QR scanning speed
    const resized = await sharp(buffer)
      .rotate()
      .resize({ width: 1200, withoutEnlargement: true })
      .raw()
      .ensureAlpha()
      .toBuffer({ resolveWithObject: true });
    
    const { data, info } = resized;
    const clamped = new Uint8ClampedArray(data.buffer, data.byteOffset, data.byteLength);
    const code = jsQR(clamped, info.width, info.height);
    if (code) {
      return { text: code.data, confidence: 0.99, bbox: code.location };
    }
    return null;
  } catch (err) {
    console.warn("QR detection failed:", err.message || err);
    return null;
  }
}

// OCR using Tesseract
const _tesseractWorker = createWorker({
  logger: (m) => {
    /* small logger */
    // console.log("TESSERACT:", m);
  },
});
let _tesseractInitialized = false;
async function runOCR(buffer) {
  try {
    if (!_tesseractInitialized) {
      await _tesseractWorker.load();
      await _tesseractWorker.loadLanguage("eng");
      await _tesseractWorker.initialize("eng");
      _tesseractInitialized = true;
    }
    // use sharp to pre-process: rotate, normalize, greyscale for better OCR
    const pre = await sharp(buffer)
      .rotate()
      .resize(1600, null, { withoutEnlargement: true })
      .greyscale()
      .toBuffer();
    const { data } = await _tesseractWorker.recognize(pre);
    const text = (data && data.text) ? data.text.trim() : "";
    // also return raw blocks for heuristic selection
    return { text, raw: data || null, confidence: 0.80 };
  } catch (err) {
    console.warn("OCR failed:", err.message || err);
    return { text: "", raw: null, confidence: 0 };
  }
}

// object recognition (MobileNet) using tfjs-node if available
async function runObjectRecognition(buffer) {
  try {
    if (!mobilenetModel) {
      await tryLoadMobileNet();
      if (!mobilenetModel) return null;
    }
    // decode buffer to tensor via tf.node.decodeImage
    const imageTensor = tf.node.decodeImage(buffer, 3);
    const results = await mobilenetModel.classify(imageTensor);
    imageTensor.dispose();
    if (!results || results.length === 0) return null;
    // results are [{className, probability}, ...]
    return results.map((r) => ({ text: r.className, confidence: r.probability }));
  } catch (err) {
    console.warn("Object recognition failed:", err.message || err);
    return null;
  }
}

// Hugging Face BLIP caption call (optional)
async function runBLIPCaption(buffer) {
  if (!HF_API_TOKEN || !USE_BLIP) return null;
  try {
    // BLIP model endpoint on Hugging Face Inference API
    const res = await fetch("https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-base", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_API_TOKEN}`,
        "Content-Type": "application/octet-stream",
      },
      body: buffer,
    });
    if (!res.ok) {
      console.warn("BLIP returned non-OK:", res.status, res.statusText);
      return null;
    }
    const json = await res.json();
    // API typically returns [{generated_text: "..."}]
    if (Array.isArray(json) && json.length > 0) {
      return { text: json[0].generated_text || json[0].caption || json[0].body || "", confidence: 0.7 };
    }
    // or { generated_text: '...' }
    if (json.generated_text) return { text: json.generated_text, confidence: 0.7 };
    return null;
  } catch (err) {
    console.warn("BLIP caption error:", err.message || err);
    return null;
  }
}

// Heuristic: infer candidate product names from OCR text
function inferNamesFromOCR(fullText) {
  if (!fullText || !fullText.trim()) return [];
  const lines = fullText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  // dedupe, prefer longer lines or lines with Titlecase / brand-like format
  const candidates = [];
  for (let line of lines) {
    // ignore pure nutrition lines and short tokens
    if (line.length < 3) continue;
    // skip lines that are all numbers or obvious nutrition header
    if (/^[0-9\W]+$/.test(line)) continue;
    // skip lines that look like address/contact
    if (/(distributed by|manufactured by|net wt|nutrition facts|ingredients)/i.test(line)) continue;
    candidates.push(line);
  }

  // rank by length and uppercase / Title Case heuristics
  candidates.sort((a, b) => {
    const score = (s) => (s.split(" ").length * 10 + (/[A-Z]/.test(s) ? 2 : 0) + s.length / 10);
    return score(b) - score(a);
  });

  // return top few unique
  const uniq = [...new Set(candidates)].slice(0, 5);
  return uniq;
}

// Search OpenFoodFacts by barcode or textual query (optional)
async function openFoodFactsLookup(upcOrQuery) {
  if (!OPENFOODFACTS) return null;
  try {
    // If numeric barcode, call /api/v0/product/[code].json
    if (/^\d{8,14}$/.test(upcOrQuery)) {
      const url = `https://world.openfoodfacts.org/api/v0/product/${upcOrQuery}.json`;
      const r = await fetch(url);
      if (!r.ok) return null;
      const j = await r.json();
      if (j.status === 1 && j.product && j.product.product_name) {
        return { text: j.product.product_name, source: "OpenFoodFacts", confidence: 0.98, raw: j.product };
      }
      return null;
    } else {
      // search by query
      const q = encodeURIComponent(upcOrQuery);
      const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${q}&search_simple=1&action=process&json=1&page_size=3`;
      const r = await fetch(url);
      if (!r.ok) return null;
      const j = await r.json();
      if (j && j.products && j.products.length > 0) {
        const p = j.products[0];
        return { text: p.product_name || p.generic_name || upcOrQuery, source: "OpenFoodFacts", confidence: 0.9, raw: p };
      }
      return null;
    }
  } catch (err) {
    console.warn("OpenFoodFacts lookup failed", err && err.message);
    return null;
  }
}

// Merge & rank outputs into final results array
function mergeAndRankOutputs({ qr, ocr, objects, caption, offLookup, ocrCandidates }) {
  const items = [];

  // QR priority high
  if (qr && qr.text) {
    let text = qr.text.trim();
    // If QR is a URL or contains 'http', make it readable
    if (/https?:\/\//i.test(text)) {
      // keep URL as text but mark as url
    }
    items.push({ source: "QR", text, confidence: 0.995 });
  }

  // OpenFoodFacts prioritized if provided (barcode detection)
  if (offLookup) items.push({ source: offLookup.source || "OpenFoodFacts", text: offLookup.text, confidence: offLookup.confidence || 0.95 });

  // BLIP caption
  if (caption && caption.text) items.push({ source: "Caption", text: caption.text, confidence: caption.confidence || 0.70 });

  // Object recognition: add several results
  if (objects && Array.isArray(objects)) {
    for (const o of objects) {
      items.push({ source: "Object", text: o.text, confidence: o.confidence || 0.5 });
    }
  }

  // OCR full text / candidates
  if (ocr && ocr.text) {
    // push the full OCR text as low-priority "OCR" item (for context)
    items.push({ source: "OCR_FULL", text: ocr.text, confidence: ocr.confidence || 0.5 });
    // add candidate lines inferred as product names (higher confidence)
    if (ocrCandidates && ocrCandidates.length) {
      ocrCandidates.forEach((c, idx) => {
        // heuristic confidence by position
        const conf = 0.85 - idx * 0.08;
        items.push({ source: "OCR_CANDIDATE", text: c, confidence: Math.max(0.4, conf) });
      });
    }
  }

  // dedupe by normalized text
  const normalized = new Map();
  for (const it of items) {
    const n = (it.text || "").replace(/[^A-Za-z0-9]/g, "").toLowerCase().slice(0, 120);
    if (!n) continue;
    if (!normalized.has(n)) normalized.set(n, it);
    else {
      // merge confidences (take max and source precedence)
      const prev = normalized.get(n);
      prev.confidence = Math.max(prev.confidence || 0, it.confidence || 0);
      // preserve best source
      if ((it.confidence || 0) > (prev.confidence || 0)) normalized.set(n, it);
    }
  }
  const merged = Array.from(normalized.values());
  merged.sort((a, b) => (b.confidence || 0) - (a.confidence || 0));

  // Compute a final 'FinalProductName' if we can (highest confidence non OCR_FULL)
  const final = merged.find((m) => m.source !== "OCR_FULL") || merged[0] || null;
  const results = merged.map((r) => ({ source: r.source, value: r.text, confidence: r.confidence }));

  return { results, final: final ? { value: final.text, confidence: final.confidence, source: final.source } : null };
}

// Express router factory
function createRouter() {
  const router = express.Router();

  // health check
  router.get("/health", (req, res) => res.json({ ok: true }));

  router.post("/analyze", async (req, res) => {
    try {
      // parse upload (supports both multipart and raw)
      const { buffer } = await parseForm(req);
      if (!buffer || buffer.length === 0) {
        return res.status(400).json({ status: "error", message: "No file uploaded" });
      }

      // run tasks in parallel
      const tasks = [];

      // QR detection
      tasks.push(detectQRCode(buffer));

      // OCR
      tasks.push(runOCR(buffer));

      // MobileNet object recognition (optional)
      const objTask = runObjectRecognition(buffer).catch((e) => {
        console.warn("Object recognition error", e && e.message);
        return null;
      });
      tasks.push(objTask);

      // BLIP captioning (optional)
      const blipTask = (HF_API_TOKEN && USE_BLIP) ? runBLIPCaption(buffer).catch((e) => {
        console.warn("BLIP error", e && e.message); return null;
      }) : Promise.resolve(null);
      tasks.push(blipTask);

      const [qr, ocr, objectsRaw, caption] = await Promise.all(tasks);
      // objectsRaw may be array of {text, confidence}
      const objects = Array.isArray(objectsRaw) ? objectsRaw : (objectsRaw ? [objectsRaw] : null);

      // From OCR text infer candidate product lines
      const ocrCandidates = inferNamesFromOCR(ocr.text || "");

      // If we found a UPC-like string in OCR or QR, try OpenFoodFacts (optional)
      let offLookup = null;
      try {
        // try QR for numeric code
        const maybeUPC = (qr && qr.text) ? (qr.text.match(/\d{8,14}/) || [])[0] : null;
        if (!maybeUPC) {
          // try OCR text for code
          const m = (ocr.text || "").match(/\b(\d{8,14})\b/);
          if (m) maybeUPC = m[1];
        }
        if (maybeUPC) {
          offLookup = await openFoodFactsLookup(maybeUPC);
        } else {
          // fallback: try an OpenFoodFacts textual search on first OCR candidate (optional)
          if (OPENFOODFACTS && ocrCandidates && ocrCandidates.length) {
            offLookup = await openFoodFactsLookup(ocrCandidates[0]);
          }
        }
      } catch (err) {
        console.warn("OpenFoodFacts attempt failed", err && err.message);
        offLookup = null;
      }

      // Merge and rank
      const merged = mergeAndRankOutputs({ qr, ocr, objects, caption, offLookup, ocrCandidates });

      // Construct final API output (frontend-friendly)
      return res.json({
        status: "success",
        results: merged.results,
        final: merged.final,
        meta: {
          qr: !!qr,
          ocr_text_snippet: (ocr && ocr.text) ? (ocr.text.slice(0, 240)) : "",
          object_count: (objects && objects.length) || 0,
          used_blip: !!caption,
          used_off: !!offLookup,
        },
      });
    } catch (err) {
      console.error("Analyze failed:", err && err.stack ? err.stack : err);
      return res.status(500).json({ status: "error", message: "Analyze failed", error: err.message || String(err) });
    }
  });

  return router;
}

// If running as standalone server
if (require.main === module) {
  (async () => {
    await tryLoadMobileNet(); // optional load
    const app = express();
    app.use(express.json({ limit: "10mb" }));
    app.use(express.urlencoded({ extended: true }));
    app.use("/", createRouter());
    const port = process.env.PORT || 3007;
    app.listen(port, () => console.log(`analyze API listening on :${port}`));
  })();
} else {
  // export router for serverless or embedding
  module.exports = createRouter();
}