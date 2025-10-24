const http = require('http');

// Simple server to test the Vercel API functions
const server = http.createServer(async (req, res) => {
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
        
        // Simple product identification based on keywords
        const lowerText = text.toLowerCase();
        let product = 'Unknown Product';
        let summary = 'No summary available.';
        
        if (lowerText.includes('chocolate') || lowerText.includes('candy') || lowerText.includes('snack')) {
          product = 'Chocolate Bar';
          summary = 'A delicious chocolate bar perfect for satisfying your sweet cravings. Contains rich cocoa and smooth texture.';
        } else if (lowerText.includes('coffee') || lowerText.includes('cafe')) {
          product = 'Coffee';
          summary = 'Freshly roasted coffee beans or ground coffee for brewing. Rich aroma and bold flavor.';
        } else if (lowerText.includes('tea') || lowerText.includes('herbal')) {
          product = 'Tea';
          summary = 'A soothing tea blend with natural ingredients. Perfect for relaxation and wellness.';
        } else if (lowerText.includes('water') || lowerText.includes('h2o')) {
          product = 'Bottled Water';
          summary = 'Pure, filtered water in a convenient bottle. Essential for hydration throughout the day.';
        } else if (lowerText.includes('soda') || lowerText.includes('cola') || lowerText.includes('pop')) {
          product = 'Soda';
          summary = 'Refreshing carbonated beverage with a burst of flavor. Perfect for any occasion.';
        } else if (lowerText.includes('shampoo') || lowerText.includes('conditioner')) {
          product = 'Hair Care Product';
          summary = 'Gentle hair care formula designed to cleanse and nourish your hair for a healthy shine.';
        } else if (lowerText.includes('soap') || lowerText.includes('body wash')) {
          product = 'Body Cleanser';
          summary = 'Refreshing body cleanser that gently removes dirt and impurities while moisturizing your skin.';
        } else if (lowerText.includes('lotion') || lowerText.includes('moisturizer')) {
          product = 'Moisturizer';
          summary = 'Hydrating lotion that nourishes and protects your skin for a soft, smooth feel.';
        } else if (text.length > 10) {
          product = 'General Product';
          summary = 'A consumer product identified through OCR text analysis. Further details may be available through specialized databases.';
        }
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
          product: product,
          summary: summary
        }));
      } catch (error) {
        console.error('Error in identify endpoint:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to identify product' }));
      }
    });
    return;
  }
  
  // Ingredients endpoint
  if (url.pathname === '/api/ingredients' && req.method === 'POST') {
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
        
        // For demonstration, we'll return sample ingredients based on product type
        const lowerText = text.toLowerCase();
        let ingredients = 'Ingredients information not available.';
        
        if (lowerText.includes('chocolate')) {
          ingredients = 'Cocoa mass, sugar, cocoa butter, emulsifier (soya lecithin), vanilla extract.\n\nHealth notes: High in calories and sugar. Contains caffeine. May cause allergic reactions in people with milk or soya allergies.';
        } else if (lowerText.includes('coffee')) {
          ingredients = '100% Arabica coffee beans.\n\nHealth notes: Contains caffeine. May improve alertness and focus. Antioxidants present.';
        } else if (lowerText.includes('tea')) {
          ingredients = 'Black tea leaves, natural flavors.\n\nHealth notes: Contains caffeine. Rich in antioxidants. May support heart health.';
        } else if (lowerText.includes('water')) {
          ingredients = 'Purified water.\n\nHealth notes: Essential for hydration. No calories or additives.';
        } else if (lowerText.includes('soda')) {
          ingredients = 'Carbonated water, high fructose corn syrup, caramel color, phosphoric acid, natural flavors, caffeine.\n\nHealth notes: High in sugar and calories. May contribute to tooth decay. Caffeine content.';
        } else if (lowerText.includes('shampoo')) {
          ingredients = 'Water, sodium laureth sulfate, cocamidopropyl betaine, glycerin, fragrance, citric acid, preservatives.\n\nHealth notes: For external use only. Avoid contact with eyes. May cause allergic reactions in sensitive individuals.';
        } else if (lowerText.includes('soap')) {
          ingredients = 'Sodium palmate, sodium cocoate, water, glycerin, fragrance, titanium dioxide.\n\nHealth notes: For external use only. Keep out of reach of children.';
        } else {
          ingredients = 'Common ingredients for this product type include: water, preservatives, flavoring agents, and colorants.\n\nHealth notes: Check packaging for complete ingredient list and allergen information.';
        }
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ result: ingredients }));
      } catch (error) {
        console.error('Error in ingredients endpoint:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to fetch ingredients' }));
      }
    });
    return;
  }
  
  // Nutrition endpoint
  if (url.pathname === '/api/nutrition' && req.method === 'GET') {
    try {
      const query = url.searchParams.get('query');
      
      if (!query) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'No query provided' }));
        return;
      }
      
      // For demonstration, we'll return sample nutrition data based on product type
      const lowerQuery = query.toLowerCase();
      let nutritionData = null;
      
      if (lowerQuery.includes('chocolate')) {
        nutritionData = {
          food: 'Chocolate Bar',
          nutrition: [
            {
              name: 'Chocolate Bar',
              calories: 220,
              serving_size_g: 40,
              fat_total_g: 13,
              fat_saturated_g: 8,
              protein_g: 2,
              sodium_mg: 30,
              potassium_mg: 150,
              cholesterol_mg: 5,
              carbohydrates_total_g: 25,
              fiber_g: 1,
              sugar_g: 22
            }
          ]
        };
      } else if (lowerQuery.includes('coffee')) {
        nutritionData = {
          food: 'Coffee',
          nutrition: [
            {
              name: 'Coffee',
              calories: 2,
              serving_size_g: 240,
              fat_total_g: 0,
              fat_saturated_g: 0,
              protein_g: 0.3,
              sodium_mg: 5,
              potassium_mg: 116,
              cholesterol_mg: 0,
              carbohydrates_total_g: 0.2,
              fiber_g: 0,
              sugar_g: 0
            }
          ]
        };
      } else if (lowerQuery.includes('tea')) {
        nutritionData = {
          food: 'Tea',
          nutrition: [
            {
              name: 'Tea',
              calories: 2,
              serving_size_g: 240,
              fat_total_g: 0,
              fat_saturated_g: 0,
              protein_g: 0,
              sodium_mg: 1,
              potassium_mg: 8,
              cholesterol_mg: 0,
              carbohydrates_total_g: 0.5,
              fiber_g: 0,
              sugar_g: 0
            }
          ]
        };
      } else if (lowerQuery.includes('water')) {
        nutritionData = {
          food: 'Bottled Water',
          nutrition: [
            {
              name: 'Bottled Water',
              calories: 0,
              serving_size_g: 1000,
              fat_total_g: 0,
              fat_saturated_g: 0,
              protein_g: 0,
              sodium_mg: 0,
              potassium_mg: 0,
              cholesterol_mg: 0,
              carbohydrates_total_g: 0,
              fiber_g: 0,
              sugar_g: 0
            }
          ]
        };
      } else if (lowerQuery.includes('soda')) {
        nutritionData = {
          food: 'Soda',
          nutrition: [
            {
              name: 'Soda',
              calories: 140,
              serving_size_g: 355,
              fat_total_g: 0,
              fat_saturated_g: 0,
              protein_g: 0,
              sodium_mg: 45,
              potassium_mg: 10,
              cholesterol_mg: 0,
              carbohydrates_total_g: 39,
              fiber_g: 0,
              sugar_g: 39
            }
          ]
        };
      } else {
        nutritionData = {
          food: query,
          nutrition: [
            {
              name: query,
              calories: 100,
              serving_size_g: 100,
              fat_total_g: 0,
              fat_saturated_g: 0,
              protein_g: 0,
              sodium_mg: 0,
              potassium_mg: 0,
              cholesterol_mg: 0,
              carbohydrates_total_g: 0,
              fiber_g: 0,
              sugar_g: 0
            }
          ]
        };
      }
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(nutritionData));
    } catch (error) {
      console.error('Error in nutrition endpoint:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Failed to fetch nutrition data' }));
    }
    return;
  }
  
  // Reddit endpoint
  if (url.pathname === '/api/reddit' && req.method === 'GET') {
    try {
      const query = url.searchParams.get('query');
      
      if (!query) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'No query provided' }));
        return;
      }
      
      // For demonstration, we'll return sample Reddit posts based on product type
      const lowerQuery = query.toLowerCase();
      let posts = [];
      
      if (lowerQuery.includes('chocolate')) {
        posts = [
          {
            title: 'Best chocolate bars for 2025?',
            url: 'https://reddit.com/r/food/comments/example1'
          },
          {
            title: 'Homemade chocolate recipes',
            url: 'https://reddit.com/r/cooking/comments/example2'
          },
          {
            title: 'Dark chocolate health benefits',
            url: 'https://reddit.com/r/health/comments/example3'
          }
        ];
      } else if (lowerQuery.includes('coffee')) {
        posts = [
          {
            title: 'Best coffee beans for espresso',
            url: 'https://reddit.com/r/coffee/comments/example4'
          },
          {
            title: 'Cold brew vs hot coffee',
            url: 'https://reddit.com/r/FoodForThought/comments/example5'
          }
        ];
      } else if (lowerQuery.includes('tea')) {
        posts = [
          {
            title: 'Tea pairing suggestions',
            url: 'https://reddit.com/r/tea/comments/example6'
          },
          {
            title: 'Herbal tea benefits',
            url: 'https://reddit.com/r/health/comments/example7'
          }
        ];
      } else {
        posts = [
          {
            title: `Discussion about ${query}`,
            url: 'https://reddit.com/r/general/comments/example8'
          },
          {
            title: `Reviews for ${query}`,
            url: 'https://reddit.com/r/reviews/comments/example9'
          }
        ];
      }
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ query, posts }));
    } catch (error) {
      console.error('Error in reddit endpoint:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Failed to fetch Reddit data' }));
    }
    return;
  }
  
  // QA endpoint
  if (url.pathname === '/api/qa' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const { question, context } = data;
        
        if (!question) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'No question provided' }));
          return;
        }
        
        // For demonstration, we'll return sample answers based on the question
        const lowerQuestion = question.toLowerCase();
        let answer = 'I don\'t have specific information about that. Please ask another question.';
        
        if (lowerQuestion.includes('ingredient') || lowerQuestion.includes('contain')) {
          answer = 'This product contains natural ingredients. For a complete list, please check the packaging or nutritional label.';
        } else if (lowerQuestion.includes('health') || lowerQuestion.includes('benefit')) {
          answer = 'This product can be part of a balanced diet. Please consult with a healthcare professional for specific health concerns.';
        } else if (lowerQuestion.includes('calorie') || lowerQuestion.includes('nutrition')) {
          answer = 'Nutritional information is available in the nutrition facts panel. Please refer to that for detailed information.';
        } else if (lowerQuestion.includes('allerg') || lowerQuestion.includes('sensitiv')) {
          answer = 'This product may contain common allergens. Please check the ingredient list carefully and consult with a doctor if you have specific allergies.';
        } else if (lowerQuestion.includes('storage') || lowerQuestion.includes('preserve')) {
          answer = 'Store in a cool, dry place away from direct sunlight. Keep the container tightly closed after opening.';
        } else {
          answer = 'Thank you for your question. For more detailed information, please refer to the product packaging or contact the manufacturer directly.';
        }
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ answer }));
      } catch (error) {
        console.error('Error in QA endpoint:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to process Q&A' }));
      }
    });
    return;
  }
  
  // Not found
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not Found');
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Test Vercel API server running on http://localhost:${PORT}`);
  console.log('Endpoints available:');
  console.log(`- http://localhost:${PORT}/health`);
  console.log(`- http://localhost:${PORT}/api/identify (POST)`);
  console.log(`- http://localhost:${PORT}/api/ingredients (POST)`);
  console.log(`- http://localhost:${PORT}/api/nutrition?query=... (GET)`);
  console.log(`- http://localhost:${PORT}/api/reddit?query=... (GET)`);
  console.log(`- http://localhost:${PORT}/api/qa (POST)`);
});