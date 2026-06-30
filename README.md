# ElementOS V233 Resurrected Folder Bundle

This bundle restores the attached V233 cinematic launch candidate as the live `src/App.jsx`.

## Why this fixes the stripped-back bundle

The previous structured bundle used clean placeholder pages and plain CSS.  
The attached V233 build uses the original Tailwind cinematic interface, advanced labs, discovery systems, reports, exports, mobile navigation, command palette, subscription UI, and safety guards.

## Deploy

```bash
npm install
npm run build
```

## Vercel

Framework preset: Vite  
Build command: `npm run build`  
Output directory: `dist`

## Supabase

Add these environment variables only if you want cloud features active:

```bash
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

The app will still render without them because `supabaseClient.js` safely returns `null` if the variables are missing.

## Important

This is a resurrection build. It prioritizes making the website look and feel like V233 again.
The folder structure is present for the next controlled refactor, but the original app remains intact in `src/App.jsx` to avoid breaking working features.
