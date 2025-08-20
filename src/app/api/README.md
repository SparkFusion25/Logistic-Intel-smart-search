# API vs Direct Supabase

We now support a feature flag **USE_SUPABASE_DIRECT**. When set to `true`, the data flows through repository functions that call Supabase directly (server‑side). When `false`, calls fall back to Next.js API routes.

**Why:** faster stabilization, fewer shape mismatches, and RLS‑guarded access.

**Where to extend:**
- Add repo functions in `src/repositories/*`
- Map new routes in `makeRequest()` in `src/hooks/useapi.ts`