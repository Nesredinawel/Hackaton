# Waga Index — Consumer Web App
## Screen Inventory, User Flow & Purpose

---

## What Waga Index Is

```
┌─────────────────────────────────────────────────────────────────┐
│  PLATFORM PURPOSE                                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Waga Index is a real-time price information platform           │
│  for Ethiopia's informal markets.                               │
│                                                                 │
│  It answers one question that no current source can:            │
│  what does a commodity cost today, in a specific market,        │
│  right now — not last month, not nationally, not estimated.     │
│                                                                 │
│  Prices are contributed by people physically present            │
│  in markets. Every figure is validated before publication.      │
│  Every gap is shown as a gap.                                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## The Two Sides of the Platform

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   CONSUMER WEB APP              INSTITUTIONAL DASHBOARD         │
│   ─────────────────             ────────────────────────        │
│   For anyone in or              For organisations that          │
│   near a market                 need the data formally          │
│                                                                 │
│   Free. Always.                 Paid. Authenticated.            │
│                                                                 │
│   Answers:                      Answers:                        │
│   What does tomato cost         What has tomato cost            │
│   at Merkato today?             across markets over 30 days,    │
│                                 with submission counts,          │
│                                 source composition, and          │
│                                 a methodology note?             │
│                                                                 │
│   Output: a number              Output: a dataset               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Consumer Web App — Purpose

```
┌─────────────────────────────────────────────────────────────────┐
│  CONSUMER WEB APP — TWO JOBS                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  JOB 1 — SERVE THE SHOPPER                                      │
│  ───────────────────────────                                    │
│  A household buyer or small trader checks what a commodity      │
│  costs before going to market, or checks whether the           │
│  price they were just quoted is reasonable.                     │
│                                                                 │
│  They get: current price, today's range, how many people        │
│  reported it, and how recently.                                 │
│                                                                 │
│  This is free. Permanently. It is not a revenue line.           │
│  It is the reason the platform exists publicly.                 │
│                                                                 │
│  JOB 2 — ACQUIRE CONTRIBUTORS                                   │
│  ──────────────────────────────                                 │
│  Every person who sees a price on the web app is shown          │
│  one action: report a price. One tap opens the Telegram         │
│  bot pre-populated with the commodity and market they           │
│  were just looking at.                                          │
│                                                                 │
│  The web app is the top of the contribution funnel.             │
│  The Telegram bot is where contribution happens.                │
│  The two surfaces are one journey.                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Who Uses the Consumer Web App

```
┌─────────────────────────────────────────────────────────────────┐
│  PRIMARY USER — THE MARKET VISITOR                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Who        Household buyer, small trader, daily shopper        │
│  Where      In or near an informal market in Addis Ababa        │
│  Device     Mid-range Android, mobile data connection           │
│  Language   Amharic primary, English secondary                  │
│  Goal       Know if a price is fair before or after buying      │
│  Time       Under 30 seconds available                          │
│  Tolerance  Zero — if it is slow or confusing they leave        │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  SECONDARY USER — THE POTENTIAL CONTRIBUTOR                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Same person as above                                           │
│  Moment     After seeing the price, offered a single action     │
│  Barrier    Must already have Telegram installed                 │
│  Ask        Open bot, send one message, done                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Screen Inventory — Consumer Web App

```
┌─────────────────────────────────────────────────────────────────┐
│  3 SCREENS                                                      │
├──────┬──────────────────────────────────┬───────────────────────┤
│  #   │  Screen Name                     │  Trigger              │
├──────┼──────────────────────────────────┼───────────────────────┤
│  S1  │  Price Lookup — Data Available   │  Default landing      │
│  S2  │  Price Lookup — Insufficient     │  No data for cell     │
│  S3  │  About                           │  Footer link tap      │
└──────┴──────────────────────────────────┴───────────────────────┘
```

---

## Screen S1 — Price Lookup (Data Available)

```
PURPOSE
───────
Show the current validated price for a commodity at a market.
Give the user enough context to judge whether it is reasonable.
Offer one action: report a price.

┌──────────────────────────────────────┐
│                                      │
│  🌿 Waga                  EN · አማ   │  ← header bar
│                                      │
├──────────────────────────────────────┤
│                                      │
│  What are prices like today?         │  ← headline
│  ዛሬ ዋጋዎች ምን ያህል ናቸው?               │    both languages always
│                                      │
│  ┌───────────────────────────────┐   │
│  │ 🥬  Tomato / ቲማቲም          ▾ │   │  ← commodity selector
│  └───────────────────────────────┘   │
│                                      │
│  ┌───────────────────────────────┐   │
│  │ 📍  Merkato                  ▾ │   │  ← market selector
│  └───────────────────────────────┘   │
│                                      │
│  ┌───────────────────────────────┐   │
│  │                               │   │
│  │  82                          │   │  ← price — large
│  │  birr per kg                  │   │  ← unit — muted
│  │                               │   │
│  │  ────────────────────────     │   │
│  │                               │   │
│  │  Range today                  │   │
│  │  75 — 90 birr                 │   │  ← range
│  │                               │   │
│  │  9 reports · 12 min ago      │   │  ← count + freshness
│  │                               │   │
│  └───────────────────────────────┘   │
│                                      │
│  ┌───────────────────────────────┐   │
│  │                               │   │
│  │  📊  See a different price?   │   │  ← report card
│  │      Report what you paid.    │   │
│  │                               │   │
│  │  ┌─────────────────────────┐  │   │
│  │  │  Report tomato price →  │  │   │  ← CTA button
│  │  └─────────────────────────┘  │   │    accent green
│  │                               │   │    opens Telegram
│  │  Opens Telegram. 5 seconds.   │   │    pre-populated
│  └───────────────────────────────┘   │
│                                      │
│  Prices from market visitors.        │  ← footer note
│  Validated. Never estimated.         │
│  About Waga Index                    │  ← about link
│                                      │
└──────────────────────────────────────┘

ELEMENT DETAIL
──────────────
Header
  Logo mark + wordmark     left
  Language toggle          right — EN / አማ
  Taps switch all content  no page reload

Commodity selector
  Dropdown                 5 items
  Each item                English name / Amharic name
  Default                  first commodity in list

Market selector
  Dropdown                 2 items in MVP
  Default                  first market in list

Price card
  Price figure             40px, semibold, #111827
  Unit                     16px, muted, below price
  Divider                  light horizontal rule
  Range                    14px, muted
  Count + freshness        13px, muted, dot separator between

Report card
  Separated from price     distinct card below, not merged
  Body copy                2 lines, 14px, muted
  CTA button               full width, accent green
                           static deep link to Telegram bot
                           commodity and market pre-populated
                           no session state, no identity link
  Subtext                  "Opens Telegram. 5 seconds." — 12px muted

Footer
  Two lines                plain text, 12px muted
  About link               navigates to S3
  No other links
  No navigation menu

STATES WITHIN S1
─────────────────
  Selector changed         price card updates immediately
                           no page reload — client-side filter
  Data loading             price card shows skeleton
                           no spinner, no loading text
  Freshness threshold      if last report > 24h ago
                           freshness label turns amber
                           "last report 2 days ago"
```

---

## Screen S2 — Price Lookup (Insufficient Data)

```
PURPOSE
───────
Show honestly that no validated price exists for this cell.
Show how close to the threshold the cell is.
Convert the absence of data into a contribution prompt.

┌──────────────────────────────────────┐
│                                      │
│  🌿 Waga                  EN · አማ   │
│                                      │
├──────────────────────────────────────┤
│                                      │
│  What are prices like today?         │
│  ዛሬ ዋጋዎች ምን ያህል ናቸው?               │
│                                      │
│  ┌───────────────────────────────┐   │
│  │ 🌾  Teff / ጤፍ               ▾ │   │
│  └───────────────────────────────┘   │
│                                      │
│  ┌───────────────────────────────┐   │
│  │ 📍  Shola                    ▾ │   │
│  └───────────────────────────────┘   │
│                                      │
│  ┌───────────────────────────────┐   │
│  │                               │   │
│  │  Not enough reports yet       │   │  ← status
│  │  በቂ ሪፖርቶች የሉም               │   │    both languages
│  │                               │   │
│  │  ────────────────────────     │   │
│  │                               │   │
│  │  1 of 3 reports needed        │   │  ← progress
│  │  in the last 72 hours         │   │
│  │                               │   │
│  │  ┌─────────────────────────┐  │   │
│  │  │  Be the first to add →  │  │   │  ← CTA
│  │  └─────────────────────────┘  │   │    same deep link
│  └───────────────────────────────┘   │
│                                      │
│  Prices from market visitors.        │
│  Validated. Never estimated.         │
│  About Waga Index                    │
│                                      │
└──────────────────────────────────────┘

DELTA FROM S1
─────────────
Price card replaced with    no-data card
  No price figure           nothing shown where price would be
  No range                  nothing to show
  Status line               "Not enough reports yet" bilingual
  Progress line             n of 3 reports needed / 72 hours
  CTA button                "Be the first to add →"
                            same Telegram deep link
                            same pre-population logic
  Card border               amber left border — not red, not grey
                            amber = incomplete, not broken

ZERO REPORTS STATE
──────────────────
  Progress line             "No reports yet in the last 72 hours"
  CTA                       "Start the count →"

DESIGN INTENT
─────────────
This screen is not an error.
It is the honest version of the product.
The gap count (1 of 3) is specific and motivating.
"Be the first to add" is an invitation, not a fallback.
The institutional evaluator who sees this screen
during a demonstration understands immediately
why the no-imputation rule has commercial value.
```

---

## Screen S3 — About

```
PURPOSE
───────
Establish credibility for the shopper who wants to know
where these prices come from.
Explain the no-imputation rule in plain language.
This is the page that earns trust — not markets it.

┌──────────────────────────────────────┐
│                                      │
│  🌿 Waga                  EN · አማ   │
│                                      │
├──────────────────────────────────────┤
│                                      │
│  About Waga Index                    │  ← section heading
│  ──────────────────                  │
│                                      │
│  Waga Index publishes real-time      │
│  price data from Ethiopia's          │
│  informal markets.                   │
│                                      │
│  Prices are reported by people       │
│  present in markets — shoppers       │
│  and traders — through Telegram.     │
│                                      │
│  ──────────────────                  │
│                                      │
│  How prices are validated            │  ← section heading
│  ──────────────────                  │
│                                      │
│  Every submission is checked         │
│  against recent reports from the     │
│  same market and against a           │
│  verified baseline.                  │
│                                      │
│  Outliers are flagged and excluded   │
│  from the published figure.          │
│  Excluded submissions are kept       │
│  and visible — never deleted.        │
│                                      │
│  ──────────────────                  │
│                                      │
│  What gaps mean                      │  ← section heading
│  ──────────────────                  │
│                                      │
│  A published price needs at least    │
│  3 validated reports in 72 hours.    │
│                                      │
│  Where that threshold is not met,    │
│  we show a gap — not an estimate.   │
│                                      │
│  A gap is honest information.        │
│  An estimate pretending to be a      │
│  price is not.                       │
│                                      │
│  ──────────────────                  │
│                                      │
│  ← Back to prices                    │  ← back link
│                                      │
└──────────────────────────────────────┘

ELEMENT DETAIL
──────────────
Layout              no cards, full bleed content
                    same header as all screens
Three sections      what / how validated / what gaps mean
Section dividers    light horizontal rule, not headings hierarchy
Tone                plain, direct, no marketing language
Back link           text link, no button style
No external links   self-contained — no footnotes, no citations
                    on the consumer-facing surface
Length              fits one mobile screen without scrolling
                    if copy grows, trim — do not scroll
```

---

## User Flow — Consumer Web App

```
┌─────────────────────────────────────────────────────────────────┐
│  ENTRY POINTS                                                   │
└─────────────────────────────────────────────────────────────────┘

Three ways a user arrives:

  A  QR code at demonstration
     └── lands on S1 with default commodity and market

  B  Shared link (e.g. WhatsApp, Telegram)
     └── lands on S1 with default commodity and market

  C  Telegram bot handoff (bot sends web link after submission)
     └── lands on S1 with the commodity just submitted pre-selected


┌─────────────────────────────────────────────────────────────────┐
│  PRIMARY FLOW — USER FINDS A PRICE AND REPORTS ONE              │
└─────────────────────────────────────────────────────────────────┘

  User arrives on S1
       │
       ├── Sees price for default commodity + market
       │
       ├── Changes commodity selector
       │        │
       │        └── Price card updates immediately (same screen)
       │
       ├── Changes market selector
       │        │
       │        └── Price card updates immediately (same screen)
       │
       ├── Reads: price / range / count / freshness
       │
       └── Taps "Report tomato price →"
                │
                └── Telegram opens
                         │
                         └── Bot pre-populated with
                             commodity + market
                                  │
                                  └── User sends price
                                           │
                                           └── Bot confirms
                                               with local context
                                                    │
                                                    └── LOOP CLOSES
                                                        user can
                                                        return to
                                                        web app


┌─────────────────────────────────────────────────────────────────┐
│  SECONDARY FLOW — USER HITS A GAP                               │
└─────────────────────────────────────────────────────────────────┘

  User selects commodity + market with insufficient data
       │
       └── S1 transitions to S2
                │
                ├── Sees: "Not enough reports yet"
                ├── Sees: n of 3 reports needed
                │
                └── Taps "Be the first to add →"
                         │
                         └── Same Telegram deep link
                                  │
                                  └── Same contribution flow
                                           │
                                           └── GAP CLOSES
                                               if enough
                                               contributors follow


┌─────────────────────────────────────────────────────────────────┐
│  TERTIARY FLOW — USER WANTS TO KNOW MORE                        │
└─────────────────────────────────────────────────────────────────┘

  User taps "About Waga Index" in footer
       │
       └── Navigates to S3
                │
                ├── Reads what / how / gaps
                │
                └── Taps "← Back to prices"
                         │
                         └── Returns to S1
                             previous commodity + market retained


┌─────────────────────────────────────────────────────────────────┐
│  LANGUAGE FLOW — USER SWITCHES LANGUAGE                         │
└─────────────────────────────────────────────────────────────────┘

  User taps EN · አማ toggle in header
       │
       ├── All content switches in place
       ├── No page reload
       ├── Commodity and market selection retained
       └── Language preference stored in localStorage
           persists for session


┌─────────────────────────────────────────────────────────────────┐
│  FLOW MAP                                                       │
└─────────────────────────────────────────────────────────────────┘

                         ┌──────────────────┐
            ─────────────│   S1             │◀──────────────────┐
           │             │   Price Lookup   │                   │
           │             │   Has Data       │                   │
           │             └──────────────────┘                   │
           │                    │  │                            │
           │         commodity  │  │  about link               │
           │         or market  │  │                            │
           │         changes to │  ▼                            │
           │         empty cell │  ┌──────────────────┐         │
           │                    │  │   S3             │         │
           │                    │  │   About          │─────────┘
           │                    │  └──────────────────┘  back link
           │                    │
           │                    ▼
           │             ┌──────────────────┐
           │             │   S2             │
           └─────────────│   Price Lookup   │
          cell gets      │   No Data        │
          enough         └──────────────────┘
          reports               │
                                │  report CTA
                                ▼
                         ┌──────────────────┐
                         │   Telegram Bot   │
                         │   (separate      │
                         │    surface)      │
                         └──────────────────┘
```

---

## What the Consumer Web App Does Not Do

```
┌─────────────────────────────────────────────────────────────────┐
│  EXPLICITLY OUT OF SCOPE — CONSUMER WEB APP                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Price history chart          dashboard only                    │
│  Cross-market comparison      dashboard only                    │
│  Fair-price assessment        roadmap                           │
│  Contributor account          no accounts on web app            │
│  Contribution history         Telegram /mystats only            │
│  Leaderboards or streaks      roadmap                           │
│  PWA installation prompt      deferred                          │
│  Offline price cache          deferred                          │
│  Push notifications           deferred                          │
│  Authentication of any kind   none — fully public               │
│  Payment or points display    prohibited in MVP                 │
│  Price forecasting            out of scope permanently          │
│  Imputation or estimates      out of scope permanently          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Design Constraints — Consumer Web App

```
┌─────────────────────────────────────────────────────────────────┐
│  CONSTRAINT                   VALUE          REASON             │
├─────────────────────────────────────────────────────────────────┤
│  Page weight                  < 200KB        loads on 3G        │
│  Time to interactive          < 4s on 3G     user is in market  │
│  Authentication               none           zero friction      │
│  Installation required        none           web only           │
│  Languages                    2              Amharic + English  │
│  Screens                      3              MVP scope          │
│  Commodities                  5              MVP constants       │
│  Markets                      2              MVP constants       │
│  Monetary language            none           prohibited F4      │
│  Imputation shown             never          core rule          │
│  Gaps shown                   always         core rule          │
└─────────────────────────────────────────────────────────────────┘
```