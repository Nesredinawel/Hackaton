Table of Contents


WAGA INDEX — Technical Requirements
MVP build specification · v1 Companion to the Strategy Pack v2. Part II of that document defines what is built; this defines how.

1. Build constants
Frozen before development begins. Changes require team-wide agreement.
Constant
Value
Markets
2
Commodities
5
Market-commodity cells
10
Publication threshold
3 validated submissions per cell
Rolling window
72 hours
Contributor response SLA
< 3s p95 (budget within the 10s user-perceived target)
Submission-to-dashboard SLA
< 60s
Activation target
40 distinct contributors
Languages
Amharic, English (Latin transliteration accepted)


2. Architecture
One service. One database. No queues, no schedulers, no microservices, no container orchestration.
Telegram  ──▶  Bot handler ──┐
                             ├──▶  Normalisation ──▶ Validation ──▶ Postgres (append-only)
Web (read) ◀── FastAPI    ──┘                                            │
                                                                    on write
                                                                         ▼
                                                                 Index recomputation
                                                                  (affected cell only)
Rules of the architecture:
Submissions are append-only. A submission row is never updated or deleted. Validation outcomes are written to a separate table referencing it.
Index values are derived and recomputable. Deleting the entire index table and rebuilding from submissions must reproduce identical results. This is the property that makes the dataset auditable, and auditability is the product.
Index recomputation is triggered on write, scoped to the affected market-commodity cell only. No cron, no background workers.
The LLM is never in the synchronous response path. See §6.

3. Stack
Layer
Choice
Notes
Bot
Python 3.11 + aiogram 3
Async, same runtime as pipeline
API
FastAPI + uvicorn
Serves both web surfaces
Database
PostgreSQL 15
Single instance
Migrations
Alembic
Schema is frozen before feature work; migrations exist for discipline
Dashboard
Next.js + Recharts
Static export acceptable
Consumer page
Same Next.js app, separate route
Read-only
LLM (ambiguous only)
Any low-cost fast-tier model behind a single interface
Swappable. Every call logged with token cost.
Hosting
Single VM, EU region (Frankfurt)
Lower latency to Ethiopia than US regions
Secrets
Environment variables
No secrets manager

Not in this build: Redis, Celery, Kubernetes, vector database, RAG, custom model training, native mobile app, message queue.

4. Data model
4.1 Reference tables
CREATE TABLE markets (
  id            SMALLSERIAL PRIMARY KEY,
  code          TEXT UNIQUE NOT NULL,        -- 'merkato'
  name_en       TEXT NOT NULL,
  name_am       TEXT NOT NULL,
  lat           NUMERIC(9,6),
  lon           NUMERIC(9,6)
);

CREATE TABLE commodities (
  id            SMALLSERIAL PRIMARY KEY,
  code          TEXT UNIQUE NOT NULL,        -- 'tomato'
  name_en       TEXT NOT NULL,
  name_am       TEXT NOT NULL,
  canonical_unit TEXT NOT NULL,              -- 'kg'
  allow_conversion BOOLEAN NOT NULL DEFAULT TRUE
);

-- Hand-authored. The single highest-leverage table in the build.
CREATE TABLE commodity_synonyms (
  id            SERIAL PRIMARY KEY,
  commodity_id  SMALLINT NOT NULL REFERENCES commodities(id),
  surface       TEXT NOT NULL,               -- as typed
  normalised    TEXT NOT NULL,               -- after §5.1 canonicalisation
  script        TEXT NOT NULL CHECK (script IN ('ethiopic','latin','english')),
  UNIQUE (normalised, script)
);
CREATE INDEX ON commodity_synonyms (normalised);

CREATE TABLE unit_conversions (
  from_unit     TEXT NOT NULL,
  to_unit       TEXT NOT NULL,
  factor        NUMERIC NOT NULL,
  commodity_id  SMALLINT REFERENCES commodities(id),  -- NULL = universal
  PRIMARY KEY (from_unit, to_unit, commodity_id)
);
Unit note. Universal conversions (kg↔quintal, kg↔gram) are commodity-independent. Pile, bunch, and heap units are not convertible and must not be forced into kg — a fabricated conversion factor is imputation in disguise. For pile-priced commodities, set allow_conversion = FALSE and record the unit as observed; these submissions form a separate series.
4.2 Contributors
CREATE TABLE contributors (
  id                BIGSERIAL PRIMARY KEY,
  telegram_user_id  BIGINT UNIQUE NOT NULL,
  first_seen_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  consent_version   TEXT,
  consent_at        TIMESTAMPTZ,
  kind              TEXT NOT NULL DEFAULT 'user'
                    CHECK (kind IN ('user','agent','team'))
);
Anchor agents are ordinary Telegram users flagged kind = 'agent'. No separate agent application exists in this build.
4.3 Submissions — append-only
CREATE TABLE submissions (
  id                BIGSERIAL PRIMARY KEY,
  contributor_id    BIGINT REFERENCES contributors(id),
  received_at       TIMESTAMPTZ NOT NULL DEFAULT now(),

  raw_text          TEXT NOT NULL,           -- exactly as received
  raw_language      TEXT,

  -- parse output (NULL if unparsed)
  commodity_id      SMALLINT REFERENCES commodities(id),
  market_id         SMALLINT REFERENCES markets(id),
  price_raw         NUMERIC,
  unit_raw          TEXT,
  price_canonical   NUMERIC,                 -- converted to canonical unit
  unit_canonical    TEXT,

  parse_status      TEXT NOT NULL
                    CHECK (parse_status IN ('parsed','ambiguous','unparsed')),
  parse_method      TEXT NOT NULL
                    CHECK (parse_method IN ('dictionary','fuzzy','llm','structured')),

  source            TEXT NOT NULL
                    CHECK (source IN ('user','agent','scraped','seed')),
  licence_class     TEXT NOT NULL DEFAULT 'internal_only'
                    CHECK (licence_class IN ('commercial_permitted','internal_only','display_only'))
);
CREATE INDEX ON submissions (market_id, commodity_id, received_at DESC);
licence_class defaults to the most restrictive value. A record without an explicit commercial grant never leaves the system in a paid extract. This field costs nothing now and cannot be reconstructed later.
4.4 Validation outcomes
CREATE TABLE submission_validations (
  submission_id   BIGINT PRIMARY KEY REFERENCES submissions(id),
  validated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  outcome         TEXT NOT NULL CHECK (outcome IN ('accepted','flagged','pending')),
  rule_id         TEXT,                      -- 'R2_IQR_OUTLIER'
  reason_en       TEXT,
  reason_am       TEXT,
  reference_low   NUMERIC,
  reference_high  NUMERIC,
  llm_used        BOOLEAN NOT NULL DEFAULT FALSE,
  llm_cost_usd    NUMERIC(10,6)
);
llm_cost_usd is not optional. Cost per validated observation is the metric that determines whether this is a business; it must be measurable from day one, not reconstructed from an invoice.
4.5 Derived index
CREATE TABLE index_values (
  market_id        SMALLINT NOT NULL REFERENCES markets(id),
  commodity_id     SMALLINT NOT NULL REFERENCES commodities(id),
  computed_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  window_start     TIMESTAMPTZ NOT NULL,
  window_end       TIMESTAMPTZ NOT NULL,
  value            NUMERIC,                  -- NULL when below threshold
  unit             TEXT NOT NULL,
  n_submissions    INT NOT NULL,
  n_contributors   INT NOT NULL,
  source_mix       JSONB NOT NULL,           -- {"user":4,"agent":1}
  status           TEXT NOT NULL
                   CHECK (status IN ('published','insufficient_data')),
  PRIMARY KEY (market_id, commodity_id, computed_at)
);
Fully rebuildable from submissions + submission_validations. A rebuild script must exist and must be run once before demonstration.
4.6 Rate limiting
CREATE TABLE rate_limit_events (
  id              BIGSERIAL PRIMARY KEY,
  contributor_id  BIGINT NOT NULL REFERENCES contributors(id),
  market_id       SMALLINT,
  commodity_id    SMALLINT,
  occurred_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  limit_rule      TEXT NOT NULL
);
Rejections are counted, not silently dropped. The rejection count is the abuse-control evidence at demonstration.

5. Normalisation pipeline
Stages run in order. Each stage’s output is recorded so a parse can be explained.
5.1 Ethiopic canonicalisation — mandatory, runs first
Ethiopic script contains homophone characters used interchangeably by fluent writers. The same commodity is spelled several valid ways. Fold each class to a single representative before any matching:
Class
Fold to
ሀ ሃ ኀ ኃ ሐ ሓ
ሀ
ሰ ሠ
ሰ
ጸ ፀ
ጸ
አ ዐ ኣ ዓ
አ
ጻ ፃ
ጻ

Additionally: strip Ethiopic punctuation (፡ ። ፣), normalise Unicode to NFC, collapse whitespace, lowercase Latin text.
Omitting this stage causes silent misses on genuine submissions — the most expensive failure mode in the system, because it looks like low contribution rather than a bug.
5.2 Tokenisation and number extraction
Handle all of: 80, 80 birr, 80ብር, 80/kg, ሰማንያ ብር (number as Amharic word), Ethiopic numerals (፹). Maintain a spelled-number lookup for 1–1000 in Amharic; beyond that, digits only.
5.3 Commodity resolution
Exact match on commodity_synonyms.normalised → parse_method = 'dictionary'
Fuzzy match, Levenshtein ratio ≥ 0.85 on the canonicalised form → 'fuzzy'
No match → parse_status = 'ambiguous', queued for §6
Latin transliteration is unstandardised (timatim, tmatm, timatem). Fuzzy matching over the canonicalised form covers this; do not attempt exact matching on Latin input.
5.4 Unit resolution and conversion
Resolve unit token against unit_conversions. If the commodity has allow_conversion = FALSE, retain the observed unit and skip conversion. If no unit is stated, apply the commodity default and record that a default was applied.
5.5 Market resolution
Inline keyboard selection is authoritative. Free-text market names are matched against markets but always confirmed via keyboard before acceptance.
Target: ≥ 90% of submissions resolved without an LLM call. Track this ratio. If it does not improve as the synonym table matures, the table is wrong, not the matcher.

6. Validation rules
Applied in order. First failure determines outcome. Every rule has a stable rule_id and a human-readable reason in both languages.
ID
Rule
Action on failure
R1
Price > 0 and within absolute commodity bounds (config)
flagged
R2
Within 2.5 × IQR of validated submissions for the same cell over the trailing 7 days
flagged, contributor prompted to confirm
R3
Within ±60% of the day-zero baseline (F14) where no local history exists
flagged
R4
Rate limit: max N submissions per contributor per cell per day
rejected, logged to rate_limit_events
R5
Duplicate: identical price from same contributor and cell within 6 hours
flagged as duplicate

Confirmation loop. An R2 or R3 failure prompts the contributor once: “This is higher/lower than recent reports. Confirm?” A confirmed submission is stored with outcome = 'flagged' and a confirmation note — retained, visible, and excluded from the index. Confirmation is evidence for review, not an override.
LLM usage — strictly bounded. Invoked only when parse_status = 'ambiguous', only asynchronously after the contributor has already received a response, and only to propose a commodity-unit interpretation for human review. It never accepts or rejects a price. Cost is logged per call.
Rationale: a validator whose decisions cannot be explained to a statistician is not a validation system. “Outside 2.5 × IQR of the trailing local window” is an answer. “The model judged it implausible” is not.

7. Index computation
Triggered on every accepted write, scoped to the affected cell.
Select validated submissions for the cell where received_at > now() - 72h and outcome = 'accepted'.
If count < 3 → write status = 'insufficient_data', value = NULL. Stop. No estimation, no interpolation, no carry-forward.
Otherwise compute the weighted median:
Factor
Weight
Source: agent
2.0
Source: user
1.0
Source: scraped / seed
0.5
Recency: linear decay across the 72h window
×0.5 → ×1.0

Weights are configuration constants, stored in version control, not tuned during the build.
Write a new index_values row. Never update an existing one — history is append-only.

8. Internal API
Consumed by both web surfaces. Not documented publicly, not offered as a product.
Method
Path
Returns
GET
/api/price?market&commodity
current value, unit, n, freshness, status, source_mix
GET
/api/series?market&commodity&from&to
time series with per-point n
GET
/api/compare?commodity&date
all markets for one commodity
GET
/api/coverage
submissions, cells at threshold, pass rate, source mix, activated contributors
GET
/api/feed?limit
recent submissions incl. flagged with reasons
GET
/api/export?commodities&markets&from&to
CSV, filtered by licence_class

Every response containing a price value must include n_submissions, status, and source_mix. A price returned without its supporting count is a defect.

9. Bot specification
Command
Behaviour
/start
One-line explanation, one example, consent statement, language selection
/submit
Structured flow with inline keyboards
free text
timatim 80 → parse → market keyboard → confirm
/terms
Full consent text, both languages
/mystats
Submission count only. No leaderboard in this build.

Response content on success: confirmation, current local range, supporting submission count, freshness. No monetary or points claim is made under any circumstance.

10. Non-functional requirements
Requirement
Target
Contributor response
< 3s p95
Submission → dashboard
< 60s
Dashboard first paint on 3G
< 4s
Consumer page weight
< 200KB
Bot availability during demo window
100%
Database backup
pg_dump before demonstration; local seeded instance as contingency
Personal data stored
Telegram user ID only. No names, no phone numbers, no location.


11. Workstreams — 5 people
#
Workstream
Owner
Deliverable
1
Bot
1 eng
Handlers, keyboards, conversation flow, rate limiting
2
Pipeline
1 eng
Canonicalisation, parsing, validation, index computation
3
Backend
1 eng
Schema, API, instrumentation, deployment
4
Web
1 eng
Dashboard (3 views + coverage + feed + export), consumer page
5
Data & recruitment
1 person, writes no code
Day-zero capture, synonym table, contributor recruitment, demonstration preparation

Workstream 5 determines how much authentic data exists at demonstration. It is not a part-time role for whoever finishes first. Code can be recovered by working longer; contributors cannot.

12. Sequencing
Order of work, not a calendar. Each stage is a dependency of the next.
Stage
Milestone
0
Schema frozen and migrated. API contract agreed. Day-zero market capture executed and loaded. Synonym table v1 authored.
1
Bot accepts and stores a submission end to end. API returns a price.
2
Normalisation and validation live. Index computes. Contributor recruitment begins.
3
Dashboard renders all three views plus coverage. Consumer page returns a price.
4
Export, submissions feed, rate limiting, flagged-reason display.
5
Feature freeze. Full rebuild-from-submissions test. Backup and locally seeded instance prepared.
6
Rehearsal. Three full end-to-end runs on the target network.

Stage 0 market capture is a hard dependency and cannot be deferred: rule R3 has no reference data before it exists, and the validator is the centrepiece of the demonstration.
13. Definition of done
☐
Criterion
☐
An unfamiliar user completes a submission in under 30s with no instruction beyond /start
☐
Submission appears on dashboard within 60s
☐
A deliberately implausible price is flagged, given a stated reason, and visibly excluded
☐
At least 6 of 10 cells meet the 3-submission threshold on authentic data
☐
Source and licence class visible on every record
☐
Multi-commodity export includes counts, source mix, methodology note; insufficient-data rows present and marked
☐
Consumer page returns a price on a phone over mobile data
☐
One-tap handoff opens the bot pre-populated
☐
Activation count queryable in real time
☐
Index rebuilt from scratch reproduces identical values
☐
Cost per validated observation is queryable
☐
Full demo path executed on venue network three times
☐
Recorded demo and locally seeded instance available


14. Demonstration script
Evaluator scans QR, sends timatim 80 from their own phone.
Bot replies with confirmation, local range, supporting count — under three seconds.
Dashboard is refreshed; the value is in the Merkato series with n incremented.
Evaluator sends an implausible price. Bot prompts for confirmation; evaluator confirms.
Submissions feed shows the entry flagged with rule ID and reason. Index is unchanged.
Coverage panel shows cells at threshold and validation pass rate.
Export produced live, opened in a spreadsheet, insufficient-data rows pointed out deliberately.
Step 7 is the argument, not an admission. Showing a gap as a gap is the credibility claim.

15. Explicitly not in this build
Native app · PWA installation and offline cache · identity linking · leaderboards and streaks · fair-price assessment · receipt OCR · USSD/SMS · IVR · scheduled jobs · public API · authentication · contributor accuracy scoring · imputation of any kind · payments · languages beyond Amharic and English.
Voice submission is a feature-flagged build item — see §16. Contributor accuracy scoring is deferred but pre-enabled — see §17. Institutional basket products are specified in §18. The full non-goals list is §19.2. Constants for a compressed build window are given in §20.

16. Voice submission (feature-flagged)
Status: in scope, behind FEATURE_VOICE. Single owner, tightly bounded capacity. Must not touch the text path. If it is not solid at feature freeze, the flag goes off and it becomes a roadmap item — a contained loss rather than a compromised release.
16.1 Why it matters
A text-only bot silently selects for contributors who are literate, comfortable typing Ethiopic on a phone, and urban. That is not the population standing in a market knowing what tomatoes sold for this morning. Voice removes the largest filter on the contributor pool, and the contributor pool is the moat.
It is also the most defensible differentiator available. A Telegram bot can be copied in a weekend; an Amharic and Afaan Oromo speech pipeline tuned to market phrasing cannot.
16.2 Flow
voice note → download OGG via file_id → STT → transcript
   → §5 normalisation, unchanged
   → MANDATORY read-back confirmation
   → store
The transcript enters the existing pipeline at §5.1. No parallel parsing path exists. §5.2 already handles Amharic spelled numbers, which is required here because ASR returns “ሰማንያ”, not “80”.
16.3 The failure mode this must defend against
The entire payload is a number, and numbers are among the worst-performing tokens in any ASR system. Published word-level accuracy figures do not transfer to digits.
A voice error is silent and in-range: “80” heard as “18” is a plausible tomato price. R2 passes it, R3 passes it, and it enters the index as a genuine observation. Text errors produce either a parse failure or an obvious outlier; voice errors produce quiet wrongness, which is the only error class the validator is structurally blind to.
Therefore read-back confirmation is mandatory and non-skippable:
🎙️ “ቲማቲም 80 ብር — መርካቶ” — is that correct? [✅ Yes] [❌ No]
This converts a silent error into a caught one. It also demonstrates better than text: the system hears, shows what it heard, and asks.
16.4 Schema
ALTER TABLE submissions
  ADD COLUMN input_mode     TEXT NOT NULL DEFAULT 'text'
             CHECK (input_mode IN ('text','voice','structured')),
  ADD COLUMN transcript     TEXT,
  ADD COLUMN asr_vendor     TEXT,
  ADD COLUMN asr_confidence NUMERIC,
  ADD COLUMN asr_cost_usd   NUMERIC(10,6),
  ADD COLUMN confirmed_at   TIMESTAMPTZ;
asr_cost_usd is required for the same reason as llm_cost_usd: voice is billed per minute and will be the largest per-observation cost in the system. Whether voice is affordable at scale is answerable only if it is logged from the first commit.
16.5 Rules
ID
Rule
R6
A voice submission without confirmed_at is pending and never reaches the index
R7
Voice rate limit, tighter than text — each call has a marginal cost
R8
STT timeout 8s; on timeout or failure, ask the contributor to type. Voice is never the only route in.

16.6 Vendor abstraction
def transcribe(audio: bytes, lang: str) -> tuple[str, float]:  # (text, confidence)
Addis AI is the implementation, not the architecture. They are a 2024-founded company; the interface exists so the vendor can be swapped or self-hosted without touching the pipeline.
Benchmark before committing: run the day-one market capture audio through STT and measure number accuracy specifically, not word accuracy. That figure decides whether this ships.
16.7 Consent and audio retention
Voice is biometric-adjacent. A voiceprint is materially more sensitive than a Telegram user identifier, and the F13 price-data consent does not cover it.
A separate voice consent, distinct from the price-data consent.
Default: retain the transcript, discard the audio after successful parse.
Audio retention only on explicit opt-in.
Note for the roadmap, not for this build: consented, labelled Amharic and Afaan Oromo market-speech audio is itself a scarce asset. No such corpus exists. That is a potential second data product and a basis for partnership with a speech vendor rather than a purchase from one. The requirement here is only to avoid foreclosing it — do not retain audio without permission, and do not discard the option by design.

17. Contributor accuracy scoring (deferred, pre-enabled)
Status: not built in v1. Cold-start-blocked — scoring requires repeat submissions and agent-matched pairs, neither of which exists at demonstration. This section exists so that nothing built now forecloses it.
17.1 The design that must be avoided
The intuitive approach — score contributors by agreement with the published index, weight accordingly — destroys the product.
It converges on consensus rather than truth. If agreement with the current index raises a contributor’s score, the person who correctly reports a genuine 40% spike on the morning it occurs is penalised for being an outlier. The system becomes a machine for suppressing exactly the signal being sold.
If scores ever touch payment, it produces herding. Contributors stop reporting what they paid and begin reporting what they expect to score well — a safe number near the last published value. The result is data that is smooth, plausible, and worthless, and the degradation is not detectable from inside the system.
17.2 The correct reference
Score against the anchor agent series, never against the crowd or the index.
Agents walk fixed routes, log an identical basket, on a known schedule, under supervision. A contributor’s score is agreement with agent observations in the same cell within a tight time window. This breaks the circularity: when a price genuinely moves, the agent observes it too, so the fast and correct contributor is rewarded rather than punished.
Consequence: contributor scoring only functions in cells agents actually visit. Agent coverage should therefore be deliberate and rotating rather than concentrated on the largest markets. Agents are not only collecting data — they are calibrating the crowd.
17.3 Shape
CREATE TABLE contributor_scores (
  contributor_id   BIGINT REFERENCES contributors(id),
  computed_at      TIMESTAMPTZ NOT NULL,
  n_scoreable      INT NOT NULL,      -- submissions matched to an agent observation
  median_abs_dev   NUMERIC,           -- % deviation from agent price
  weight           NUMERIC NOT NULL,  -- value consumed by index computation
  method_version   TEXT NOT NULL,
  PRIMARY KEY (contributor_id, computed_at)
);
Design constraints, which matter more than the formula:
Everyone begins at 1.0. New contributors are never penalised for being new; doing so would strangle acquisition.
Shrink toward 1.0 at low n. Three scoreable submissions establish almost nothing. Apply Bayesian shrinkage, or cap movement below roughly ten observations.
Bound the range, approximately 0.3–2.0. No contributor should dominate a cell; none should be silently zeroed.
Version the method and retain score history. Never overwrite. Same principle as the index: recomputable, auditable, explainable to a statistician.
A score is a weight, not a verdict. Low-scoring submissions still enter the dataset with full provenance. Down-weighting, not censoring.
17.4 What contributors see
Not the accuracy score. It is demoralising, and visibility invites gaming.
Contributors see social comparison — submission count, streak, standing within their market — consistent with the FPCA finding that social norms increased submissions while information disclosure did not. Accuracy weighting remains internal and is disclosed in the methodology note that institutions read.
If contributors are eventually paid, payment is on verified volume gated by a minimum reliability floor, never proportional to an accuracy score. Proportional payment reintroduces the herding incentive with a badge attached.
17.5 What must be true now for this to be buildable later
Both are already required elsewhere in this specification; they are restated because scoring is the reason they matter most:
Submissions remain append-only. Scores are computed from raw history.
The index remains recomputable from raw. Reweighted history must be reproducible end to end.
One addition to make now: agent submissions must carry a precise timestamp and route tag, so agent-contributor pairs can be matched retroactively without guesswork.
Satisfy these and the entire scoring layer can be backfilled across all accumulated history on the day it is built. Violate them and scoring begins from the date the omission is noticed.

18. Institutional data products (v2 — design now, build later)
Not built in v1. Specified here because v1 schema decisions determine whether these are cheap or impossible later.
18.1 Basket definitions
The primary institutional product is not a price series. It is a costed basket — a named set of commodities, quantities, and units, priced at a given market on a given date. Humanitarian cash programmes construct a Minimum Expenditure Basket and use it to set household transfer values; the basket, not the individual price, is the unit of purchase.
CREATE TABLE basket_definitions (
  id            SERIAL PRIMARY KEY,
  code          TEXT UNIQUE NOT NULL,     -- 'eth_meb_food_2026'
  owner         TEXT NOT NULL,            -- issuing body
  version       TEXT NOT NULL,
  effective_from DATE NOT NULL,
  effective_to  DATE
);

CREATE TABLE basket_items (
  basket_id     INT REFERENCES basket_definitions(id),
  commodity_id  SMALLINT REFERENCES commodities(id),
  quantity      NUMERIC NOT NULL,
  unit          TEXT NOT NULL,
  PRIMARY KEY (basket_id, commodity_id)
);
Commodity selection is a commercial decision, not an analytical one. The v1 commodity list should be chosen to match the operative MEB food basket — same items, same units — so that output is a drop-in input to a calculation the customer already performs, rather than a dataset requiring interpretation.
18.2 Costing rules
A basket is costed only from published cell values. Where a component commodity is insufficient_data, the basket is returned as partially costed, with the missing components enumerated and a coverage ratio attached. It is never completed by substitution, carry-forward, or estimate.
A partially costed basket with explicit gaps is usable by an institution. A silently completed basket is not, because it cannot be defended to an auditor.
18.3 Endpoint surface
Method
Path
Returns
GET
/api/basket?definition&market&date
costed basket, per-item coverage, coverage ratio
GET
/api/basket/history?definition&market&from&to
costed series across revision cycles
GET
/api/coverage?market&from&to
cells at threshold, cells insufficient, contributor counts
POST
/api/alerts
threshold-breach notification against a basket definition

Coverage and confidence metadata are first-class response fields, not diagnostics. The recurring institutional question is which of these figures are thin, and answering it is the commercial function of the no-imputation rule.
18.4 Access control
v2 introduces authentication, per-customer scoping, and usage metering. v1 deliberately has none. The constraint v1 must respect is that licence_class filtering already exists at the record level (§4.3), so commercial scoping is a query predicate rather than a migration.

19. Build order and explicit non-goals
19.1 Build in this order
Schema and provenance fields. Cheapest now, unrecoverable later: licence_class, consent record, precise agent timestamps and route tags, append-only submissions.
Day-zero market capture. Hard dependency of the validator (R3).
Bot → parse → store → index → read API. The spine. Nothing else functions without it.
Validation and flagged-reason display. The demonstration centrepiece.
Export with coverage metadata. The artefact institutions actually use.
Dashboard. Sells and demonstrates; does not replace the export.
Consumer read-only page. Acquisition surface.
Voice, feature-flagged. §16.
19.2 Do not build
Not building
Reason
Consumer native mobile application
Adds install friction to the acquisition funnel with no functional gain. A mobile web page is sufficient.
Price forecasting or predictive modelling
History is too short to defend out-of-sample against a naive last-value baseline. Forecasts invite the one question that cannot be answered.
Vector database / RAG
There is nothing to retrieve.
Custom model training
The parsing problem is a lookup table with fuzzy matching.
Microservices, Kubernetes, message queues
One service, one database, computation on write.
Public API in v1
The dashboard consumes an internal endpoint. An API is purchased by organisations that already trust the numbers; offering one first inverts the order of trust.
Imputation, interpolation, carry-forward, substitution
Any of these renders the dataset undefendable to an auditor and destroys the institutional value proposition.
Payment or points redemption of any kind
An unpriced liability, a probable regulatory question, and it invalidates the retention experiment currently under test.
Contributor accuracy scores shown to contributors
Demoralising and gameable. Weighting stays internal, disclosed in the methodology note.

19.3 The agent field application (v2, when built)
If exactly one mobile application is ever built, it is this one — not the consumer app.
Anchor agents work in markets with poor connectivity against a fixed basket on a fixed route. Requirements: offline capture with deferred sync, route and basket pre-loaded, precise timestamps captured at observation rather than at sync, and photographic evidence optional per observation. This is what allows anchor capture to scale beyond operators personally known to the team, and anchor capture is what makes contributor accuracy weighting (§17) possible at all.
The consumer application is marketing. The agent application is capability.

20. Compressed build variant
Where the available window is materially shorter than assumed elsewhere in this document, the specification does not change — the constants change. Nothing in §4 (schema), §5.1 (canonicalisation), §6 (validation rules), or §19.2 (non-goals) is negotiable regardless of window, because each is either cheap now and unrecoverable later, or is itself the thing being demonstrated.
20.1 Constants under compression
Constant
Standard
Compressed
Markets
2
2
Commodities
5
3
Cells
10
6
Activation target
40 contributors
15 contributors
Voice (§16)
feature-flagged, in scope
off — roadmap only
Consumer page
read-only lookup
single price view, no comparison
Export
full curated slice
fixed CSV, one basket, no date picker

Contributor count is the constant that must fall furthest. Recruitment cannot be compressed by working longer; it is bounded by how many humans can be reached, and that is a function of elapsed time rather than effort.
20.2 What is built regardless of window
The demonstration argument requires exactly five things to be true. Everything else is optional.
A submission arrives from an unfamiliar person’s own device and is stored.
It is normalised across script and unit and reaches the published value.
An implausible submission is flagged, given a stated reason, and visibly excluded.
At least one cell is below threshold and displays insufficient-data.
Source and licence class are visible on every record.
Items 3 and 4 are the argument. Item 4 in particular must be presented deliberately rather than apologised for: the visible gap is the claim, because a competitor’s dashboard has no gaps only because it estimates them away.
20.3 Pre-work, not build-work
The following are performed before development begins and are not engineering tasks:
Day-zero market capture (§4, R3 dependency)
Synonym table for the reduced commodity list
Market and commodity lists frozen
Contributor recruitment channels prepared and messaging drafted
A compressed window does not shorten these. It only means they must already be finished when the window opens.

