# Lens-Style Product/Object Scanner

A fully functional Google Lens-style product scanner that can identify objects/products from camera capture or image upload using a hybrid pipeline of QR detection, OCR, object recognition, and optional BLIP captioning.

## Features

- ✅ QR / Barcode detection using jsQR
- ✅ OCR text extraction using Tesseract.js
- ✅ Object recognition using HuggingFace ViT model
- ✅ Optional BLIP captions (when HF_API_TOKEN is provided)
- ✅ Camera capture with proper browser permissions
- ✅ File upload support
- ✅ Intelligent result merging with confidence scoring
- ✅ Responsive UI with Tailwind CSS

## Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

## Quick Start

```bash
# Install dependencies
npm install

# Install API dependencies
cd api && npm install && cd ..

# Run both frontend and backend concurrently
npm start
```

Or run them separately:

```bash
# Terminal 1: Start the backend API
cd api && npm start

# Terminal 2: Start the frontend
npm run dev
```

## Project Structure

```
lens-scanner-final/
├── api/
│   ├── analyze.js          # Backend API with hybrid analysis pipeline
│   └── package.json        # Backend dependencies
├── src/
│   ├── components/
│   │   ├── CameraPanel.jsx # Camera capture and file upload
│   │   └── AnalysisPanel.jsx # Results display
│   ├── App.jsx             # Main application component
│   ├── main.jsx            # React DOM renderer
│   └── styles.css          # Styling
├── index.html              # Main HTML file
├── vite.config.js          # Vite configuration
└── package.json            # Frontend dependencies
```

## Setup Instructions

### 1. Install All Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd api
npm install
cd ..
```

### 2. Configure Environment Variables (Optional)

To enable object recognition and BLIP captioning:

1. Sign up for a free account at [Hugging Face](https://huggingface.co/)
2. Get your API token from your account settings
3. Create a `.env` file in the `api` directory with:

```
HF_API_TOKEN=your_huggingface_api_token_here
USE_BLIP=true
```

### 3. Start the Application

You have several options:

**Option 1: Run both frontend and backend concurrently**
```bash
npm start
```

**Option 2: Run frontend and backend separately**
```bash
# Terminal 1: Start the backend API
cd api
node analyze.js

# Terminal 2: Start the frontend
npm run dev
```

### 4. Access the Application

Open your browser and navigate to http://localhost:5173

## Usage

1. **File Upload**: Click "Select Image" to upload an image file
2. **Camera Capture**: Click "Use Camera" to capture an image from your webcam
3. View the analysis results including:
   - Product / Object name
   - QR/Barcode data
   - Extracted text (OCR)
   - Detected object
   - AI-generated caption (if enabled)
   - Confidence scores

## How It Works

1. **CameraPanel** handles camera capture and file upload
2. When an image is captured or uploaded, it's sent to `/api/analyze`
3. The backend runs a hybrid analysis pipeline:
   - QR/Barcode detection using jsQR
   - OCR text extraction using Tesseract.js
   - Object recognition using HuggingFace API
   - Optional BLIP captioning
4. Results are merged intelligently based on confidence scores
5. Analysis results are displayed in the AnalysisPanel

## Dependencies

### Backend
- express: Web framework
- express-fileupload: File upload handling
- tesseract.js: OCR engine
- jsqr: QR code detection
- sharp: Image processing
- node-fetch: HTTP client
- dotenv: Environment variable management

### Frontend
- react: UI library
- react-dom: React DOM rendering
- @vitejs/plugin-react: React plugin for Vite
- vite: Build tool
- concurrently: Run multiple commands concurrently

## Troubleshooting

### Camera Permissions
- Make sure your browser has permission to access the camera
- Check your browser settings if the camera doesn't work

### API Connection Issues
- Ensure the backend API is running on port 3007
- Check the browser console for any connection errors

### CORS Issues
- The Vite development server is configured to proxy API requests to avoid CORS issues

## Customization

You can customize the application by:

1. **Styling**: Modify `src/styles.css` to change the appearance
2. **Analysis Logic**: Update `api/analyze.js` to modify the hybrid pipeline
3. **UI Components**: Edit `CameraPanel.jsx` and `AnalysisPanel.jsx` to change the interface
4. **Result Merging**: Adjust the `mergeResults` function in `api/analyze.js` to change how results are prioritized

## License

This project is open source and available under the MIT License.