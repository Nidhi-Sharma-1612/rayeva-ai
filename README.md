# Rayeva AI — Sustainable Procurement Platform

An AI-powered B2B platform for sustainable product categorization and procurement proposal generation.

---

## Modules

### Module 1 — AI Product Categorizer

Categorizes products into predefined categories with sustainability tags using GPT-4o.

### Module 2 — AI B2B Proposal Generator

Generates full sustainable procurement proposals with budget allocation and impact summary using GPT-4o.

### Module 3 — AI Impact Reporting Generator _(Architecture)_

Post-order engine that calculates plastic saved, carbon avoided, and local sourcing impact per order.

### Module 4 — AI WhatsApp Support Bot _(Architecture)_

WhatsApp-integrated AI bot for order queries, return policies, escalation, and conversation logging.

---

## Tech Stack

| Layer       | Technology                   |
| ----------- | ---------------------------- |
| Frontend    | React 18, Vite, Tailwind CSS |
| Backend     | Node.js, Express.js          |
| Database    | MongoDB, Mongoose            |
| AI Model    | OpenAI GPT-4o                |
| HTTP Client | Axios                        |

---

## Project Structure

```
rayeva-ai/
├── client/          # React Frontend
├── server/          # Express Backend
└── architecture/    # Module 3 & 4 diagrams
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB running locally
- OpenAI API key

### Backend Setup

```bash
cd server
cp .env.example .env
# Add your MONGO_URI and OPENAI_API_KEY to .env
npm install
npm run dev
```

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

### Environment Variables

**server/.env**

```
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/rayeva-ai
OPENAI_API_KEY=your_openai_api_key_here
AI_MODEL=gpt-4o
```

**client/.env**

```
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## API Endpoints

### Module 1 — Categorizer

| Method | Endpoint               | Description          |
| ------ | ---------------------- | -------------------- |
| `POST` | `/api/categorizer`     | Categorize a product |
| `GET`  | `/api/categorizer`     | Get all results      |
| `GET`  | `/api/categorizer/:id` | Get one result       |

### Module 2 — Proposal Generator

| Method | Endpoint            | Description         |
| ------ | ------------------- | ------------------- |
| `POST` | `/api/proposal`     | Generate a proposal |
| `GET`  | `/api/proposal`     | Get all proposals   |
| `GET`  | `/api/proposal/:id` | Get one proposal    |

---

## AI Prompt Design

### Module 1 — Categorizer Prompt

- **System prompt** injects 15 product categories and 15 sustainability filters
- **User prompt** dynamically builds from product input fields
- Model instructed to return **only valid JSON** — no markdown, no explanation
- `temperature: 0.2` for consistent structured output
- `aiResponseParser.js` handles edge cases (markdown fences, malformed JSON)

### Module 2 — Proposal Prompt

- **System prompt** defines exact JSON schema for a full procurement proposal
- **User prompt** injects company name, industry, budget, categories and sustainability preferences
- Model instructed to recommend exactly 5 products and stay within budget
- `temperature: 0.3` for slightly more creative product recommendations

---

## Architecture Diagrams

- [Module 3 — Impact Reporting](./architecture/module3-impact-reporting-architecture.md)
- [Module 4 — WhatsApp Bot](./architecture/module4-whatsapp-bot-architecture.md)
