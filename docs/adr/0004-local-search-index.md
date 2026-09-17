# Search uses a local multi-channel index

`browser.bookmarks.search` cannot meet Chinese P0 recall (PRD R4 / §0.1 D1): Han substring, order-independent Han, pinyin, initials, Latin, domain, and width/whitespace normalization. Product search therefore builds and queries a **local multi-channel index** in `chrome.storage.local`. `browser.bookmarks` remains the source of truth for Bookmark and Folder records and the change events that keep the index current (`onCreated` / `onChanged` / `onMoved` / `onRemoved` / `onChildrenReordered` / import begin–end). It is the index data source, not the search engine.

The AGENTS.md hook (`useBookmarkSearch`, or a clearer name) is a facade over that index. Calling `bookmarks.search` for product search is rejected so we do not keep a half-dead path that can never pass R4 acceptance.

A dual-path (API placeholder plus local index) was also rejected.
