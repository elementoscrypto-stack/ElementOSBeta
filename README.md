# ElementOS Beta — V400 Safe Refactor Bundle

This bundle is built from the uploaded current project files.

## What V400 does

- Preserves the existing `src/App.jsx` application logic, pages, labs, reports, Supabase and Stripe flow.
- Keeps the Vite root structure: `index.html` loads `/src/main.jsx`.
- Keeps Tailwind/PostCSS enabled.
- Uses Node `24.x` for future Vercel compatibility.
- Adds a full-site cinematic visual system in `src/style.css`.
- Adds npm install safeguards for Vercel.

## Deploy

1. Replace your repository files with this bundle.
2. Commit and push to GitHub.
3. In Vercel, redeploy.
4. If styling looks stale, use **Redeploy → Clear Build Cache**.

## Vercel Settings

- Framework: Vite
- Install Command: `npm install --no-audit --no-fund --prefer-online`
- Build Command: `npm run build`
- Output Directory: `dist`
- Node: `24.x`

## Environment Variables

Recommended if using Supabase/Stripe:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY`
- `VITE_STRIPE_PRICE_ID`

The uploaded Supabase client has a safe fallback when Supabase env vars are missing, so the site should not blank just because Supabase is not configured.


## V401 Magnificent Visual Upgrade

This bundle keeps the working ElementOS functionality intact and adds a safe full-site cinematic visual layer in `src/style.css`.
