const express = require('express');
const multer = require('multer');
const crypto = require('crypto');
const axios = require('axios');
const Tesseract = require('tesseract.js'); // server variant may vary
const router = express.Router();
const upload = multer();

const OPENFOODFACTS_URL = 'https://world.openfoodfacts.org/api/v0/product'; // +/<barcode>.json
const OPENBEAUTY_URL = 'https://world.openbeautyfacts.org/api/v0/product';

const analysisCache = new Map();
const CACHE_TTL = parseInt(process.env.CACHE_TTL_MS || '3600000');

function md5(buffer) { return crypto.createHash('md5').update(buffer).digest('hex'); }

// helper: extract UPC-like numbers from text
function extractBarcodes(text) {
  if (!text) return [];
  const matches = Array.from(text.matchAll(/\b(\d{8,13})\b/g)).map(m => m[1]);
  return [...new Set(matches)];
}

// helper: basic OCR line heuristics to pick product-like lines
function preferProductLines(text) {
  if (!text) return null;
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  // prefer lines with uppercase brand-like tokens or long tokens
  const candidates = lines.filter(l => /[A-Z]{2,}/.test(l) || l.split(' ').length <= 6 && l.length > 3);
  return candidates.length ? candidates[0] : (lines[0] || null);
}

async function lookupBarcode(barcode) {
  try {
    let res = await axios.get(`${OPENFOODFACTS_URL}/${barcode}.json`, { timeout: 5000 });
    if (res.data && res.data.status === 1) return res.data.product;
    res = await axios.get(`${OPENBEAUTY_URL}/${barcode}.json`, { timeout: 5000 });
    if (res.data && res.data.status === 1) return res.data.product;
  } catch (err) {
    // ignore timeout/error, return null
  }
  return null;
}

router.post('/analyze', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Missing file' });

    const buf = req.file.buffer;
    const key = md5(buf);
    if (analysisCache.has(key)) {
      const cached = analysisCache.get(key);
      if (Date.now() - cached.ts < CACHE_TTL) return res.json({ ...cached.data, cached: true });
      analysisCache.delete(key);
    }

    // Run OCR first (needed for barcode extraction) but still do in parallel with others
    const ocrPromise = Tesseract.recognize(buf, 'eng', { logger: () => {} })
      .then(r => r?.data?.text || '')
      .catch(() => '');

    // Parallel object classification / captioning (conditional on HF token)
    const hfToken = process.env.HF_API_TOKEN;
    const objectPromise = hfToken ? axios.post('https://api-inference.huggingface.co/models/google/vit-base-patch16-224', buf, {
      headers: { Authorization: `Bearer ${hfToken}`, 'Content-Type':'application/octet-stream' }, timeout: 10000
    }).then(r => r.data).catch(() => null) : Promise.resolve(null);

    const blipPromise = hfToken && process.env.USE_BLIP === 'true' ? axios.post('https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-base', buf, {
      headers: { Authorization: `Bearer ${hfToken}`, 'Content-Type':'application/octet-stream' }, timeout: 15000
    }).then(r => r.data).catch(() => null) : Promise.resolve(null);

    const [ocrText, objectRes, blipRes] = await Promise.all([ocrPromise, objectPromise, blipPromise]);

    // Extract barcode(s)
    const barcodes = extractBarcodes(ocrText || '');
    let barcodeInfo = null;
    if (barcodes.length) {
      // try first barcode lookups in order
      for (const code of barcodes) {
        const product = await lookupBarcode(code);
        if (product) { barcodeInfo = { code, product }; break; }
      }
    }

    // Candidate merging & scoring
    const candidates = [];
    if (barcodeInfo) {
      candidates.push({ source: 'barcode', value: barcodeInfo.product?.product_name || barcodeInfo.product?.name || barcodeInfo.code, confidence: 0.95 });
    }

    const ocrCandidate = preferProductLines(ocrText);
    if (ocrCandidate) candidates.push({ source: 'ocr', value: ocrCandidate, confidence: 0.6 });

    if (objectRes && Array.isArray(objectRes) && objectRes[0]) {
      const label = objectRes[0].label || (objectRes[0].class || '');
      const score = objectRes[0]?.score ? Math.min(0.9, objectRes[0].score) : 0.5;
      candidates.push({ source: 'object', value: label, confidence: score });
    }

    if (blipRes && Array.isArray(blipRes) && blipRes[0]) {
      const caption = blipRes[0].generated_text || blipRes[0].caption || '';
      candidates.push({ source: 'caption', value: caption, confidence: 0.5 });
    }

    // sort cand and pick winner
    candidates.sort((a,b) => b.confidence - a.confidence);
    const product = candidates.length ? candidates[0].value : (ocrText.split('\n')[0] || 'Unknown');

    const out = {
      product,
      candidates,
      raw: { ocr: ocrText, object: objectRes, blip: blipRes },
      barcodes
    };

    // cache
    analysisCache.set(key, { data: out, ts: Date.now() });
    setTimeout(() => analysisCache.delete(key), CACHE_TTL);

    res.json(out);
  } catch(err) {
    console.error('analyze error', err.message || err);
    res.status(500).json({ error: 'internal' });
  }
});

module.exports = router;
