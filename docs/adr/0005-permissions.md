# Manifest permissions stay minimal

Install-time permissions are `bookmarks`, `favicon`, `storage`, and `activeTab` (PRD Appendix B). `bookmarks` is the product; `favicon` is icon display; `storage` holds the local search index (ADR 0004), OpenRecord, and extension prefs. `activeTab` lets the Popup read the current tab URL/title on toolbar click so ＋ can save the current page (D2). It is not a standing `tabs` grant.

Do **not** request the full `tabs` permission just to call `tabs.create` (R5). `optional_host_permissions` are requested only when the user later enables dead-link check (R9). No `history` in v1.
