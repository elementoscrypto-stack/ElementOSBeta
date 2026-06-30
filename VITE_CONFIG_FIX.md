# Vercel Vite Config Fix

Your Vercel error means `vite.config.js` contains JSX or pasted React code.

Replace the entire file with:

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
});
```

Then make sure the old large ElementOS JSX file is located at:

```txt
src/App.jsx
```

Do not paste App.jsx content into vite.config.js.
