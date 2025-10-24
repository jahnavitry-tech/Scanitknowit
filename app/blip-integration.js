// BLIP Image Captioning Integration
// This snippet can be added to your api/analyze.js file to enhance image analysis with AI-generated captions

import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Generates a descriptive caption for an image using Hugging Face BLIP model
 * @param {Buffer} imageBuffer - The image data as a buffer
 * @returns {Promise<Object|null>} Caption result with value and confidence, or null if failed
 */
async function generateBLIPCaption(imageBuffer) {
  // Check if HF API token is available
  const HF_API_TOKEN = process.env.HF_API_TOKEN;
  if (!HF_API_TOKEN) {
    console.log('HF_API_TOKEN not set, skipping BLIP caption generation');
    return null;
  }

  try {
    console.log('Generating BLIP caption...');
    
    // Call Hugging Face Inference API for BLIP image captioning
    const response = await fetch(
      'https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-base',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${HF_API_TOKEN}`,
          'Content-Type': 'application/octet-stream'
        },
        body: imageBuffer
      }
    );

    // Check if the response is successful
    if (!response.ok) {
      const errorText = await response.text();
      console.warn(`BLIP API error (${response.status}): ${errorText}`);
      return null;
    }

    // Parse the JSON response
    const jsonData = await response.json();
    
    // Validate the response structure
    if (Array.isArray(jsonData) && jsonData[0] && jsonData[0].generated_text) {
      console.log('BLIP caption generated successfully');
      return {
        value: jsonData[0].generated_text,
        source: 'BLIP Caption',
        confidence: 0.75 // Fixed confidence for captions
      };
    } else {
      console.warn('Unexpected BLIP API response format:', jsonData);
      return null;
    }
  } catch (error) {
    console.error('BLIP caption generation failed:', error.message);
    return null;
  }
}

// Example usage in your analyze endpoint:
/*
app.post('/api/analyze', async (req, res) => {
  // ... existing code for QR detection, OCR, object recognition ...
  
  const results = [];
  
  // ... after QR, OCR, and object recognition ...
  
  // Add BLIP caption if available
  const captionResult = await generateBLIPCaption(imageBuffer);
  if (captionResult) {
    results.push(captionResult);
  }
  
  // ... rest of your code ...
});
*/

export { generateBLIPCaption };