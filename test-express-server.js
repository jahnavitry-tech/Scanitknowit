const express = require('express');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
const PORT = 8787;

// Middleware
app.use(express.json());

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  next();
});

// Use the OpenRouter API key from the environment or use the provided one
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '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';
const API_NINJAS_KEY = process.env.API_NINJAS_KEY || 'rDDdECESJxM8DeCjjOSjUg==cIDxI7V36U0vKVbQ';

// Root endpoint
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head><title>🚀 Scan It Know It Test Server</title></head>
      <body style="font-family:sans-serif;">
        <h2>🚀 Scan It Know It Test Server is running</h2>
        <ul>
          <li><a href="/health">/health</a></li>
          <li><a href="/api/identify">/api/identify</a></li>
          <li><a href="/api/ingredients">/api/ingredients</a></li>
          <li><a href="/api/calories?query=banana">/api/calories</a></li>
          <li><a href="/api/reddit?query=coffee">/api/reddit</a></li>
          <li><a href="/api/qa">/api/qa</a></li>
        </ul>
      </body>
    </html>
  `);
});

// Health check
app.get('/health', (req, res) => {
  res.json({ ok: true, status: "healthy" });
});

// Identify endpoint
app.post('/api/identify', async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: "No text provided" });
    }

    console.log("Identify request received with text:", text);

    // Use OpenRouter GPT to identify the product
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
          { role: "user", content: text }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter API error:", errorText);
      return res.status(response.status).json({ error: `OpenRouter API error: ${errorText}` });
    }

    const data = await response.json();
    const product = data?.choices?.[0]?.message?.content?.trim() || "Unknown product";
    
    // Also get a summary of the product
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
      console.error("OpenRouter API error for summary:", errorText);
      return res.json({ 
        product: product,
        summary: "No summary available."
      });
    }

    const summaryData = await summaryResponse.json();
    const summary = summaryData?.choices?.[0]?.message?.content?.trim() || "No summary available.";

    res.json({ 
      product: product,
      summary: summary
    });
  } catch (error) {
    console.error("Error in identify endpoint:", error);
    res.status(500).json({ error: "Failed to identify product", details: error.message });
  }
});

// Ingredients endpoint
app.post('/api/ingredients', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).send("Missing 'text' field");

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: `List ingredients and health notes for: ${text}` }],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter API error:", errorText);
      return res.status(response.status).json({ error: `OpenRouter API error: ${errorText}` });
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content || "No data";
    res.json({ result: content });
  } catch (error) {
    console.error("Error in ingredients endpoint:", error);
    res.status(500).json({ error: "Failed to process ingredients", details: error.message });
  }
});

// Calories endpoint
app.get('/api/calories', async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).send("Missing ?query parameter");

    const resApi = await fetch(`https://api.api-ninjas.com/v1/nutrition?query=${encodeURIComponent(query)}`, {
      headers: { "X-Api-Key": API_NINJAS_KEY },
    });

    if (!resApi.ok) {
      const errorText = await resApi.text();
      console.error("API Ninjas error:", errorText);
      return res.status(resApi.status).json({ error: `API Ninjas error: ${errorText}` });
    }

    const data = await resApi.json();
    res.json({ food: query, nutrition: data });
  } catch (error) {
    console.error("Error in calories endpoint:", error);
    res.status(500).json({ error: "Failed to fetch nutrition data", details: error.message });
  }
});

// Reddit endpoint
app.get('/api/reddit', async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).send("Missing ?query parameter");

    const resApi = await fetch(`https://www.reddit.com/search.json?q=${encodeURIComponent(query)}&limit=5`, {
      headers: { "User-Agent": "ScanItKnowIt/1.0" },
    });

    if (!resApi.ok) {
      const errorText = await resApi.text();
      console.error("Reddit API error:", errorText);
      return res.status(resApi.status).json({ error: `Reddit API error: ${errorText}` });
    }

    const json = await resApi.json();
    const posts = json?.data?.children?.map((c) => ({
      title: c.data?.title || "",
      url: `https://reddit.com${c.data?.permalink || ""}`,
    })) || [];

    res.json({ query, posts });
  } catch (error) {
    console.error("Error in Reddit endpoint:", error);
    res.status(500).json({ error: "Failed to fetch Reddit data", details: error.message });
  }
});

// QA endpoint
app.post('/api/qa', async (req, res) => {
  try {
    const { question, context } = req.body;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a food and nutrition assistant." },
          { role: "user", content: `Context: ${context}\nQuestion: ${question}` },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter API error:", errorText);
      return res.status(response.status).json({ error: `OpenRouter API error: ${errorText}` });
    }

    const data = await response.json();
    const answer = data?.choices?.[0]?.message?.content || "No answer.";
    res.json({ answer });
  } catch (error) {
    console.error("Error in QA endpoint:", error);
    res.status(500).json({ error: "Failed to process Q&A", details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Test server running on http://127.0.0.1:${PORT}`);
  console.log('Endpoints available:');
  console.log(`- http://127.0.0.1:${PORT}/health`);
  console.log(`- http://127.0.0.1:${PORT}/api/identify (POST)`);
  console.log(`- http://127.0.0.1:${PORT}/api/ingredients (POST)`);
  console.log(`- http://127.0.0.1:${PORT}/api/calories?query=... (GET)`);
  console.log(`- http://127.0.0.1:${PORT}/api/reddit?query=... (GET)`);
  console.log(`- http://127.0.0.1:${PORT}/api/qa (POST)`);
});