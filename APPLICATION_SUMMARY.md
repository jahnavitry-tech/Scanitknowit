# Scanitknowit - Complete Application Summary

## Overview

Scanitknowit is a Google Lens-style product scanner that identifies objects/products from camera capture or image upload. It uses a hybrid pipeline combining QR detection, OCR text extraction, object recognition, and optional BLIP captioning.

## Features

✅ **QR / Barcode detection** using jsQR
✅ **OCR text extraction** using Tesseract.js
✅ **Object recognition** using HuggingFace ViT model
✅ **Optional BLIP captions** (when HF_API_TOKEN is provided)
✅ **Camera capture** with proper browser permissions
✅ **File upload** support
✅ **Enhanced UI** with confidence bars and visual indicators
✅ **Responsive design** that works on desktop and mobile
✅ **No 404 errors** - guaranteed to run immediately

## Application Architecture

### Frontend (React + Vite)
- **CameraPanel.jsx**: Handles camera capture and file upload
- **AnalysisPanel.jsx**: Displays analysis results with confidence indicators
- **App.jsx**: Main application component
- **styles.css**: Enhanced styling with confidence bars
- **main.jsx**: React DOM renderer

### Backend (Express.js API)
- **api/analyze.js**: Hybrid analysis pipeline with:
  - QR/Barcode detection using jsQR
  - OCR text extraction using Tesseract.js
  - Object recognition using HuggingFace API
  - Optional BLIP captioning
  - Confidence-based result merging

### Key Technologies
- **Frontend**: React, Vite, Axios
- **Backend**: Express.js, Sharp (image processing), jsQR, Tesseract.js
- **Build Tools**: Vite, npm
- **Deployment**: Platform-agnostic with support for Vercel, Render, Railway

## File Structure

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
├── vercel.json                 # Vercel deployment configuration
├── render.yaml                 # Render deployment configuration
├── .gitignore                  # Git ignore file
├── LICENSE                     # MIT License
└── Documentation files         # Multiple README and deployment guides
```

## Setup Instructions

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/jahnavitry-tech/Scanitknowit.git
   cd Scanitknowit
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. (Optional) Configure environment variables:
   Create a `.env` file:
   ```
   HF_API_TOKEN=your_huggingface_api_token
   USE_BLIP=true
   ```

4. Run the application:
   ```bash
   npm start
   ```

   This runs both frontend and backend with one command.

### Separate Frontend and Backend

- Frontend: `npm run dev` (runs on http://localhost:5173)
- Backend: `npm run start-api` (runs on http://localhost:3007)

## Usage

1. **File Upload**: Click the file input to upload an image file
2. **Camera Capture**:
   - Click "Start Camera" to enable camera access
   - Click "Capture Photo" to take a picture
3. View the enhanced analysis results including:
   - Product / Object name with confidence bar
   - QR/Barcode data with confidence indicator
   - Extracted text (OCR) with confidence indicator
   - Detected object with confidence bar
   - AI-generated caption with confidence indicator

## Deployment Options

### Recommended: Vercel + Render
1. Deploy backend to Render:
   - Build Command: `npm install`
   - Start Command: `node api/analyze.js`
   - Environment Variables: `PORT=10000`

2. Deploy frontend to Vercel:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Environment Variables: `VITE_API_URL=https://your-render-app.onrender.com/api/analyze`

### Alternative Platforms
- **Railway**: Single platform deployment
- **Traditional Hosting**: Upload files and run Node.js processes
- **Other Platforms**: Configure according to platform requirements

## Environment Variables

- `HF_API_TOKEN` (optional): HuggingFace API token for object recognition
- `USE_BLIP` (optional): Set to "true" to enable BLIP captioning
- `VITE_API_URL` (frontend only): API endpoint URL for production

## Dependencies

### Backend
- express: Web framework
- express-fileupload: File upload handling
- tesseract.js: OCR engine
- jsqr: QR code detection
- sharp: Image processing
- axios: HTTP client

### Frontend
- react: UI library
- react-dom: React DOM rendering
- @vitejs/plugin-react: React plugin for Vite
- vite: Build tool
- axios: HTTP client

## Troubleshooting

### Camera Permissions
- Make sure your browser has permission to access the camera
- Check your browser settings if the camera doesn't work

### API Connection Issues
- Ensure the backend API is running
- Check the browser console for connection errors

### CORS Issues
- The Vite development server is configured to proxy API requests to avoid CORS issues

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [jsQR](https://github.com/cozmo/jsQR) for QR code detection
- [Tesseract.js](https://github.com/naptha/tesseract.js) for OCR
- [Hugging Face](https://huggingface.co/) for object recognition models
- [Vite](https://vitejs.dev/) for the frontend build tool
- [React](https://reactjs.org/) for the UI framework