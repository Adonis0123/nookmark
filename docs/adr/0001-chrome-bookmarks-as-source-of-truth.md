# Chrome bookmarks API is the source of truth

Nookmark is a client on the browser bookmarks tree, not a separate library. A Bookmark created or deleted in Chrome is the same record Nookmark shows. An own-store with one-shot import was rejected so Nookmark extends Chrome bookmarks instead of replacing them.

Extra metadata such as tags or notes is not decided. The first UI is a toolbar popup; a full manager comes later.
