# Deployment Guide

This guide explains how to deploy the Scan It Know It application both locally and on Vercel.

## Local Development

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Git

### Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd scanitknowit-up
   ```

2. **Install dependencies:**
   ```bash
   cd app
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your actual API keys
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   The application will be available at http://localhost:5173

### Building for Production

1. **Clean build:**
   ```bash
   npm run rebuild
   ```

2. **Serve locally:**
   ```bash
   npm run serve
   ```
   The application will be available at http://localhost:5173

## Vercel Deployment

### Prerequisites
- Vercel account
- Vercel CLI (optional but recommended)

### Deployment Steps

1. **Install Vercel CLI (if not already installed):**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy the application:**
   ```bash
   # From the root directory
   vercel --prod
   ```

   Or deploy from the app directory:
   ```bash
   cd app
   vercel --prod
   ```

### Environment Variables

Set the following environment variables in your Vercel project settings:

```
OPENROUTER_API_KEY=your_openrouter_api_key_here
OPENROUTER_MODEL=meta-llama/Meta-Llama-3-8B-Instruct
API_NINJAS_KEY=your_api_ninjas_key_here
REDDIT_CLIENT_ID=your_reddit_client_id
REDDIT_CLIENT_SECRET=your_reddit_client_secret
REDDIT_USER_AGENT=scanitknowit-app
TESSERACT_LANG=eng
NODE_ENV=production
```

### Project Structure for Vercel

```
project-root/
├── app/                      # Frontend
│   ├── index.html
│   ├── src/
│   ├── vite.config.js
│   ├── package.json
│   └── vercel.json
├── api/                      # Serverless functions
│   ├── ocr.ts
│   ├── identify.ts
│   ├── nutrition.ts
│   ├── ingredients.ts
│   ├── reddit.ts
│   └── qa.ts
├── vercel.json              # Root Vercel configuration
└── README.md
```

## API Configuration

### Getting API Keys

1. **OpenRouter API Key:**
   - Visit: https://openrouter.ai/keys
   - Sign up for a free account
   - Generate an API key

2. **API Ninjas Key:**
   - Visit: https://api-ninjas.com/
   - Sign up for a free account
   - Get your API key

3. **Reddit API Keys:**
   - Visit: https://www.reddit.com/prefs/apps
   - Create a new application
   - Get your client ID and secret

## Troubleshooting

### Common Issues

1. **"404 Not Found" Errors:**
   - Ensure you're serving from the correct directory
   - Check that the `dist` folder exists after building
   - Verify the vercel.json configuration

2. **API Connection Issues:**
   - Check that all environment variables are set correctly
   - Verify API keys are valid
   - Ensure the worker/server is running (for local development)

3. **Build Failures:**
   - Clean the build: `npm run clean`
   - Reinstall dependencies: `rm -rf node_modules && npm install`
   - Check for TypeScript errors

### Local Development with Worker

For local development with the worker:

1. **Start the worker:**
   ```bash
   cd worker
   npm run dev
   ```

2. **Start the frontend:**
   ```bash
   cd app
   npm run dev
   ```

The Vite configuration includes a proxy that forwards `/api` requests to the worker running on `http://127.0.0.1:8787`.

## Testing Deployment

After deployment, test the following features:

1. Camera access and image capture
2. OCR text extraction
3. Object recognition fallback
4. API endpoints:
   - `/api/identify`
   - `/api/nutrition`
   - `/api/ingredients`
   - `/api/reddit`
   - `/api/qa`

5. Analysis panel functionality
6. Mobile responsiveness

## Monitoring

- Check Vercel logs for deployment issues
- Monitor API usage limits
- Verify all external API integrations are working