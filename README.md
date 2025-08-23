# Logistic Intel Smart Search

AI-powered logistics intelligence platform with CRM, search, and automation tools.

## Architecture

- **React Router pages**: Located in `src/rr/pages/` - render client-side only via BrowserRouter
- **Next.js pages**: Located in `src/pages/` - SSR/ISR capable marketing/API surfaces
- **API routes**: Located in `src/pages/api/` - server-side endpoints

## Features

- 🔍 Smart search with Air/Ocean filtering and confidence scoring
- 👥 CRM with Apollo and PhantomBuster enrichment
- 📧 Email tracking and campaign management
- 📊 Quote generator with PDF export
- 🧮 Tariff calculator with HS code lookup
- 🔐 Plan gating (Free/Pro/Enterprise)

## Development

```bash
npm install
npm run dev
```

## Deployment

```bash
npm run build
npm start
```

Built with Next.js 14, React 18, TypeScript, and Tailwind CSS.# Force deployment Sat Aug 23 04:29:02 PM UTC 2025
