# Deployment Guide for Scanitknowit

This guide explains how to deploy the Scanitknowit application to various platforms. The application consists of a React frontend and a Node.js/Express backend API.

## Deployment Options

### 1. Vercel + Render (Recommended)

This is the recommended approach as it separates the frontend and backend, which works well with free tier limitations.

#### Deploy Backend to Render

1. Go to https://render.com and sign up
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - Name: `scanitknowit-api`
   - Build Command: `npm install`
   - Start Command: `node api/analyze.js`
   - Environment Variables:
     - `PORT` = `10000`

5. Click "Create Web Service"

#### Deploy Frontend to Vercel

1. Go to https://vercel.com and sign up
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure the project:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

5. Add Environment Variables:
   - `VITE_API_URL` = `https://your-render-service.onrender.com/api/analyze`

6. Click "Deploy"

### 2. Single Platform Deployment

#### Railway

1. Go to https://railway.app and sign up
2. Click "New Project" → "Deploy from GitHub"
3. Connect your repository
4. Railway will automatically detect the project type
5. Add environment variables if needed
6. Click "Deploy"

#### Vercel with Serverless Functions

1. Convert the Express API to Vercel Serverless Functions
2. Deploy to Vercel as a single project

### 3. Traditional Hosting

For traditional hosting providers that support Node.js:

1. Upload all files to your hosting provider
2. Run `npm install` to install dependencies
3. Start the backend with `node api/analyze.js`
4. Build the frontend with `npm run build`
5. Serve the `dist` folder as static files

## Environment Variables

The application uses the following environment variables:

- `HF_API_TOKEN` (optional): HuggingFace API token for object recognition
- `USE_BLIP` (optional): Set to "true" to enable BLIP captioning
- `VITE_API_URL` (frontend only): API endpoint URL for production

For local development, create a `.env` file:
```
HF_API_TOKEN=your_huggingface_api_token
USE_BLIP=true
```

For production deployment, set these variables in your hosting platform's environment settings.

## Performance Considerations

1. **Image Processing**: Large images may take time to process. Consider implementing image resizing on the frontend.
2. **API Rate Limits**: Free-tier external APIs may have rate limits.
3. **Cold Starts**: Free-tier services may experience cold starts.
4. **Memory Usage**: Image processing can be memory-intensive.

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure the backend has proper CORS headers
2. **API Connection**: Verify the API URL is correctly configured
3. **Build Failures**: Check that all dependencies are properly listed in package.json
4. **Runtime Errors**: Check platform logs for detailed error messages

### Debugging Steps

1. Check the browser console for frontend errors
2. Check the backend logs for API errors
3. Verify environment variables are set correctly
4. Test API endpoints directly

## Scaling Considerations

1. **Load Balancing**: For high-traffic applications, consider using a load balancer
2. **Caching**: Implement caching for repeated requests
3. **Database**: If you add persistent storage, choose an appropriate database
4. **CDN**: Use a CDN for serving static assets

## Monitoring

1. **Uptime Monitoring**: Most platforms provide basic uptime monitoring
2. **Error Tracking**: Consider integrating Sentry or similar services
3. **Performance Monitoring**: Use platform-provided tools or third-party services
4. **Log Management**: Regularly review application logs

## Cost Management

1. **Free Tier Usage**: Stay within free tier limits
2. **Resource Optimization**: Optimize image processing and API usage
3. **Caching**: Implement caching to reduce API calls
4. **Monitoring**: Set up alerts for resource usage

## Security Considerations

1. **API Keys**: Never commit API keys to version control
2. **Input Validation**: Validate all user inputs
3. **File Uploads**: Validate and sanitize uploaded files
4. **HTTPS**: Ensure all communications are encrypted

## Backup and Recovery

1. **Code Backup**: Use Git for version control
2. **Environment Variables**: Document all environment variables
3. **Deployment Configuration**: Keep deployment configurations in version control
4. **Disaster Recovery**: Have a plan for restoring service if needed