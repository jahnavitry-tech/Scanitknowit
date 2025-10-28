const express = require("express");
const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const analyzeRouter = require("./api/analyze");

const app = express();
const port = process.env.PORT || 3000;

// Add cache
const analysisCache = new Map();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

// Make cache globally accessible
global.analysisCache = analysisCache;

// Add cache cleanup function
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of analysisCache.entries()) {
    if (now - value.timestamp > CACHE_TTL) {
      analysisCache.delete(key);
    }
  }
}, 60000); // Check every minute

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory if it exists
app.use(express.static(path.join(__dirname, "public")));

// Enable CORS for all routes
app.use((req, res, next) => {
  const corsOrigin = process.env.CORS_ORIGIN || "*";
  res.header("Access-Control-Allow-Origin", corsOrigin);
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

// Middleware to check cache
app.use("/api/analyze", (req, res, next) => {
  if (req.method === 'POST' && req.file) {
    const imageHash = crypto.createHash('md5').update(req.file.buffer).digest('hex');
    
    if (analysisCache.has(imageHash)) {
      console.log('Cache hit for image hash:', imageHash);
      return res.json(analysisCache.get(imageHash));
    }
    
    // Attach hash to request for later caching
    req.imageHash = imageHash;
  }
  next();
});

// Routes
app.use("/api", analyzeRouter);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ 
    status: "OK", 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.status(200).json({ 
    message: "Scanitknowit Backend API is running",
    version: "1.0.0",
    endpoints: {
      analyze: "/api/analyze",
      health: "/health"
    }
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});