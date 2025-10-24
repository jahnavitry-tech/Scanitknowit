# Scanitknowit - Complete GitHub Repository Package

## Overview

This package contains a fully functional Google Lens-style product scanner application that can identify objects/products from camera capture or image upload. The application uses free open-source tools and implements a hybrid pipeline for analysis.

## Repository Structure

```
├── api/
│   └── analyze.js              # Backend API with hybrid analysis pipeline
├── src/                        # React frontend
│   ├── App.jsx                 # Main application component
│   ├── main.jsx                # React DOM renderer
│   ├── styles.css              # Application styling
│   └── components/
│       ├── AnalysisPanel.jsx   # Results display component
│       └── CameraPanel.jsx     # Camera capture and file upload component
├── index.html                  # Main HTML file
├── package.json                # Dependencies and scripts
├── vite.config.js              # Vite configuration
├── .gitignore                  # Git ignore file
├── LICENSE                     # MIT License
├── README.md                   # Project documentation
├── DEPLOYMENT.md               # Deployment instructions
├── FINAL_SUMMARY.md            # Detailed project summary
├── SUMMARY.md                  # Brief project overview
├── .env.example               # Environment variables template
├── test-setup.js              # Test setup script
├── deploy.bat                 # Windows deployment script
├── deploy.sh                  # Unix deployment script
└── INITIALIZE_AND_PUSH.bat    # Repository initialization script
```

## Features

1. **Camera Capture**: Real-time camera access for scanning products
2. **File Upload**: Support for uploading images for analysis
3. **Hybrid Analysis Pipeline**:
   - QR/Barcode Detection using jsQR
   - OCR Text Extraction using Tesseract.js
   - Object Recognition using HuggingFace ViT model
   - Optional BLIP Captioning
4. **Confidence-Based Results**: Ranked results with confidence scores
5. **Responsive UI**: Mobile-friendly interface with visual feedback

## Technical Implementation

### Frontend (React + Vite)
- CameraPanel component for camera access and file upload
- AnalysisPanel component for displaying results with confidence indicators
- Axios for API communication
- Modern CSS with responsive design

### Backend (Express.js)
- Image processing with Sharp (Windows-compatible alternative to Canvas)
- Hybrid analysis pipeline combining multiple detection methods
- Confidence scoring and result merging
- Proper error handling and validation

### Dependencies
- react, react-dom: Frontend framework
- vite: Build tool
- express: Backend framework
- express-fileupload: File handling
- jsqr: QR code detection
- tesseract.js: OCR text extraction
- sharp: Image processing
- axios: HTTP client

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy .env.example to .env and add your HuggingFace API token:
   ```bash
   cp .env.example .env
   # Edit .env to add your HF_API_TOKEN
   ```

3. Start the application:
   ```bash
   npm start
   ```

4. Visit http://localhost:5173 to use the application

## Deployment

The package includes deployment scripts for various platforms:
- Vercel
- Netlify
- Traditional hosting
- Docker (planned)

See DEPLOYMENT.md for detailed instructions.

## GitHub Push Instructions

To push this code to your GitHub repository:

1. Run PUSH_TO_GITHUB.ps1 (PowerShell script) or PUSH_TO_GITHUB.bat (Windows batch)
2. When prompted, enter your GitHub credentials (use Personal Access Token as password)
3. Visit https://github.com/jahnavitry-tech/Scanitknowit to verify the code is there

## Notes

- The application uses free-tier APIs that may have rate limits
- For production use, consider implementing caching and more robust error handling
- The UI includes confidence indicators to help users understand result reliability
- All processing is done client-side for privacy, with only API calls sent externally