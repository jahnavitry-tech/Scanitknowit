# Scanitknowit - Lens-Style Product/Object Scanner

A fully functional Google Lens-style product scanner that can identify objects/products from camera capture or image upload using a hybrid pipeline of QR detection, OCR, object recognition, and optional BLIP captioning.

## 🌟 Features

- ✅ **QR / Barcode detection** using jsQR
- ✅ **OCR text extraction** using Tesseract.js
- ✅ **Object recognition** using HuggingFace ViT model
- ✅ **Optional BLIP captions** (when HF_API_TOKEN is provided)
- ✅ **Camera capture** with proper browser permissions
- ✅ **File upload** support
- ✅ **Enhanced UI** with confidence bars and visual indicators
- ✅ **Responsive design** that works on desktop and mobile
- ✅ **No 404 errors** - guaranteed to run immediately

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/jahnavitry-tech/Scanitknowit.git
cd Scanitknowit

# Install dependencies
npm install

# Run both frontend and backend with one command
npm start
```

Or run them separately:

```bash
# Terminal 1: Start the backend API
npm run start-api

# Terminal 2: Start the frontend
npm run dev
```

Then open your browser at http://localhost:5173

## 📁 Project Structure

```
Scanitknowit/
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

## 🛠️ Setup Instructions

### 1. Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### 2. Installation

```bash
# Clone the repository
git clone https://github.com/jahnavitry-tech/Scanitknowit.git
cd Scanitknowit

# Install dependencies
npm install
```

### 3. Environment Configuration (Optional)

To enable object recognition and BLIP captioning:

1. Sign up for a free account at [Hugging Face](https://huggingface.co/)
2. Get your API token from your account settings
3. Create a `.env` file in the root directory:

```
HF_API_TOKEN=your_huggingface_api_token_here
USE_BLIP=true
```

### 4. Running the Application

**Option 1: Single command start (recommended)**
```bash
npm start
```

**Option 2: Run frontend and backend separately**

Terminal 1:
```bash
npm run start-api
```

Terminal 2:
```bash
npm run dev
```

## 🎯 Usage

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

## 🧠 How It Works

The application uses a hybrid analysis pipeline:

1. **CameraPanel** handles camera capture and file upload
2. When an image is captured or uploaded, it's sent to `/api/analyze`
3. The backend runs a hybrid analysis pipeline:
   - QR/Barcode detection using jsQR
   - OCR text extraction using Tesseract.js
   - Object recognition using HuggingFace API
   - Optional BLIP captioning
4. Analysis results are displayed in the AnalysisPanel with enhanced UI

## 📦 Dependencies

### Backend
- express: Web framework
- express-fileupload: File upload handling
- tesseract.js: OCR engine
- jsqr: QR code detection
- sharp: Image processing (Windows-compatible)
- axios: HTTP client

### Frontend
- react: UI library
- react-dom: React DOM rendering
- @vitejs/plugin-react: React plugin for Vite
- vite: Build tool
- axios: HTTP client

## 🐛 Troubleshooting

### Camera Permissions
- Make sure your browser has permission to access the camera
- Check your browser settings if the camera doesn't work

### API Connection Issues
- Ensure the backend API is running on port 3007
- Check the browser console for any connection errors

### CORS Issues
- The Vite development server is configured to proxy API requests to avoid CORS issues

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [jsQR](https://github.com/cozmo/jsQR) for QR code detection
- [Tesseract.js](https://github.com/naptha/tesseract.js) for OCR
- [Hugging Face](https://huggingface.co/) for object recognition models
- [Vite](https://vitejs.dev/) for the frontend build tool
- [React](https://reactjs.org/) for the UI framework