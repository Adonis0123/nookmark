# Search uses a local index; bookmarks API is data only

`browser.bookmarks.search` cannot meet Chinese P0 recall (pinyin, initials, order-independent Han, domain channel). Search builds and queries a local index in `storage.local`; `browser.bookmarks` remains the source of truth for Bookmark/Folder records and change events. The AGENTS.md hook is a search facade over that index, not a thin wrapper around `bookmarks.search`.

A dual-path (API placeholder + local index) was rejected to avoid a half-dead code path that would never pass R4 acceptance.
