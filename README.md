# Nookmark

Chrome/Edge MV3 toolbar popup that searches, saves, and opens the browser's own bookmarks. The Chrome bookmarks tree is the source of truth — Nookmark is a client, not a separate library.

## Docs

| Doc | What |
|---|---|
| [`CONTEXT.md`](CONTEXT.md) | Domain terms (Bookmark, Folder, Folder filter, OpenRecord) |
| [`docs/prd.md`](docs/prd.md) | Product spec — P0 decisions D1–D8 |
| [`docs/design.md`](docs/design.md) | Popup visual spec + P0 states |
| [`docs/adr/`](docs/adr/) | Decisions: [0001](docs/adr/0001-chrome-bookmarks-as-source-of-truth.md) bookmarks SoT · [0004](docs/adr/0004-local-search-index.md) local search · [0005](docs/adr/0005-permissions.md) permissions |
| [`AGENTS.md`](AGENTS.md) | Stack, data, hooks for implementers |

## Commands

```sh
pnpm install
pnpm dev       # Chrome with the extension loaded
pnpm compile   # tsc --noEmit
pnpm build     # production Chrome MV3 into .output/
```
