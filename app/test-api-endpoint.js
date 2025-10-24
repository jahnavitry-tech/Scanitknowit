// Test script to verify API endpoint is working
import fetch from 'node-fetch';

async function testAPI() {
  try {
    // Test the API endpoint
    const response = await fetch('http://localhost:3007/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ test: true })
    });
    
    console.log(`API response status: ${response.status}`);
    
    if (response.status === 400) {
      const data = await response.json();
      console.log('Expected error (no file uploaded):', data.error);
      console.log('✅ API endpoint is working correctly!');
    } else {
      console.log(`Unexpected response status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error testing API endpoint:', error.message);
  }
}

testAPI();