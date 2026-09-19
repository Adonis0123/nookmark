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
The toolbar popup. Nookmark's first surface. Visual spec: `docs/design.md` (canvas node `9:1`, not `4:1`).
_Avoid_: side panel, bookmarks.html, new tab page

**First slice**:
The first shippable Popup: R1–R6 plus R4 P0 seven search channels (PRD D8). Confirmed 2026-09-18 as 初版. Lockup title is Nookmark. Gear, Manager entry, and 「查看全部」 are hidden. Open is a foreground new tab. Bookmark tiles/rows use favicons. Canvas mock is not a feature. Not Manager, not the add-bookmark dialog, not tags/notes/stars, not R4 P1.
_Avoid_: canvas-complete v1, Manager in v1, Azure frame `4:1` as the product, implementing mock data as behavior

**Other Bookmarks**:
The browser's unfiled Folder (`folderType === "other"`). First slice ＋ creates a Bookmark here (ADR 0006). Display the folder's API title; do not hardcode「其他书签」or id `"2"`.
_Avoid_: Bookmarks Bar as default save target, Nookmark-owned inbox, Unsorted

**Manager**:
A later full-page surface for browsing the bookmarks tree. Not specified by the popup visual spec. Out of the First slice.
_Avoid_: chrome://bookmarks replacement

**Folder filter**:
A chip row that constrains the Popup to Bookmarks under one user Folder (ADR 0007). Chips are `全部` plus the immediate child Folders of Bookmarks Bar, Other Bookmarks, and Mobile Bookmarks, using API titles. Empty query + a Folder lists descendant Bookmarks as rows; a query ANDs with the chip. Hide the row when there are no user Folders. Not a tag system — there is no Tag entity (PRD D3).
_Avoid_: tag, category, collection, album, label chip, 书签栏/其他书签 as chips

**OpenRecord**:
A local open-history row (`bookmarkId`, `openedAt`, `openCount`) in `chrome.storage.local`. Seeds 常用 tiles and 最近打开. Clearing it wipes local history only and does not delete Bookmarks (PRD D5 / R2). It is not bookmark source of truth.
_Avoid_: Chrome Sync record, bookmark SoT, `chrome.history`, `dateLastUsed` as the only store
