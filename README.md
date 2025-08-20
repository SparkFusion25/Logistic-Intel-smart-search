# Valesco — Logistics Intel + CRM + Widgets

## Run locally
1) Copy `.env.local.example` to `.env.local` and paste your keys.
2) Install & run:
```bash
pnpm i
pnpm dev # http://localhost:3000
```

## New pages
- `/widgets` — hub
- `/widgets/tariff` — Tariff Calculator (estimates, API fallback)
- `/widgets/quote` — Quote Generator (HTML preview/export)
- `/api/health` — deploy health check

## Tariff Calculator
- Uses Avalara/Flexport if keys exist; otherwise chapter-based estimator.
- *Not a binding ruling.*

## Quote Generator
- Client fills form → server returns styled HTML → opens in new tab for print/PDF.

## Deploy (Vercel)
- Project → Settings → Environment Variables → set all from `.env.local.example`.
- Deploy branch: `main`.
- After deploy: check `/api/health`, then `/search`, `/crm`, `/widgets`.