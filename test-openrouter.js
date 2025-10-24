const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// Use the OpenRouter API key from the environment or use a placeholder
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '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';

async function testOpenRouterAPI() {
  try {
    console.log('Testing OpenRouter API with key:', OPENROUTER_API_KEY.substring(0, 10) + '...');
    
    // Test the identify functionality
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { 
            role: "system", 
            content: "You are a product identifier. Identify the product from OCR text. Respond with only the product name." 
          },
          { role: "user", content: "This is a test product with ingredients and nutrition information" }
        ]
      })
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', [...response.headers.entries()]);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API error:', errorText);
      return;
    }

    const data = await response.json();
    console.log('OpenRouter API response:', JSON.stringify(data, null, 2));
    
    const product = data?.choices?.[0]?.message?.content?.trim() || "Unknown product";
    console.log('Identified product:', product);
  } catch (error) {
    console.error('Error testing OpenRouter API:', error);
  }
}

testOpenRouterAPI();