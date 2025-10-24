# Step-by-Step Deployment Guide: Vercel + Render Setup

This guide provides exact steps to create accounts, connect your repository, and deploy the Scanitknowit application.

## 📋 Pre-Deployment Preparation

Before starting, ensure you have completed the [PRE_DEPLOYMENT_CHECKLIST.md](file:///C:/Users/deepa/Downloads/Scanitknowit-up/Scanitknowit-GitHub/PRE_DEPLOYMENT_CHECKLIST.md):

1. ✅ GitHub repository is ready at `https://github.com/jahnavitry-tech/Scanitknowit`
2. ✅ All code is committed and pushed to `main` branch
3. ✅ Environment variables are identified
4. ✅ HuggingFace API token obtained (optional but recommended)

## 🚀 Step 1: Backend Deployment to Render

### 1.1 Create Render Account

1. Go to [https://render.com](https://render.com)
2. Click "Sign Up" or "Get Started"
3. Sign up using GitHub (recommended) or email
4. Verify your email if prompted

### 1.2 Create Web Service

1. Click "New" → "Web Service"
2. Connect to GitHub repository:
   - Click "Connect account" if first time
   - Select `jahnavitry-tech/Scanitknowit` repository
   - Select `main` branch
3. Configure service:
   - **Name**: `scanitknowit-api`
   - **Region**: Choose closest to your users
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node api/analyze.js`
   - **Plan**: Free (Starter)

### 1.3 Configure Environment Variables

In the "Environment Variables" section, add:

```
HF_API_TOKEN=your_huggingface_api_token_here
USE_BLIP=false
PORT=10000
NODE_ENV=production
ALLOWED_ORIGINS=*
```

Note: Set `ALLOWED_ORIGINS` to `*` for now. After frontend deployment, update it to your Vercel URL.

### 1.4 Deploy Backend

1. Click "Create Web Service"
2. Wait for deployment to complete (5-10 minutes)
3. Note the Render URL (will look like `https://scanitknowit-api.onrender.com`)

### 1.5 Verify Backend Deployment

1. Check logs for "API running on http://localhost:10000"
2. Test health endpoint: `https://your-render-app.onrender.com/health`
3. Should return: `{"status":"OK","timestamp":"...","uptime":...}`

## 🌐 Step 2: Frontend Deployment to Vercel

### 2.1 Create Vercel Account

1. Go to [https://vercel.com](https://vercel.com)
2. Click "Sign Up"
3. Sign up using GitHub (recommended) or email
4. Verify your email if prompted

### 2.2 Import Project

1. Click "New Project"
2. Click "Import" under "Import Git Repository"
3. Select `jahnavitry-tech/Scanitknowit` repository
4. Select `main` branch

### 2.3 Configure Project

Vercel should auto-detect this as a Vite project. Verify settings:

- **Framework Preset**: Vite
- **Root Directory**: `./`
- **Build Command**: `npm run build`
- **Output Directory**: `dist/`

### 2.4 Configure Environment Variables

Add environment variable:
```
VITE_API_URL=https://your-render-app.onrender.com
```

Replace `your-render-app.onrender.com` with your actual Render backend URL.

### 2.5 Deploy Frontend

1. Click "Deploy"
2. Wait for deployment to complete (2-5 minutes)
3. Note the Vercel URL (will look like `https://scanitknowit.vercel.app`)

## 🔗 Step 3: Connect Frontend and Backend

### 3.1 Update Backend CORS Settings

1. Go back to Render dashboard
2. Go to your `scanitknowit-api` service
3. Go to "Environment Variables"
4. Update `ALLOWED_ORIGINS` to your Vercel URL:
   ```
   ALLOWED_ORIGINS=https://your-vercel-app.vercel.app
   ```
5. Click "Save Changes"
6. Wait for redeployment

### 3.2 (Optional) Update Frontend Environment Variables

If your Render URL changed, update `VITE_API_URL` in Vercel:
1. Go to Vercel dashboard
2. Go to your project
3. Go to "Settings" → "Environment Variables"
4. Update `VITE_API_URL` if needed
5. Redeploy the project

## ✅ Step 4: Test Deployment

### 4.1 Test Frontend

1. Visit your Vercel URL
2. Verify the application loads without errors
3. Check browser console for any issues

### 4.2 Test Backend

1. Visit your Render health endpoint: `https://your-render-app.onrender.com/health`
2. Should return a JSON response with status "OK"

### 4.3 Test End-to-End

1. On the Vercel frontend:
   - Click "Start Camera" and allow camera permissions
   - Click "Capture Photo" or use file upload
   - Verify results appear in the analysis panel
2. Test all features:
   - QR code detection
   - OCR text extraction
   - Object recognition (if HF_API_TOKEN provided)
   - BLIP captioning (if USE_BLIP=true and HF_API_TOKEN provided)

## 🛠️ Step 5: Configure Monitoring

### 5.1 Set Up Uptime Monitoring

1. Sign up for [UptimeRobot](https://uptimerobot.com/)
2. Create a new monitor:
   - Monitor Type: HTTP(s)
   - URL: `https://your-render-app.onrender.com/health`
   - Friendly Name: Scanitknowit Backend
3. Set monitoring interval to 5 minutes

### 5.2 (Optional) Error Tracking

1. Sign up for [Sentry](https://sentry.io/)
2. Create a new project for JavaScript/React
3. Add Sentry DSN to frontend environment variables

## 🔧 Troubleshooting Common Issues

### CORS Errors
- Ensure `ALLOWED_ORIGINS` in Render matches your Vercel URL exactly
- Include `https://` in the URL
- Multiple origins can be comma-separated

### API Connection Failures
- Verify `VITE_API_URL` in Vercel matches Render backend URL
- Test API endpoint directly in browser or Postman
- Check Render logs for errors

### Build Failures
- Check package.json dependencies
- Verify Node.js version compatibility
- Check platform build logs for specific errors

### Cold Start Delays
- Render free tier services sleep after 15 minutes of inactivity
- First request after sleep may take a few seconds
- Consider implementing a scheduled ping to keep service warm

## 📊 Success Verification Checklist

### Deployment Success
- [ ] Frontend accessible via Vercel URL
- [ ] Backend accessible via Render URL
- [ ] Health check endpoint returns 200 OK
- [ ] API endpoint processes requests
- [ ] No console errors in browser

### Functionality Testing
- [ ] Camera capture works
- [ ] File upload works
- [ ] QR code detection works
- [ ] OCR text extraction works
- [ ] Object recognition works (with HF_API_TOKEN)
- [ ] BLIP captioning works (with USE_BLIP=true and HF_API_TOKEN)
- [ ] Results display correctly

### Performance
- [ ] Page loads within 5 seconds
- [ ] Image processing completes within 30 seconds
- [ ] Works on mobile devices
- [ ] Works on different browsers

## 🎉 Deployment Complete!

Your Scanitknowit application is now successfully deployed with:

- **Frontend**: Vercel (React + Vite)
- **Backend**: Render (Node.js/Express)
- **Monitoring**: UptimeRobot (health check)
- **Environment**: Production-ready with proper CORS and security settings

## 🔄 Future Updates

To update your deployed application:

1. Push changes to `main` branch on GitHub
2. Vercel and Render will automatically redeploy
3. Monitor deployment logs for any issues
4. Test updated functionality

For major changes, consider using a staging environment first.