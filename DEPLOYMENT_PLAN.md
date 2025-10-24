# Scanitknowit Deployment Plan: Vercel (Frontend) + Render (Backend)

## ✅ Deployment Readiness Checklist

### A. Prerequisites Collected from Codebase

| Category | Details | Status |
|---------|---------|--------|
| **Repository** | GitHub repository URL | `https://github.com/jahnavitry-tech/Scanitknowit.git` |
| **Branch for Deployment** | Branch name | `main` |
| **Frontend Build** | Build command & output folder | `npm run build` → `dist/` |
| **Backend Start Command** | Start command | `node api/analyze.js` |
| **Node.js Version** | Version | `>=14.0.0` (package.json engines field) |
| **Environment Variables** | Required variables | `HF_API_TOKEN`, `USE_BLIP`, `PORT` |
| **API Base URL** | Backend endpoint | Will be Render backend URL |
| **Static Assets** | Images, fonts, icons | All handled by Vite build |
| **CORS Configuration** | Allowed origins | Needs to be added to backend |
| **External Dependencies** | Libraries | All in package.json |
| **Memory/CPU Needs** | Approximate RAM | ~512MB per request (image processing) |
| **Rate Limits** | External API usage | HuggingFace free tier limits |
| **Ports** | Backend listening port | Configurable via `PORT` env var |
| **File Upload Limits** | Max file size | Currently no explicit limits |
| **CI/CD Triggers** | On push to branch | `main` branch auto-deploy |

## 🚀 Step-by-Step Deployment Plan

### 1. Frontend Deployment: Vercel

#### Step 1: Prepare frontend build locally
```bash
# Navigate to project root
cd /path/to/scanitknowit

# Install dependencies
npm install

# Build the frontend
npm run build

# Verify dist/ folder is created
ls -la dist/
```

#### Step 2: Create Vercel account & connect GitHub repository
1. Go to [Vercel](https://vercel.com/)
2. Sign up or log in
3. Click "New Project"
4. Import your GitHub repository: `jahnavitry-tech/Scanitknowit`
5. Select the `main` branch

#### Step 3: Configure project settings in Vercel
```
Build Command: npm run build
Output Directory: dist/
Install Command: npm install
Framework Preset: Vite
Root Directory: ./
```

#### Step 4: Add environment variables (if needed)
```
VITE_API_URL=https://your-render-backend.onrender.com/api/analyze
```

#### Step 5: Deploy
1. Click "Deploy"
2. Wait for build & deployment to complete
3. Confirm site is accessible via Vercel subdomain

### 2. Backend Deployment: Render

#### Step 1: Prepare backend (already configured)
Package.json is already properly configured:
```json
{
  "name": "scanitknowit",
  "version": "1.0.0",
  "scripts": {
    "start-api": "node api/analyze.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "axios": "^1.6.0",
    "tesseract.js": "^4.1.3",
    "sharp": "^0.32.1",
    "jsqr": "^1.4.0",
    "express-fileupload": "^1.4.0"
  },
  "engines": {
    "node": ">=14.0.0"
  }
}
```

#### Step 2: Create Render account & connect GitHub
1. Go to [Render](https://render.com/)
2. Sign up or log in
3. Click "New" → "Web Service"
4. Connect to GitHub repository: `jahnavitry-tech/Scanitknowit`
5. Select the `main` branch

#### Step 3: Configure Render Web Service
```
Name: scanitknowit-api
Region: Choose closest to your users
Runtime: Node
Build Command: npm install
Start Command: node api/analyze.js
Plan: Free
```

#### Step 4: Add environment variables in Render dashboard
```
HF_API_TOKEN=your_huggingface_api_token_here
USE_BLIP=true
PORT=10000
NODE_ENV=production
```

#### Step 5: Deploy & Monitor
1. Click "Create Web Service"
2. Wait for deployment to complete
3. Check logs for errors
4. Confirm `/api/analyze` endpoint is accessible

### 3. Connect Frontend ↔ Backend

#### Step 1: Update backend CORS configuration
We need to modify the backend to accept requests from the Vercel frontend:

```javascript
// In api/analyze.js, add CORS support
import express from 'express';
import fileUpload from 'express-fileupload';
import cors from 'cors'; // Add this import

const app = express();

// Add CORS middleware
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
  credentials: true
}));

app.use(fileUpload());
// ... rest of the code
```

#### Step 2: Update frontend API URL
The frontend is already configured to use environment variables:
```javascript
// In src/components/CameraPanel.jsx
const apiUrl = import.meta.env.VITE_API_URL || '/api/analyze';
```

#### Step 3: Set Vercel environment variable
In Vercel dashboard, add:
```
VITE_API_URL=https://your-render-service.onrender.com
```

### 4. CI/CD Setup

#### Vercel Auto-deploy Configuration
Vercel automatically deploys on push to `main` branch.

#### Render Auto-deploy Configuration
Render automatically deploys on push to `main` branch.

### 5. Testing & Validation

#### Checklist for Testing:
- [ ] Frontend loads correctly on Vercel URL
- [ ] Backend responds correctly to `/api/analyze` requests
- [ ] Image processing works for various image sizes
- [ ] QR code detection works
- [ ] OCR text extraction works
- [ ] Object recognition works (with HF_API_TOKEN)
- [ ] BLIP captioning works (with USE_BLIP=true)
- [ ] CORS is properly configured
- [ ] HTTPS working on both frontend & backend

## 🛠️ Exact Commands and Configurations

### 1. Local Development Commands
```bash
# Install dependencies
npm install

# Start both frontend and backend
npm start

# Start only backend
npm run start-api

# Start only frontend
npm run dev

# Build for production
npm run build
```

### 2. Vercel Configuration (vercel.json)
```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/analyze.js",
      "use": "@vercel/node",
      "config": {
        "includeFiles": [
          "api/**"
        ]
      }
    },
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "api/analyze.js"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "PORT": "3000"
  }
}
```

### 3. Render Configuration (render.yaml)
```yaml
services:
  - type: web
    name: scanitknowit-api
    env: node
    buildCommand: npm install
    startCommand: node api/analyze.js
    envVars:
      - key: PORT
        value: 10000
```

### 4. Environment Variables Required

#### Render Environment Variables:
```
HF_API_TOKEN=your_huggingface_api_token
USE_BLIP=true
PORT=10000
NODE_ENV=production
ALLOWED_ORIGINS=https://your-vercel-app.vercel.app
```

#### Vercel Environment Variables:
```
VITE_API_URL=https://your-render-app.onrender.com
```

## 📁 Folder Structure for Deployment

```
scanitknowit/
├── api/
│   └── analyze.js              # Backend API endpoint
├── src/                        # React frontend
│   ├── App.jsx                 # Main application component
│   ├── main.jsx                # React DOM renderer
│   ├── styles.css              # Application styling
│   └── components/
│       ├── AnalysisPanel.jsx   # Results display
│       └── CameraPanel.jsx     # Camera/file upload
├── dist/                       # Built frontend (generated)
├── node_modules/               # Dependencies (generated)
├── index.html                  # Main HTML file
├── package.json                # Dependencies and scripts
├── package-lock.json           # Dependency lock file
├── vite.config.js              # Vite configuration
├── vercel.json                 # Vercel deployment config
├── render.yaml                 # Render deployment config
└── .gitignore                  # Git ignore file
```

## 🚨 Important Notes for Free-Tier Deployment

1. **Render Free Tier Limitations**:
   - Service sleeps after 15 minutes of inactivity
   - Cold starts may take a few seconds
   - 512MB RAM limit per container

2. **Vercel Free Tier Limitations**:
   - Serverless functions have execution time limits
   - 100GB bandwidth per month
   - 500 builds per month

3. **HuggingFace API Limits**:
   - Free tier has rate limits
   - Consider implementing caching for repeated requests

4. **Image Processing Considerations**:
   - Large images may exceed memory limits
   - Processing time may exceed function timeouts
   - Consider implementing image resizing on frontend

## ✅ Final Deployment Checklist

### Before Deployment:
- [ ] All dependencies listed in package.json
- [ ] `npm run build` works locally
- [ ] Backend starts with `node api/analyze.js`
- [ ] Environment variables documented
- [ ] CORS configured for production
- [ ] GitHub repository connected to both platforms
- [ ] CI/CD triggers configured for `main` branch

### After Deployment:
- [ ] Frontend accessible via Vercel URL
- [ ] Backend accessible via Render URL
- [ ] API endpoint `/api/analyze` returns 200
- [ ] Image processing works end-to-end
- [ ] All features (QR, OCR, Object Recognition) functional
- [ ] HTTPS working on both platforms
- [ ] Environment variables properly set

## 🆘 Troubleshooting Common Issues

### 1. CORS Errors
Solution: Ensure backend has proper CORS configuration and ALLOWED_ORIGINS is set

### 2. API Connection Failures
Solution: Verify VITE_API_URL in Vercel matches Render backend URL

### 3. Build Failures
Solution: Check package.json dependencies and Node.js version compatibility

### 4. Memory Issues
Solution: Implement image resizing or optimize processing pipeline

### 5. Cold Start Delays
Solution: Consider implementing a health check endpoint to keep service warm

This deployment plan provides exact steps, commands, and configurations needed to deploy Scanitknowit to Vercel and Render without errors.