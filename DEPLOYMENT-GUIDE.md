# Scanitknowit Deployment Guide

This guide explains how to deploy the Scanitknowit application with its current structure.

## Current Project Structure

```
Scanitknowit-up/
├── app/                           # Frontend (Vite + React) — deploy on Vercel
│   ├── package.json              # Frontend scripts & deps
│   ├── vite.config.js
│   ├── index.html
│   ├── src/
│   │   ├── main.jsx             # React bootstrap
│   │   ├── App.jsx              # Main UI
│   │   └── components/
│   │       ├── CameraPanel.jsx  # Camera / upload, does client-side resize & upload
│   │       └── AnalysisPanel.jsx # Shows analysis results & confidence
│   └── api/
│       └── analyze.js           # API endpoint (if used)
├── scanitknowit-backend/         # Backend (Express) — deploy on Render
│   ├── package.json             # Backend scripts & deps
│   ├── server.js               # Express server, caching, routes
│   ├── api/
│   │   └── analyze.js          # /api/analyze implementation
│   ├── .env.production         # Production environment variables
│   └── render.yaml             # Render deployment configuration
├── DEPLOYMENT.md               # Deployment process and checklist
├── README.md                   # Application architecture and file structure
└── ERRORS_AND_FIXES.md         # Errors and fixes documentation
```

## Vercel Deployment (Frontend)

### Prerequisites
1. Install Vercel CLI: `npm install -g vercel`
2. Login to Vercel: `vercel login`

### Deployment Steps
1. Navigate to the app directory:
   ```bash
   cd app
   ```

2. Deploy to Vercel:
   ```bash
   vercel --prod
   ```

3. Configure Vercel Project Settings:
   - Set **Project Root** to `app` in the Vercel dashboard
   - This ensures Vercel finds `app/package.json` instead of incorrectly looking for `app/vite.config.js`

### Environment Variables (Frontend)
Create a `.env.production` file in the `app/` directory:
```bash
VITE_API_URL=https://your-render-backend.onrender.com
```

## Render Deployment (Backend)

### Prerequisites
1. Create an account at [Render](https://render.com)
2. Connect your GitHub repository to Render

### Deployment Steps
1. Create a new Web Service in Render
2. Connect to your GitHub repository
3. Configure the service:
   - **Name**: scanitknowit-backend
   - **Root Directory**: `scanitknowit-backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node.js

### Environment Variables (Backend)
Set these environment variables in the Render dashboard:
```bash
CORS_ORIGIN=https://your-frontend.vercel.app
NODE_ENV=production
PORT=10000
```

## Fixing the Vercel Build Error

The error "Build 'src' is 'app/vite.config.js' but expected 'package.json' or 'build.sh'" occurs when Vercel is incorrectly configured. To fix this:

1. **Ensure Project Root is set correctly**: In the Vercel dashboard, set the Project Root to `app`

2. **Verify vercel.json configuration**: Your `app/vercel.json` should look like this:
   ```json
   {
     "version": 2,
     "builds": [
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
         "src": "/(.*)",
         "dest": "/dist/$1"
       }
     ]
   }
   ```

3. **Check package.json build script**: Ensure your `app/package.json` has:
   ```json
   {
     "scripts": {
       "build": "vite build",
       "dev": "vite",
       "preview": "vite preview"
     }
   }
   ```

## Testing the Deployment

1. After deploying both frontend and backend, test the application:
   - Visit your Vercel frontend URL
   - Try uploading an image to verify the analysis works
   - Check the browser console for any errors

2. Verify API connectivity:
   - Check that the frontend can communicate with the backend
   - Ensure CORS is properly configured

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure `CORS_ORIGIN` is set correctly in Render environment variables
2. **API Connection Failures**: Verify `VITE_API_URL` points to your Render backend
3. **Build Failures**: Check that all dependencies are listed in package.json
4. **File Size Limits**: Large dependencies may exceed Vercel/Render limits

### Monitoring

1. Check Vercel logs for frontend issues:
   ```bash
   vercel logs your-frontend-url.vercel.app
   ```

2. Check Render logs for backend issues through the Render dashboard

## Maintenance

1. Regularly update dependencies:
   ```bash
   cd app && npm outdated && npm update
   cd ../scanitknowit-backend && npm outdated && npm update
   ```

2. Monitor for security vulnerabilities:
   ```bash
   npm audit
   ```

3. Update environment variables as needed for new features or services