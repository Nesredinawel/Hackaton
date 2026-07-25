# Waga Index — Consumer Website
## Modern Design System & Screen Inventory

---

## Design Direction

```
┌─────────────────────────────────────────────────────────────────┐
│  DESIGN LANGUAGE                                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Vibe         E-commerce discovery meets civic data            │
│               Think Jumia meets Bloomberg market data          │
│               Clean, fast, browsable, trustworthy              │
│                                                                 │
│  Feel         Modern African market — not sterile dashboard    │
│               Warm neutrals, strong typography, clear data     │
│                                                                 │
│  Interaction  Browse-first, not search-first                   │
│               Prices feel discoverable, not queried            │
│               Every screen has somewhere to go next            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Design Tokens

```
┌─────────────────────────────────────────────────────────────────┐
│  TOKENS                                                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  COLOUR                                                         │
│  ──────                                                         │
│  Background      #F8F7F4   warm off-white, not sterile         │
│  Surface         #FFFFFF   cards and inputs                    │
│  Surface Alt     #F1EFE9   subtle section differentiation      │
│  Border          #E8E4DC   warm grey, not cold                 │
│  Text Primary    #1A1814   near black, warm                    │
│  Text Secondary  #6B6560   muted body                          │
│  Text Tertiary   #9C9590   labels, timestamps                  │
│                                                                 │
│  Accent Green    #1D7A4E   primary brand, CTAs                 │
│  Accent Light    #E8F5EE   green tint for backgrounds          │
│  Amber           #C47D1A   insufficient data, warnings         │
│  Amber Light     #FEF3E2   amber card backgrounds              │
│  Success         #16A34A   confirmed states                    │
│                                                                 │
│  TYPOGRAPHY                                                     │
│  ──────────                                                     │
│  Display         Clash Display — headlines, price figures      │
│  Body            Inter — all body copy, labels, UI             │
│  Amharic         Noto Sans Ethiopic — all Ethiopian script     │
│                                                                 │
│  SCALE                                                         │
│  xs    11px      timestamps, micro labels                      │
│  sm    13px      supporting info, muted rows                   │
│  base  15px      body copy                                     │
│  lg    17px      card titles, commodity names                  │
│  xl    22px      section headings                              │
│  2xl   28px      page headings                                 │
│  3xl   40px      price figures                                 │
│  4xl   56px      hero price display                            │
│                                                                 │
│  SPACE                                                         │
│  Base unit       4px                                           │
│  Card padding    20px                                          │
│  Section gap     48px                                          │
│  Page padding    20px mobile / 40px desktop                    │
│                                                                 │
│  SHAPE                                                         │
│  Card radius     16px                                          │
│  Button radius   12px                                          │
│  Badge radius    999px (pill)                                  │
│  Input radius    12px                                          │
│                                                                 │
│  SHADOW                                                        │
│  Card            0 1px 4px rgba(0,0,0,0.06)                   │
│  Elevated card   0 4px 16px rgba(0,0,0,0.10)                  │
│  No decorative   shadows serve hierarchy only                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Screen Count

```
┌─────────────────────────────────────────────────────────────────┐
│  CONSUMER WEBSITE — SCREEN INVENTORY                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Phase 1   Shell & Navigation             1 screen             │
│  Phase 2   Home & Discovery               2 screens            │
│  Phase 3   Category & Browse              2 screens            │
│  Phase 4   Commodity Detail               2 screens            │
│  Phase 5   Price Detail                   3 screens            │
│  Phase 6   Transparency                   1 screen             │
│                                                                 │
│  Total                                   11 screens            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

# Phase 1 — Shell & Navigation
**1 screen · Persistent across all pages**

---

## Screen 1.1 — App Shell

```
PURPOSE
───────
Persistent chrome that wraps every screen.
Navigation, search, language toggle.
Never competes with content.

DESKTOP SHELL
─────────────

┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                                                                 │   │
│  │  🌿 WAGA          All Categories ▾    Markets ▾    About        │   │
│  │                                                    EN · አማ     │   │
│  │                                                                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│  (navbar: white bg, border-bottom, 64px tall, sticky)                  │
│                                                                         │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │                                                                │    │
│  │                     PAGE CONTENT                               │    │
│  │                                                                │    │
│  └────────────────────────────────────────────────────────────────┘    │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  🌿 WAGA INDEX                                                  │   │
│  │  Real-time market prices from Ethiopia's informal markets.      │   │
│  │                                                                 │   │
│  │  Food & Groceries  ·  Electronics  ·  Clothing  ·  Household   │   │
│  │  Health & Pharmacy  ·  Transport                                │   │
│  │                                                                 │   │
│  │  © 2025 Waga Index  ·  About  ·  Methodology  ·  EN · አማ      │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│  (footer: Surface Alt bg, 3 rows, warm)                                │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

MOBILE SHELL
────────────

┌──────────────────────────────────────┐
│                                      │
│  ┌──────────────────────────────┐    │
│  │  🌿 WAGA     🔍    EN · አማ  │    │
│  └──────────────────────────────┘    │
│  (navbar: 56px, logo left,          │
│   icons right, sticky)              │
│                                      │
│   PAGE CONTENT                       │
│                                      │
│  ┌──────────────────────────────┐    │
│  │  🏠   🔍   🏷    👤          │    │
│  └──────────────────────────────┘    │
│  (bottom tab bar: 56px              │
│   Home / Search / Categories /      │
│   Contribute)                       │
│                                      │
└──────────────────────────────────────┘

NAVBAR ELEMENTS
───────────────
Logo mark + wordmark     left, links to Home
Categories dropdown      all categories, active + coming soon labelled
Markets dropdown         filter — all markets or specific market
                         persists as global context
About link               navigates to S6.1
Language toggle          EN · አማ — all content switches
Search                   desktop: inline search bar centre
                         mobile: icon, expands to overlay

BOTTOM TAB BAR (mobile only)
─────────────────────────────
Home                     S2.1
Search                   opens search overlay
Categories               S3.1 Category Browser
Contribute               opens Telegram bot, no pre-population

FOOTER ELEMENTS
───────────────
Brand line               one sentence description
Category links           all categories, quick nav
Utility links            About · Methodology · Language
Copyright
No social links          not needed in MVP
```

---

# Phase 2 — Home & Discovery
**2 screens**

---

## Screen 2.1 — Home

```
PURPOSE
───────
Make browsing feel like discovery.
Show the breadth of what is tracked.
Surface live prices immediately — no interaction required.
The e-commerce shelf effect: abundance, freshness, browsability.

MOBILE
──────

┌──────────────────────────────────────┐
│  🌿 WAGA            🔍    EN · አማ   │  navbar
├──────────────────────────────────────┤
│                                      │
│  ┌──────────────────────────────┐    │
│  │                              │    │
│  │  Market prices,              │    │  HERO BLOCK
│  │  right now.                  │    │  #1A1814
│  │  የዛሬ የገበያ ዋጋዎች።              │    │  Clash Display 32px
│  │                              │    │  warm bg #F1EFE9
│  │  Ethiopia's informal markets │    │  full bleed
│  │  tracked in real time.       │    │
│  │  15px Inter muted            │    │
│  │                              │    │
│  │  ┌──────────────────────┐    │    │
│  │  │  Browse prices  →    │    │    │  accent green button
│  │  └──────────────────────┘    │    │
│  │                              │    │
│  └──────────────────────────────┘    │
│                                      │
│  LIVE NOW  ●                         │  section label
│  ─────────────────────────────────   │  green dot pulsing
│                                      │
│  ← scroll horizontally →            │  LIVE PRICE STRIP
│  ┌──────────┐ ┌──────────┐ ┌──────  │  horizontal scroll
│  │          │ │          │ │        │  price chips
│  │ Tomato   │ │ Onion    │ │ Teff   │
│  │ 82 birr  │ │ 45 birr  │ │ 580 br │
│  │ Merkato  │ │ Merkato  │ │ Merkat │
│  │ /kg      │ │ /kg      │ │ /kg    │
│  │ 9 rpts   │ │ 6 rpts   │ │ 5 rpts │
│  │ 12m ago  │ │ 28m ago  │ │ 45m ago│
│  └──────────┘ └──────────┘ └──────  │
│  (each chip: white card, shadow,    │
│   16px radius, tap → S5.1)          │
│                                      │
│  Browse by Category                  │  section label
│  ─────────────────────────────────   │
│                                      │
│  ┌────────────┐  ┌────────────┐      │  CATEGORY GRID
│  │            │  │            │      │  2-col
│  │  🥬        │  │  📱        │      │
│  │            │  │            │      │
│  │  Food &    │  │ Electronics│      │
│  │  Groceries │  │            │      │
│  │  ምግብና ግሮሰሪ│  │ ኤሌክትሮኒክስ  │      │
│  │            │  │            │      │
│  │  12 items  │  │ Coming soon│      │
│  │  ● Live    │  │            │      │
│  └────────────┘  └────────────┘      │
│                                      │
│  ┌────────────┐  ┌────────────┐      │
│  │  👗        │  │  🏠        │      │
│  │  Clothing  │  │ Household  │      │
│  │  ልብስ       │  │ የቤት እቃዎች  │      │
│  │  Coming    │  │ Coming     │      │
│  │  soon      │  │ soon       │      │
│  └────────────┘  └────────────┘      │
│                                      │
│  ┌────────────┐  ┌────────────┐      │
│  │  💊        │  │  🚌        │      │
│  │  Health    │  │ Transport  │      │
│  │  ጤና        │  │ ትራንስፖርት  │      │
│  │  Coming    │  │ Coming     │      │
│  │  soon      │  │ soon       │      │
│  └────────────┘  └────────────┘      │
│                                      │
│  Featured Items                      │  section label
│  ─────────────────────────────────   │
│                                      │
│  ┌──────────────────────────────┐    │  FEATURED ITEM CARDS
│  │  🥬  Tomato  ቲማቲም            │    │  vertical list
│  │  ─────────────────────────   │    │  full width
│  │                              │    │
│  │  82 birr/kg                  │    │  price large
│  │  Merkato                     │    │  market label
│  │                              │    │
│  │  Range  75 — 90 birr         │    │  range muted
│  │  ██████████░░░░  9 reports   │    │  confidence bar
│  │  Updated 12 min ago          │    │  freshness
│  └──────────────────────────────┘    │
│                                      │
│  ┌──────────────────────────────┐    │
│  │  🥬  Teff  ጤፍ                │    │
│  │  580 birr/kg                 │    │
│  │  Merkato                     │    │
│  │  Range  560 — 600 birr       │    │
│  │  ████████░░░░░░  5 reports   │    │
│  │  Updated 45 min ago          │    │
│  └──────────────────────────────┘    │
│                                      │
│  See all Food & Groceries →          │  text link
│                                      │
│  Contribute a price                  │  section label
│  ─────────────────────────────────   │
│                                      │
│  ┌──────────────────────────────┐    │  CONTRIBUTE BANNER
│  │                              │    │  green tint bg
│  │  Know what something costs   │    │
│  │  today?                      │    │
│  │  ዋጋ ያውቃሉ? ሪፖርት ያድርጉ።        │    │
│  │                              │    │
│  │  ┌────────────────────────┐  │    │
│  │  │  Report a price  →    │  │    │  green button
│  │  └────────────────────────┘  │    │
│  │  Opens Telegram. 5 seconds.  │    │
│  └──────────────────────────────┘    │
│                                      │
├──────────────────────────────────────┤
│  🏠   🔍   🏷    👤                  │  bottom tab bar
└──────────────────────────────────────┘

DESKTOP LAYOUT DIFFERENCES
───────────────────────────
Hero              full width, 2-column: text left, live strip right
Category grid     3-column or 4-column
Featured items    2-column card grid
Contribute banner full width strip, text left button right

SECTION BREAKDOWN
─────────────────
1  Hero block             tagline + CTA
2  Live price strip       horizontal scroll chips, real-time
3  Browse by category     2-col grid, live vs coming soon
4  Featured items         3 most-recently-updated items
5  Contribute banner      acquisition CTA
```

---

## Screen 2.2 — Search Results

```
PURPOSE
───────
Cross-category commodity search.
Fast path for users who know what they want.
Results feel like product search, not a filter form.

MOBILE
──────

┌──────────────────────────────────────┐
│  🌿 WAGA            🔍    EN · አማ   │
├──────────────────────────────────────┤
│                                      │
│  ┌──────────────────────────────┐    │
│  │  ← 🔍  tomato             ✕ │    │  search input
│  └──────────────────────────────┘    │  auto-focused
│                                      │
│  Results for "tomato"                │  results label
│  ─────────────────────────────────   │
│                                      │
│  ┌──────────────────────────────┐    │  RESULT CARD
│  │                              │    │  one per matching
│  │  🥬  Tomato / ቲማቲም           │    │  commodity
│  │       Food & Groceries       │    │  category badge
│  │                              │    │
│  │  ┌──────────┐  ┌──────────┐  │    │  MARKET PILLS
│  │  │ Merkato  │  │ Shola    │  │    │  inline per card
│  │  │ 82 birr  │  │ ⚠ data   │  │    │  tap → S5.1
│  │  │ 9 rpts   │  │ needed   │  │    │  or S5.2
│  │  └──────────┘  └──────────┘  │    │
│  │                              │    │
│  │  See all markets →           │    │  link → S4.1
│  └──────────────────────────────┘    │
│                                      │
│  ─── No more results ───             │
│                                      │
│  Not finding it?                     │
│  ┌──────────────────────────────┐    │
│  │  Report this commodity →     │    │  contribute CTA
│  └──────────────────────────────┘    │
│                                      │
├──────────────────────────────────────┤
│  🏠   🔍   🏷    👤                  │
└──────────────────────────────────────┘

EMPTY STATE
───────────
┌──────────────────────────────────────┐
│                                      │
│  ┌──────────────────────────────┐    │
│  │  ← 🔍  berbere            ✕ │    │
│  └──────────────────────────────┘    │
│                                      │
│  No results for "berbere"            │
│                                      │
│  ┌──────────────────────────────┐    │
│  │                              │    │
│  │  This commodity is not in    │    │
│  │  the index yet.              │    │
│  │                              │    │
│  │  You can be the first to     │    │
│  │  report a price for it.      │    │
│  │                              │    │
│  │  ┌────────────────────────┐  │    │
│  │  │  Report via Telegram → │  │    │
│  │  └────────────────────────┘  │    │
│  └──────────────────────────────┘    │
│                                      │
│  Browse all categories →             │
│                                      │
└──────────────────────────────────────┘

ELEMENT DETAIL
──────────────
Search input          sticky top, auto-focused, live results
                      debounced 200ms — not on every keystroke
Result cards          one card per commodity
                      shows all markets as pills inside card
                      published market: price + count
                      insufficient market: amber pill "data needed"
Market pills          tappable individually → S5.1 or S5.2
See all markets       links to S4.1 for this commodity
Not finding it CTA    converts no-result into contribution moment
```

---

# Phase 3 — Category & Browse
**2 screens**

---

## Screen 3.1 — Category Browser

```
PURPOSE
───────
The full catalogue of commodity categories.
Entry point from nav dropdown or bottom tab.
Feels like a department store directory.

MOBILE
──────

┌──────────────────────────────────────┐
│  🌿 WAGA            🔍    EN · አማ   │
├──────────────────────────────────────┤
│                                      │
│  All Categories                      │  page heading
│  ሁሉም ምድቦች                            │  Clash Display 28px
│                                      │
│  ┌──────────────────────────────┐    │  ACTIVE CATEGORY
│  │                              │    │  full width card
│  │  🥬                          │    │  prominent
│  │  Food & Groceries            │    │
│  │  ምግብና ግሮሰሪ                   │    │
│  │                              │    │
│  │  Tomato · Onion · Potato     │    │  commodity preview
│  │  Teff · Oil · Wheat · Sugar  │    │  tags
│  │  + 5 more                    │    │
│  │                              │    │
│  │  ● 12 live prices            │    │  live badge
│  │                              │    │  green dot
│  │  Browse →                    │    │  arrow link
│  └──────────────────────────────┘    │
│                                      │
│  Coming Soon                         │  section label
│  ─────────────────────────────────   │  muted
│                                      │
│  ┌────────────┐  ┌────────────┐      │  COMING SOON
│  │            │  │            │      │  2-col grid
│  │  📱        │  │  👗        │      │  muted cards
│  │            │  │            │      │
│  │ Electronics│  │ Clothing   │      │
│  │ ኤሌክትሮኒክስ  │  │ ልብስ        │      │
│  │            │  │            │      │
│  │ Coming     │  │ Coming     │      │
│  │ soon       │  │ soon       │      │
│  └────────────┘  └────────────┘      │
│                                      │
│  ┌────────────┐  ┌────────────┐      │
│  │  🏠        │  │  💊        │      │
│  │ Household  │  │ Health     │      │
│  │ የቤት እቃዎች  │  │ ጤና         │      │
│  │ Coming     │  │ Coming     │      │
│  │ soon       │  │ soon       │      │
│  └────────────┘  └────────────┘      │
│                                      │
│  ┌────────────────────────────┐      │  FULL WIDTH
│  │  🚌  Transport  ትራንስፖርት   │      │  if odd count
│  │  Coming soon               │      │
│  └────────────────────────────┘      │
│                                      │
├──────────────────────────────────────┤
│  🏠   🔍   🏷    👤                  │
└──────────────────────────────────────┘

ELEMENT DETAIL
──────────────
Active category        large card, full width
                       icon + name bilingual
                       commodity tags preview (first 7 + n more)
                       live prices badge with green dot
                       Browse → navigates to S3.2

Coming soon grid       2-column, muted opacity 60%
                       icon + name bilingual
                       "Coming soon" label
                       tappable → S3.2 Coming Soon state

DESKTOP
───────
Active categories      could be multiple in future
                       3-column grid when more than 1 active
Coming soon            4-column grid
```

---

## Screen 3.2 — Category Detail

```
PURPOSE
───────
All commodities within one category.
Browse and compare prices across the whole category.
The shelf — every item visible, scannable, tappable.
Market selector applies to the whole page.

MOBILE
──────

┌──────────────────────────────────────┐
│  ← 🌿 WAGA          🔍   EN · አማ   │
├──────────────────────────────────────┤
│                                      │
│  🥬  Food & Groceries                │  category heading
│      ምግብና ግሮሰሪ                        │  Clash Display 28px
│                                      │
│  ┌──────────────────────────────┐    │  MARKET SELECTOR
│  │  📍  Merkato               ▾ │    │  sticky below header
│  └──────────────────────────────┘    │  applies to all items
│                                      │
│  ── SORT ─────────────────────────   │  sort chips
│  [ Freshest ✓ ]  [ A–Z ]  [ Price ] │  horizontal scroll
│  ────────────────────────────────    │
│                                      │
│  ┌──────────────────────────────┐    │  COMMODITY CARD
│  │                              │    │  has data
│  │  Tomato                      │    │  name EN semibold 17px
│  │  ቲማቲም                        │    │  name AM 15px muted
│  │                              │    │
│  │  82 birr/kg                  │    │  price 28px Clash Display
│  │                              │    │
│  │  Range  75 — 90 birr         │    │  range muted sm
│  │  9 reports · 12 min ago     │    │  count + freshness sm
│  │                              │    │
│  │               See detail  →  │    │  tap anywhere → S5.1
│  └──────────────────────────────┘    │
│                                      │
│  ┌──────────────────────────────┐    │
│  │  Onion                       │    │
│  │  ሽንኩርት                        │    │
│  │  45 birr/kg                  │    │
│  │  Range  40 — 52 birr         │    │
│  │  6 reports · 28 min ago     │    │
│  │               See detail  →  │    │
│  └──────────────────────────────┘    │
│                                      │
│  ┌──────────────────────────────┐    │
│  │  Potato                      │    │
│  │  ድንች                         │    │
│  │  30 birr/kg                  │    │
│  │  Range  25 — 38 birr         │    │
│  │  4 reports · 1 hr ago       │    │
│  │               See detail  →  │    │
│  └──────────────────────────────┘    │
│                                      │
│  ┌──────────────────────────────┐    │  COMMODITY CARD
│  │                              │    │  insufficient data
│  │  Wheat                       │    │  amber left border
│  │  ስንዴ                         │    │  4px solid #C47D1A
│  │                              │    │
│  │  ⚠  Not enough reports yet   │    │  status
│  │     1 of 3 needed            │    │  progress
│  │     in last 72 hours         │    │
│  │                              │    │
│  │           Add data →         │    │  CTA → Telegram
│  └──────────────────────────────┘    │
│                                      │
│  ┌──────────────────────────────┐    │
│  │  Sugar  ·  ሸዋ                │    │  COMPACT CARD
│  │  ⚠  No reports yet           │    │  zero data
│  │  Add data →                  │    │  more compact
│  └──────────────────────────────┘    │
│                                      │
│  ┌──────────────────────────────┐    │  CONTRIBUTE STRIP
│  │  🌿  Know a price not here?  │    │  accent light bg
│  │  Report it in 5 seconds.     │    │
│  │  [ Report a price → ]        │    │
│  └──────────────────────────────┘    │
│                                      │
├──────────────────────────────────────┤
│  🏠   🔍   🏷    👤                  │
└──────────────────────────────────────┘

CARD STATES
───────────
Has data           white card, shadow-sm
                   price prominent, range, count, freshness
                   full card tappable → S5.1

Insufficient       amber left border 4px
                   no price shown — not even a dash
                   status + progress count
                   "Add data →" link → Telegram

Zero reports       compact — less vertical space
                   no price, no range
                   amber left border
                   "Add data →" link

SORT OPTIONS
────────────
Freshest           default — most recently updated first
A–Z                alphabetical English name
Price low–high     only applies to has-data rows
                   insufficient rows always at bottom

DESKTOP LAYOUT
──────────────
2-column card grid
Market selector    inline top-right
Sort chips         inline top-left
```

---

# Phase 4 — Commodity Detail
**2 screens**

---

## Screen 4.1 — Commodity Overview (All Markets)

```
PURPOSE
───────
One commodity, all markets, side by side.
The comparison view — where is this cheapest today?
Entry point from recently-updated taps, search results.

MOBILE
──────

┌──────────────────────────────────────┐
│  ← 🌿 WAGA          🔍   EN · አMA   │
├──────────────────────────────────────┤
│                                      │
│  Tomato                              │  commodity heading
│  ቲማቲም                                │  Clash Display 28px
│  🥬  Food & Groceries                │  category tag muted
│                                      │
│  All markets today                   │  section label
│  ─────────────────────────────────   │
│                                      │
│  ┌──────────────────────────────┐    │  MARKET PRICE CARD
│  │                              │    │  has data
│  │  📍 Merkato                  │    │  market name
│  │     መርካቶ                     │    │
│  │                              │    │
│  │  82 birr/kg                  │    │  price Clash 32px
│  │                              │    │
│  │  Range today  75 — 90 birr  │    │  range
│  │  Reports      9              │    │
│  │  Last report  12 min ago    │    │
│  │                              │    │
│  │             View detail  →   │    │  → S5.1
│  └──────────────────────────────┘    │
│                                      │
│  ┌──────────────────────────────┐    │  MARKET PRICE CARD
│  │  📍 Shola                    │    │  insufficient
│  │     ሾላ                        │    │  amber left border
│  │                              │    │
│  │  ⚠  Not enough reports       │    │
│  │     1 of 3 needed            │    │
│  │                              │    │
│  │             Add data →       │    │  → Telegram
│  └──────────────────────────────┘    │
│                                      │
│  Report this price                   │  section label
│  ─────────────────────────────────   │
│                                      │
│  ┌──────────────────────────────┐    │  REPORT CARD
│  │                              │    │  accent light bg
│  │  Saw a different price?      │    │
│  │  ዋጋ አይተዋል? ሪፖርት ያድርጉ።        │    │
│  │                              │    │
│  │  Choose your market:         │    │
│  │                              │    │
│  │  ┌────────────────────────┐  │    │
│  │  │  📍 Merkato           │  │    │  market buttons
│  │  └────────────────────────┘  │    │  each → Telegram
│  │  ┌────────────────────────┐  │    │  pre-populated
│  │  │  📍 Shola             │  │    │
│  │  └────────────────────────┘  │    │
│  │                              │    │
│  │  Opens Telegram. 5 seconds.  │    │
│  └──────────────────────────────┘    │
│                                      │
├──────────────────────────────────────┤
│  🏠   🔍   🏷    👤                  │
└──────────────────────────────────────┘

ELEMENT DETAIL
──────────────
Market cards          one per available market
                      has-data: white card, price prominent
                      insufficient: amber border, no price shown
Report card           market buttons instead of single CTA
                      each button opens Telegram for that market
                      pre-populated with this commodity
```

---

## Screen 4.2 — Coming Soon Category Landing

```
PURPOSE
───────
Graceful destination for inactive category taps.
Not a dead end. Sets expectation. Collects intent.

MOBILE
──────

┌──────────────────────────────────────┐
│  ← 🌿 WAGA          🔍   EN · አMA   │
├──────────────────────────────────────┤
│                                      │
│  ┌──────────────────────────────┐    │  HERO CARD
│  │                              │    │  Surface Alt bg
│  │  📱                          │    │  icon large 48px
│  │                              │    │
│  │  Electronics                 │    │  Clash Display 28px
│  │  ኤሌክትሮኒክስ                    │    │
│  │                              │    │
│  │  This category is coming     │    │
│  │  soon to Waga Index.         │    │
│  │  ይህ ምድብ በቅርቡ ይጨምራል።         │    │
│  │                              │    │
│  └──────────────────────────────┘    │
│                                      │
│  ┌──────────────────────────────┐    │  CONTRIBUTE CARD
│  │                              │    │  accent light bg
│  │  Know electronics prices     │    │
│  │  in Addis Ababa?             │    │
│  │                              │    │
│  │  Report prices now — they    │    │
│  │  will appear when we have    │    │
│  │  enough data.                │    │
│  │                              │    │
│  │  ┌────────────────────────┐  │    │
│  │  │  Report a price  →    │  │    │
│  │  └────────────────────────┘  │    │
│  └──────────────────────────────┘    │
│                                      │
│  While you wait                      │  section label
│  ─────────────────────────────────   │
│                                      │
│  ┌──────────────────────────────┐    │  BROWSE OTHER
│  │  Browse what is live now     │    │  card
│  │                              │    │
│  │  🥬  Food & Groceries  →     │    │
│  └──────────────────────────────┘    │
│                                      │
├──────────────────────────────────────┤
│  🏠   🔍   🏷    👤                  │
└──────────────────────────────────────┘
```

---

# Phase 5 — Price Detail
**3 screens**

---

## Screen 5.1 — Price Detail (Has Data)

```
PURPOSE
───────
The deepest view. One commodity, one market.
Full context: price, range, count, freshness, source.
The moment of decision — is this price fair?

MOBILE
──────

┌──────────────────────────────────────┐
│  ← 🌿 WAGA          🔍   EN · አMA   │
├──────────────────────────────────────┤
│                                      │
│  ┌──────────────────────────────┐    │  PRICE HERO CARD
│  │  Surface Alt bg              │    │  full bleed card
│  │                              │    │
│  │  Tomato / ቲማቲም               │    │  name bilingual
│  │  📍 Merkato  ·  🥬 Food      │    │  market · category
│  │                              │    │
│  │  82                          │    │  Clash Display 56px
│  │  birr per kg                 │    │  unit 18px muted
│  │                              │    │
│  │  ● Updated 12 min ago        │    │  green dot freshness
│  └──────────────────────────────┘    │
│                                      │
│  Today at Merkato                    │  section label
│  ─────────────────────────────────   │
│                                      │
│  ┌──────────────────────────────┐    │  STATS CARD
│  │                              │    │
│  │  Range today                 │    │
│  │  75 ──────────── 90 birr     │    │  visual range bar
│  │       ▲                      │    │  marker at 82
│  │       82 (current median)    │    │
│  │                              │    │
│  │  ─────────────────────────   │    │
│  │                              │    │
│  │  Reports     9               │    │  stat rows
│  │  Contributors  7 people      │    │
│  │  Field agents  2 agents      │    │
│  │  Window      last 72 hours   │    │
│  │                              │    │
│  └──────────────────────────────┘    │
│                                      │
│  Other markets                       │  section label
│  ─────────────────────────────────   │
│                                      │
│  ┌──────────────────────────────┐    │  OTHER MARKET
│  │  📍 Shola  ·  ⚠ No data yet  │    │  compact row
│  │  Add data →                  │    │
│  └──────────────────────────────┘    │
│                                      │
│  ┌──────────────────────────────┐    │  REPORT CARD
│  │  📊  Did you pay a different │    │  accent light bg
│  │      price at Merkato?       │    │
│  │                              │    │
│  │  ┌────────────────────────┐  │    │
│  │  │  Report this price  →  │  │    │  green button
│  │  └────────────────────────┘  │    │
│  │  Opens Telegram. 5 seconds.  │    │
│  └──────────────────────────────┘    │
│                                      │
├──────────────────────────────────────┤
│  🏠   🔍   🏷    👤                  │
└──────────────────────────────────────┘

RANGE BAR DETAIL
─────────────────
  Full width bar        low to high range
  Filled segment        from low to high, accent light
  Marker triangle       at the median price position
  Labels                low value left / high value right
  Median label          below marker

STAT ROWS
──────────
  Reports               total count, not "n submissions"
  Contributors          human count
  Field agents          agent count
  Window                "last 72 hours" in plain English
  No source codes       user / agent / scraped never shown
                        plain language only on consumer surface
```

---

## Screen 5.2 — Price Detail (No Data)

```
PURPOSE
───────
Honest gap. Specific progress. Direct contribution prompt.
The gap is a feature — not a failure.

MOBILE
──────

┌──────────────────────────────────────┐
│  ← 🌿 WAGA          🔍   EN · አMA   │
├──────────────────────────────────────┤
│                                      │
│  ┌──────────────────────────────┐    │  HERO CARD
│  │  Amber Light bg #FEF3E2      │    │  amber tinted
│  │                              │    │
│  │  Teff / ጤፍ                   │    │
│  │  📍 Shola  ·  🥬 Food        │    │
│  │                              │    │
│  │  ⚠  Not enough reports yet   │    │  status large
│  │     በቂ ሪፖርቶች የሉም            │    │  bilingual
│  │                              │    │
│  └──────────────────────────────┘    │
│                                      │
│  ┌──────────────────────────────┐    │  PROGRESS CARD
│  │                              │    │
│  │  Progress to first price     │    │
│  │                              │    │
│  │  ██░░░░  1 of 3 reports      │    │  progress bar
│  │          needed              │    │  1/3 filled
│  │          in the last 72 hrs  │    │
│  │                              │    │
│  │  Help reach the threshold:   │    │
│  │                              │    │
│  │  ┌────────────────────────┐  │    │
│  │  │  Add the missing data →│  │    │  green button
│  │  └────────────────────────┘  │    │
│  │  Opens Telegram. 5 seconds.  │    │
│  └──────────────────────────────┘    │
│                                      │
│  Try another market                  │  section label
│  ─────────────────────────────────   │
│                                      │
│  ┌──────────────────────────────┐    │
│  │  📍 Merkato  ·  580 birr/kg  │    │  has data
│  │  5 reports  ·  45 min ago   │    │  green card
│  │  View detail  →              │    │  → S5.1
│  └──────────────────────────────┘    │
│                                      │
├──────────────────────────────────────┤
│  🏠   🔍   🏷    👤                  │
└──────────────────────────────────────┘

ZERO REPORTS STATE
──────────────────
Progress bar          empty bar — 0 of 3
Button text           "Start the count →"
Body copy             "No one has reported this yet.
                       Be the first."
```

---

## Screen 5.3 — Price Submitted Confirmation

```
PURPOSE
───────
Close the loop when user returns from Telegram.
Show the updated price with their contribution included.
Warm, human, brief.

MOBILE
──────

┌──────────────────────────────────────┐
│  🌿 WAGA            🔍    EN · አMA   │
├──────────────────────────────────────┤
│                                      │
│  ┌──────────────────────────────┐    │  CONFIRMATION CARD
│  │  Accent Light bg             │    │  green tinted
│  │                              │    │
│  │  ✅  Thank you               │    │  checkmark 32px
│  │      አመሰግናለሁ                 │    │  bilingual
│  │                              │    │
│  │  Your report helps everyone  │    │
│  │  who shops in this market.   │    │
│  │                              │    │
│  └──────────────────────────────┘    │
│                                      │
│  Current price                       │  section label
│  ─────────────────────────────────   │
│                                      │
│  Tomato / ቲማቲም  ·  📍 Merkato        │
│                                      │
│  ┌──────────────────────────────┐    │  REFRESHED PRICE CARD
│  │                              │    │
│  │  83                          │    │  updated price
│  │  birr per kg                 │    │
│  │                              │    │
│  │  Range    75 — 92 birr       │    │
│  │  Reports  10                 │    │  count updated
│  │  Updated  Just now           │    │  freshness
│  │                              │    │
│  └──────────────────────────────┘    │
│                                      │
│  ┌──────────────────────────────┐    │  NEXT ACTION CARD
│  │  Report another price        │    │
│  │  ─────────────────────────   │    │
│  │  [ Browse categories → ]     │    │  softer CTA
│  └──────────────────────────────┘    │
│                                      │
├──────────────────────────────────────┤
│  🏠   🔍   🏷    👤                  │
└──────────────────────────────────────┘

TRIGGER
───────
URL param            ?submitted=true&commodity=tomato&market=merkato
State                shown once — refresh removes confirmation card
                     price card remains

NO POINTS            no streak mention
NO BADGES            not in MVP
NO MONETARY LANGUAGE prohibited
```

---

# Phase 6 — Transparency
**1 screen**

---

## Screen 6.1 — About & Methodology

```
PURPOSE
───────
Build trust. Explain the platform in plain language.
Describe the no-imputation rule without jargon.
List what is live and what is coming.
Credibility not marketing.

MOBILE
──────

┌──────────────────────────────────────┐
│  ← 🌿 WAGA          🔍   EN · አMA   │
├──────────────────────────────────────┤
│                                      │
│  About Waga Index                    │  Clash Display 28px
│  ────────────────                   │
│                                      │
│  Real-time price data from           │
│  Ethiopia's informal markets.        │
│  Contributed by people in markets.   │
│  Verified before publication.        │
│                                      │
│  ──────────────────                  │
│                                      │
│  How it works                        │  section heading
│  ─────────────                      │
│                                      │
│  ┌──────────────────────────────┐    │  STEP CARDS
│  │  1  Someone in a market      │    │  numbered
│  │     reports a price via      │    │  white cards
│  │     Telegram.                │    │
│  └──────────────────────────────┘    │
│                                      │
│  ┌──────────────────────────────┐    │
│  │  2  The price is checked     │    │
│  │     against recent reports   │    │
│  │     and a verified baseline. │    │
│  └──────────────────────────────┘    │
│                                      │
│  ┌──────────────────────────────┐    │
│  │  3  If it passes, it joins   │    │
│  │     the published index.     │    │
│  │     If not, it is flagged    │    │
│  │     and kept — not deleted.  │    │
│  └──────────────────────────────┘    │
│                                      │
│  ┌──────────────────────────────┐    │
│  │  4  A price needs 3+         │    │
│  │     validated reports in 72  │    │
│  │     hours to publish.        │    │
│  └──────────────────────────────┘    │
│                                      │
│  ──────────────────                  │
│                                      │
│  What gaps mean                      │  section heading
│  ──────────────                     │
│                                      │
│  When you see "not enough reports"   │
│  it means the threshold was not met. │
│  We show the gap — not an estimate.  │
│                                      │
│  A gap is honest.                    │
│  An estimate presented as a price    │
│  is not.                             │
│                                      │
│  ──────────────────                  │
│                                      │
│  What we cover                       │  section heading
│  ─────────────                      │
│                                      │
│  ┌──────────────────────────────┐    │  COVERAGE TABLE
│  │  🥬 Food & Groceries  ● Live │    │  green dot live
│  │  📱 Electronics    Coming    │    │  muted coming
│  │  👗 Clothing       Coming    │    │
│  │  🏠 Household      Coming    │    │
│  │  💊 Health         Coming    │    │
│  │  🚌 Transport      Coming    │    │
│  └──────────────────────────────┘    │
│                                      │
│  ← Back to prices                    │
│                                      │
├──────────────────────────────────────┤
│  🏠   🔍   🏷    👤                  │
└──────────────────────────────────────┘
```

---

## Final Screen Inventory

```
┌─────────────────────────────────────────────────────────────────┐
│  CONSUMER WEBSITE — COMPLETE SCREEN INVENTORY                   │
├──────┬──────────────────────────────────────┬───────────────────┤
│  #   │  Screen Name                         │  Phase            │
├──────┼──────────────────────────────────────┼───────────────────┤
│  1.1 │  App Shell                           │  Shell            │
├──────┼──────────────────────────────────────┼───────────────────┤
│  2.1 │  Home                                │  Home & Discovery │
│  2.2 │  Search Results                      │  Home & Discovery │
├──────┼──────────────────────────────────────┼───────────────────┤
│  3.1 │  Category Browser                    │  Category & Browse│
│  3.2 │  Category Detail                     │  Category & Browse│
├──────┼──────────────────────────────────────┼───────────────────┤
│  4.1 │  Commodity Overview (All Markets)    │  Commodity Detail │
│  4.2 │  Coming Soon Category Landing        │  Commodity Detail │
├──────┼──────────────────────────────────────┼───────────────────┤
│  5.1 │  Price Detail — Has Data             │  Price Detail     │
│  5.2 │  Price Detail — No Data              │  Price Detail     │
│  5.3 │  Price Submitted Confirmation        │  Price Detail     │
├──────┼──────────────────────────────────────┼───────────────────┤
│  6.1 │  About & Methodology                 │  Transparency     │
└──────┴──────────────────────────────────────┴───────────────────┘

Phase 1   Shell & Navigation           1 screen
Phase 2   Home & Discovery             2 screens
Phase 3   Category & Browse            2 screens
Phase 4   Commodity Detail             2 screens
Phase 5   Price Detail                 3 screens
Phase 6   Transparency                 1 screen
─────────────────────────────────────────────────
Total                                 11 screens
```