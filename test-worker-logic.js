const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// Use the OpenRouter API key from the environment or use the provided one
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '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';

async function testIdentifyEndpoint() {
  try {
    console.log('Testing identify endpoint logic...');
    
    // Simulate the text that would come from OCR
    const text = "Coca Cola 355ml Nutrition Facts Serving Size 12 fl oz (355mL) Servings Per Container about 1 Calories 140 Calories from Fat 0 % Daily Value* Total Fat 0g 0% Sodium 45mg 2% Total Carbohydrate 39g 13% Sugars 39g Protein 0g Vitamin A 0% Vitamin C 0% Calcium 0% Iron 0% *Percent Daily Values are based on a 2,000 calorie diet.";
    
    console.log('OCR text:', text);
    
    // Test the product identification
    console.log('\n--- Testing Product Identification ---');
    const identifyResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
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
          { role: "user", content: text }
        ]
      })
    });

    if (!identifyResponse.ok) {
      const errorText = await identifyResponse.text();
      console.error('OpenRouter API error for identification:', errorText);
      return;
    }

    const identifyData = await identifyResponse.json();
    const product = identifyData?.choices?.[0]?.message?.content?.trim() || "Unknown product";
    console.log('Identified product:', product);
    
    // Test the product summary
    console.log('\n--- Testing Product Summary ---');
    const summaryResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
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
            content: "You are a product analyst. Provide a brief 3-5 line summary of this product, including its main features and purpose." 
          },
          { role: "user", content: `What is ${product}?` }
        ]
      })
    });

    if (!summaryResponse.ok) {
      const errorText = await summaryResponse.text();
      console.error('OpenRouter API error for summary:', errorText);
      return;
    }

    const summaryData = await summaryResponse.json();
    const summary = summaryData?.choices?.[0]?.message?.content?.trim() || "No summary available.";
    console.log('Product summary:', summary);
    
    // Return the result that would be sent by the worker
    const result = {
      product: product,
      summary: summary
    };
    
    console.log('\n--- Final Result ---');
    console.log(JSON.stringify(result, null, 2));
    
  } catch (error) {
    console.error('Error in test:', error);
  }
}

testIdentifyEndpoint();