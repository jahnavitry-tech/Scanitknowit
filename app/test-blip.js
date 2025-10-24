// Test script to verify BLIP integration is working
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

async function testBLIP() {
  const HF_API_TOKEN = process.env.HF_API_TOKEN;
  
  if (!HF_API_TOKEN) {
    console.log('HF_API_TOKEN not found in environment variables');
    return;
  }
  
  console.log('HF_API_TOKEN found, testing BLIP integration...');
  
  try {
    // Try to make a simple request to the BLIP API to verify the token works
    const response = await fetch(
      'https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-base',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${HF_API_TOKEN}`,
        },
        body: JSON.stringify({ inputs: "test" })
      }
    );
    
    console.log(`API response status: ${response.status}`);
    
    if (response.status === 429) {
      console.log('API is working but rate limited (this is normal for free accounts)');
    } else if (response.status === 200) {
      console.log('API is working correctly!');
    } else {
      console.log(`Unexpected response status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error testing BLIP API:', error.message);
  }
}

testBLIP();