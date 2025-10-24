const http = require('http');
const { execSync } = require('child_process');

// Simple server to test the identify endpoint logic
const server = http.createServer(async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle OPTIONS requests
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }
  
  // Parse URL
  const url = new URL(req.url, `http://${req.headers.host}`);
  
  // Health check endpoint
  if (url.pathname === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true, status: 'healthy' }));
    return;
  }
  
  // Identify endpoint
  if (url.pathname === '/api/identify' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', async () => {
      try {
        const data = JSON.parse(body);
        const text = data.text;
        
        if (!text) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'No text provided' }));
          return;
        }
        
        console.log('Identify request received with text:', text);
        
        // Simulate OpenRouter API call
        // In a real implementation, this would call the actual OpenRouter API
        const product = 'Test Product';
        const summary = 'This is a test product summary';
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
          product: product,
          summary: summary
        }));
      } catch (error) {
        console.error('Error in identify endpoint:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to identify product' }));
      }
    });
    return;
  }
  
  // Not found
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not Found');
});

const PORT = 8787;
server.listen(PORT, () => {
  console.log(`Test server running on http://127.0.0.1:${PORT}`);
  console.log('Endpoints available:');
  console.log(`- http://127.0.0.1:${PORT}/health`);
  console.log(`- http://127.0.0.1:${PORT}/api/identify (POST)`);
});