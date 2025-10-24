# 🚀 ScanItKnowIt - Full Stack Setup

A full-stack AI-powered app that **scans product labels**, performs **OCR + AI ingredient analysis**, and **fetches public reviews** — all built on:
- ⚛️ React + Vite + Tailwind (Frontend)
- 🌩️ Cloudflare Workers (Serverless API)
- 🤖 OpenRouter (LLM for product reasoning)
- 🔍 Tesseract.js (OCR)
- 🍎 API Ninjas (Calorie data)

---

## 🧰 Prerequisites

- Node.js 18+
- npm or pnpm
- Cloudflare Wrangler (`npm i -g wrangler`)
- Free API keys from:
  - [OpenRouter](https://openrouter.ai/keys)
  - [API Ninjas](https://api-ninjas.com/api/caloriesburned)

---

## 🗂 Project Structure

```
scanitknowit/
├── app/                 # React frontend
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   ├── postcss.config.cjs
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       ├── index.css
│       ├── components/
│       │   ├── ImageUploader.tsx
│       │   ├── ResultCard.tsx
│       │   └── Loader.tsx
│       └── utils/
│           └── ocr.ts
│
├── worker/              # Cloudflare Worker backend
│   ├── src/
│   │   └── index.ts
│   ├── wrangler.jsonc
│   ├── package.json
│   └── .dev.vars
│
└── README.md
```

---

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

You should see:
`🚀 Scan It Know It Worker is running`

### 3. Start the Frontend

```bash
cd ../app
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

### Worker Deployment

1. Login to Cloudflare:
   ```bash
   wrangler login
   ```
2. Publish the worker:
   ```bash
   wrangler deploy
   ```
3. Your live worker will be at:
   ```
   https://scanitknowit.<your-subdomain>.workers.dev
   ```

### Frontend Deployment

Deploy the frontend to Cloudflare Pages:
1. Connect your GitHub repo to Cloudflare Pages
2. Set the build command to: `npm run build`
3. Set the build output directory to: `dist`

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