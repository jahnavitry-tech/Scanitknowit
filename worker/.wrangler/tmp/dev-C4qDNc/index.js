var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/index.ts
function withCors(response) {
  const headers = new Headers(response.headers);
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return new Response(response.body, { ...response, headers });
}
__name(withCors, "withCors");
function handleOptions() {
  return withCors(new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400"
    }
  }));
}
__name(handleOptions, "handleOptions");
var src_default = {
  async fetch(req, env) {
    if (req.method === "OPTIONS") {
      return handleOptions();
    }
    const url = new URL(req.url);
    if (url.pathname === "/") {
      return withCors(new Response(
        `
        <html>
          <head><title>\u{1F680} Scan It Know It Worker</title></head>
          <body style="font-family:sans-serif;">
            <h2>\u{1F680} Scan It Know It Worker is running</h2>
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
    if (url.pathname === "/health") {
      return withCors(Response.json({ ok: true, status: "healthy" }));
    }
    if (url.pathname === "/api/identify" && req.method === "POST") {
      try {
        const body = await req.json();
        const text = body?.text;
        if (!text) {
          return withCors(new Response(JSON.stringify({ error: "No text provided" }), {
            status: 400,
            headers: { "Content-Type": "application/json" }
          }));
        }
        console.log("Identify request received with text:", text);
        if (!env.OPENROUTER_API_KEY) {
          return withCors(new Response(JSON.stringify({ error: "OpenRouter API key not configured" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
          }));
        }
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json"
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
        const data = await response.json();
        const product = data?.choices?.[0]?.message?.content?.trim() || "Unknown product";
        const summaryResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json"
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
            product,
            summary: "No summary available."
          }), {
            headers: { "Content-Type": "application/json" }
          }));
        }
        const summaryData = await summaryResponse.json();
        const summary = summaryData?.choices?.[0]?.message?.content?.trim() || "No summary available.";
        return withCors(Response.json({
          product,
          summary
        }));
      } catch (error) {
        console.error("Error in identify endpoint:", error);
        return withCors(Response.json({ error: "Failed to identify product", details: error.message }, { status: 500 }));
      }
    }
    if (url.pathname === "/api/ingredients" && req.method === "POST") {
      try {
        const body = await req.json();
        const text = body?.text;
        if (!text) return withCors(new Response("Missing 'text' field", { status: 400 }));
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
            "Authorization": `Bearer ${env.OPENROUTER_API_KEY}`
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: `List ingredients and health notes for: ${text}` }]
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
        const data = await response.json();
        const content = data?.choices?.[0]?.message?.content || "No data";
        return withCors(Response.json({ result: content }));
      } catch (error) {
        console.error("Error in ingredients endpoint:", error);
        return withCors(Response.json({ error: "Failed to process ingredients", details: error.message }, { status: 500 }));
      }
    }
    if (url.pathname === "/api/calories" && req.method === "GET") {
      try {
        const query = url.searchParams.get("query");
        if (!query) return withCors(new Response("Missing ?query parameter", { status: 400 }));
        if (!env.API_NINJAS_KEY) {
          return withCors(new Response(JSON.stringify({ error: "API Ninjas key not configured" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
          }));
        }
        const res = await fetch(`https://api.api-ninjas.com/v1/nutrition?query=${encodeURIComponent(query)}`, {
          headers: { "X-Api-Key": env.API_NINJAS_KEY }
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
        return withCors(Response.json({ error: "Failed to fetch nutrition data", details: error.message }, { status: 500 }));
      }
    }
    if (url.pathname === "/api/reddit" && req.method === "GET") {
      try {
        const query = url.searchParams.get("query");
        if (!query) return withCors(new Response("Missing ?query parameter", { status: 400 }));
        const res = await fetch(`https://www.reddit.com/search.json?q=${encodeURIComponent(query)}&limit=5`, {
          headers: { "User-Agent": env.REDDIT_USER_AGENT || "ScanItKnowIt/1.0" }
        });
        if (!res.ok) {
          const errorText = await res.text();
          console.error("Reddit API error:", errorText);
          return withCors(Response.json({ error: `Reddit API error: ${errorText}` }, { status: res.status }));
        }
        const json = await res.json().catch(() => null);
        const posts = json?.data?.children?.map((c) => ({
          title: c.data?.title || "",
          url: `https://reddit.com${c.data?.permalink || ""}`
        })) || [];
        return withCors(Response.json({ query, posts }));
      } catch (error) {
        console.error("Error in Reddit endpoint:", error);
        return withCors(Response.json({ error: "Failed to fetch Reddit data", details: error.message }, { status: 500 }));
      }
    }
    if (url.pathname === "/api/qa" && req.method === "POST") {
      try {
        const body = await req.json();
        const { question, context } = body;
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
            "Authorization": `Bearer ${env.OPENROUTER_API_KEY}`
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              { role: "system", content: "You are a food and nutrition assistant." },
              { role: "user", content: `Context: ${context}
Question: ${question}` }
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
        const data = await response.json();
        const answer = data?.choices?.[0]?.message?.content || "No answer.";
        return withCors(Response.json({ answer }));
      } catch (error) {
        console.error("Error in QA endpoint:", error);
        return withCors(Response.json({ error: "Failed to process Q&A", details: error.message }, { status: 500 }));
      }
    }
    return withCors(new Response("Not Found", { status: 404 }));
  }
};

// node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-9Dg2jm/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = src_default;

// node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-9Dg2jm/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=index.js.map
