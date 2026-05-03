# Shamba AI — Frontend

Kenya Agricultural Market Intelligence — Next.js 14 App

## Setup

```bash
npm install
cp .env.local.example .env.local
# Edit .env.local with your values
npm run dev
```

## Environment Variables

```
NEXT_PUBLIC_API_URL=https://shamba-price-api-production.up.railway.app
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

## Deploy to Vercel

```bash
npx vercel --prod
# Set env vars in Vercel dashboard
```

## Screens

| Route | Description |
|---|---|
| `/` | Home dashboard — stats, AI, movers, prices |
| `/markets` | Trend charts + full daily price table |
| `/commodities` | All commodities list |
| `/commodities/[name]` | Commodity deep-dive with trend chart |
| `/counties` | All 47 counties |
| `/counties/[name]` | County prices + markets |
| `/compare` | Multi-county price comparison |
| `/ai` | Full Shamba AI chat |
