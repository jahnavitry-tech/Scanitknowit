# Testing Instructions for Lens-Style Product Scanner

## Prerequisites
- Node.js installed on your system
- A modern web browser (Chrome, Firefox, Edge, etc.)

## Setup Instructions

1. **Start the Backend API Server:**
   ```bash
   cd api
   npm install
   node analyze.js
   ```
   The API will be running on http://localhost:3007

2. **Start the Frontend Development Server:**
   ```bash
   # From the root directory
   npx vite
   ```
   The frontend will be available on http://localhost:5177 (or another port if 5173-5176 are in use)

## Testing the Application

1. **Open the Application:**
   Navigate to http://localhost:5177 in your web browser

2. **Test File Upload:**
   - Click "Select Image" to upload an image file from your computer
   - Try using images with:
     - QR codes or barcodes
     - Text (for OCR detection)
     - Clear objects (for object recognition)

3. **Test Camera Capture:**
   - Click "Use Camera" to switch to camera mode
   - Allow camera permissions when prompted by your browser
   - Point your camera at an object or image
   - Click "Capture Photo" to analyze the captured image

## API Configuration

To enable object recognition and BLIP captioning:

1. Sign up for a free account at [Hugging Face](https://huggingface.co/)
2. Get your API token from your account settings
3. Create a `.env` file in the `api` directory with:
   ```
   HF_API_TOKEN=your_huggingface_api_token_here
   USE_BLIP=true
   ```

## Troubleshooting

1. **Canvas Installation Issues on Windows:**
   The application uses Sharp instead of Canvas to avoid Windows compatibility issues.

2. **Camera Permissions:**
   - Make sure your browser has permission to access the camera
   - Check your browser settings if the camera doesn't work

3. **API Connection Issues:**
   - Ensure the backend API is running on port 3007
   - Check the browser console for any connection errors

4. **CORS Issues:**
   - The Vite development server is configured to proxy API requests to avoid CORS issues

## Features Implemented

- ✅ QR / Barcode detection using jsQR
- ✅ OCR text extraction using Tesseract.js
- ✅ Object recognition using HuggingFace ViT model (when HF_API_TOKEN is provided)
- ✅ BLIP captioning (when USE_BLIP=true and HF_API_TOKEN is provided)
- ✅ Camera capture with proper browser permissions handling
- ✅ File upload support
- ✅ Intelligent result merging with confidence scoring
- ✅ Responsive UI with clear result display

## Testing with Sample Images

For testing purposes, try using:
- Images with QR codes (like product barcodes)
- Images with clear text
- Images with distinct objects
- Screenshots of this application itself

The application will intelligently merge results from all available detection methods to provide the most accurate product identification possible.