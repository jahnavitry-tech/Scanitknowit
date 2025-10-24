# Quick Reference: Scanitknowit Deployment

## 🚀 Essential Deployment Information

### Repository
- **URL**: https://github.com/jahnavitry-tech/Scanitknowit
- **Branch**: main

### Backend (Render)
- **Start Command**: `node api/analyze.js`
- **Build Command**: `npm install`
- **Port**: 10000 (set via PORT environment variable)
- **Health Endpoint**: `/health`

### Frontend (Vercel)
- **Build Command**: `npm run build`
- **Output Directory**: `dist/`
- **Framework**: Vite

### Environment Variables

#### Render (Backend)
```
HF_API_TOKEN=your_huggingface_token
USE_BLIP=false
PORT=10000
NODE_ENV=production
ALLOWED_ORIGINS=https://your-vercel-app.vercel.app
```

#### Vercel (Frontend)
```
VITE_API_URL=https://your-render-app.onrender.com
```

## 📋 Deployment Steps (Quick Version)

1. **Sign up** for Render and Vercel
2. **Deploy Backend** to Render:
   - Import GitHub repo
   - Set start/build commands
   - Add environment variables
3. **Deploy Frontend** to Vercel:
   - Import GitHub repo
   - Confirm auto-detected settings
   - Add VITE_API_URL environment variable
4. **Connect Services**:
   - Update Render's ALLOWED_ORIGINS with Vercel URL
5. **Test** end-to-end functionality

## 🔧 Key Endpoints

- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-app.onrender.com`
- **Health Check**: `https://your-app.onrender.com/health`
- **API Endpoint**: `https://your-app.onrender.com/api/analyze`

## 🛠️ Troubleshooting

### Common Issues
1. **CORS Errors**: Check ALLOWED_ORIGINS in Render
2. **API Connection**: Verify VITE_API_URL in Vercel
3. **Build Failures**: Check package.json dependencies
4. **Cold Starts**: Render free tier sleeps after 15min

### Quick Fixes
- **CORS**: Set ALLOWED_ORIGINS to Vercel URL
- **API**: Ensure VITE_API_URL matches Render backend
- **Build**: Run `npm install` locally to verify
- **Performance**: Test with smaller images

## 📊 Success Metrics

✅ Frontend loads without errors
✅ Backend health check returns 200 OK
✅ Camera capture works
✅ File upload processes
✅ API returns analysis results
✅ No console errors

## 🔄 Updates

Push to `main` branch → Auto-deploy on both platforms

---

**Need more details?** See [DEPLOYMENT_STEPS.md](file:///C:/Users/deepa/Downloads/Scanitknowit-up/Scanitknowit-GitHub/DEPLOYMENT_STEPS.md) for complete instructions.