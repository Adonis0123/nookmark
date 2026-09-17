# Manifest permissions stay minimal

Install-time permissions are `bookmarks`, `favicon`, and `storage` (PRD Appendix B). `bookmarks` is the product; `favicon` is icon display; `storage` holds the local search index (ADR 0004), OpenRecord, and extension prefs.

Do **not** request the full `tabs` permission just to call `tabs.create` (R5). `optional_host_permissions` are requested only when the user later enables dead-link check (R9). No `history` in v1.

TODO: align `wxt.config.ts` `manifest` with this list when implementation starts. This ADR is documentation only.
