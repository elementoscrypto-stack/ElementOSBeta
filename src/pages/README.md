# Pages

This restored bundle intentionally keeps the original V233 cinematic application in `src/App.jsx` so the deployed site looks like it used to.

Next safe refactor step:
1. Move one page at a time from `App.jsx` into this folder.
2. Export it from the page file.
3. Import it back into `App.jsx`.
4. Deploy after each page move.

Do not split every page at once; V233 is a large working launch build.
