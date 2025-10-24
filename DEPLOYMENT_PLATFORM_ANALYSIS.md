# Deployment Options for Scanitknowit

## Application Architecture Summary

- **Backend:** Node.js/Express REST API
- **Frontend:** React with Vite
- **Database:** None (stateless)
- **File Storage:** In-memory processing only
- **Deployment:** Git-based

## Recommended Deployment Platforms

### 1. Vercel + Render (Recommended Two-Platform Solution)

#### Frontend on Vercel
**Configuration:**
- Build Command: `npm run build`
- Output Directory: `dist/`
- Install Command: `npm install`
- Framework Preset: Vite

**Environment Variables:**
- `VITE_API_URL` = `https://your-backend-url.onrender.com/api`

#### Backend on Render
**Configuration:**
- Build Command: `npm install`
- Start Command: `node api/analyze.js`
- Runtime: Node.js
- Plan: Free

**Environment Variables:**
- `PORT` = `10000` (Render's default port)

### 2. Single Platform Options

#### Railway (Single Platform)
**Configuration:**
- Build Command: `npm install`
- Start Command: `npm start`
- Runtime: Node.js

**Notes:**
- Railway can handle both frontend and backend
- May need to modify the start script

#### Vercel with Serverless Functions (Single Platform)
**Configuration:**
- Convert Express API to Vercel Serverless Functions
- Frontend builds normally

### 3. Traditional Hosting

#### cPanel/Shared Hosting
**Requirements:**
- Node.js support
- Ability to run background processes
- Custom port configuration

**Deployment Steps:**
1. Upload files via Git or FTP
2. Run `npm install`
3. Start backend with `node api/analyze.js`
4. Serve frontend statically from `dist/` folder

## Detailed Deployment Instructions

### Vercel + Render Setup

#### Step 1: Deploy Backend to Render

1. Go to https://render.com
2. Sign up or log in
3. Click "New" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - Name: `scanitknowit-api`
   - Region: Choose closest to your users
   - Branch: `main`
   - Root Directory: Leave empty
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `node api/analyze.js`
   - Plan: Free
   - Add Environment Variable:
     - Key: `PORT`
     - Value: `10000`

6. Click "Create Web Service"

#### Step 2: Update Frontend for External API

1. Modify `src/components/CameraPanel.jsx` to use external API URL:
   ```javascript
   // Change from:
   const response = await axios.post('/api/analyze', formData, {
   
   // To:
   const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3007/api/analyze';
   const response = await axios.post(apiUrl, formData, {
   ```

2. Add to `.env.production`:
   ```
   VITE_API_URL=https://your-render-app-url.onrender.com/api/analyze
   ```

#### Step 3: Deploy Frontend to Vercel

1. Go to https://vercel.com
2. Sign up or log in
3. Click "Add New Project"
4. Import your GitHub repository
5. Configure:
   - Framework Preset: Vite
   - Root Directory: Leave empty
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

6. Add Environment Variables:
   - `VITE_API_URL` = `https://your-render-app-url.onrender.com/api/analyze`

7. Click "Deploy"

## Platform Comparison

| Platform | Free Tier | Frontend Support | Backend Support | Ease of Use | Best For |
|----------|-----------|------------------|-----------------|-------------|----------|
| Vercel | Generous | Excellent | Good (Serverless) | Very Easy | Frontend-first apps |
| Render | Good | Good | Excellent | Easy | Full-stack apps |
| Railway | Generous | Good | Excellent | Easy | Full-stack apps |
| Netlify | Generous | Excellent | Limited | Very Easy | Static sites |
| Traditional | Varies | Limited | Good | Medium | Legacy hosting |

## Performance Considerations

1. **API Response Time:** Free-tier services may have cold starts
2. **Rate Limiting:** External APIs (HuggingFace, Tesseract) may have limits
3. **Image Processing:** Large images may take time to process
4. **Caching:** Consider implementing caching for repeated requests

## Cost Estimation

| Platform | Monthly Cost | Notes |
|----------|--------------|-------|
| Vercel + Render | $0 | Free tier sufficient for personal use |
| Single Platform | $0-$7 | Free tier to basic paid plan |
| Traditional | $5-$50 | Depends on hosting provider |

## Monitoring and Maintenance

1. **Uptime Monitoring:** Both Vercel and Render provide basic monitoring
2. **Error Tracking:** Consider adding Sentry or similar
3. **Performance Monitoring:** Use built-in platform tools
4. **Log Management:** Both platforms provide log access

## Troubleshooting Common Issues

1. **CORS Errors:** Ensure API has proper CORS headers
2. **Environment Variables:** Check that all variables are set correctly
3. **Build Failures:** Ensure all dependencies are in package.json
4. **Runtime Errors:** Check platform logs for detailed error messages