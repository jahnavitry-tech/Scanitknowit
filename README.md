# Scanitknowit - Google Lens-Style Product Scanner

A fully functional product scanner that combines multiple recognition technologies to identify products, QR codes, text, and objects - similar to Google Lens.

## 📁 Project Structure

```
Scanitknowit-up/
├── app/                           # Frontend (Vite + React) — deploy on Vercel
│   ├── package.json              # Frontend scripts & deps
│   ├── vite.config.js            # Vite configuration
│   ├── index.html                # Main HTML file
│   ├── src/                      # React source code
│   │   ├── main.jsx             # React bootstrap
│   │   ├── App.jsx              # Main UI component
│   │   └── components/          # React components
│   │       ├── CameraPanel.jsx  # Camera and file upload interface
│   │       └── AnalysisPanel.jsx # Results display component
│   └── api/                     # API endpoints (if used)
│       └── analyze.js
├── scanitknowit-backend/         # Backend (Express) — deploy on Render
│   ├── package.json             # Backend dependencies
│   ├── server.js               # Main server file
│   ├── api/                    # API implementation
│   │   └── analyze.js          # Image analysis endpoint
│   ├── .env.production         # Production environment variables
│   └── render.yaml             # Render deployment configuration
├── tests/                       # Test files
├── demos/                       # Demo files
└── documentation/               # Project documentation
    ├── DEPLOYMENT.md           # Deployment process and checklist
    ├── README.md               # Application architecture and file structure
    └── ERRORS_AND_FIXES.md     # Errors and fixes documentation
```

## 🌟 Features

- **QR Code Detection**: High-confidence QR/barcode scanning (0.95-0.99 confidence)
- **OCR Text Recognition**: Extracts product names and text using Tesseract.js
- **Image Captioning**: Optional AI-generated captions via Hugging Face BLIP (requires API token)
- **File Upload**: Process uploaded images
- **Ranked Results**: Merged and ranked results with confidence scoring
- **Robust Error Handling**: Non-blocking processing ensures partial results even if some methods fail

## 🚀 Quick Start

1. Install dependencies for both frontend and backend:
   ```bash
   cd app && npm install
   cd ../scanitknowit-backend && npm install
   ```

2. Start the backend server:
   ```bash
   npm run dev
   ```

3. Start the frontend development server:
   ```bash
   cd ../app
   npm run dev
   ```

4. Open your browser to `http://localhost:5173` (or the port shown in the terminal)

## 🛠️ Environment Variables

### Frontend (.env.production)
```env
# Backend API URL
VITE_API_URL=https://your-render-backend.onrender.com
```

### Backend (.env.production)
```env
# CORS origin for frontend
CORS_ORIGIN=https://your-frontend.vercel.app

# Hugging Face API token for BLIP image captioning (optional)
HF_API_TOKEN=hf_xOuGQNnHJyxTIahVjmtlSwhoTZFhHnKQH

# Node environment
NODE_ENV=production

# Port (Render will set this automatically)
PORT=10000
```

## 🎯 How It Works

1. **File Upload**: Users can upload images through the CameraPanel
2. **Image Processing**: Converts images to blobs for analysis
3. **Multi-Method Analysis**:
   - QR codes detected with `jsQR` (highest priority, 0.95-0.99 confidence)
   - Text extracted with `tesseract.js`
   - Objects recognized with TensorFlow.js MobileNet
   - Captions generated with Hugging Face BLIP (optional)
4. **Results Merging**: All results are ranked by confidence and displayed

## 🧪 Testing

1. Open your browser and go to the URL shown in the terminal (likely `http://localhost:5173`)
2. Click "Scan Now" to upload an image
3. View the analysis results in the AnalysisPanel

## ✅ API Key Information

The only API key used in this application is for Hugging Face BLIP image captioning:

- **HF_API_TOKEN**: Enables AI-generated captions for images (like Google Lens descriptions)
- This is completely optional - QR detection and OCR work without it

## 🛡️ Robust Error Handling

The API has been enhanced with comprehensive error handling to prevent "Failed to analyze image" errors:

- **File Validation**: Checks that uploaded files exist and are accessible
- **Non-Blocking Processing**: If one recognition method fails, others continue
- **Detailed Logging**: Each step is logged for debugging purposes
- **Resource Management**: Temporary files are automatically cleaned up
- **Cross-Platform Compatibility**: Works on Windows, macOS, and Linux

## 📊 Result Ranking

Results are ranked by confidence with the following priorities:
1. **QR Codes**: 0.95-0.99 confidence (highest priority)
2. **OCR Text**: 0.5-0.85 confidence
3. **BLIP Captions**: 0.75 confidence (if enabled)
4. **Object Recognition**: 0.3-0.6 confidence

## 🎨 UI Components

### CameraPanel.jsx
- Simple file upload interface
- Image preview functionality
- Loading and error states
- Clean, modern design

### AnalysisPanel.jsx
- Google Lens-style results display
- Confidence bars with color coding
- Icons for different result types
- Responsive design for all screen sizes

## ☁️ Deployment

### Frontend (Vercel)
1. Install Vercel CLI: `npm install -g vercel`
2. Login to Vercel: `vercel login`
3. Deploy from the `app/` directory: `vercel --prod`
4. Set Project Root to `app` in Vercel dashboard

### Backend (Render)
1. Create a new Web Service on Render
2. Connect to your GitHub repository
3. Set Root Directory to `scanitknowit-backend`
4. Set Build Command to `npm install`
5. Set Start Command to `npm start`
6. Add environment variables in Render dashboard

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request