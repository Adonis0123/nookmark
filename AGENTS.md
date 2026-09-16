# Nookmark

Chrome/Edge MV3 extension. Client on the browser bookmarks tree. First surface is the toolbar popup.

Read `CONTEXT.md` for domain terms. Decisions live in `docs/adr/`. Product spec: `docs/prd.md`. Popup visual spec: `docs/design.md`, with reference screens in `docs/screens/`.

## Commands

- `pnpm dev` — Chrome with the extension loaded
- `pnpm compile` — `tsc --noEmit`
- `pnpm build` — production Chrome MV3 into `.output/`

## Stack

- WXT + React 19 + TypeScript + pnpm
- UI: Tailwind CSS v4 (`@tailwindcss/vite`) + shadcn/ui (New York) + lucide-react
- Add a shadcn primitive only when a screen needs it. Do not vendor unused components.
- WXT module already in use: `@wxt-dev/module-react`
- Skip `@wxt-dev/unocss` (Tailwind is the WXT React default in the wild)
- Skip Zustand. Bookmark records are not client store state.

## Data

- Bookmark / Folder: `browser.bookmarks` is the source of truth (ADR 0001)
- Extension prefs (theme, last query): `storage.defineItem` from `#imports`. Theme is reserved; the popup is light-only (ADR 0003).
- Do not copy the bookmarks tree into IndexedDB or a parallel library

## Hooks

Put React hooks in `hooks/`. One hook wraps one browser API:

- `useCurrentTab` → `browser.tabs`
- `useBookmarkSearch` → `browser.bookmarks.search`
- `useStorageItem` → `storage.defineItem(...).watch`

No extra hook library. TanStack Query is allowed later if a screen has cache/invalidation pain; do not add it up front.

## Entrypoints

Keep `entrypoints/popup/`. Do not add `content.ts`, `sidepanel`, or `bookmarks.html` (the last one overrides `chrome://bookmarks`).

## Style

- Named exports. `function` components.
- `cn()` from `lib/utils.ts` for class names.
- Zod at system boundaries when we start parsing storage or messages.
