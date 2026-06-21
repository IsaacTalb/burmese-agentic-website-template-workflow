#!/bin/bash
# Quick setup script for new client
# Usage: ./scripts/setup-client.sh businessname

set -e
SLUG=$1

if [ -z "$SLUG" ]; then
  echo "Usage: ./scripts/setup-client.sh <business-slug>"
  exit 1
fi

echo "Setting up client: $SLUG"

# 1. Create GitHub deploy key
ssh-keygen -t ed25519 -C "deploy-$SLUG" -f ~/.ssh/deploy_$SLUG -N ""
echo ""
echo "Add this deploy key to your GitHub repo ($SLUG):"
cat ~/.ssh/deploy_$SLUG.pub
echo ""

# 2. Remind about services
echo "Next steps:"
echo "1. Create Clerk app at https://clerk.com"
echo "2. Create Supabase project at https://supabase.com"
echo "3. Run scripts/supabase-init.sql in Supabase SQL editor"
echo "4. Create Cloudflare R2 bucket: ${SLUG}-assets"
echo "5. Import repo to Vercel and add env vars"
echo "6. Create Telegram bot via @BotFather"
echo ""
echo "Then: cp .env.example .env.local and fill in the values"
