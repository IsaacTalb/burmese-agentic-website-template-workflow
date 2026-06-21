# Agent Rules — Read Before Making Any Changes

## ✅ You CAN edit these files freely

```
content/products/catalog.json     — add/edit/remove products, prices, stock
content/settings/business.json    — name, phone, payment numbers, delivery options
content/settings/theme.json       — colors, fonts, logo text
content/pages/home.json           — hero text, announcements, featured section
content/pages/about.json          — about page content
public/images/                    — static images (non-R2)
```

## ❌ You CANNOT edit these files

```
.env.local                        — API keys, never touch
src/lib/                          — core integrations
src/app/api/                      — backend API routes
agent-config/                     — this config itself
scripts/                          — deployment scripts
*.config.ts / *.config.js         — build config
```

## ⚠️ Ask before editing these

```
src/app/                          — page routing and layout
src/components/                   — UI components
src/types/                        — TypeScript types
```

## Rules

1. Always edit content JSON files — never hardcode content in components
2. Product prices are in MMK (Myanmar Kyat) as integers, no decimals
3. Image URLs must point to R2 public URL or be left as empty string ""
4. When adding a product, always include both `name` (English) and `nameMyanmar` fields
5. Never add credentials, tokens, or secrets to any content file
6. After changes, summarize what you changed and why
