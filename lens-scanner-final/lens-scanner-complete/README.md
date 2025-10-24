# Lens-Style Product/Object Scanner

A fully functional Google Lens-style product scanner that can identify objects/products from camera capture or image upload.

## Features

- ✅ QR / Barcode detection using jsQR
- ✅ OCR text extraction using Tesseract.js
- ✅ Camera capture with proper browser permissions
- ✅ File upload support
- ✅ Responsive UI with Tailwind CSS

## Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

## Quick Start

```bash
# Install dependencies
npm install

# Run the backend API
npm run start-api

# In a new terminal, run the frontend
npm run dev
```

## Project Structure

```
lens-scanner-complete/
├── api/
│   └── analyze.js          # Backend API with QR and OCR detection
├── src/
│   ├── components/
│   │   ├── CameraPanel.jsx # Camera capture and file upload
│   │   └── AnalysisPanel.jsx # Results display
│   ├── App.jsx             # Main application component
│   ├── main.jsx            # React DOM renderer
│   └── styles.css          # Styling
├── index.html              # Main HTML file
├── vite.config.js          # Vite configuration
├── package.json            # Project dependencies and scripts
└── .env.example            # Environment variables example
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables (Optional)

To enable BLIP captioning:

1. Sign up for a free account at [Hugging Face](https://huggingface.co/)
2. Get your API token from your account settings
3. Create a `.env` file with:

```
HF_API_TOKEN=your_huggingface_api_token_here
USE_BLIP=true
```

### 3. Start the Application

You need to run the backend and frontend separately:

**Terminal 1: Start the backend API**
```bash
npm run start-api
```

**Terminal 2: Start the frontend**
```bash
npm run dev
```

### 4. Access the Application

Open your browser and navigate to http://localhost:5173

## Usage

1. **File Upload**: Click the file input to upload an image file
2. **Camera Capture**: Allow camera permissions and click "Scan Now"
3. View the analysis results including:
   - Product / Object name
   - QR/Barcode data
   - Extracted text (OCR)
   - AI-generated caption (if enabled)

## How It Works

1. **CameraPanel** handles camera capture and file upload
2. When an image is captured or uploaded, it's sent to `/api/analyze`
3. The backend runs analysis:
   - QR/Barcode detection using jsQR
   - OCR text extraction using Tesseract.js
4. Analysis results are displayed in the AnalysisPanel

## Dependencies

### Backend
- express: Web framework
- multer: File upload handling
- tesseract.js: OCR engine
- jsqr: QR code detection
- canvas: Image processing
- node-fetch: HTTP client

### Frontend
- react: UI library
- react-dom: React DOM rendering
- @vitejs/plugin-react: React plugin for Vite
- vite: Build tool

## Troubleshooting

### Camera Permissions
- Make sure your browser has permission to access the camera
- Check your browser settings if the camera doesn't work

### API Connection Issues
- Ensure the backend API is running on port 3007
- Check the browser console for any connection errors

### CORS Issues
- The Vite development server is configured to proxy API requests to avoid CORS issues

## License

This project is open source and available under the MIT License.