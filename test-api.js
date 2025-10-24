const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testIdentify() {
  try {
    const response = await fetch('http://127.0.0.1:8787/api/identify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: 'This is a test product with ingredients and nutrition information'
      })
    });

    const data = await response.json();
    console.log('Response:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error:', error);
  }
}

testIdentify();