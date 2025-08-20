# Valesco — Logistics Intel + CRM

## Setup
1. Copy `.env.local.example` to `.env.local` and paste your keys. **Do not commit** secrets.
2. Install deps and run:

```bash
pnpm i # or npm i / yarn
pnpm dev # http://localhost:3000
```

## Env
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (required)
- `SUPABASE_SERVICE_ROLE` (server routes upsert)
- `OPENAI_API_KEY` (AI assist + summaries)
- `APOLLO_API_KEY` (contact enrichment)
- `PHANTOMBUSTER_API_KEY`, `PHANTOMBUSTER_AGENT_ID` (optional fallback)
- `NEWS_API_KEY` (optional headlines; otherwise links only)

## Deploy (Vercel)
- Import repo in Vercel → set all env vars above in **Project Settings → Environment Variables**
- Build command: `next build` (default)
- Framework Preset: Next.js
- After deploy: visit `/search` and `/crm`

## Pages
- `/` Landing
- `/dashboard` Hub
- `/search` Search Intelligence (uses Supabase RPC `search_unified`)
- `/crm` CRM table + drawer with AI enrichment

## Notes
- All enrichment calls avoid scraping (only APIs or search links).
- Mobile‑first components, premium look.