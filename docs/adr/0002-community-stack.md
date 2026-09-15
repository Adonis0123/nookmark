# Tailwind, shadcn, and WXT storage

WXT React projects on GitHub use Tailwind CSS far more than the official UnoCSS module (about 1524 vs 31 `package.json` hits with `@wxt-dev/module-react`). Community starters also standardize on shadcn/ui + lucide-react.

Bookmark records stay in `browser.bookmarks`. Extension-only prefs use WXT `storage.defineItem`. Popup code reads both through small React hooks, not Zustand. Zustand showed up in WXT apps, but it would duplicate the browser tree we already chose as source of truth.
