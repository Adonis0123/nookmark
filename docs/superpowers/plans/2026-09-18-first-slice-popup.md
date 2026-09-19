# First Slice Popup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the Nookmark toolbar Popup First slice: read the Chrome bookmarks tree, local P0 search, 常用 / 最近打开, save current page into Other Bookmarks, open in a foreground tab.

**Architecture:** `browser.bookmarks` is the only Bookmark/Folder store (ADR 0001). A service worker flattens the tree into a derived search index in `chrome.storage.local` (ADR 0004). The Popup never calls `browser.bookmarks.search`. Search, ranking, OpenRecord, and Folder filter are pure functions the Popup runs against that snapshot. The SW only builds/patches the snapshot and listens to bookmark events.

**Tech Stack:** WXT 0.21 + React 19 + TypeScript + Tailwind v4 + Vitest. New deps: `zod`, `pinyin-pro`, `vitest`. No Zustand. No full `tabs` permission (`activeTab` only). No Manager / gear / tags.

**Spec:** `docs/prd.md` §0.1 D1–D8 + R1–R6 + R4 P0 seven channels + Appendix C T-01..T-11, T-20..T-24. Visual: `docs/design.md` node `9:1`. Glossary: `CONTEXT.md`. ADR 0001, 0003, 0004, 0005, 0006, 0007.

## Global Constraints

- Named `function` exports; React `function` components; `cn()` from `lib/utils.ts`.
- Install-time permissions: `bookmarks`, `favicon`, `storage`, `activeTab` (ADR 0005). Never request full `tabs`.
- Product search must not call `browser.bookmarks.search`.
- Canvas mock is not a feature (PRD §11.5): no tags, notes, stars, recycle, cloud quota, 6-color category palette, hard-coded「128 / 已同步」, gear, Manager, 「查看全部」.
- Lockup title is **Nookmark**. Search placeholder is「搜索书签、网址或拼音」(D6).
- ＋ writes into Other Bookmarks via `folderType === "other"` (ADR 0006). Never hardcode id `"2"`.
- Open is `browser.tabs.create({ url, active: true })`. Block `javascript:` by default.
- Bookmark tiles/rows use site favicon; chips are text-only (ADR 0007).
- Popup is light-only (ADR 0003). Size 420×680.
- Zod at storage and message boundaries.
- Commit style: Conventional Commits + emoji (`🎉 feat:`, `🧪 test:`, `🐛 fix:`). One commit per task.
- Do not add `content.ts`, `sidepanel`, or `bookmarks.html`.

## Parallelization

```text
PR1 Foundation          (vitest, permissions, CSS tokens, domain types)
 ├── PR2 Search engine  (normalize, pinyin, P0 match+score)     [parallel]
 ├── PR3 Tree + OpenRecord + save/open helpers                  [parallel]
 └── PR5 Popup glass shell                                      [parallel]
      │
      PR4 Service worker snapshot (needs PR2 + PR3)
      │
      PR6 Popup wired (needs PR4 + PR5)
```

Max parallelism after PR1: three worktrees (PR2, PR3, PR5). PR6 is last.

---

## File map

| Path | Responsibility |
|---|---|
| `vitest.config.ts` | Vitest + WXT path aliases |
| `wxt.config.ts` | `bookmarks` / `favicon` / `storage` / `activeTab` |
| `assets/tailwind.css` | First slice tokens (`--color-accent` etc.) |
| `lib/bookmarks/types.ts` | `BookmarkNode`, `SearchIndexEntry`, `OpenRecord` |
| `lib/bookmarks/schemas.ts` | Zod for storage snapshots |
| `lib/bookmarks/tree.ts` | Flatten `getTree()`, ancestor ids, Folder filter chips, Other Bookmarks lookup |
| `lib/bookmarks/snapshot.ts` | Build `SearchIndexEntry[]` from nodes + OpenRecord |
| `lib/bookmarks/events.ts` | Incremental patch + import pause |
| `lib/search/normalize.ts` | NFKC, strip combining marks, lower, collapse whitespace |
| `lib/search/pinyin.ts` | `full` + `initials` strings via `pinyin-pro` (no tone) |
| `lib/search/weights.ts` | R4.4 weight table |
| `lib/search/match.ts` | P0 seven channels + score + `queryId` stale drop |
| `lib/open-records.ts` | Cap 200, bump on open, clear, seed from `dateLastUsed` |
| `lib/frequent.ts` | Top 8 by `openCount` + recency; fallback bookmarks-bar first 8 URL nodes |
| `lib/open-bookmark.ts` | Protocol guard + `tabs.create` + OpenRecord bump |
| `lib/save-current.ts` | Dedup by exact URL; create under Other Bookmarks |
| `lib/favicon.ts` | `chrome-extension://<id>/_favicon/?pageUrl=&size=32` |
| `lib/storage-items.ts` | `storage.defineItem` keys |
| `entrypoints/background.ts` | Rebuild/patch snapshot |
| `hooks/useStorageItem.ts` | watch + get |
| `hooks/useCurrentTab.ts` | active tab url/title |
| `hooks/useBookmarkSearch.ts` | local-index facade |
| `hooks/useIdleView.ts` | 常用 / 最近 / Folder chips |
| `entrypoints/popup/App.tsx` | Screen state machine |
| `entrypoints/popup/components/*.tsx` | Glass pieces |
| `tests/**` | Vitest |

Do **not** create `components/ui/*` unless a First slice screen actually needs a shadcn primitive. Prefer divs + tokens.

---

### Task 1: Foundation — Vitest, permissions, tokens

**Files:**
- Create: `vitest.config.ts`
- Modify: `package.json`, `wxt.config.ts`, `assets/tailwind.css`, `entrypoints/popup/index.html`
- Test: `tests/health.test.ts`

**Interfaces:**
- Consumes: existing WXT React app
- Produces: `pnpm test` runs Vitest; manifest has `bookmarks` / `favicon` / `storage`; CSS variables for `{colors.*}` in `docs/design.md`

- [ ] **Step 1: Add deps and test script**

```bash
pnpm add zod pinyin-pro
pnpm add -D vitest
```

`package.json` scripts:

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 2: Write failing health test**

```ts
// tests/health.test.ts
import { describe, expect, it } from 'vitest';

describe('tooling', () => {
  it('runs vitest', () => {
    expect(1 + 1).toBe(2);
  });
});
```

- [ ] **Step 3: Add `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';
import { resolve } from 'node:path';

export default defineConfig({
  resolve: {
    alias: { '@': resolve(__dirname, '.') },
  },
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
  },
});
```

Run: `pnpm test`
Expected: PASS

- [ ] **Step 4: Permissions**

```ts
// wxt.config.ts
manifest: {
  name: 'Nookmark',
  permissions: ['bookmarks', 'favicon', 'storage', 'activeTab'],
},
```

Do not add full `tabs`, `history`, or host permissions. `activeTab` is required so `useCurrentTab` can read the current page URL on toolbar click (D2).

- [ ] **Step 5: Tokens + popup shell size**

In `assets/tailwind.css` under `@theme`:

```css
@theme {
  --color-accent: #0866FF;
  --color-accent-press: #0653CC;
  --color-accent-soft: rgb(8 102 255 / 0.15);
  --color-on-accent: #ffffff;
  --color-success-dot: #34c759;
  --color-canvas-top: #f2f7fe;
  --color-canvas-mid: #e9f1fc;
  --color-canvas-bottom: #dce8f9;
  --color-glass-panel: rgb(255 255 255 / 0.62);
  --color-glass-panel-flat: rgb(255 255 255 / 0.60);
  --color-glass-element: rgb(255 255 255 / 0.55);
  --color-glass-edge-strong: rgb(255 255 255 / 0.85);
  --color-glass-edge-soft: rgb(255 255 255 / 0.75);
  --color-inset-6: rgb(14 42 88 / 0.06);
  --color-inset-8: rgb(14 42 88 / 0.08);
  --color-ink: #1d1d1f;
  --color-ink-muted: #6e6e73;
  --color-ink-tertiary: #86868b;
  --color-shadow-card: rgb(12 50 110 / 0.07);
  --color-shadow-accent: rgb(8 102 255 / 0.26);
  --color-atmosphere-glow: rgb(8 102 255 / 0.15);
  --color-atmosphere-highlight: rgb(255 255 255 / 0.75);
  --radius-shell: 18px;
  --radius-tile: 16px;
  --radius-row: 12px;
}
```

`index.html`: `lang="zh-CN"`. In `App.tsx` (temporary until PR5/PR6): `className="h-[680px] w-[420px]"`.

- [ ] **Step 6: Commit**

```bash
git add package.json pnpm-lock.yaml vitest.config.ts wxt.config.ts assets/tailwind.css tests/health.test.ts entrypoints/popup/index.html entrypoints/popup/App.tsx
git commit -m "🎉 feat: add vitest, bookmark permissions, and glass tokens"
```

---

### Task 2: Domain types and Zod snapshots

**Files:**
- Create: `lib/bookmarks/types.ts`, `lib/bookmarks/schemas.ts`, `lib/storage-items.ts`
- Test: `tests/bookmarks/schemas.test.ts`

**Interfaces:**
- Consumes: Task 1 (`zod`)
- Produces:

```ts
export type BookmarkNode = {
  id: string;
  parentId: string | null;
  title: string;
  url?: string;
  isFolder: boolean;
  dateAdded?: number;
  dateLastUsed?: number;
  folderType?: 'bookmarks-bar' | 'other' | 'mobile' | 'managed';
  unmodifiable?: 'managed';
  syncing?: boolean;
  path: string[];
  ancestorIds: string[];
};

export type SearchIndexEntry = {
  id: string;
  title: { raw: string; full: string; initials: string };
  domain: { raw: string; full: string; initials: string };
  path: { raw: string; full: string; initials: string };
  url: string;
  ancestorIds: string[];
  isFolder: boolean;
  unmodifiable?: 'managed';
  openCount: number;
  lastOpenedAt: number | null;
  dateAdded: number;
};

export type OpenRecord = {
  bookmarkId: string;
  openedAt: number;
  openCount: number;
};

export type BookmarkSnapshot = {
  version: 1;
  builtAt: number;
  nodes: BookmarkNode[];
  index: SearchIndexEntry[];
};

export type SnapshotState =
  | { status: 'loading'; snapshot: null }
  | { status: 'ok'; snapshot: BookmarkSnapshot }
  | { status: 'permission'; snapshot: null }
  | { status: 'error'; snapshot: null };
```

Storage keys (WXT):

```ts
import { storage } from '#imports';

export const snapshotStateItem = storage.defineItem<SnapshotState>(
  'local:snapshotState',
  { fallback: { status: 'loading', snapshot: null } },
);

export const openRecordsItem = storage.defineItem<OpenRecord[]>(
  'local:openRecords',
  { fallback: [] },
);
```

Never treat `snapshot == null` as the only signal: permission failures must set `status: 'permission'` so the Popup can show R6 instead of spinning on「正在索引书签…」.

`#imports` is not available in Vitest node tests — keep `storage-items.ts` thin and do not import it from pure functions.

- [ ] **Step 1: Failing test — Zod rejects a second bookmark store shape**

```ts
import { describe, expect, it } from 'vitest';
import { bookmarkSnapshotSchema } from '@/lib/bookmarks/schemas';

describe('bookmarkSnapshotSchema', () => {
  it('accepts version 1 snapshot with empty lists', () => {
    const parsed = bookmarkSnapshotSchema.parse({
      version: 1,
      builtAt: 0,
      nodes: [],
      index: [],
    });
    expect(parsed.version).toBe(1);
  });

  it('rejects missing version', () => {
    expect(() =>
      bookmarkSnapshotSchema.parse({ builtAt: 0, nodes: [], index: [] }),
    ).toThrow();
  });
});
```

- [ ] **Step 2: Run** `pnpm test tests/bookmarks/schemas.test.ts` — Expected: FAIL cannot find module

- [ ] **Step 3: Implement schemas + types** using the shapes above. `url` optional on folder nodes; index entries for URL nodes only.

- [ ] **Step 4: Run tests — PASS**

- [ ] **Step 5: Commit** `🎉 feat: add bookmark snapshot types and zod schemas`

---

### Task 3: Flatten tree, Folder filter chips, Other Bookmarks parent

**Files:**
- Create: `lib/bookmarks/tree.ts`
- Test: `tests/bookmarks/tree.test.ts`

**Interfaces:**
- Consumes: `BookmarkNode` from Task 2
- Produces:

```ts
export function flattenTree(
  tree: chrome.bookmarks.BookmarkTreeNode[],
): BookmarkNode[];

export function folderFilterChips(nodes: BookmarkNode[]): BookmarkNode[];
// immediate children of bookmarks-bar / other / mobile that are folders.
// exclude the special roots themselves.

export function idleChips(
  nodes: BookmarkNode[],
): { id: string | null; title: string }[];
// [] when folderFilterChips(nodes) is empty (hide the row).
// otherwise [{ id: null, title: '全部' }, ...user folders].
// D3 / ADR 0007: 全部 is required whenever any user Folder chip exists.

export function otherBookmarksFolder(nodes: BookmarkNode[]): BookmarkNode | null;
// folderType === 'other'. never id === '2'.

export function descendantsOf(nodes: BookmarkNode[], folderId: string): BookmarkNode[];
// nodes whose ancestorIds includes folderId, URL nodes only for lists.

export function bookmarksBarUrls(nodes: BookmarkNode[]): BookmarkNode[];
// URL nodes whose parent is folderType bookmarks-bar, tree order, max 8.
```

Chrome `getTree()` fixture (do not call the API in this test):

```ts
const tree = [
  {
    id: '0',
    title: '',
    children: [
      {
        id: '1',
        title: 'Bookmarks Bar',
        folderType: 'bookmarks-bar',
        children: [
          { id: '10', title: '设计', children: [
            { id: '101', title: 'Figma', url: 'https://figma.com' },
          ]},
          { id: '11', title: 'MDN', url: 'https://developer.mozilla.org' },
        ],
      },
      {
        id: '2',
        title: 'Other Bookmarks',
        folderType: 'other',
        children: [],
      },
    ],
  },
];
```

- [ ] **Step 1: Failing tests**

```ts
it('lists 设计 as a chip and not Bookmarks Bar', () => {
  const nodes = flattenTree(tree as never);
  const chips = folderFilterChips(nodes);
  expect(chips.map((n) => n.title)).toEqual(['设计']);
});

it('prepends 全部 only when user folders exist', () => {
  const nodes = flattenTree(tree as never);
  expect(idleChips(nodes).map((c) => c.title)).toEqual(['全部', '设计']);
  expect(idleChips([]).length).toBe(0);
});

it('finds Other Bookmarks by folderType, not id', () => {
  const nodes = flattenTree(tree as never);
  expect(otherBookmarksFolder(nodes)?.folderType).toBe('other');
});

it('descendant list of 设计 includes Figma and not MDN', () => {
  const nodes = flattenTree(tree as never);
  const rows = descendantsOf(nodes, '10');
  expect(rows.map((n) => n.id)).toEqual(['101']);
});
```

- [ ] **Step 2: Run — FAIL**

- [ ] **Step 3: Implement `flattenTree`**: walk children; `isFolder = url == null`; `path` = ancestor titles skipping the empty root; `ancestorIds` = ancestor folder ids skipping `'0'`. Copy `folderType` / `unmodifiable` / `syncing` / `dateLastUsed` when present.

- [ ] **Step 4: PASS + commit** `🎉 feat: flatten bookmark tree and resolve folder filter chips`

---

### Task 4: Search P0 seven channels

**Files:**
- Create: `lib/search/normalize.ts`, `lib/search/pinyin.ts`, `lib/search/weights.ts`, `lib/search/match.ts`
- Test: `tests/search/normalize.test.ts`, `tests/search/p0.test.ts`

**Interfaces:**
- Consumes: `SearchIndexEntry` from Task 2
- Produces:

```ts
export function normalizeQuery(input: string): string;
// 1. normalize('NFKC')
// 2. NFD + strip U+0300–U+036F
// 3. toLowerCase on latin
// 4. trim + collapse whitespace
// First slice: do NOT map 繁→简 (R4 P1).

export function haystackForTitle(raw: string): { raw: string; full: string; initials: string };
// pinyin-pro, toneType: 'none', non-Han kept as-is.
// Polyphonic: join extra readings with ASCII RS (\u001e) or store the longest
// plus common extra readings concatenated with '|' — match() treats '|' as
// alternative. Prefer: `full` is the no-tone concatenated string
// (shejilinggan); also generate `fullAlts: string[]` if pinyin-pro returns
// multiples. Keep the public SearchIndexEntry.title.full as the primary
// string; extra readings appended with '|'.

export function searchIndex(
  entries: SearchIndexEntry[],
  query: string,
  opts: { folderId: string | null; queryId: number },
): { queryId: number; hits: SearchHit[] };

export type SearchHit = {
  entry: SearchIndexEntry;
  score: number;
  match: 'raw' | 'pinyin-full' | 'pinyin-initials' | 'latin' | 'domain';
  rawHighlight?: { start: number; end: number };
  pinyinHint?: string; // e.g. 'sjlg → 设计灵感'
};
```

P0 match rules (linear scan; no inverted index until >2000 later):

1. Skip folder entries (`isFolder` or empty `url`).
2. If `folderId` set, require `ancestorIds.includes(folderId)`.
3. `q = normalizeQuery(query)`; empty → no hits (idle view is not search).
4. Channels, first hit wins for `match` type, score still sums:
   - **raw Han/latin substring** of `title.raw` normalized
   - **order-independent Han**: every non-space char of `q` appears in normalized title (T-03 `灵感设计`)
   - **pinyin full**: `title.full` includes `q` (no separators)
   - **pinyin initials**: `title.initials` includes `q`; exact initials equality gets ×1.2
   - **latin**: case-insensitive title
   - **domain**: `domain.raw` / `domain.full` includes `q`
   - NFKC already in normalize (T-10, T-11)
5. Score per R4.4 using `lib/search/weights.ts` constants only (no magic numbers in `match.ts`). Overlay live `OpenRecord[]` onto entries before scoring (`opts.records`) so Popup bumps are not waiting for SW rebuild.
6. Return hits sorted by score desc, then `openCount`, then `dateAdded`.
7. Caller discards results if `queryId` !== latest.
8. Extra tests (not just `it.each` hit/miss): T-07 `sjlg` ranks the exact-initials title above a coincidental pinyin hit; raw Han match outranks pinyin-only on the same query.

- [ ] **Step 1: Failing P0 table** — one `it.each` covering T-01..T-11 and T-20. Fixture: one entry title `设计灵感` url `https://example.com/x`, one `Figma` , three `https://dribbble.com/...`.

```ts
it.each([
  ['设计', '设计灵感'],
  ['灵感', '设计灵感'],
  ['灵感设计', '设计灵感'],
  ['sheji', '设计灵感'],
  ['shejilinggan', '设计灵感'],
  ['sj', '设计灵感'],
  ['sjlg', '设计灵感'],
  ['figma', 'Figma'],
  ['FIGMA', 'Figma'],
  ['Ｆｉｇｍａ', 'Figma'],
  ['figma ', 'Figma'],
])('P0 %s hits %s', (q, title) => {
  const hits = searchIndex(fixture, q, { folderId: null, queryId: 1 });
  expect(hits.hits.some((h) => h.entry.title.raw === title)).toBe(true);
});

it('domain dribbble hits all three', () => { /* T-09 */ });
it('does not throw on regex metacharacters', () => {
  expect(() => searchIndex(fixture, '.*+?^${}()[]|', { folderId: null, queryId: 1 })).not.toThrow();
});
```

Do **not** implement T-12..T-19 (P1).

- [ ] **Step 2: Run — FAIL**

- [ ] **Step 3: Implement normalize + pinyin + match.** Escape user query as literal (`q` is never a RegExp).

- [ ] **Step 4: PASS.** If `pinyin-pro` gzip size of the search module path looks over ~400KB in a later build, switch `pinyin-pro` import to a subset API documented in its README (`pinyin-pro/dist/index.mjs` default is OK for First slice; do not add a second pinyin library).

- [ ] **Step 5: Commit** `🎉 feat: add local P0 multi-channel bookmark search`

---

### Task 5: OpenRecord, 常用 ranking, seed

**Files:**
- Create: `lib/open-records.ts`, `lib/frequent.ts`
- Test: `tests/open-records.test.ts`, `tests/frequent.test.ts`

**Interfaces:**
- Consumes: `OpenRecord`, `BookmarkNode` from Task 2; `bookmarksBarUrls` from Task 3
- Produces:

```ts
export function bumpOpenRecord(
  records: OpenRecord[],
  bookmarkId: string,
  now: number,
): OpenRecord[];
// upsert, increment openCount, set openedAt, sort by openedAt desc, cap 200.

export function clearOpenRecords(): OpenRecord[]; // []

export function recentIds(records: OpenRecord[], limit = 3): string[];

export function seedFromDateLastUsed(
  nodes: BookmarkNode[],
  now: number,
): OpenRecord[];
// URL nodes with dateLastUsed, mapped to { bookmarkId, openedAt: dateLastUsed, openCount: 1 }.
// If Chrome has no dateLastUsed, return []. Idle view then uses dateAdded only for 最近? Spec: degrade to dateAdded and do not error. Produce records with openedAt = dateAdded and openCount = 0 so UI can still sort, and a flag is not needed — UI shows relative time from openedAt.

export function frequentIds(
  records: OpenRecord[],
  nodes: BookmarkNode[],
  now: number,
): string[];
// Score: openCount * recency decay over 30 days. Top 8 that still exist as URL nodes.
// If records empty: bookmarksBarUrls(nodes).map(id), max 8.
// If no URL nodes at all: [].
```

- [ ] **Step 1: Failing tests** — bump moves A to front; cap 200; clear returns []; empty records + bar fallback returns bar URLs; no URL nodes → [].

- [ ] **Step 2–4: TDD implement**

- [ ] **Step 5: Commit** `🎉 feat: add OpenRecord bump, seed, and frequent ranking`

---

### Task 6: Favicon, protocol guard, save current, open

**Files:**
- Create: `lib/favicon.ts`, `lib/open-bookmark.ts`, `lib/save-current.ts`
- Test: `tests/favicon.test.ts`, `tests/open-bookmark.test.ts`, `tests/save-current.test.ts`

**Interfaces:**
- Consumes: `otherBookmarksFolder` from Task 3
- Produces:

```ts
export function faviconUrl(pageUrl: string, extensionId: string, size = 32): string;
// chrome-extension://${extensionId}/_favicon/?pageUrl=${encodeURIComponent(pageUrl)}&size=${size}

export function isBlockedUrl(url: string): boolean;
// true for javascript: (case-insensitive). First slice also block data: and file:.
// http(s) allowed. chrome:// has no favicon (C7) but may still open.

export type OpenBookmarkDeps = {
  createTab: (opts: { url: string; active: true }) => Promise<unknown>;
};

export async function openBookmark(
  url: string,
  deps: OpenBookmarkDeps,
): Promise<{ ok: true } | { ok: false; reason: 'blocked' }>;

export type SaveCurrentInput = {
  url: string;
  title: string;
  nodes: BookmarkNode[];
  create: (opts: { parentId: string; title: string; url: string }) => Promise<{ id: string }>;
};

export async function saveCurrentPage(input: SaveCurrentInput): Promise<
  | { ok: true; id: string }
  | { ok: false; reason: 'already-saved' | 'no-other-folder' | 'invalid-url' | 'blocked' }
>;
// already-saved: some URL node has exact same url string.
```

- [ ] **Step 1: Failing tests**

```ts
it('blocks javascript: URLs', async () => {
  const createTab = async () => { throw new Error('should not create'); };
  const result = await openBookmark('javascript:alert(1)', { createTab });
  expect(result).toEqual({ ok: false, reason: 'blocked' });
});

it('refuses duplicate URL', async () => {
  const nodes: BookmarkNode[] = [{
    id: 'x', parentId: '2', title: 'A', url: 'https://a.com', isFolder: false,
    path: [], ancestorIds: ['2'],
  }];
  const result = await saveCurrentPage({
    url: 'https://a.com', title: 'A', nodes,
    create: async () => ({ id: 'nope' }),
  });
  expect(result.reason).toBe('already-saved');
});
```

- [ ] **Step 2–4: TDD implement**

- [ ] **Step 5: Commit** `🎉 feat: add favicon URL, blocked schemes, save into Other Bookmarks`

---

### Task 7: Service worker snapshot

**Files:**
- Modify: `entrypoints/background.ts`
- Create: `lib/bookmarks/snapshot.ts`, `lib/bookmarks/events.ts`
- Test: `tests/bookmarks/snapshot.test.ts`, `tests/bookmarks/events.test.ts`

**Interfaces:**
- Consumes: Tasks 2–5 (`flattenTree`, `haystackForTitle`, OpenRecord for `openCount`)
- Produces: SW keeps `snapshotItem` current.

```ts
export function buildSnapshot(
  tree: chrome.bookmarks.BookmarkTreeNode[],
  records: OpenRecord[],
  builtAt: number,
): BookmarkSnapshot;
// flatten; for each URL node, SearchIndexEntry with pinyin haystacks;
// openCount/lastOpenedAt from records.

export function applyCreated(snapshot: BookmarkSnapshot, node: chrome.bookmarks.BookmarkTreeNode, records: OpenRecord[]): BookmarkSnapshot;
export function applyChanged(snapshot: BookmarkSnapshot, id: string, change: { title?: string; url?: string }, records: OpenRecord[]): BookmarkSnapshot;
export function applyMoved(snapshot: BookmarkSnapshot, id: string, move: { parentId: string; index?: number }): BookmarkSnapshot;
// Chrome only notifies the moved node. If it is a folder, cascade-update
// ancestorIds + path for every descendant (same rule as applyRemoved),
// or rebuild() the whole snapshot. A URL-only move patches that node.
export function applyRemoved(snapshot: BookmarkSnapshot, id: string): BookmarkSnapshot;
// Folder remove: drop the folder and every node whose ancestorIds includes id (Chrome only fires the folder).
```

SW `main()` (sync entry, kick async work without making `main` async):

1. `rebuild()`:
   - `snapshotStateItem.setValue({ status: 'loading', snapshot: null })` only on first run when no ok snapshot exists.
   - `getTree()`. On permission / read failure → `{ status: 'permission' | 'error', snapshot: null }` and return.
   - `records = openRecordsItem.getValue()`. **If `records.length === 0`**, `records = seedFromDateLastUsed(flattenTree(tree), now)` and `openRecordsItem.setValue(records)` when the seed is non-empty. Never overwrite non-empty local records with seed.
   - `buildSnapshot` + `snapshotStateItem.setValue({ status: 'ok', snapshot })`.
2. Listen `onCreated/onChanged/onMoved/onRemoved/onChildrenReordered` → patch or rebuild. Folder `onMoved` must cascade or rebuild.
3. `onImportBegan` → set `importing=true` and ignore patch events; `onImportEnded` → `rebuild()`.
4. On install/startup: `rebuild()`.

Do not search in the SW. Do not write Bookmark records except through Chrome APIs in the Popup save path.

- [ ] **Step 1: Failing tests on `applyRemoved` cascade and `buildSnapshot` pinyin fields**

- [ ] **Step 2–4: TDD the pure functions; then wire `background.ts`**

```ts
export default defineBackground(() => {
  let importing = false;
  // attach listeners; call rebuild()
});
```

- [ ] **Step 5: `pnpm compile` must pass**

- [ ] **Step 6: Commit** `🎉 feat: keep local bookmark snapshot in the service worker`

---

### Task 8: Popup glass shell (no data)

**Files:**
- Modify: `entrypoints/popup/App.tsx`, `entrypoints/popup/main.tsx`
- Create: `entrypoints/popup/components/Shell.tsx`, `Atmosphere.tsx`, `BrandLockup.tsx`, `SearchBar.tsx`, `FilterChips.tsx`, `FrequentGrid.tsx`, `RecentList.tsx`, `BookmarkTile.tsx`, `RecentRow.tsx`, `Toast.tsx`, `FullPanelMessage.tsx`
- Test: none required beyond `pnpm compile` (visual). Do not invent mock tags.

**Interfaces:**
- Consumes: Task 1 tokens
- Produces: 420×680 light glass layout matching `docs/design.md` **structure**, with:
  - Title **Nookmark**
  - Subtitle slot: `{count} 个书签` plus ` · 已同步` only when every URL node has `syncing === true`; omit sync clause when unknown/mixed
  - Search placeholder「搜索书签、网址或拼音」+ ⌘K hint
  - ＋ button (no gear)
  - No footer「打开管理页」, no「查看全部」
  - Chips / grids / rows accept props; empty arrays render nothing (D4 hide)
  - `RecentList` takes `onClear?: () => void` and shows「清空记录」when there is at least one recent row (D5). Hidden when `onClear` is omitted or the list is empty.
  - Favicon `<img>` with `onError` swapping to the inset fallback glyph (C7). Do not color tiles from the canvas category palette.

Accent budget: Logo fill, ＋, selected chip. Hidden Manager does not count. Search highlight later may use accent as the 4th. Keep a 5th unused.

- [ ] **Step 1: Implement presentational components with typed props** (`title`, `domain`, `faviconSrc`, `relativeTime`, `selectedChipId`, `onSearchChange`, `onSubmitSearch`, `ime` composition handlers as no-ops until Task 10).

- [ ] **Step 2: `pnpm compile`**

- [ ] **Step 3: Commit** `🎉 feat: add Nookmark popup glass shell`

---

### Task 9: Hooks + idle view

**Files:**
- Create: `hooks/useStorageItem.ts`, `hooks/useCurrentTab.ts`, `hooks/useIdleView.ts`, `hooks/useBookmarkSearch.ts`
- Modify: `entrypoints/popup/App.tsx`
- Test: `tests/hooks/idle-view.test.ts` (pure helper extracted from the hook)

**Interfaces:**
- Consumes: snapshot + open records + Tasks 3–5
- Produces:

```ts
export function selectIdleView(
  state: SnapshotState,
  records: OpenRecord[],
  folderId: string | null,
  now: number,
): {
  status: 'loading' | 'empty' | 'ready' | 'permission' | 'error';
  bookmarkCount: number;
  chips: { id: string | null; title: string }[];
  frequent: { id: string; title: string; url: string }[];
  recent: { id: string; title: string; url: string; openedAt: number }[];
  folderRows: { id: string; title: string; url: string }[] | null;
  syncingAll: boolean | null;
};
```

Rules (ADR 0007):

- `state.status === 'loading'` → `loading` (copy「正在索引书签…」).
- `state.status === 'permission'` → R6 full panel. Never spin on loading.
- `state.status === 'error'` →「无法读取书签」full panel.
- `state.status === 'ok'` and no URL nodes → `empty` (copy「还没有书签。点右上角 ＋ 收藏当前页面。」). Hide frequent + recent.
- `folderId == null`: frequent + recent from Task 5; `folderRows = null`. `chips = idleChips(nodes)` (includes 全部 when any user Folder exists; empty array hides the row).
- `folderId != null`: `folderRows = descendantsOf`; hide frequent + recent.
- App idle path must pass `onClear` into `RecentList` → `openRecordsItem.setValue([])`. Clearing does not delete Bookmarks.

`useBookmarkSearch(query, folderId)`: debounce 100ms; ignore updates while `composition`; increment `queryId`; call `searchIndex`; drop stale `queryId`.

`useCurrentTab`: `browser.tabs.query({ active: true, currentWindow: true })`.

- [ ] **Step 1: Failing tests for `selectIdleView`**

- [ ] **Step 2–4: TDD helper, then hooks wrapping `storage.defineItem.watch`**

- [ ] **Step 5: Wire App idle path**

- [ ] **Step 6: Commit** `🎉 feat: wire popup idle view to bookmark snapshot`

---

### Task 10: Search UI, IME, no-results, pinyin hint

**Files:**
- Modify: `SearchBar.tsx`, `App.tsx`, `RecentRow.tsx`
- Test: `tests/search/stale-query.test.ts` (T-22)

**Interfaces:**
- Consumes: `searchIndex`, `useBookmarkSearch`
- Produces: non-empty query replaces idle content with hit rows. Chip still ANDs. IME: `onCompositionStart` sets composing; `onCompositionEnd` clears and searches. Highlight raw range with accent. If `match` is `pinyin-full` or `pinyin-initials`, show `{query} → {title.raw}` on the right (`typography.meta` / `ink-muted`). Zero hits:「没有匹配的书签」+ optional「在网上搜索『…』」opening `https://www.google.com/search?q=` + pinyin tip「可输入拼音或首字母，如 sjlg」. Enter opens selected hit. Arrow keys move selection. ⌘K / Ctrl+K focuses search. Esc clears query.

T-22: simulate queryId 1 resolving after queryId 2 — UI must keep queryId 2 hits. Implement as a unit test on the search facade reducer, not a flake-prone timer test:

```ts
export function acceptSearchResult<T extends { queryId: number }>(
  latestQueryId: number,
  result: T,
): T | null {
  return result.queryId === latestQueryId ? result : null;
}
```

- [ ] **Step 1–4: TDD `acceptSearchResult` + IME flag in a tiny `createSearchSession()` helper**

- [ ] **Step 5: Commit** `🎉 feat: add popup search with IME-safe local index`

---

### Task 11: Open and save current page

**Files:**
- Modify: `App.tsx`, tiles, rows, ＋ button, `Toast.tsx`
- Test: reuse Task 6 functions; add `tests/save-current-ui-copy.test.ts` mapping reasons to copy

Copy:

| Result | Copy |
|---|---|
| save ok | 已收藏当前页面 |
| already-saved | 当前页面已在书签中 |
| blocked / invalid-url | 该链接类型已被安全策略阻止 |
| no-other-folder | 无法找到「其他书签」文件夹 |
| open blocked | 该链接类型已被安全策略阻止 |

Open order: call `openBookmark` first. **Only if `{ ok: true }`**, then `bumpOpenRecord` + `openRecordsItem.setValue`. Never bump on `javascript:` / blocked URLs. Do not use `dateLastUsed` as the write path.

Search scoring must overlay live OpenRecord onto index entries at query time (`openCount` / `lastOpenedAt`), because the SW snapshot may lag after a Popup bump.

After successful save: Chrome `onCreated` updates the snapshot via SW; Popup watches storage.

- [ ] **Step 1: Failing copy-map test**

- [ ] **Step 2–4: Implement handlers**

- [ ] **Step 5: Commit** `🎉 feat: save current page and open bookmarks from the popup`

---

### Task 12: Permission, loading, managed lock

**Files:**
- Modify: `App.tsx`, `FullPanelMessage.tsx`, `RecentRow.tsx`
- Test: `tests/permissions-copy.test.ts`

**Interfaces:**
- If `browser.bookmarks.getTree()` / snapshot rebuild throws, or `runtime.lastError` indicates permission: full-panel「需要书签访问权限」+ body that this is not data loss + link action `chrome.tabs.create({ url: 'chrome://extensions/?id=' + id })` (still no `tabs` permission — `tabs.create` with url is allowed).
- Managed nodes (`unmodifiable === 'managed'`): show lock cue; no delete/edit (First slice has no edit anyway). Still openable if URL is not blocked.
- Loading: chrome (lockup, search, ＋) stays; content caption「正在索引书签…」.

- [ ] **Step 1–4: TDD copy helper + wire**

- [ ] **Step 5: Commit** `🎉 feat: add bookmark permission and loading states`

- [ ] **Step 6: `pnpm test && pnpm compile`**

---

## PR Plan

### PR 1: Foundation

- **Description:** Vitest, `zod` / `pinyin-pro`, manifest permissions (`bookmarks` / `favicon` / `storage` / `activeTab`), glass CSS tokens including atmosphere, domain types + `SnapshotState` + Zod schemas, storage item keys.
- **Files/components affected:** `package.json`, `vitest.config.ts`, `wxt.config.ts`, `assets/tailwind.css`, `lib/bookmarks/types.ts`, `lib/bookmarks/schemas.ts`, `lib/storage-items.ts`, `tests/**`
- **Dependencies:** None

### PR 2: Search engine

- **Description:** `normalizeQuery`, pinyin haystacks, P0 seven-channel `searchIndex` + weights. Appendix C T-01..T-11, T-20, T-22 helper. No UI.
- **Files/components affected:** `lib/search/**`, `tests/search/**`
- **Dependencies:** PR 1

### PR 3: Tree, OpenRecord, save/open helpers

- **Description:** Flatten tree, Folder filter chips, Other Bookmarks lookup, OpenRecord bump/seed/frequent, favicon URL, protocol guard, save-current pure function.
- **Files/components affected:** `lib/bookmarks/tree.ts`, `lib/open-records.ts`, `lib/frequent.ts`, `lib/favicon.ts`, `lib/open-bookmark.ts`, `lib/save-current.ts`, `tests/**`
- **Dependencies:** PR 1

### PR 4: Service worker snapshot

- **Description:** Build/patch `BookmarkSnapshot` in the SW; import pause; persist via `storage.defineItem`.
- **Files/components affected:** `entrypoints/background.ts`, `lib/bookmarks/snapshot.ts`, `lib/bookmarks/events.ts`
- **Dependencies:** PR 2, PR 3

### PR 5: Popup glass shell

- **Description:** 420×680 light glass presentational Popup. Nookmark lockup. Hide gear / Manager / 查看全部. No mock tags. No live data.
- **Files/components affected:** `entrypoints/popup/**`
- **Dependencies:** PR 1

### PR 6: Popup wired

- **Description:** Hooks + idle view + search IME + save/open + empty/permission/loading. Favicon tiles. Folder filter behavior (ADR 0007).
- **Files/components affected:** `hooks/**`, `entrypoints/popup/App.tsx`, `entrypoints/popup/components/**`
- **Dependencies:** PR 4, PR 5

---

## Spec coverage

| Spec | Task / PR |
|---|---|
| D1 / ADR 0004 local index | 4, 7 |
| D2 / ADR 0006 save current → Other Bookmarks | 6, 11 |
| D3 / ADR 0007 Folder filter | 3, 9, 10 |
| D4 常用 8 auto | 5, 9 |
| D5 最近 3 + clear local | 5, 9, 11 |
| D6 placeholder | 8, 10 |
| D7 hide gear/Manager/查看全部 | 8 |
| D8 no R4 P1, no Manager | 4 (omits T-12..T-19), 8 |
| R1 tree + events + import + empty | 3, 7, 12 |
| R2 OpenRecord | 5, 11 |
| R3 frequent | 5, 9 |
| R4 P0 seven + IME + hint + no-results | 4, 10 |
| R5 open foreground + blocked javascript | 6, 11 |
| R6 permission panel + managed lock | 12 |
| C7 favicon | 6, 9 |
| ADR 0003 light glass 9:1 | 1, 8 |
| ADR 0005 permissions | 1 |
| T-24 no network in search | 4 (pure, no fetch) |

Out of plan on purpose: R4 P1, R7–R10, Manager, add-bookmark dialog, Q1 spike (OpenRecord still seeds from `dateLastUsed` when present).

## Verification (after PR6)

```bash
pnpm test
pnpm compile
pnpm build
```

Then `pnpm dev`: load unpacked, open Popup.

1. Empty-ish profile: empty copy, ＋ works, lands in Other Bookmarks.
2. Type `sjlg` against a「设计灵感」bookmark: hit + pinyin hint; composition period does not search.
3. Chip a user Folder: list descendants; search ANDs.
4. Open a row: new foreground tab; it becomes 最近[0].
5. 清空: recent clears, bookmarks remain.
6. No gear, no 打开管理页, no 查看全部, no 标签.
7. DevTools Network on the extension page during search: no extra requests (favicon fetch to the extension `_favicon` endpoint is allowed; no Google/pinyin CDN).
