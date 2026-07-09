# ElementOS V401 Magnificent Visual Upgrade

This bundle is built from the current V400 safe refactor bundle.

What changed:
- Full-site cinematic visual polish through `src/style.css`.
- More premium glass panels, cards, reports, inputs, buttons, labs, sidebar and mobile surfaces.
- Preserved the fixed horizontal button behaviour.
- Preserved Supabase fallback, Stripe files, reports, labs, and current app logic.
- Added a Vite chunk size warning limit only to reduce noisy build warnings.

What did not change:
- No route rewrites.
- No Supabase logic changes.
- No Stripe logic changes.
- No report/lab/calculation logic changes.
- No page removals.

Deploy:
1. Replace your repo files with this bundle.
2. Commit to GitHub.
3. Redeploy Vercel.
4. Use Clear Build Cache if old styling appears.
