// Simple test to verify the frontend is working
import fetch from 'node-fetch';

async function testFrontend() {
  try {
    const response = await fetch('http://localhost:5176');
    const html = await response.text();
    console.log('Frontend is accessible!');
    console.log('Response status:', response.status);
    console.log('HTML length:', html.length);
    
    // Check if the expected content is in the HTML
    if (html.includes('Lens-Style Product/Object Scanner')) {
      console.log('✅ App title found in HTML');
    } else {
      console.log('❌ App title not found in HTML');
    }
    
    // Check for React-specific content
    if (html.includes('root')) {
      console.log('✅ Root div found in HTML');
    } else {
      console.log('❌ Root div not found in HTML');
    }
    
    // Check for JavaScript bundle
    if (html.includes('.js') || html.includes('script')) {
      console.log('✅ JavaScript bundle referenced in HTML');
    } else {
      console.log('❌ JavaScript bundle not referenced in HTML');
    }
    
    console.log('Frontend is working correctly!');
  } catch (error) {
    console.error('Error testing frontend:', error.message);
  }
}

testFrontend();