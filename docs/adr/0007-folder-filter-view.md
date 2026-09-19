# Folder filter constrains the Popup view

Folder filter chips are the user's immediate child Folders of Bookmarks Bar, Other Bookmarks, and Mobile Bookmarks. The special root folders are not chips; they are containers. A chip plus an empty query replaces 常用 and 最近 with descendant Bookmark rows. A non-empty query intersects search hits with that Folder (`全部` = the whole tree). If the user has no such Folders, the chip row is hidden.

Treating chips as tags, using them only to filter 常用/最近, or listing 书签栏/其他书签 themselves as chips, was rejected: there is no Tag entity (PRD D3), and the Popup is not a tree browser.
