const http = require('http');

// Simple server to test the endpoints
const server = http.createServer((req, res) => {
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
    
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const text = data.text;
        
        if (!text) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'No text provided' }));
          return;
        }
        
        console.log('Identify request received with text:', text);
        
        // Return a mock response
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
          product: 'Test Product',
          summary: 'This is a test product summary'
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
  console.log(`Simple test server running on http://127.0.0.1:${PORT}`);
  console.log('Endpoints available:');
  console.log(`- http://127.0.0.1:${PORT}/health`);
  console.log(`- http://127.0.0.1:${PORT}/api/identify (POST)`);
});