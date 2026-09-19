---
version: alpha
name: Bookmark-Glass-design-analysis
description: 一个"浅色液态玻璃"的浏览器书签插件界面系统。基底是一条同色相的冷蓝明度渐变，上面浮着两枚大半径、低透明度的光斑；所有内容都装在白色玻璃里，玻璃的层级靠"白度阶梯"区分而不是靠阴影堆叠。全系统只有一个强调色——宝蓝 #0866FF，且一屏最多出现五处。图标可以分色相，但必须服从同一条规则：极浅底（L 91–95）+ 深字形（L 23–49），靠明度差拉开而不是靠饱和度堆叠。界面情绪是安静的、有实体的、可触摸的——像一块磨砂玻璃浮在清晨的天光上。

colors:
  accent: "#0866FF"
  accent-press: "#0653CC"
  accent-soft-15: "rgba(8, 102, 255, 0.15)"
  on-accent: "#FFFFFF"
  success-dot: "#34C759"

  canvas-top: "#F2F7FE"
  canvas-mid: "#E9F1FC"
  canvas-bottom: "#DCE8F9"
  atmosphere-glow: "rgba(8, 102, 255, 0.15)"
  atmosphere-highlight: "rgba(255, 255, 255, 0.75)"

  glass-panel: "rgba(255, 255, 255, 0.62)"
  glass-panel-flat: "rgba(255, 255, 255, 0.60)"
  glass-element: "rgba(255, 255, 255, 0.55)"
  glass-edge-strong: "rgba(255, 255, 255, 0.85)"
  glass-edge-soft: "rgba(255, 255, 255, 0.75)"

  inset-tint-6: "rgba(14, 42, 88, 0.06)"
  inset-tint-8: "rgba(14, 42, 88, 0.08)"

  ink: "#1D1D1F"
  ink-muted: "#6E6E73"
  ink-tertiary: "#86868B"

  tile-blue-bg: "#E3EEFC"
  tile-blue-glyph: "#1B4FA8"
  tile-violet-bg: "#EDE8FC"
  tile-violet-glyph: "#5B37C4"
  tile-teal-bg: "#DFF3F0"
  tile-teal-glyph: "#0C6A5D"
  tile-rose-bg: "#FBE5EF"
  tile-rose-glyph: "#AD2464"
  tile-amber-bg: "#FCEFDD"
  tile-amber-glyph: "#9A5B0C"

  shadow-card: "rgba(12, 50, 110, 0.07)"
  shadow-accent: "rgba(8, 102, 255, 0.26)"

typography:
  brand-title:
    fontFamily: "Noto Sans SC, system-ui, sans-serif"
    fontSize: 17px
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: 0
  section-title:
    fontFamily: "Noto Sans SC, system-ui, sans-serif"
    fontSize: 15px
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: 0
  row-title:
    fontFamily: "Noto Sans SC, system-ui, sans-serif"
    fontSize: 12.5px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: 0
  chip-selected:
    fontFamily: "Noto Sans SC, system-ui, sans-serif"
    fontSize: 12.5px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0
  chip-rest:
    fontFamily: "Noto Sans SC, system-ui, sans-serif"
    fontSize: 12.5px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: 0
  tile-label:
    fontFamily: "Noto Sans SC, system-ui, sans-serif"
    fontSize: 11px
    fontWeight: 500
    lineHeight: 1.35
    letterSpacing: 0
  search-input:
    fontFamily: "Noto Sans SC, system-ui, sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: 0
  caption:
    fontFamily: "Noto Sans SC, system-ui, sans-serif"
    fontSize: 11px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: 0
  caption-strong:
    fontFamily: "Noto Sans SC, system-ui, sans-serif"
    fontSize: 11.5px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0
  meta:
    fontFamily: "Noto Sans SC, system-ui, sans-serif"
    fontSize: 10.5px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: 0
  domain:
    fontFamily: "Inter, ui-monospace, sans-serif"
    fontSize: 10.5px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: 0
  key-hint:
    fontFamily: "Inter, ui-monospace, sans-serif"
    fontSize: 11px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0
  count:
    fontFamily: "Inter, ui-monospace, sans-serif"
    fontSize: 10px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0

rounded:
  chip-xs: 8px
  icon-sm: 9px
  icon: 10px
  logo: 11px
  row: 12px
  tile: 16px
  shell: 18px
  pill: 9999px

spacing:
  xxs: 2px
  xs: 4px
  sm: 6px
  md: 8px
  lg: 10px
  xl: 12px
  xxl: 16px
  canvas: 20px

components:
  shell-popup:
    backgroundColor: "{colors.canvas-top}"
    width: 420px
    height: 680px
    rounded: "{rounded.shell}"
  atmosphere-layer:
    backgroundColor: transparent
    blur: 150px
    height: 680px
  brand-lockup:
    backgroundColor: "{colors.accent}"
    rounded: "{rounded.logo}"
    width: 30px
    height: 30px
    typography: "{typography.brand-title}"
    textColor: "{colors.ink}"
  button-create:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    rounded: "{rounded.pill}"
    width: 30px
    height: 30px
    shadow: "{colors.shadow-accent} 0 6px 16px"
  button-ghost-circular:
    backgroundColor: "{colors.glass-panel-flat}"
    borderColor: "{colors.glass-edge-strong}"
    blur: 20px
    rounded: "{rounded.pill}"
    width: 30px
    height: 30px
  search-input:
    backgroundColor: "{colors.glass-panel-flat}"
    borderColor: "{colors.glass-edge-strong}"
    blur: 30px
    rounded: "{rounded.pill}"
    height: 46px
    padding: 13px
    typography: "{typography.search-input}"
    textColor: "{colors.ink-tertiary}"
  chip-filter-selected:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    rounded: "{rounded.pill}"
    height: 32px
    padding: 0 16px
  chip-filter-rest:
    backgroundColor: "{colors.glass-element}"
    borderColor: "{colors.glass-edge-soft}"
    blur: 20px
    rounded: "{rounded.pill}"
    height: 32px
    padding: 0 16px
  kbd-chip:
    backgroundColor: "{colors.inset-tint-6}"
    rounded: "{rounded.chip-xs}"
    width: 40px
    height: 24px
    typography: "{typography.key-hint}"
    textColor: "{colors.ink-muted}"
  count-badge:
    backgroundColor: "{colors.inset-tint-8}"
    rounded: "{rounded.icon-sm}"
    height: 17px
    padding: 0 8px
    typography: "{typography.count}"
    textColor: "{colors.ink-muted}"
  text-link:
    backgroundColor: transparent
    typography: "{typography.row-title}"
    textColor: "{colors.accent}"
  bookmark-tile:
    backgroundColor: "{colors.glass-panel}"
    borderColor: "{colors.glass-edge-strong}"
    blur: 30px
    rounded: "{rounded.tile}"
    width: 86px
    height: 84px
    padding: 10px
    shadow: "{colors.shadow-card} 0 8px 24px"
    typography: "{typography.tile-label}"
  icon-tile:
    rounded: "{rounded.icon}"
    width: 30px
    height: 30px
  recent-row:
    backgroundColor: "{colors.glass-element}"
    borderColor: "{colors.glass-edge-soft}"
    blur: 20px
    rounded: "{rounded.row}"
    height: 48px
    padding: 11px
    typography: "{typography.row-title}"
  recent-row-icon:
    rounded: "{rounded.icon-sm}"
    width: 26px
    height: 26px
  status-dot:
    backgroundColor: "{colors.success-dot}"
    width: 7px
    height: 7px
    rounded: "{rounded.pill}"
---

# Popup visual spec

Light glass UI for the Nookmark toolbar popup (420×680). Domain language stays in `CONTEXT.md`. The light-only constraint is ADR 0003.

Canvas copy is not the domain model:

- The lockup title is **Nookmark** (confirmed 2026-09-18). Canvas 「书签」 is mock UI.
- Canvas mock is not a product feature (PRD §11.5). Do not ship tags, notes, stars, recycle, cloud quota, hard-coded「128 / 已同步」, or the 6-color category palette as behavior.
- Category swatches on the canvas color Folder glyphs. They are not a Category entity. First slice Bookmark tiles and rows use the site **favicon** (ADR 0005); fallback glyph if missing. Chips are text-only.
- 「常用」 is a Popup section of Bookmark tiles. Product rule (PRD §0.1 D4): 8 auto tiles by local openCount; no manual pin.
- 「最近打开」 and 「已同步」 are canvas copy. Product rule (PRD §0.1 D5): 3 recent rows; clear wipes local open records only. Chrome Sync is not a Nookmark record; sync copy must follow `syncing` when shown — omit the sync clause when unknown.
- Search placeholder on canvas may still say「标签」. Product copy is「搜索书签、网址或拼音」(PRD §0.1 D6). Filter chips are Folder filter (ADR 0007), not tags.
- Main 「＋」 means save the current tab into Other Bookmarks (PRD §0.1 D2, ADR 0006), not an empty-bookmark dialog. Gear, Manager entry, and 「查看全部」 are **hidden** in the First slice (D7) — not visible-disabled.

P0 empty / no-results / permission / loading / save-current feedback is specified in **P0 states & interactions** below (text + tokens). No extra screenshots required.

## Screens

| Screen | Status | Notes |
|---|---|---|
| `docs/screens/popup.png` | **Normative** | The toolbar Popup this spec describes. Token-for-token, this screenshot and this document agree. |
| `docs/screens/popup-add-bookmark.png` | Not aligned | Add-Bookmark dialog (560px). **Predates the `{colors.accent}` decision** — it still uses the earlier Azure palette with grey borders (`#D6E3F0`) instead of white glass edges, and carries a 「标签」 field that `CONTEXT.md` avoids. Treat as a layout reference only. |
| `docs/screens/manager.png` | Not aligned | Earlier exploration of the Manager surface (1440×720). **Not covered by this spec** (see `CONTEXT.md`) and also on the earlier Azure accent. Treat as a layout reference only. |

Source canvas: <https://ardot.tencent.com/file/726157280612685> — node `9:1` (`A1b · 弹窗 Meta Blue 宝蓝`) is the Popup. Node `4:1` is labeled「当前基线」on the canvas; that label is stale — confirmed 2026-09-18, do not implement `4:1`. `2:418` is the Add-Bookmark dialog, `4:134` the Manager exploration; both are out of the First slice.

## Overview

这套系统的全部张力来自一个判断：**浅色玻璃的"高级感"不来自玻璃本身，而来自玻璃底下那层有色调的底。**纯白玻璃放在近白底上会当场消失，所以画布必须带一点色相——一条从 `{colors.canvas-top}` 到 `{colors.canvas-bottom}` 的单色相冷蓝渐变，色相锁在 H215–220，只做明度变化（L 97% → 91% → 87%）。渐变之上浮两枚大半径光斑：一枚宝蓝 `{colors.atmosphere-glow}`、一枚纯白 `{colors.atmosphere-highlight}`，都走 150px 模糊。

层级用**白度阶梯**表达，不用阴影：面板 62% 白 → 元素 55% 白 → 内嵌色块 6–8% 蓝黑。阴影只在两个地方出现——书签卡片底下一层几乎看不见的蓝相投影 `{colors.shadow-card}`，以及主按钮自己的强调色投影 `{colors.shadow-accent}`。**全屏只有主按钮一处投影**，这是纪律。

强调色只有一个：宝蓝 `{colors.accent}`，并且**一屏不超过五处**。它出现在 Logo 底、新建按钮、选中芯片、文字链接与箭头、以及底部的管理入口——除此之外任何地方要"点击感"，都用白度变化或 `{colors.ink}` 表达，不用颜色。

图标允许有颜色，但必须遵守同一条规则：底是同色相极浅（L 91–95），字形是同色相极深（L 23–49），两者明度差 ≥45。这与"糖果色"的本质区别在于——糖果色是高饱底 + 白字形，这套是极浅底 + 深字形。

---

## Colors

### Brand & Accent

| Token | Value | HSL | Use |
|---|---|---|---|
| `{colors.accent}` | `#0866FF` | H217 S100 L52 | 唯一的强调色。Logo 底、主按钮、选中芯片、链接、管理入口 |
| `{colors.accent-press}` | `#0653CC` | H217 S100 L40 | 派生值（压暗 ~20%）。按下态实心填充 |
| `{colors.accent-soft-15}` | `rgba(8,102,255,0.15)` | — | 光斑填充；选中态浅底可复用 |
| `{colors.on-accent}` | `#FFFFFF` | — | 强调色之上的一切文字与描边字形 |
| `{colors.success-dot}` | `#34C759` | H135 S64 L49 | 同步状态点。全系统唯一的功能性彩色 |

**为什么是 H217。** 对 76 套公开设计规范做色相统计，H215–222（宝蓝带）的出现频次最高——Meta `#0866FF`、BMW `#1C69D4`、IBM `#0F62FE` 都落在这一带；而 H205–212（天青带，Apple `#0066CC`、LinkedIn `#0A66C2`）次之，H224–240（靛蓝带，Linear `#5E6AD2`、Discord `#5865F2`）再次。H217 是这个统计的重心，也是最"正"的蓝。

**不要往亮调。** `{colors.accent}` 的白字对比度实测 **4.82:1**，刚刚过 WCAG AA 的 4.5:1。任何把明度抬到 L>55% 的"更亮的蓝"（例如 Tailwind `#3B82F6`，L=60%，对比度仅 3.2:1）都会让白字失效。

### Surface — 画布与氛围

| Token | Value | Use |
|---|---|---|
| `{colors.canvas-top}` | `#F2F7FE` | 画布渐变起点（顶） |
| `{colors.canvas-mid}` | `#E9F1FC` | 渐变中点（45%） |
| `{colors.canvas-bottom}` | `#DCE8F9` | 渐变终点（底） |
| `{colors.atmosphere-glow}` | `rgba(8,102,255,0.15)` | 蓝光斑填充（节点 opacity 0.75，blur 150） |
| `{colors.atmosphere-highlight}` | `rgba(255,255,255,0.75)` | 白光斑填充（节点 opacity 0.45，blur 150） |

画布渐变用**垂直**方向（`gradientTransform` 顶→底），三个 stop 恰好是同色相的 L 97 → 95 → 92，色相与饱和度只在极小的范围内浮动，肉眼读起来是"一块被光照到的纸"，不是"一个渐变"。

### Surface — 玻璃三级

| Token | Value | Blur | Border | Use |
|---|---|---|---|---|
| `{colors.glass-panel}` | `rgba(255,255,255,0.62)` | 30px | `{colors.glass-edge-strong}` 1px | 书签卡片——唯一带投影的玻璃层级 |
| `{colors.glass-panel-flat}` | `rgba(255,255,255,0.60)` | 30px | `{colors.glass-edge-strong}` 1px | 搜索栏、圆形图标按钮（无投影） |
| `{colors.glass-element}` | `rgba(255,255,255,0.55)` | 20px | `{colors.glass-edge-soft}` 1px | 筛选芯片、最近打开记录行 |
| `{colors.inset-tint-6}` | `rgba(14,42,88,0.06)` | — | 无 | 快捷键键帽这类"凹进去"的小面 |
| `{colors.inset-tint-8}` | `rgba(14,42,88,0.08)` | — | 无 | 数量徽章 |

三级的差别是**白度 62 → 60 → 55 与模糊 30 → 30 → 20**，差幅刻意做得很小：玻璃层级靠"几乎察觉不到的白度差 + 大圆角 + 亮边"成立，一旦靠阴影拉开就变成了卡片堆卡片。

### Text

| Token | Value | 玻璃底实测对比度 | Use |
|---|---|---|---|
| `{colors.ink}` | `#1D1D1F` | 15.6:1 ✓ | 品牌名、分组标题、卡片与记录标题 |
| `{colors.ink-muted}` | `#6E6E73` | 4.54:1 ✓ | 二级信息：品牌副标题、域名、键帽、数量 |
| `{colors.ink-tertiary}` | `#86868B` | **3.25:1 ✗** | 三级 metadata：时间戳、搜索占位 |

> ⚠️ `{colors.ink-tertiary}` 在玻璃底上实测只有 3.25:1，**低于 WCAG AA 的 4.5:1**。它目前只用在"12 分钟前""figma.com"这类可跳过的元信息上，可以接受；但如果要承载任何可读内容，必须升级到 `{colors.ink-muted}`（4.54:1）。这是本系统现存唯一的对比度欠账。

### Hairlines & Borders

- 玻璃的边永远是**白色而非灰色**：`{colors.glass-edge-strong}`（0.85）用于面板级，`{colors.glass-edge-soft}`（0.75）用于元素级。
- 没有中性灰描边。所有"分割"要么是白边，要么是留白，要么是白度阶梯。
- 面板级玻璃额外挂一条顶部内高光：`inset 0 1px 1.5px rgba(255,255,255,0.9)`——这是玻璃"有厚度"的关键，比任何描边都更有效。

### Brand Gradient

系统里**没有品牌渐变**。唯一的渐变是画布底，且是单色相明度渐变。跨色相渐变（蓝→紫这类）在本系统里是禁止项。

---

## Typography

### Font Family

- **Noto Sans SC** —— 全部中文与界面文案。承载标题（SemiBold 600）、正文（Regular 400）、强调文案（Medium 500）。
- **Inter** —— 数字、域名、键盘快捷键、计数。`{typography.domain}`、`{typography.key-hint}`、`{typography.count}` 三处专用。

字重阶梯只有三档：**400 / 500 / 600**。700 及以上的 Black 在本系统里没有位置——界面情绪是安静的，粗体一出现就破了。

### Hierarchy

| Role | Size | Weight | Family | Use |
|---|---|---|---|---|
| `{typography.brand-title}` | 17px | 600 | Noto Sans SC | 插件名 Nookmark |
| `{typography.section-title}` | 15px | 600 | Noto Sans SC | 分组标题"常用""最近打开" |
| `{typography.search-input}` | 14px | 400 | Noto Sans SC | 搜索框输入与占位 |
| `{typography.row-title}` | 12.5px | 400 | Noto Sans SC | 记录行主标题、文字链接 |
| `{typography.chip-selected}` / `{typography.chip-rest}` | 12.5px | 500 / 400 | Noto Sans SC | 筛选芯片（选中加一档字重） |
| `{typography.caption-strong}` | 11.5px | 500 | Noto Sans SC | 底栏"打开管理页" |
| `{typography.caption}` | 11px | 400 | Noto Sans SC | 品牌副标题、底栏同步状态 |
| `{typography.tile-label}` | 11px | 500 | Noto Sans SC | 书签卡片标签 |
| `{typography.key-hint}` | 11px | 500 | Inter | ⌘K 键帽 |
| `{typography.meta}` | 10.5px | 400 | Noto Sans SC | 时间戳 |
| `{typography.domain}` | 10.5px | 400 | Inter | 域名 |
| `{typography.count}` | 10px | 500 | Inter | 数量徽章 |

### Principles

1. **字号跨度只有 10 → 17px。**这是一个 420px 宽的小面板，不是落地页。任何超过 20px 的字在这个尺寸里都显得吵。
2. **层级靠颜色和字重，不靠字号。**记录标题（12.5/400/`{colors.ink}`）与域名（10.5/400/`{colors.ink-muted}`）只差 2px，但对比度差了两倍——视线自然落在标题上。
3. **中文走 Noto Sans SC，数字与拉丁走 Inter。**域名和时间戳里的数字必须切到 Inter，否则数字字形会偏软。
4. **行高统一 1.4 附近。**没有花哨的 lead——这是个工具面板，读的是标签不是段落。

### Note on Font Substitutes

- Noto Sans SC → 系统栈回落 `system-ui, sans-serif`；Windows 上会落到微软雅黑，字形偏宽，注意记录行可能溢出，需要 `text-overflow: ellipsis`。
- Inter → 回落 `ui-monospace, sans-serif`。域名和键帽的等宽感是设计意图，不要回落到普通无衬线。

---

## Layout

### Spacing System

| Token | Value | Use |
|---|---|---|
| `{spacing.xxs}` | 2px | 品牌文字内部行距、计数徽章内间距 |
| `{spacing.xs}` | 4px | 底栏"管理入口"图标与文字 |
| `{spacing.sm}` | 6px | 底栏同步点与文案 |
| `{spacing.md}` | 8px | 卡片内图标与标签、筛选芯片间距、操作按钮间距 |
| `{spacing.lg}` | 10px | 品牌区图标与文字、卡片内边距、记录行图标与文字 |
| `{spacing.xl}` | 12px | 卡片网格间距、记录行圆角圈定的内边距 |
| `{spacing.xxl}` | 16px | 内容区各模块之间的垂直节奏 |
| `{spacing.canvas}` | 20px | 面板左右安全边距 |

> 光学补偿：画布用的是 10/11、12/13、6/7 这类**相差 1px 的成对值**。11 和 13 不是新刻度，而是"看起来正"的修正值——文字块有视觉留白，几何居中会比光学居中偏上偏左。

### Grid & Container

- 面板：**420 × 680**，圆角 `{rounded.shell}`（18px），是可滚动区域内的一张固定宽度卡。
- 内容区：**380px**（面板宽减去左右各 `{spacing.canvas}` 20px），纵向 `layout: vertical`，模块间 `gap: {spacing.xxl}`（16px）。
- 书签卡片网格：**4 列**，卡片 86×84，列间距 `{spacing.xl}`（12px）→ 4×86 + 3×12 = 380，正好铺满内容宽度。
- 记录行：**单列整宽**，高 48px，圆角 `{rounded.row}`。
- 全系统**没有水平滚动**，也没有超过两栏的横向布局——这是弹窗，不是仪表盘。

### Whitespace Philosophy

留白承担了大部分"分组"职责。系统里几乎没有分割线：分组之间靠 16px 的呼吸和一条 15px SemiBold 的标题切开，玻璃卡片自己在底上"浮起来"。如果哪天想加分割线，先问是不是该加留白。

---

## Elevation & Depth

系统用三层机制表达深度，且**优先级从高到低**：

| Level | Treatment | Use |
|---|---|---|
| L0 · 画布 | 单色相明度渐变 + 2 枚模糊光斑 | 面板底，`{component.atmosphere-layer}` |
| L1 · 玻璃元素 | 白 55% + blur 20 + 白边 0.75 | 筛选芯片、记录行（**无投影**） |
| L2 · 玻璃面板 | 白 62% + blur 30 + 白边 0.85 + 内高光 | 书签卡片（**唯一带投影的玻璃**） |
| L3 · 强调实体 | 实心 `{colors.accent}` + `{colors.shadow-accent}` | 主按钮（**全屏唯一带投影的实体**） |

**投影哲学。** 整个界面只有两组投影：
1. `{colors.shadow-card}` = `rgba(12,50,110,0.07) 0 8px 24px` —— 挂在书签卡片上。注意它是**蓝相**而不是纯黑：纯黑投影在蓝底上会发脏，取画布同族色压到 7% 才"融"进去。
2. `{colors.shadow-accent}` = `rgba(8,102,255,0.26) 0 6px 16px` —— 只挂在主按钮上。这是全屏唯一一处"彩色投影"，它让"新建"成为唯一真正立起来的东西。

量级上，7% 和 26% 都不是随手写的：面板级卡片上的投影要**几乎看不出来**才算对（能看出"这里有阴影"就是重了），而主按钮需要一眼看出它是凸的。

### Decorative Depth

- **光斑必须低透明度。**`{colors.atmosphere-glow}` 填充 15% + 节点 opacity 75%，实际落地不到 12%。模糊半径再大，opacity 给到 1 一样会艳成马卡龙。
- **光斑是氛围层的兄弟节点，绘制顺序在内容之前。**它必须真的在玻璃下面，`BACKGROUND_BLUR` 才吃得到——这是玻璃"透出底色"的物理前提。
- **不要给元素级玻璃加投影。**记录行和芯片一旦有了投影，L1 和 L2 的层级就糊了，整屏会开始像"一堆小卡片"。

---

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.chip-xs}` | 8px | 快捷键键帽 |
| `{rounded.icon-sm}` | 9px | 记录行图标底（26×26）、数量徽章 |
| `{rounded.icon}` | 10px | 书签卡片图标底（30×30） |
| `{rounded.logo}` | 11px | 品牌 Logo（30×30） |
| `{rounded.row}` | 12px | 最近打开记录行 |
| `{rounded.tile}` | 16px | 书签卡片、筛选芯片 |
| `{rounded.shell}` | 18px | 弹窗面板外壳 |
| `{rounded.pill}` | 9999px | 搜索栏（h46 取半高 23px）、圆形按钮（30×30 取 15px）、状态点 |

**圆角语法有两条隐含规则：**

1. **同级容器半径 ≥ 内部元素半径。**卡片 16 > 图标底 10 > 字形；记录行 12 > 图标底 9。违反它会显得"嵌套很脏"。
2. **`{rounded.pill}` 只出现在"输入或状态"上**——搜索栏、芯片、圆形按钮、状态点。它们都是"可以按下去"的东西。

### Geometry

- 图标底恒为方块（30×30 或 26×26），不裁圆——圆角停在 10/9px，保留"方块"的读感。
- 键帽是 40×24 的扁矩形，圆角 8px，暗示一个真实的物理按键。
- 所有图标为**线性描边**（1.4–1.6px），不用面性填充。因为字形颜色已经很深，再吃面性填充会显重。

---

## Components

### Shell

**`{component.shell-popup}`** —— 420×680，圆角 `{rounded.shell}`，填充 `{colors.canvas-top}`，其上覆盖 `{component.atmosphere-layer}`。内容区 `layout: none` + 绝对居中：380px 宽、垂直 gap 16px。

**`{component.atmosphere-layer}`** —— 420×680 无填充容器，两个椭圆子节点：
- `光-蓝`：780×560，填充 `{colors.atmosphere-glow}`，节点 opacity **0.75**，`LAYER_BLUR 150`，偏上半部。
- `光-白`：640×460，填充 `{colors.atmosphere-highlight}`，节点 opacity **0.45**，`LAYER_BLUR 150`，压在蓝光偏右下。

两枚光斑叠出的是"左上偏蓝、右上偏亮"的自然光感——单一光源，不是两束聚光灯。

**`{component.brand-lockup}`** —— 左 30×30 宝蓝方块（`{rounded.logo}`）内嵌 10×15 白色书签线性字形；右为两行文字：`{typography.brand-title}` `{colors.ink}` 的 **Nookmark**（画布「书签」是 mock），`{typography.caption}` `{colors.ink-muted}` 的"128 个书签 · 已同步"。图标与文字间距 `{spacing.lg}`（10px），行内 gap `{spacing.xxs}`（2px）。

### Buttons

**`{component.button-create}`** —— **主操作**。30×30 圆形（`{rounded.pill}`），实心 `{colors.accent}`，内嵌白色加号（14×14 容器，字形 9.6×9.6，1.6px 线宽），挂 `{colors.shadow-accent} 0 6px 16px`。全屏唯一带投影的实体。按下态：填充切 `{colors.accent-press}`，投影移除。

**`{component.button-ghost-circular}`** —— 30×30 圆形次级操作（设置）。填充 `{colors.glass-panel-flat}`、白边 1px `{colors.glass-edge-strong}`、`BACKGROUND_BLUR 20`，**无投影**。字形是 `{colors.ink}` 的 1.5px 线性齿轮。按下态：白度降到 `{colors.glass-element}`。

两组按钮间距 `{spacing.md}`（8px），始终紧贴右上角。

**`{component.text-link}`** —— `{typography.row-title}`（"查看全部"，12px）或 `{typography.caption-strong}`（"打开管理页"，11.5px Medium），色 `{colors.accent}`，其后跟一枚 12×12 的箭头容器（VECTOR，仅描边 `{colors.accent}`）。文字与箭头 gap 3–4px。永远不用下划线。

### Inputs

**`{component.search-input}`** —— 高 46px，`{rounded.pill}`（半径 23px），填充 `{colors.glass-panel-flat}`、白边 `{colors.glass-edge-strong}`、`BACKGROUND_BLUR 30`，**无投影但有内高光** `inset 0 1px 1.5px rgba(255,255,255,0.9)`。内边距 13px，横向 gap 10px。三个子节点：

1. 搜索图标 —— 16×16 容器，一只 8.8px 圆 + 3.4px 手柄，`{colors.ink-tertiary}` 1.5px 描边。
2. 占位文案 —— `{typography.search-input}` `{colors.ink-tertiary}`，`layoutGrow: 1`。
3. `{component.kbd-chip}` —— 40×24，填充 `{colors.inset-tint-6}`，`{rounded.chip-xs}`，`{typography.key-hint}` `{colors.ink-muted}` 的 ⌘K。

> 搜索栏是这套玻璃里唯一"凹"的元素——内高光的作用就是把它从"浮起"翻转成"陷进去"。它是视觉上的分界：上面是 chrome，下面是内容。

### Chips

**`{component.chip-filter-selected}`** —— 66×32，`{rounded.pill}`，**实心** `{colors.accent}`，文字 `{typography.chip-selected}` `{colors.on-accent}`。

**`{component.chip-filter-rest}`** —— 66×32 同尺寸，填充 `{colors.glass-element}`、白边 `{colors.glass-edge-soft}`、`BACKGROUND_BLUR 20`，文字 `{typography.chip-rest}` `{colors.ink-muted}`。

选中态是**同尺寸的实心替换**，不是加描边或加底色——一眼可数，永远只有一个是"实"的。芯片横向 gap `{spacing.md}`（8px）。

### Cards & Containers

**`{component.bookmark-tile}`** —— 86×84，`{rounded.tile}`，填充 `{colors.glass-panel}`、白边 1px `{colors.glass-edge-strong}`、`BACKGROUND_BLUR 30`、内高光 `inset 0 1px 1.5px rgba(255,255,255,0.9)`，外加 `{colors.shadow-card} 0 8px 24px`。内部 `layout: vertical`：`{component.icon-tile}` 30×30 在上，标签在下，gap 8px，内边距 10px。四列网格，gap 12px。

**`{component.icon-tile}`** —— 30×30，`{rounded.icon}`。First slice：站点 favicon（contain）；失败时用 `{colors.inset-tint-8}` 底 + `{colors.ink-muted}` 线性回落字形。画布分类色板不上色。

**`{component.recent-row}`** —— 整宽，高 48px，`{rounded.row}`（12px），填充 `{colors.glass-element}`、白边 `{colors.glass-edge-soft}`、`BACKGROUND_BLUR 20`，**无投影**。内边距 11px，横向 gap 10px。结构：`{component.recent-row-icon}` 26×26（`{rounded.icon-sm}`，分类浅色底 + 深色字形）→ 文字区（`{typography.row-title}` `{colors.ink}` 标题 + `{typography.domain}` `{colors.ink-muted}` 域名，gap 7px，`layoutGrow: 1`）→ `{typography.meta}` `{colors.ink-tertiary}` 时间戳。

### Badges & Status

**`{component.count-badge}`** —— 24×17，`{rounded.icon-sm}`（9px），填充 `{colors.inset-tint-8}`，`{typography.count}` `{colors.ink-muted}`。跟在分组标题右侧，gap 7px。**它是凹下去的**——没有描边、没有玻璃，和面板形成对照。

**`{component.status-dot}`** —— 7×7 圆，`{colors.success-dot}`，其后跟 `{typography.caption}` `{colors.ink-muted}` 的"已同步 · 刚刚"，gap 6px。全系统唯一的绿色，只用在这里。

### Folder filter (D3 / ADR 0007)

Chips: `全部` plus immediate child Folder titles from Bookmarks Bar / Other Bookmarks / Mobile Bookmarks. Hide the chip row when that list is empty. Do not chip the special roots.

- `全部` + empty query: 常用 grid + 最近 rows (this screen).
- One Folder + empty query: replace 常用 and 最近 with descendant Bookmark `{component.recent-row}` list.
- Non-empty query: search hits ∩ current chip (`全部` = whole tree). Results use `{component.recent-row}` (favicon + title + domain + pinyin hint when needed).

### Category Icon Palette (canvas mock)

First slice does **not** color Bookmark tiles from this table. Use favicons. The palette stays as a visual reference if a later surface needs Folder glyphs.

六个分类色号，全部服从同一条生成规则——**底 = 同色相极浅，字形 = 同色相极深，两者明度差 ≥45**：

| 分类 | 底 | 底 HSL | 字形 | 字形 HSL | 明度差 |
|---|---|---|---|---|---|
| 设计灵感 / 字体库 | `#E3EEFC` | H214 S80 L94 | `#1B4FA8` | H218 S45 L38 | 56 |
| 组件库 / 灵感收藏 | `#EDE8FC` | H255 S77 L95 | `#5B37C4` | H255 S54 L49 | 46 |
| 开发文档 | `#DFF3F0` | H171 S45 L91 | `#0C6A5D` | H172 S24 L23 | 68 |
| 设计规范 / 配色方案 | `#FBE5EF` | H333 S73 L94 | `#AD2464` | H332 S45 L41 | 53 |
| 图标素材 | `#FCEFDD` | H35 S83 L93 | `#9A5B0C` | H33 S41 L33 | 60 |

**使用约束：**
- 一屏内**同一分类必须同色**。上表中前三行是同一色号的多处复用，不是新色号。
- 相邻卡片**不得同色**，同列上下**不得同色**。4 列网格最容易在列内撞色，排布后请逐列复核。
- 色号的**数量上限是 6**。类别超过 6 个时，复用色号而不是新增色相。
- 浅底上依然要保留 `BACKGROUND_BLUR 20`——这层模糊让色号看起来像"透过玻璃的色块"，而不是贴上去的色纸。

---

## Do's and Don'ts

### Do

- 画布用**单色相明度渐变**（H215–220，L 97→95→92），色相全画布锁死。
- 光斑用 `{colors.atmosphere-glow}` / `{colors.atmosphere-highlight}`，填充透明度 ≤0.15，节点 opacity ≤0.75，模糊 150px。
- 玻璃层级用**白度阶梯**：面板 62% → 元素 55% → 内嵌 6–8%。层级差靠白度，不靠阴影。
- 玻璃的边永远用**白色**：面板级 0.85、元素级 0.75，且面板级必须挂 `inset 0 1px 1.5px rgba(255,255,255,0.9)` 内高光。
- 强调色 `{colors.accent}` **一屏最多五处**：Logo 底 / 新建按钮 / 选中芯片 / 文字链接与箭头 / 管理入口。
- 卡片投影必须染蓝相——`{colors.shadow-card}`（`#0C326E` 压到 7%），不要用纯黑。
- 图标用**极浅底 + 深字形**，明度差 ≥45，且遵守 `{rounded.icon}` 的嵌套半径。
- 环境层（光斑）必须是玻璃的**同层级兄弟节点且绘制顺序在前**，`BACKGROUND_BLUR` 才有效。
- 主按钮以外的任何元素都**不挂投影**。

### Don't

- **不要跨色相渐变。**蓝→紫这类渐变是整套系统里第一位的禁止项。
- **不要高饱马卡龙光晕。**模糊半径再大，opacity 给到 1 一样艳。
- **不要用高饱底 + 白字形做图标。**那是糖果色语法，和本系统的极浅底 + 深字形是两套语言。一屏出现 5 种以上高饱和色相即视为走偏。
- **不要把强调色调亮到 L>55%。**`#0866FF` 的白字对比度是 4.82:1，已经贴着 AA 线；再亮一档就跌穿了。
- **不要给元素级玻璃挂阴影。**L1 有了投影，L1/L2 的层级就糊了。
- **不要在玻璃上再叠玻璃超过两层。**面板 → 元素是终点；第三层要改成 `{colors.inset-tint-6}` 这类凹面。
- **不要引入第二个强调色。**底部管理入口、查看全部、选中芯片、Logo、新建按钮全都是同一个 `{colors.accent}`。
- **不要用 700 及以上字重。**阶梯只有 400 / 500 / 600。
- **不要加分割线。**分组靠 16px 留白 + 15px SemiBold 标题。
- **不要用中性灰描边。**边只用白色。

---

## Responsive Behavior

### 面板宽度

| 名称 | 宽度 | 关键变化 |
|---|---|---|
| 最小 | 360px | 内容区 320px；书签网格 4→3 列（96×84，gap 12）；筛选芯片横向滚动，首屏露出 3.5 枚 |
| 标准 | 420px | 4 列 86×84 网格；内容区 380px。设计基准 |
| 宽松 | 480px | 内容区 440px；书签网格保持 4 列，卡片放宽到 101×88；搜索栏与记录行留白同步放大 |

这**不是**一个需要断点体系的产品，而是一块固定宽度的面板。宽度只在 360–480 之间浮动，超过 480 就应该切到管理页，而不是继续拉伸弹窗。

### Touch / 命中区

- 书签卡片 86×84、记录行 48px 高、芯片 32px 高——都超过 44px 或接近，符合基本命中要求。
- 圆形按钮 30×30 **低于 44px 推荐值**。桌面扩展可以接受（鼠标精度更高），但若要移植到触屏，需要把命中区扩到 44×44（视觉尺寸保持不变）。
- 搜索栏 46px、圆形按钮 30px 是全局最基本的两个尺度，不要为了"更精致"再缩。

### Collapsing Strategy

- **筛选芯片**：≥420px 时 5 枚平铺；<420px 时横向滚动，左侧保留 13px 内边距，并在末枚右侧渐隐。
- **书签网格**：4 列在 <380px 时降为 3 列，卡片保持 84px 高，宽度按比例放宽——不要缩小卡片，缩小会让标签折行。
- **记录行**：<380px 时域名隐藏（时间戳保留在右），标题单行省略号收尾。
- **品牌副标题**：<360px 时隐藏"· 已同步"，只留书签数量。

### Dark Mode

**未定义。**本系统是刻意只在浅色下成立的——玻璃的层级完全建立在"白色叠加"上，深色下这套机制不成立，需要另起一套体系（surface 阶梯 + 中性光斑），不能靠反色复用。见 Known Gaps。

---

## Iteration Guide

1. 一次只动一个组件，并且用它的 YAML 键名指代（`{component.bookmark-tile}`、`{component.chip-filter-selected}`）。
2. 变体作为独立条目挂在 `components:` 下（`-selected` / `-rest` / `-press`）。
3. 全文用 `{token.refs}`，**不要内联 hex**。
4. **不记录 hover 态。**只记录 default 与 active/pressed。
5. 要"更重的强调"时，先换面（白度阶梯向下一档），再考虑加投影——顺序不能颠倒。
6. 改动强调色时，需要同步的位置只有五处，且**只有实心填充要改**，白色字形不动。
7. 新增分类色号前先数一遍：色号总数不能超过 6，且必须满足"明度差 ≥45"。

### 画布节点对照

| 组件 | 节点 ID | 令牌 |
|---|---|---|
| 面板外壳 | `9:1` | `{component.shell-popup}` |
| 氛围层 | `9:2` | `{component.atmosphere-layer}` |
| 光-蓝 / 光-白 | `9:4` / `9:5` | `{colors.atmosphere-glow}` / `{colors.atmosphere-highlight}` |
| 内容区 | `9:3` | 380px 容器 |
| Logo / 新建 / 设置 | `9:49` / `9:51` / `9:52` | `{component.brand-lockup}` / `button-create` / `button-ghost-circular` |
| 搜索栏 / 快捷键 | `9:7` / `9:20` | `{component.search-input}` / `kbd-chip` |
| 选中芯片 / 未选芯片 | `9:21` / `9:22` | `{component.chip-filter-selected}` / `-rest` |
| 数量徽章 | `9:62` | `{component.count-badge}` |
| 书签卡片（首个） | `9:28` | `{component.bookmark-tile}` |
| 图标底（首个） | `9:65` | `{component.icon-tile}` |
| 记录行（首个） | `9:12` | `{component.recent-row}` |
| 状态点 | `9:90` | `{component.status-dot}` |

画布：`https://ardot.tencent.com/file/726157280612685?node_id=9%3A1`

---

## P0 states & interactions

Text + tokens only. No new screenshots. Product rules in PRD §0.1 win over canvas copy (D2 / D6 / D7).

### Empty library

The bookmarks tree has no URL nodes (US-11). Hide `{component.bookmark-tile}` grid and `{component.recent-row}` list when they have nothing to show (D4 already hides 常用 when there are no bookmarks). Do **not** render an error.

Show a quiet guide in the content column: `{typography.caption}` / `{colors.ink-muted}` (readable; do not use `{colors.ink-tertiary}` for this teaching copy). Example:「还没有书签。点右上角 ＋ 收藏当前页面。」`{component.button-create}` stays available.

### No search results

Query returned zero hits (R4.6). Replace the results list with:

1. `{typography.section-title}` / `{colors.ink}` —「没有匹配的书签」
2. Optional exit — `{component.text-link}`「在网上搜索『…』」
3. Pinyin tip — `{typography.caption}` / `{colors.ink-muted}`:「可输入拼音或首字母，如 `sjlg`」

The tip teaches pinyin input (PRD R4.6). Do not omit it.

### Permission denied / bookmarks read failure

R6. Full-panel message, not a toast that can be missed, and not raw API strings.

- Title `{typography.section-title}` / `{colors.ink}`:「需要书签访问权限」or「无法读取书签」
- Body `{typography.caption}` / `{colors.ink-muted}`: one sentence that this is a permission or read failure, not that bookmarks were deleted
- Action `{component.text-link}`: open the extension's settings (`chrome://extensions` for this id)

Managed / `unmodifiable` nodes stay in the list with a lock cue; they are not this state.

### Loading / indexing

First build of the local index (ADR 0004 / M5: interactive ≤ 1s, full index ≤ 3s). Keep chrome (lockup, search, ＋) up. In the content column, a quiet caption `{typography.caption}` / `{colors.ink-muted}`「正在索引书签…」or ghost tiles that reuse `{colors.glass-panel}` / `{colors.inset-tint-6}` with no titles. Do not show stale or partial search hits.

### Pinyin-hit row hint

When a row is a pinyin / initials hit (R4.6 / US-02e):

- Highlight the matching **Han** in the title (`{colors.accent}` is allowed here as one of the five accent hits, or a `{colors.accent-soft-15}` wash under the glyphs)
- On the right of `{component.recent-row}`, a light cue `{typography.meta}` / `{colors.ink-muted}`: `sjlg → 汉字` (example: `sjlg → 设计灵感`)

Do not invent a second accent. Skip the cue on raw Han / Latin hits.

### Save current page (main ＋)

`{component.button-create}` saves the current tab into Other Bookmarks (D2 / ADR 0006). Feedback is a **toast or inline caption**, not a dialog.

| Outcome | Copy (example) | Treatment |
|---|---|---|
| Success |「已收藏当前页面」 | Brief toast / inline; `{typography.caption}` / `{colors.ink}` on `{colors.glass-element}` |
| Already saved |「当前页面已在书签中」 | Same surface; do not write a duplicate Bookmark |
| Failure | Readable reason (invalid URL, write error) | Same surface; no raw exception string |

**Do not** treat `docs/screens/popup-add-bookmark.png` as normative. That frame is Azure + a「标签」field and predates `{colors.accent}` / D2. Empty-bookmark dialog is out of P0.

### Gear / Manager / 「查看全部」(D7)

Hide `{component.button-ghost-circular}` (gear), the footer「打开管理页」`{component.text-link}`, and 常用「查看全部」. Do not render them disabled. Hidden entries do not count toward the five `{colors.accent}` hits.

---

## Known Gaps

- **深色模式未定义。**本系统是浅色专属。深色不能靠反色复用——玻璃层级建立在白色叠加之上，深色下需要另起"surface 阶梯 + 中性光斑"的体系。
- **`{colors.ink-tertiary}` 对比度不达标。**`#86868B` 在玻璃底上实测 3.25:1，低于 AA 4.5:1。它只用在可跳过的元信息上；若要承载可读内容，必须升级到 `{colors.ink-muted}`。
- **管理页（宽屏面）未纳入本规范。**本规范抽取自 420×680 的弹窗主界面。宽屏管理页需要补侧栏 / 多栏网格 / 表格行三组组件，且当前画布上的管理页版本用的是另一支蓝（H210），与本规范的 `{colors.accent}`（H217）不一致——两者需要先统一强调色再合并成一份完整规范。P0 不实现 Manager / 齿轮交互（D7）。
- **按压 / 悬停 / 焦点态只定义了填充变化。**过渡时长、缓动曲线、位移量均未在画布上验证，属于实现阶段待定项。
- **图标字形均为 1.4–1.6px 线性描边，未做统一的 24×24 网格规范。**目前依赖逐图导出时的视觉对齐，补齐需要一份正式的图标网格。
- **P0 空 / 无结果 / 权限失败 / 索引中 / 拼音提示 / 收藏当前页反馈**已在上文用文案 + token 写清；画布上仍无对应像素稿。实现按该节落地，不必等新截图。记录行 / 卡片的骨架形态仍可在实现时微调。
- **`popup-add-bookmark` 对话框不是 P0 规范。**主 ＋ = 收藏当前页（D2）；Azure +「标签」稿只作历史布局参考。
- **滚动条样式未定义。**在 macOS 上依赖系统覆盖式滚动条；Windows 上需要显式样式化，否则与玻璃面板冲突。
