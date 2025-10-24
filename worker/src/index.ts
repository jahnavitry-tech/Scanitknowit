export interface Env {
  OPENROUTER_API_KEY: string;
  API_NINJAS_KEY: string;
  REDDIT_CLIENT_ID: string;
  REDDIT_CLIENT_SECRET: string;
  REDDIT_USER_AGENT: string;
}

// CORS helper function
function withCors(response: Response): Response {
  const headers = new Headers(response.headers);
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return new Response(response.body, { ...response, headers });
}

// Handle OPTIONS requests for CORS
function handleOptions(): Response {
  return withCors(new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  }));
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
      return handleOptions();
    }

    const url = new URL(req.url);

    // Root landing page
    if (url.pathname === "/") {
      return withCors(new Response(
        `
        <html>
          <head><title>🚀 Scan It Know It Worker</title></head>
          <body style="font-family:sans-serif;">
            <h2>🚀 Scan It Know It Worker is running</h2>
            <ul>
              <li><a href="/health">/health</a></li>
              <li><a href="/api/identify">/api/identify</a></li>
              <li><a href="/api/ingredients">/api/ingredients</a></li>
              <li><a href="/api/calories?query=banana">/api/calories</a></li>
              <li><a href="/api/reddit?query=coffee">/api/reddit</a></li>
              <li><a href="/api/qa">/api/qa</a></li>
            </ul>
          </body>
        </html>`,
        { headers: { "Content-Type": "text/html" } }
      ));
    }

    // Health check
    if (url.pathname === "/health") {
      return withCors(Response.json({ ok: true, status: "healthy" }));
    }

    // Identify endpoint - Uses OpenRouter GPT for product identification
    if (url.pathname === "/api/identify" && req.method === "POST") {
      try {
        const body = await req.json() as { text?: string };
        const text = body?.text;
        
        if (!text) {
          return withCors(new Response(JSON.stringify({ error: "No text provided" }), { 
            status: 400,
            headers: { "Content-Type": "application/json" }
          }));
        }

        console.log("Identify request received with text:", text);

        // Check if OpenRouter API key is available
        if (!env.OPENROUTER_API_KEY) {
          return withCors(new Response(JSON.stringify({ error: "OpenRouter API key not configured" }), { 
            status: 500,
            headers: { "Content-Type": "application/json" }
          }));
        }

        // Use OpenRouter GPT to identify the product
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${env.OPENROUTER_API_KEY}`,
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
          return withCors(new Response(JSON.stringify({ error: `OpenRouter API error: ${errorText}` }), { 
            status: response.status,
            headers: { "Content-Type": "application/json" }
          }));
        }

        const data = await response.json() as { choices?: { message?: { content?: string } }[] };
        const product = data?.choices?.[0]?.message?.content?.trim() || "Unknown product";
        
        // Also get a summary of the product
        const summaryResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${env.OPENROUTER_API_KEY}`,
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
          return withCors(new Response(JSON.stringify({ 
            product: product,
            summary: "No summary available."
          }), { 
            headers: { "Content-Type": "application/json" }
          }));
        }

        const summaryData = await summaryResponse.json() as { choices?: { message?: { content?: string } }[] };
        const summary = summaryData?.choices?.[0]?.message?.content?.trim() || "No summary available.";

        return withCors(Response.json({ 
          product: product,
          summary: summary
        }));
      } catch (error) {
        console.error("Error in identify endpoint:", error);
        return withCors(Response.json({ error: "Failed to identify product", details: (error as Error).message }, { status: 500 }));
      }
    }

    // Ingredients endpoint (OpenRouter LLM)
    if (url.pathname === "/api/ingredients" && req.method === "POST") {
      try {
        const body = await req.json() as { text?: string };
        const text = body?.text;
        if (!text) return withCors(new Response("Missing 'text' field", { status: 400 }));

        // Check if OpenRouter API key is available
        if (!env.OPENROUTER_API_KEY) {
          return withCors(new Response(JSON.stringify({ error: "OpenRouter API key not configured" }), { 
            status: 500,
            headers: { "Content-Type": "application/json" }
          }));
        }

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${env.OPENROUTER_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: `List ingredients and health notes for: ${text}` }],
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("OpenRouter API error:", errorText);
          return withCors(new Response(JSON.stringify({ error: `OpenRouter API error: ${errorText}` }), { 
            status: response.status,
            headers: { "Content-Type": "application/json" }
          }));
        }

        const data = await response.json() as { choices?: { message?: { content?: string } }[] };
        const content = data?.choices?.[0]?.message?.content || "No data";
        return withCors(Response.json({ result: content }));
      } catch (error) {
        console.error("Error in ingredients endpoint:", error);
        return withCors(Response.json({ error: "Failed to process ingredients", details: (error as Error).message }, { status: 500 }));
      }
    }

    // Calories endpoint
    if (url.pathname === "/api/calories" && req.method === "GET") {
      try {
        const query = url.searchParams.get("query");
        if (!query) return withCors(new Response("Missing ?query parameter", { status: 400 }));

        // Check if API Ninjas key is available
        if (!env.API_NINJAS_KEY) {
          return withCors(new Response(JSON.stringify({ error: "API Ninjas key not configured" }), { 
            status: 500,
            headers: { "Content-Type": "application/json" }
          }));
        }

        const res = await fetch(`https://api.api-ninjas.com/v1/nutrition?query=${encodeURIComponent(query)}`, {
          headers: { "X-Api-Key": env.API_NINJAS_KEY },
        });

        if (!res.ok) {
          const errorText = await res.text();
          console.error("API Ninjas error:", errorText);
          return withCors(Response.json({ error: `API Ninjas error: ${errorText}` }, { status: res.status }));
        }

        const data = await res.json();
        return withCors(Response.json({ food: query, nutrition: data }));
      } catch (error) {
        console.error("Error in calories endpoint:", error);
        return withCors(Response.json({ error: "Failed to fetch nutrition data", details: (error as Error).message }, { status: 500 }));
      }
    }

    // Reddit endpoint
    if (url.pathname === "/api/reddit" && req.method === "GET") {
      try {
        const query = url.searchParams.get("query");
        if (!query) return withCors(new Response("Missing ?query parameter", { status: 400 }));

        const res = await fetch(`https://www.reddit.com/search.json?q=${encodeURIComponent(query)}&limit=5`, {
          headers: { "User-Agent": env.REDDIT_USER_AGENT || "ScanItKnowIt/1.0" },
        });

        if (!res.ok) {
          const errorText = await res.text();
          console.error("Reddit API error:", errorText);
          return withCors(Response.json({ error: `Reddit API error: ${errorText}` }, { status: res.status }));
        }

        const json = await res.json().catch(() => null) as { data?: { children?: Array<{ data?: { title?: string, permalink?: string } }> } } | null;
        const posts = json?.data?.children?.map((c: { data?: { title?: string, permalink?: string } }) => ({
          title: c.data?.title || "",
          url: `https://reddit.com${c.data?.permalink || ""}`,
        })) || [];

        return withCors(Response.json({ query, posts }));
      } catch (error) {
        console.error("Error in Reddit endpoint:", error);
        return withCors(Response.json({ error: "Failed to fetch Reddit data", details: (error as Error).message }, { status: 500 }));
      }
    }

    // QA endpoint (OpenRouter LLM)
    if (url.pathname === "/api/qa" && req.method === "POST") {
      try {
        const body = await req.json() as { question?: string, context?: string };
        const { question, context } = body;

        // Check if OpenRouter API key is available
        if (!env.OPENROUTER_API_KEY) {
          return withCors(new Response(JSON.stringify({ error: "OpenRouter API key not configured" }), { 
            status: 500,
            headers: { "Content-Type": "application/json" }
          }));
        }

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${env.OPENROUTER_API_KEY}`,
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
          return withCors(new Response(JSON.stringify({ error: `OpenRouter API error: ${errorText}` }), { 
            status: response.status,
            headers: { "Content-Type": "application/json" }
          }));
        }

        const data = await response.json() as { choices?: { message?: { content?: string } }[] };
        const answer = data?.choices?.[0]?.message?.content || "No answer.";
        return withCors(Response.json({ answer }));
      } catch (error) {
        console.error("Error in QA endpoint:", error);
        return withCors(Response.json({ error: "Failed to process Q&A", details: (error as Error).message }, { status: 500 }));
      }
    }

    return withCors(new Response("Not Found", { status: 404 }));
  },
};