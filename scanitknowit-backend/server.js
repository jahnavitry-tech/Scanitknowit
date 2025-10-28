const express = require("express");
const multer = require("multer");
const path = require("path");
const analyzeRouter = require("./api/analyze");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory if it exists
app.use(express.static(path.join(__dirname, "public")));

// Enable CORS for all routes
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
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