# Scanitknowit Deployment Checklist

This checklist ensures all steps are completed for a successful deployment to Vercel (frontend) + Render (backend).

## ✅ Pre-Deployment Checklist

### Code Repository
- [ ] GitHub repository created and accessible
- [ ] All code committed and pushed to `main` branch
- [ ] No sensitive information (API keys, passwords) in code

### Application Readiness
- [ ] `package.json` has all dependencies listed
- [ ] `npm install` runs successfully
- [ ] `npm run build` creates `dist/` folder
- [ ] Backend starts with `npm run start-api`
- [ ] Frontend starts with `npm run dev`
- [ ] All environment variables identified and documented

### Environment Variables
- [ ] `HF_API_TOKEN` from HuggingFace (optional but recommended)
- [ ] `USE_BLIP` set to "true" or "false"
- [ ] `PORT` for backend (Render will provide)
- [ ] `ALLOWED_ORIGINS` for CORS (Vercel frontend URL)

## 🚀 Deployment Steps

### 1. Backend Deployment (Render)

#### Render Web Service Configuration
- [ ] Create new Web Service on Render
- [ ] Connect to GitHub repository
- [ ] Select `main` branch
- [ ] Set:
  - Name: `scanitknowit-api`
  - Runtime: Node
  - Build Command: `npm install`
  - Start Command: `node api/analyze.js`
  - Plan: Free

#### Render Environment Variables
- [ ] Add `HF_API_TOKEN` (your HuggingFace token)
- [ ] Add `USE_BLIP=true` (if you want BLIP captions)
- [ ] Add `PORT=10000`
- [ ] Add `NODE_ENV=production`
- [ ] Add `ALLOWED_ORIGINS=https://your-vercel-app.vercel.app` (update with actual URL)

#### Render Deployment Verification
- [ ] Deployment completes successfully
- [ ] Logs show "API running on http://localhost:10000"
- [ ] Health check endpoint accessible: `https://your-render-app.onrender.com/health`
- [ ] API endpoint accessible: `https://your-render-app.onrender.com/api/analyze`

### 2. Frontend Deployment (Vercel)

#### Vercel Project Configuration
- [ ] Create new Project on Vercel
- [ ] Import GitHub repository
- [ ] Select `main` branch
- [ ] Set:
  - Framework Preset: Vite
  - Root Directory: `./`
  - Build Command: `npm run build`
  - Output Directory: `dist/`

#### Vercel Environment Variables
- [ ] Add `VITE_API_URL=https://your-render-app.onrender.com` (update with actual URL)

#### Vercel Deployment Verification
- [ ] Deployment completes successfully
- [ ] Site is accessible via Vercel URL
- [ ] No console errors in browser
- [ ] Camera access works
- [ ] File upload works

### 3. Integration Testing

#### End-to-End Functionality
- [ ] Frontend can call backend API
- [ ] Image upload works from frontend
- [ ] QR code detection works
- [ ] OCR text extraction works
- [ ] Object recognition works (if HF_API_TOKEN provided)
- [ ] BLIP captioning works (if USE_BLIP=true and HF_API_TOKEN provided)
- [ ] Results display correctly in AnalysisPanel

#### Performance Testing
- [ ] Page loads within 5 seconds
- [ ] Image processing completes within 30 seconds
- [ ] No memory errors or crashes
- [ ] Works on mobile devices
- [ ] Works on different browsers

## 🔧 Post-Deployment Configuration

### Monitoring Setup
- [ ] Set up uptime monitoring (e.g., UptimeRobot)
- [ ] Configure error tracking (optional)
- [ ] Set up logging alerts (Render dashboard)

### Domain Configuration (Optional)
- [ ] Custom domain for frontend (Vercel)
- [ ] Custom domain for backend (Render)
- [ ] SSL certificates automatically provisioned

### Security Configuration
- [ ] Verify CORS is properly configured
- [ ] Check that only necessary ports are exposed
- [ ] Ensure environment variables are not exposed in client-side code

## 🆘 Troubleshooting Checklist

### Common Issues and Solutions

#### CORS Errors
- [ ] Check `ALLOWED_ORIGINS` environment variable in Render
- [ ] Verify Vercel frontend URL is in allowed origins
- [ ] Check browser console for specific CORS error messages

#### API Connection Failures
- [ ] Verify `VITE_API_URL` in Vercel environment variables
- [ ] Check that Render backend is running
- [ ] Test API endpoint directly with curl or Postman

#### Build Failures
- [ ] Check package.json dependencies
- [ ] Verify Node.js version compatibility
- [ ] Check Render and Vercel build logs for specific errors

#### Image Processing Issues
- [ ] Check memory usage in Render logs
- [ ] Test with smaller image files
- [ ] Verify HuggingFace API token is valid

#### Performance Issues
- [ ] Implement image resizing on frontend
- [ ] Add caching for repeated requests
- [ ] Consider upgrading from free tier if needed

## 📊 Success Metrics

### Deployment Success
- [ ] Application accessible via public URLs
- [ ] All features working as expected
- [ ] No critical errors in logs
- [ ] Performance within acceptable limits

### User Experience
- [ ] Fast loading times
- [ ] Responsive interface
- [ ] Clear error messages
- [ ] Mobile-friendly design

## 📝 Documentation Updates

### After Successful Deployment
- [ ] Update README.md with deployment URLs
- [ ] Document environment variables used
- [ ] Record any platform-specific configurations
- [ ] Note any deviations from this checklist

---

✅ **Deployment Complete!** Your Scanitknowit application is now ready for production use.