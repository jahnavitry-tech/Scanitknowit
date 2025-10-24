# Deployment Guide: Google Lens-Style Product Scanner

## ✅ Pre-Deployment Checklist

### 1. Code & Configuration Verification
- [x] All API endpoints return proper JSON responses
- [x] Frontend handles API errors gracefully
- [x] Environment variables properly configured
- [x] Vercel configuration files updated
- [x] Package.json scripts updated for cross-platform compatibility
- [x] Vite configuration optimized for production

### 2. Dependencies Verification
All required packages are listed in package.json:
- `react`, `react-dom` - Frontend framework
- `tesseract.js` - OCR processing
- `jsqr` - QR code detection
- `formidable` - Multipart form data parsing
- `node-fetch` - HTTP requests
- `@tensorflow/tfjs-node` - TensorFlow.js for Node.js
- `@tensorflow-models/mobilenet` - Object recognition
- `express` - API server framework

### 3. API Functionality
- [x] Camera capture and file upload working
- [x] QR code detection with high priority (0.99 confidence)
- [x] OCR text extraction with product name heuristics
- [x] Object recognition (MobileNet via TensorFlow.js)
- [x] Image captioning (BLIP via Hugging Face API - optional)
- [x] Merged and ranked results with confidence scoring
- [x] Proper error handling for all recognition methods

## 🌐 Environment Variables Required

### For Optional Features
- `HF_API_TOKEN` - Hugging Face API token for BLIP image captioning (optional)

### For Development
- `NODE_ENV` - Set to "development" or "production"

## 📁 Project Structure

```
project-root/
├── src/                      # Frontend source code
│   ├── components/          # React components
│   │   ├── CameraPanel.jsx
│   │   ├── AnalysisPanel.jsx
│   │   └── App.jsx
│   └── main.jsx             # Entry point
├── api/                     # API endpoints
│   └── analyze-simple.js    # Main analysis endpoint
├── dist/                    # Built assets (generated)
├── vite.config.js           # Vite configuration
├── vercel.json              # Vercel configuration
├── package.json             # Dependencies and scripts
└── .env                     # Environment variables
```

## 🔧 Local Development Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Create a `.env` file in the root directory:
```bash
# Optional - for BLIP image captioning
HF_API_TOKEN=your_hugging_face_api_token_here
```

### 3. Start Development Servers
```bash
# Terminal 1: Start frontend development server
npm run dev

# Terminal 2: Start API server
npm run api
```

The frontend will run on http://localhost:5173 with API proxying to http://localhost:3007

## ☁️ Vercel Deployment

### 1. Install Vercel CLI
```bash
npm install -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

### 3. Deploy to Vercel
From the project root directory:
```bash
vercel --prod
```

### 4. Set Environment Variables in Vercel Dashboard
1. Go to your project settings in Vercel
2. Navigate to "Environment Variables"
3. Add:
   - Key: `HF_API_TOKEN`
   - Value: Your Hugging Face API token (optional)

## 🧪 Testing Checklist

### Frontend Components
- [ ] CameraPanel captures images correctly
- [ ] Torch toggle works on supported devices
- [ ] File upload processes images
- [ ] Scan overlay animation displays properly
- [ ] Error messages display correctly

### API Endpoints
- [ ] `/api/analyze` accepts multipart/form-data
- [ ] QR code detection works with high confidence
- [ ] OCR extracts text and identifies product names
- [ ] Object recognition returns generic objects
- [ ] Image captioning works when HF_API_TOKEN is set
- [ ] Results are properly merged and ranked

### Analysis Panel
- [ ] Ranked results display with confidence bars
- [ ] Source labels show correctly (QR, OCR, Object, Caption)
- [ ] Empty states handled gracefully
- [ ] Mobile responsiveness verified

## 🚨 Common Issues & Solutions

### 1. "Failed to analyze image" Errors
- **Cause**: Incorrect multipart/form-data handling
- **Solution**: Verify FormData is sent with "file" key

### 2. QR Codes Not Detected
- **Cause**: Low image quality or poor lighting
- **Solution**: Ensure good lighting and clear images

### 3. OCR Returns Unreadable Text
- **Cause**: Poor image quality or complex fonts
- **Solution**: Improve image quality or lighting conditions

### 4. Object Recognition Too Generic
- **Cause**: MobileNet limitations
- **Solution**: Results are combined with other methods for better accuracy

### 5. Image Captioning Not Working
- **Cause**: Missing HF_API_TOKEN environment variable
- **Solution**: Set HF_API_TOKEN in environment variables

## 📈 Performance Optimization

### 1. Image Processing
- Images are automatically resized to reduce processing time
- Formidable handles large file uploads safely

### 2. API Response Times
- Recognition methods run in parallel for faster results
- TensorFlow.js models loaded once for better performance
- Tesseract.js worker pool for OCR processing

### 3. Memory Management
- TensorFlow tensors properly disposed after use
- Formidable temporary files automatically removed

## 🔒 Security Considerations

### 1. File Uploads
- File size limited to 10MB
- Only image files accepted
- Formidable validates file types

### 2. API Security
- POST-only endpoints
- Input validation for all parameters
- Error messages don't expose internal details

### 3. Environment Variables
- Sensitive tokens stored securely in Vercel
- No hardcoded API keys in source code
- .env files in .gitignore

## 🔄 Maintenance

### 1. Dependency Updates
Regularly update dependencies:
```bash
npm outdated
npm update
```

### 2. Model Updates
- TensorFlow.js models update automatically
- Tesseract.js language packs can be updated
- Check for new versions of MobileNet

### 3. Monitoring
- Monitor Vercel logs for errors
- Track API response times
- Watch for failed image analyses

## 🆘 Support Resources

### Documentation
- [Vercel Documentation](https://vercel.com/docs)
- [TensorFlow.js Documentation](https://tfjs.tensorflow.org/)
- [Tesseract.js Documentation](https://tesseract.projectnaptha.com/)

### Community
- GitHub Issues for bug reports
- Stack Overflow for implementation questions
- Discord/Slack communities for real-time help

---
*Deployment Guide Last Updated: October 23, 2025*