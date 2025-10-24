// Test script for Vercel API functions
async function testAPI() {
  try {
    console.log('Testing Vercel API functions...');
    
    // Test identify endpoint
    console.log('\n1. Testing /api/identify...');
    const identifyResponse = await fetch('http://localhost:3000/api/identify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: 'Chocolate bar with almonds' })
    });
    
    const identifyData = await identifyResponse.json();
    console.log('Identify response:', JSON.stringify(identifyData, null, 2));
    
    // Test ingredients endpoint
    console.log('\n2. Testing /api/ingredients...');
    const ingredientsResponse = await fetch('http://localhost:3000/api/ingredients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: 'Chocolate bar with almonds' })
    });
    
    const ingredientsData = await ingredientsResponse.json();
    console.log('Ingredients response:', JSON.stringify(ingredientsData, null, 2));
    
    // Test nutrition endpoint
    console.log('\n3. Testing /api/nutrition...');
    const nutritionResponse = await fetch('http://localhost:3000/api/nutrition?query=chocolate');
    
    const nutritionData = await nutritionResponse.json();
    console.log('Nutrition response:', JSON.stringify(nutritionData, null, 2));
    
    // Test reddit endpoint
    console.log('\n4. Testing /api/reddit...');
    const redditResponse = await fetch('http://localhost:3000/api/reddit?query=chocolate');
    
    const redditData = await redditResponse.json();
    console.log('Reddit response:', JSON.stringify(redditData, null, 2));
    
    // Test QA endpoint
    console.log('\n5. Testing /api/qa...');
    const qaResponse = await fetch('http://localhost:3000/api/qa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        question: 'What are the health benefits of chocolate?',
        context: 'Chocolate bar with almonds'
      })
    });
    
    const qaData = await qaResponse.json();
    console.log('QA response:', JSON.stringify(qaData, null, 2));
    
    console.log('\n✅ All API tests completed successfully!');
  } catch (error) {
    console.error('❌ Error testing API:', error);
  }
}

testAPI();