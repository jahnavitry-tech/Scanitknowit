# Scanitknowit Project Summary

## Overview

This document provides a summary of the Scanitknowit project structure and components.

## Project Structure

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

## Key Components

### Frontend (app/)
- **Framework**: React with Vite
- **Key Features**:
  - Camera capture and file upload
  - Client-side image optimization (resize to 1024px)
  - Results display with confidence scoring
- **Main Components**:
  - `CameraPanel.jsx`: Handles image capture/upload and optimization
  - `AnalysisPanel.jsx`: Displays analysis results

### Backend (scanitknowit-backend/)
- **Framework**: Node.js with Express
- **Key Features**:
  - Image analysis using multiple recognition methods
  - In-memory caching with MD5 hash keys
  - CORS configuration for frontend communication
- **Analysis Methods**:
  - QR code detection (jsQR)
  - OCR text recognition (Tesseract.js)
  - Object recognition (TensorFlow.js MobileNet)
  - Image captioning (Hugging Face BLIP - optional)

## Environment Variables

### Frontend (.env.production)
```bash
VITE_API_URL=https://your-render-backend.onrender.com
```

### Backend (.env.production)
```bash
CORS_ORIGIN=https://your-frontend.vercel.app
NODE_ENV=production
PORT=10000
HF_API_TOKEN=your_hugging_face_api_token_here  # Optional
```

## Deployment

### Frontend (Vercel)
- **Project Root**: `app/`
- **Build Command**: `npm run build`
- **Output Directory**: `dist/`

### Backend (Render)
- **Root Directory**: `scanitknowit-backend/`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

## Recent Fixes

1. **Vercel Build Error**: Fixed by ensuring Project Root is set to `app/` in Vercel dashboard
2. **API File Naming**: Renamed `analyze-simple.js` to `analyze.js` for consistency
3. **Environment Variables**: Added proper production environment files
4. **File Cleanup**: Removed redundant configuration files and unused entry points
5. **Dependency Issues**: Reinstalled node_modules to fix build issues

## Next Steps

1. Deploy frontend to Vercel using the provided PowerShell script
2. Deploy backend to Render following the instructions in the deployment guide
3. Update environment variables with actual URLs
4. Test the complete application workflow