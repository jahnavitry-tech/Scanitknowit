# Lens-Style Product/Object Scanner (Enhanced UI)

A fully functional Google Lens-style product scanner with enhanced UI and confidence bars. This application can identify objects/products from camera capture or image upload using a hybrid pipeline of QR detection, OCR, object recognition, and optional BLIP captioning.

## Features

- ✅ QR / Barcode detection using jsQR
- ✅ OCR text extraction using Tesseract.js
- ✅ Object recognition using HuggingFace ViT model
- ✅ Optional BLIP captions (when HF_API_TOKEN is provided)
- ✅ Camera capture with proper browser permissions
- ✅ File upload support
- ✅ Enhanced UI with confidence bars and visual indicators
- ✅ Responsive design

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
lens-scanner-enhanced/
├── api/
│   └── analyze.js          # Backend API with hybrid analysis pipeline
├── src/
│   ├── components/
│   │   ├── CameraPanel.jsx # Camera capture and file upload
│   │   └── AnalysisPanel.jsx # Results display with confidence bars
│   ├── App.jsx             # Main application component
│   ├── main.jsx            # React DOM renderer
│   └── styles.css          # Enhanced styling with confidence bars
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

To enable object recognition and BLIP captioning:

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
2. **Camera Capture**: 
   - Click "Start Camera" to enable camera access
   - Click "Capture Photo" to take a picture
3. View the enhanced analysis results including:
   - Product / Object name with confidence bar
   - QR/Barcode data with confidence indicator
   - Extracted text (OCR) with confidence indicator
   - Detected object with confidence bar
   - AI-generated caption with confidence indicator

## Enhanced UI Features

- **Confidence Bars**: Visual indicators showing the confidence level of each detection
- **Color-coded Confidence**: Green (high), Yellow (medium), Red (low)
- **Organized Sections**: Clear separation of different analysis results
- **Primary Result Highlight**: Prominent display of the main identified product/object
- **Responsive Design**: Works well on both desktop and mobile devices

## How It Works

1. **CameraPanel** handles camera capture and file upload
2. When an image is captured or uploaded, it's sent to `/api/analyze`
3. The backend runs a hybrid analysis pipeline:
   - QR/Barcode detection using jsQR
   - OCR text extraction using Tesseract.js
   - Object recognition using HuggingFace API
   - Optional BLIP captioning
4. Analysis results are displayed in the AnalysisPanel with enhanced UI

## Dependencies

### Backend
- express: Web framework
- multer: File upload handling
- tesseract.js: OCR engine
- jsqr: QR code detection
- canvas: Image processing
- node-fetch: HTTP client
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
- Ensure the backend API is running on port 3007
- Check the browser console for any connection errors

### CORS Issues
- The Vite development server is configured to proxy API requests to avoid CORS issues

## Customization

You can customize the application by:

1. **Styling**: Modify `src/styles.css` to change the appearance
2. **Analysis Logic**: Update `api/analyze.js` to modify the hybrid pipeline
3. **UI Components**: Edit `CameraPanel.jsx` and `AnalysisPanel.jsx` to change the interface
4. **Confidence Calculation**: Adjust the confidence calculation logic in `api/analyze.js`

## License

This project is open source and available under the MIT License.