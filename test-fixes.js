const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testFixes() {
  try {
    console.log('Testing fixes for the QA summary issue...');
    
    // Test identify endpoint
    console.log('\n1. Testing /api/identify...');
    const identifyResponse = await fetch('http://localhost:3001/api/identify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: 'Chocolate bar with almonds' })
    });
    
    const identifyData = await identifyResponse.json();
    console.log('Identify response:', JSON.stringify(identifyData, null, 2));
    
    // Test QA endpoint with product name for summary
    console.log('\n2. Testing /api/qa with product name for summary...');
    const qaSummaryResponse = await fetch('http://localhost:3001/api/qa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        productName: identifyData.product,
        context: 'Chocolate bar with almonds'
      })
    });
    
    const qaSummaryData = await qaSummaryResponse.json();
    console.log('QA Summary response:', JSON.stringify(qaSummaryData, null, 2));
    
    // Test QA endpoint with specific question
    console.log('\n3. Testing /api/qa with specific question...');
    const qaQuestionResponse = await fetch('http://localhost:3001/api/qa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        question: 'What are the health benefits?',
        productName: identifyData.product,
        context: 'Chocolate bar with almonds'
      })
    });
    
    const qaQuestionData = await qaQuestionResponse.json();
    console.log('QA Question response:', JSON.stringify(qaQuestionData, null, 2));
    
    console.log('\n✅ All tests completed successfully!');
  } catch (error) {
    console.error('❌ Error testing fixes:', error);
  }
}

// Run the test
testFixes();