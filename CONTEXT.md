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
_Avoid_: tag, collection, album
