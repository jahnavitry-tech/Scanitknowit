# Google Lens-Style Product Scanner

A fully functional product scanner that combines multiple recognition technologies to identify products, QR codes, text, and objects - similar to Google Lens.

## 🌟 Features

- **QR Code Detection**: High-confidence QR/barcode scanning (0.95-0.99 confidence)
- **OCR Text Recognition**: Extracts product names and text using Tesseract.js
- **Image Captioning**: Optional AI-generated captions via Hugging Face BLIP (requires API token)
- **File Upload**: Process uploaded images
- **Ranked Results**: Merged and ranked results with confidence scoring
- **Robust Error Handling**: Non-blocking processing ensures partial results even if some methods fail

## 🚀 Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the API server:
   ```bash
   node api/analyze.js
   ```

3. Start the frontend development server:
   ```bash
   npm run dev
   ```

4. Open your browser to `http://localhost:5186` (or the port shown in the terminal)

## 🛠️ Environment Variables

The application uses the following environment variables:

```env
# Hugging Face API token for BLIP image captioning (optional)
HF_API_TOKEN=hf_xOuGQNnHJyxTIahVjmtlSwhoTZFhHnKQH
```

The HF_API_TOKEN is already configured in your `.env` file and will enable AI-generated captions for images.

## 📁 Project Structure

```
my-lens-scanner/
├─ package.json
├─ vite.config.js
├─ index.html
├─ .env
├─ README.md
├─ src/
│  ├─ main.jsx
│  ├─ App.jsx
│  ├─ styles.css
│  └─ components/
│     ├─ CameraPanel.jsx
│     └─ AnalysisPanel.jsx
└─ api/
   └─ analyze.js
```

## 🎯 How It Works

1. **File Upload**: Users can upload images through the CameraPanel
2. **Image Processing**: Converts images to blobs for analysis
3. **Multi-Method Analysis**:
   - QR codes detected with `jsQR` (highest priority, 0.95-0.99 confidence)
   - Text extracted with `tesseract.js`
   - Captions generated with Hugging Face BLIP (optional)
4. **Results Merging**: All results are ranked by confidence and displayed

## 🧪 Testing

1. Open your browser and go to the URL shown in the terminal (likely `http://localhost:5186`)
2. Click "Scan Now" to upload an image
3. View the analysis results in the AnalysisPanel

## ✅ API Key Information

The only API key used in this application is for Hugging Face BLIP image captioning:

- **HF_API_TOKEN**: Enables AI-generated captions for images (like Google Lens descriptions)
- This is completely optional - QR detection and OCR work without it
- Your token is already configured in the `.env` file

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

## 🚀 Deployment

Deploy to Vercel with zero configuration.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request