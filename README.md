# Scan It Know It

A full-stack product scanning web app: take or upload a product photo, OCR with Tesseract.js, identify the product via OpenRouter LLM, and fetch on-demand card data (ingredients, calories, Reddit reviews, Q&A) via Cloudflare Workers.

## 📖 Complete Documentation

Please see [COMBINED_README.md](COMBINED_README.md) for complete setup instructions, including both frontend and worker configuration.

## 🚀 Quick Start

### 1. Configure Worker API Keys

Inside `worker/.dev.vars` (for local), add your API keys:

```bash
OPENROUTER_API_KEY=sk-your-openrouter-key
NINJA_API_KEY=your-api-ninjas-key
```

### 2. Start the Worker

```bash
cd worker
npm install
npm run dev
```

Access it at 👉 [http://127.0.0.1:8787](http://127.0.0.1:8787)

### 3. Start the Frontend

```bash
cd app
npm install
npm run dev
```

Visit 👉 [http://localhost:5174](http://localhost:5174)

---

## 🧠 How It Works

1. **Upload Image** → OCR runs locally via Tesseract.js
2. **OCR Text Sent** → To Worker endpoints:
   * `/api/identify` → OpenRouter model identifies product
   * `/api/ingredients` → LLM analyzes ingredients
   * `/api/calories` → API Ninjas fetches nutrition info
   * `/api/reddit` → Reddit posts fetched
   * `/api/qa` → LLM answers "Is this product healthy?"
3. **Results Displayed** → In clean cards on the frontend

---

## 🧰 Prerequisites

- Node.js 18+
- npm or pnpm
- Cloudflare Wrangler (`npm i -g wrangler`)
- Free API keys from:
  - [OpenRouter](https://openrouter.ai/keys)
  - [API Ninjas](https://api-ninjas.com/api/caloriesburned)

---

## 🗂 Setup

### 1. Clone and install
```bash
git clone <repo-url>
cd scanitknowit
npm install
```

### 2. Configure Worker

Inside `worker/.dev.vars` (for local), add:

```bash
OPENROUTER_API_KEY=sk-your-openrouter-key
NINJA_API_KEY=your-api-ninjas-key
```

### 3. Start the worker

```bash
cd worker
npm run dev
```

Access it at 👉 [http://127.0.0.1:8787](http://127.0.0.1:8787)

### 4. Start frontend

```bash
cd app
npm run dev
```

Visit 👉 [http://localhost:5173](http://localhost:5173)

---

## 🧠 API Endpoints

| Endpoint           | Method | Description                    |
| ------------------ | ------ | ------------------------------ |
| `/health`          | GET    | Health check                   |
| `/api/identify`    | POST   | Identify product from OCR text |
| `/api/ingredients` | POST   | Analyze ingredients via LLM    |
| `/api/calories`    | GET    | Get calorie info (API Ninjas)  |
| `/api/reddit`      | GET    | Fetch Reddit reviews           |
| `/api/qa`          | POST   | AI Q&A about a product         |

**Example Test (POST):**

```bash
curl -X POST http://127.0.0.1:8787/api/identify \
  -H "Content-Type: application/json" \
  -d '{"text": "Coca Cola ingredients sugar carbonated water"}'
```

---

## 🌐 Deploy to Cloudflare

1. Login:

   ```bash
   wrangler login
   ```
2. Publish:

   ```bash
   wrangler deploy
   ```
3. Your live worker will be at:

   ```
   https://scanitknowit.<your-subdomain>.workers.dev
   ```

---

## 🧩 Troubleshooting

| Issue                               | Fix                                                           |
| ----------------------------------- | ------------------------------------------------------------- |
| `Not Found` on endpoints            | Ensure POST vs GET method matches                             |
| `Invalid API Key`                   | Check `.dev.vars` or run `wrangler secret put`                |
| `SyntaxError: Unexpected token '<'` | You called POST endpoint from browser without JSON body       |
| OCR not working                     | Ensure `tesseract.js` is imported correctly in frontend utils |

---

## ❤️ Credits

* [Cloudflare Workers](https://developers.cloudflare.com/workers/)
* [OpenRouter](https://openrouter.ai)
* [API Ninjas](https://api-ninjas.com)
* [Tesseract.js](https://tesseract.projectnaptha.com/)
* [React + Tailwind](https://tailwindcss.com/)

---

Made with 💡 by [Your Name]