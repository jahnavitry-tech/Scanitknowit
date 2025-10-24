import Tesseract from 'tesseract.js'

export async function ocrFromFile(file: File | string): Promise<string> {
  // `file` can be a File object (from input) or dataURL string
  if (typeof file === 'string') {
    const res = await Tesseract.recognize(file, 'eng', { logger: m => {} })
    return res.data.text || ''
  } else {
    const res = await Tesseract.recognize(file, 'eng', { logger: m => {} })
    return res.data.text || ''
  }
}