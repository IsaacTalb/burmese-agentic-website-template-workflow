# Architecture Overview

## Folder Structure

```
/
├── content/                    ← AGENT-WRITABLE ZONE
│   ├── products/catalog.json   ← All products, prices, stock
│   ├── pages/home.json         ← Homepage content
│   ├── pages/about.json        ← About page content
│   └── settings/
│       ├── business.json       ← Business info, payment numbers, delivery
│       └── theme.json          ← Colors, fonts, logo
│
├── src/
│   ├── app/
│   │   ├── (site)/             ← Public-facing pages (Next.js route group)
│   │   │   ├── page.tsx        ← Homepage
│   │   │   ├── shop/           ← Product listing + detail pages
│   │   │   ├── about/          ← About page
│   │   │   └── contact/        ← Contact page
│   │   ├── admin/              ← Protected admin (Clerk auth required)
│   │   └── api/
│   │       ├── payment/submit/ ← Order submission + screenshot upload
│   │       ├── chatbot/        ← Proxy to VPS chatbot
│   │       └── telegram/       ← Telegram webhook receiver
│   │
│   ├── components/
│   │   ├── layout/             ← Navbar, Footer
│   │   ├── payment/            ← OrderForm (3-step payment flow)
│   │   └── chatbot/            ← Chat widget
│   │
│   ├── lib/
│   │   ├── content.ts          ← Reads /content/ JSON files
│   │   ├── supabase/           ← DB client (browser + server)
│   │   ├── cloudflare/r2.ts    ← Image URL helpers
│   │   └── telegram/bot.ts     ← Telegram notification helpers
│   │
│   └── types/index.ts          ← TypeScript types (mirrors JSON structure)
│
├── agent-config/
│   ├── AGENT_RULES.md          ← What the AI agent can/cannot touch
│   └── SETUP_CHECKLIST.md      ← Per-client onboarding steps
│
├── scripts/
│   ├── supabase-init.sql       ← DB schema for each new client
│   ├── docker-compose.chatbot.yml ← VPS container setup
│   └── setup-client.sh         ← New client bootstrap script
│
└── docs/
    └── ARCHITECTURE.md         ← This file
```

## Data Flow

### Customer Order
```
Customer → Product Page → OrderForm (3 steps)
  1. Fill shipping details
  2. See mobile banking number → copy → pay
  3. Upload payment screenshot
→ POST /api/payment/submit
→ Supabase orders table (status: pending)
→ Telegram notification to owner
→ Owner verifies in Admin Panel → update status
```

### Agent Content Update
```
Business owner asks Claude Code / Codex CLI:
  "Change the price of Product X to 25000"
Agent edits: content/products/catalog.json
→ git commit + push
→ Vercel auto-deploys (< 1 min)
→ Live on website
```

### Chatbot Flow
```
User message (web widget or Telegram)
→ /api/chatbot or /api/telegram/webhook
→ VPS endpoint (Ollama + Gemma 3 4B + RAG)
→ pgvector similarity search in Supabase
→ LLM generates response with context
→ Reply to user
```

## Per-Client Isolation

| Service | Scope | Why |
|---|---|---|
| GitHub repo | 1 per client | Clean agent access, deploy keys |
| Vercel project | 1 per client | Separate domains, env vars |
| Cloudflare account | 1 per client | Billing isolation |
| Clerk app | 1 per client | Auth isolation |
| Supabase project | 1 per client | Data isolation |
| VPS container | Shared (1 per client container) | Cost efficiency |
