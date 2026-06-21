# New Client Setup Checklist

## 1. Clone & Configure (15 min)
- [ ] Clone this repo with new name: `git clone ... businessname-website`
- [ ] `cp .env.example .env.local`
- [ ] Fill in business info in `content/settings/business.json`
- [ ] Fill in brand colors in `content/settings/theme.json`
- [ ] Add products to `content/products/catalog.json`

## 2. Clerk Setup (10 min)
- [ ] Create new Clerk application at clerk.com
- [ ] Copy publishable key + secret key to `.env.local`
- [ ] Set redirect URLs to your Vercel domain

## 3. Supabase Setup (15 min)
- [ ] Create new Supabase project
- [ ] Run `/scripts/supabase-init.sql` in Supabase SQL editor
- [ ] Copy URL + anon key + service role key to `.env.local`

## 4. Cloudflare R2 Setup (10 min)
- [ ] Create R2 bucket named `businessname-assets`
- [ ] Enable public access, copy public URL
- [ ] Create API token with R2 read/write
- [ ] Fill R2 values in `.env.local`

## 5. Vercel Deploy (5 min)
- [ ] Import repo to Vercel
- [ ] Add all `.env.local` values as Vercel environment variables
- [ ] Deploy

## 6. Telegram Bot (10 min)
- [ ] Create bot via @BotFather, copy token
- [ ] Deploy Cloudflare Worker from `/scripts/telegram-worker.js`
- [ ] Set webhook: `POST https://api.telegram.org/bot{TOKEN}/setWebhook`

## 7. VPS Chatbot Container (20 min)
- [ ] SSH into VPS
- [ ] `docker-compose -f scripts/docker-compose.chatbot.yml up -d`
- [ ] Set `CHATBOT_API_URL` in Vercel env vars

## Total estimated time per client: ~1.5 hours
