# Nookmark

A Chrome/Edge Manifest V3 extension that searches, saves, and opens the browser's own bookmarks. The first surface is a toolbar popup; a full manager comes later.

## Language

**Nookmark**:
A Chrome/Edge browser extension. It is a client on the browser bookmarks tree, not a website and not a separate bookmark service.
_Avoid_: web app, Firefox-first product, standalone bookmark service

**Bookmark**:
A URL node in the browser bookmarks tree. The browser bookmarks API is the source of truth; deleting it in Chrome deletes it in Nookmark.
_Avoid_: independent library record, imported copy, Nookmark-owned item

**Folder**:
A folder node in the browser bookmarks tree. A Bookmark has one parent Folder.
_Avoid_: tag, collection, album, category

**Popup**:
The toolbar popup. Nookmark's first surface. Visual spec: `docs/design.md`.
_Avoid_: side panel, bookmarks.html, new tab page

**Manager**:
A later full-page surface for browsing the bookmarks tree. Not specified by the popup visual spec. Out of the first Popup P0 slice.
_Avoid_: chrome://bookmarks replacement

**Folder filter**:
A chip on the Popup that narrows the view to Bookmarks under one top-level Folder (plus an "全部" chip). Canvas mock labels like「设计」「开发」stand in for the user's real Folder titles. This is a Folder constraint, not a tag system — there is no Tag entity (PRD D3).
_Avoid_: tag, category, collection, album, label chip

**OpenRecord**:
A local open-history row (`bookmarkId`, `openedAt`, `openCount`) in `chrome.storage.local`. Seeds 常用 tiles and 最近打开. Clearing it wipes local history only and does not delete Bookmarks (PRD D5 / R2). It is not bookmark source of truth.
_Avoid_: Chrome Sync record, bookmark SoT, `chrome.history`, `dateLastUsed` as the only store
