# Google Lens-Style Product Scanner

A modern, Yuka-inspired product scanner that combines QR code detection, OCR, object recognition, and AI captioning to identify products from images.

## Features

- 📸 Image upload support
- 🔍 QR code detection with high priority
- 📝 OCR text recognition
- 🧩 Object recognition using MobileNet
- 🖼️ Optional AI captioning via Hugging Face BLIP
- 🛒 Product lookup via Open Food Facts API
- 📊 Confidence-based ranking of results
- 🎨 Beautiful, Google Lens-style UI with Tailwind CSS

## Documentation

- [Hybrid AI Pipeline](HYBRID_AI_PIPELINE.md) - Detailed explanation of the AI processing pipeline
- [System Architecture](SYSTEM_ARCHITECTURE.md) - Technical architecture and data flow

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd lens-scanner
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

1. Start the API server:
   ```bash
   npm run api
   ```
   The API will be available at `http://localhost:3007`

2. In a new terminal, start the development server:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5174`

### Testing the API

You can test if the API is working correctly with the provided test script:
```bash
node test-api.js
```

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Enable BLIP captioning (requires HF_API_TOKEN)
USE_BLIP=false

# Enable OpenFoodFacts lookup
OPENFOODFACTS=true

# Your Hugging Face API token (required for BLIP captioning)
# HF_API_TOKEN=your_hugging_face_api_token_here

# TensorFlow.js configuration
# Set to true to disable TensorFlow.js (object recognition)
SKIP_MOBILENET=false
```

To enable BLIP captioning:
1. Set `USE_BLIP=true`
2. Obtain a Hugging Face API token from [https://huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)
3. Add your token to the `.env` file:
   ```
   HF_API_TOKEN=your_token_here
   ```

To disable object recognition (MobileNet):
1. Set `SKIP_MOBILENET=true`

### Deployment

The application is configured for deployment on Vercel. Simply connect your GitHub repository to Vercel and deploy.

## How It Works

1. **Image Upload**: Users can upload an image of a product
2. **Multi-Modal Analysis**: The image is analyzed using multiple techniques:
   - QR code detection (highest priority)
   - OCR text recognition
   - Object recognition with MobileNet
   - AI captioning (optional)
   - Product lookup via Open Food Facts API
3. **Result Ranking**: Results are ranked by confidence score
4. **Display**: Results are displayed in a beautiful, Google Lens-style interface

## Technologies Used

- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: Node.js, Express
- **Image Processing**: Sharp, jsQR, Canvas
- **AI/ML**: Tesseract.js (OCR), TensorFlow.js (MobileNet), Hugging Face BLIP (optional)
- **APIs**: Open Food Facts (free product database)
- **Deployment**: Vercel

## API Endpoints

- `POST /analyze` - Analyze an uploaded image
- `GET /health` - Health check endpoint

## Folder Structure

```
/lens-scanner/
├── index.html
├── vite.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── .env
├── /src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── styles.css
│   ├── /components/
│   │   ├── CameraPanel.jsx
│   │   ├── AnalysisPanel.jsx
├── /api/
│   └── analyze.js
└── /public/
    └── favicon.ico
```

## Hybrid Approach

This application uses a hybrid approach combining local AI models with optional cloud services:

### Local Models (100% offline)
- **jsQR**: QR/Barcode detection
- **Tesseract.js**: OCR text recognition
- **MobileNet**: Object recognition

### Optional Cloud Services
- **Hugging Face BLIP**: AI image captioning (requires API token)
- **Open Food Facts**: Product database lookup (free, no API key required)

This approach provides:
- ✅ Full offline capability with local models
- ✅ Enhanced results when online services are available
- ✅ No mandatory API keys or paid services
- ✅ Privacy-focused local processing