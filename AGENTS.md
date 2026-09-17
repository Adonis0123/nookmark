# Nookmark

Chrome/Edge MV3 extension. Client on the browser bookmarks tree. First surface is the toolbar popup.

Read `CONTEXT.md` for domain terms. Product spec: `docs/prd.md` (§0.1 D1–D8). Popup visual spec: `docs/design.md`, with reference screens in `docs/screens/`. Decisions live in `docs/adr/` — including ADR 0001 (bookmarks SoT), ADR 0004 (local search index), and ADR 0005 (permissions).

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

- Bookmark / Folder records: `browser.bookmarks` is the source of truth (ADR 0001). Do not copy the tree into IndexedDB or a parallel library.
- Search index: derived from `browser.bookmarks` + change events; stored in `chrome.storage.local` (ADR 0004 / PRD R4). Never treat the index as a second bookmark store.
- OpenRecord (local open history for 常用 / 最近打开): `storage.local` via `storage.defineItem` (PRD D5 / R2). Not bookmark SoT; clearing it does not delete Bookmarks.
- Extension prefs (theme, last query): `storage.defineItem` from `#imports`. Theme is reserved; the popup is light-only (ADR 0003).

## Hooks

Put React hooks in `hooks/`. One hook wraps one concern:

- `useCurrentTab` → `browser.tabs` (current tab for save-current-page). `tabs.create` does not need the full `tabs` permission (ADR 0005).
- `useBookmarkSearch` (or a clearer name) → **local-index facade** (ADR 0004). Do **not** call `browser.bookmarks.search` for product search.
- `useStorageItem` → `storage.defineItem(...).watch` (prefs, OpenRecord)

No extra hook library. TanStack Query is allowed later if a screen has cache/invalidation pain; do not add it up front.

## Entrypoints

Keep `entrypoints/popup/`. Do not add `content.ts`, `sidepanel`, or `bookmarks.html` (the last one overrides `chrome://bookmarks`).

## Style

- Named exports. `function` components.
- `cn()` from `lib/utils.ts` for class names.
- Zod at system boundaries when we start parsing storage or messages.
