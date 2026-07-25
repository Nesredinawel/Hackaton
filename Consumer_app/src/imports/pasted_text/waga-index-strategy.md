Waga Index
Concept, Product Scope, and Commercial Strategy
Table of Contents


Waga Index
Concept, Product Scope, and Commercial Strategy
Document type
Consolidated strategy and product pack
Version
v2
Supersedes
Hackathon submission v1; MVP PRD Draft v3 Section 2
Status
Working draft

Real-time, market-level price data for Ethiopia’s informal markets.

Part I — Concept
1. The problem
Most Ethiopian households buy their food in informal markets, and no one records what those prices actually are.
Official statistics are not absent — the Ethiopian Statistical Service publishes a Consumer Price Index every month. But the CPI is built to answer a different question. It reports an index rather than price levels, at regional and national aggregation rather than by market, on a monthly cadence rather than daily. It is the right instrument for measuring inflation and the wrong one for answering a household question.
None of these are failures of the CPI. They are simply outside what a national index is designed to do:
Tomatoes sold for 80 birr in Addis Ababa and 120 in Adama on the same morning — and nothing in the official series can show that spread, because the spread is exactly what aggregation removes.
A family budgets against a number describing last month, nationally.
A small trader sets prices by rumour, because rumour is the only same-day information available.
A researcher studies an economy visible only in aggregate and in arrears.
The gap is not accuracy. It is granularity and frequency. That gap is what Waga Index fills, and it sits beside official statistics rather than in competition with them.
2. What we are building
A live price index for Ethiopia’s informal markets, assembled from three streams and published with its provenance attached.
Contribution. Anyone can send a price to a Telegram bot in about five seconds — timatim 80 — in Amharic or English, free text or structured. No app install, no account, no data cost beyond a message. Telegram is already on the phone.
Anchor capture. Trained field agents walk fixed routes through major markets on a set schedule, logging an identical basket each time. This is the spine: a known-quality series that the crowd can be checked against, and the mechanism that makes anonymous submissions statistically usable rather than merely numerous.
Baseline ingestion. Publicly listed prices and partner data, used to seed the validator and fill display context. This stream is labelled as such and never presented as contributed data.
Anchor agent tooling and receipt capture are roadmap items. The current build performs anchor capture manually.
3. How a raw submission becomes a published price
Raw submissions are messy in predictable ways. One person writes timatim, another writes tomato, another types it in Latin script. One quotes per kilo, the next per pile. Machine handling of that variation is the difference between a research project and a product.
Normalisation. Commodity synonyms are resolved across Amharic, English, and transliterated forms. Units convert to a canonical unit per commodity. Input that cannot be parsed is retained as pending, never discarded — unparsed submissions are training data, not waste.
Validation before publication. Each new price is checked against recent submissions from the same market and against the anchor series. Range rules run on every submission; a language model assesses plausibility only for genuinely ambiguous cases, and never inside the contributor’s response path. Whether a number is a fat-fingered typo or a trader attempting to move the index, it is flagged before it reaches the public feed.
Flagged is not deleted. Excluded submissions are retained with their rejection reason and are visible in the interface. A validator whose decisions cannot be inspected is an assertion, not a control.
No imputation. Where a market-commodity pair has too few validated submissions, the index reports insufficient data. It does not estimate, interpolate, or fill. This is a deliberate constraint and the most important one in the system: an institution can only build on our numbers if every published figure is traceable to observations that actually occurred. A dataset that silently mixes measurement with estimation is unusable for exactly the buyers who would otherwise pay for it. Gaps close by extending coverage, not by modelling over them.
Provenance on every record. Each price carries its source — contributor, agent, ingested, seed — visible in the interface and attached to every export, together with the supporting submission count and a confidence indicator.
4. What comes out
For shoppers. A price lookup on any phone: what a commodity is going for in the nearest market today, how fresh that figure is, and how many submissions support it. Enter a quoted price and see where it sits against the local range. Free, permanently.
For institutions. Granular, high-frequency price data that no current source produces in Ethiopia: a defined slice across commodities, markets, and dates, exported with submission counts, source composition, confidence indicators, and a methodology note. Insufficient-data rows are marked, never omitted.
5. Why this works — the evidence
This model is not speculative. It has been built, run, and independently evaluated in Africa.
The European Commission’s Joint Research Centre launched the Food Price Crowdsourcing in Africa (FPCA) initiative in 2019, implemented with the International Institute of Tropical Agriculture in Nigeria and Wageningen University, piloting in northern Nigeria. Volunteers submitted staple prices daily through a mobile application over roughly three years. The resulting datasets are published in Scientific Data: submissions are validated in real time within spatio-temporal markets, then reweighted weekly using geo-location so the volunteer sample resembles a formal sample design, with results served on a dashboard updated twice daily. A subsequent evaluation compared the crowdsourced series against data collected concurrently by trained enumerators in the same region.
Two lessons from that body of work shape our design directly.
First, statistical treatment is the hard part, not collection. Volunteers are self-selected, anonymous, and of unknown individual reliability. Raw volunteer submissions are not a sample. The published FPCA methodology addresses this with real-time outlier detection followed by geographic reweighting toward a formal design. Our anchor-agent spine serves the same purpose by a different route — a known-quality reference series to weight and check the crowd against.
Second, sustaining participation is the binding constraint, and the intuitive lever does not work. Randomised trials on the Nigerian platform tested two approaches to keeping contributors active: social norms increased submissions; information disclosure did not.
That is a direct and useful correction to our own prior assumption. We had expected that returning local price context to a contributor — showing them what their neighbours are reporting — would itself drive repeat contribution. The evidence says information alone does not.
So we separate the two:
Price context earns the first submission. It is the immediate, legible reason to answer a stranger’s bot at all.
Social comparison earns the rest. Contribution standing, streaks, and market-level leaderboards are the retention layer, and they are on the roadmap as a first-class feature rather than a decoration.
We would rather design against a finding that contradicts us than repeat an assumption that has already been tested and failed.
Third, and specific to us: none of this work has been done in Ethiopia. FPCA ran in Nigeria. The World Bank’s Real-Time Prices programme covers data-scarce environments through AI imputation — a different method with different guarantees. Ethiopia has neither a crowdsourced market-level price series nor a domestic operator building one.
6. What makes this different
The first real-time, market-level price series for Ethiopia’s informal markets — a granularity and frequency that official statistics are not designed to provide.
A validated method, not an invented one. Crowdsourcing plus paid anchor agents has been implemented and peer-reviewed in Africa. We are adapting a documented approach, including its published failure modes, to a country where it has not been run.
Machine handling of what humans cannot do at volume — resolving multilingual and multi-orthographic submissions, converting inconsistent units, and screening every price against nearby and recent observations in real time. Applied to cleaning and verification; explicitly not to filling gaps.
Provenance as the product. Every figure carries its source, its supporting count, and its confidence. Gaps are published as gaps. This is what makes the dataset citable, and citability is what makes it saleable.

Part II — Product scope
Proposed replacement for MVP PRD Draft v3, Section 2.
The functionality required to validate the core proposition. No item is deferrable. Every item below is traceable to the hypothesis: that an individual at point of purchase will report a price, and that sufficient contributors exist to produce a defensible market-day value.
7. Build constants
Frozen before feature development begins and not revisited during the build.
Constant
Value
Seeded markets
2
Commodity basket
5
Market-commodity cells
10
Publication threshold
3 validated submissions per cell, rolling 72 hours
Activation target
40 distinct activated contributors

Coverage is deliberately narrow. The demonstration claim is depth of verified data in a small number of cells, not breadth of thinly-populated ones. Ten cells at threshold is a defensible index; seventy cells below threshold is an empty dashboard.
8. Requirements
ID
Requirement
Specification
F1
Telegram price submission
Submission in under ten seconds. Free text and structured input in Amharic and English. Market chosen via inline keyboard. No account creation; onboarding limited to /start, which carries the consent statement defined in F13.
F2
Submission normalisation
Commodity synonym resolution across Amharic, English, and transliterated forms. Unit conversion to canonical units per commodity. Unparseable input retained as pending, never discarded.
F3
Pre-publication validation
Range rules checked against recent local history and the day-zero baseline (F14). LLM plausibility assessment applied to ambiguous submissions only, and never in the synchronous response path. Outliers trigger a confirmation prompt. Flagged submissions retained and excluded from computation, not deleted.
F4
Immediate contributor response
Each submission confirmed with local price context: current range and supporting submission count. This is the acquisition mechanism and is under test. No monetary or points-redemption claim is made to contributors in this build.
F5
Market-day price computation
Weighted median of validated submissions over a rolling 72-hour window, subject to a three-submission minimum per commodity per market. Below threshold, an insufficient-data state is shown. No imputation.
F6
Institutional dashboard
Three views: price over time for a single market; cross-market comparison for a single commodity and date; coverage panel showing submissions, cells at threshold, validation pass rate, and source composition. A submissions feed shows flagged entries with rejection reasons. No authentication.
F7
Curated data extract
Definition and export of a data slice across commodities, markets, and a date range. Includes submission count, source composition, confidence indicator, and methodology note. Below-threshold rows marked insufficient-data, never omitted or estimated. Filtered by licence class per F8. CSV.
F8
Source and licence classification
Every record carries two independent fields. Source: user, agent, scraped, or seed — visible in the interface. Licence class: commercial-permitted, internal-only, or display-only — governing whether the record may leave the system in a commercial extract. Presenting scraped data as user contribution is not permissible under any circumstance. Absence of a classification is treated as internal-only.
F9
Instrumentation from initial commit
Each submission records source, licence class, market, parse outcome, validation result, and contributor identifier. The activation metric is only obtainable if captured at time of submission.
F10
Consumer price surface
Mobile-first read-only web page. Price lookup by commodity with freshness indicator and supporting submission count; nearest seeded market applied by default. Amharic and English. No authentication, no installation, no offline caching, no personalisation.
F11
Consumption-to-contribution handoff
Every price view presents a single-tap action opening the Telegram bot with commodity and market pre-populated. Static deep link; no session state, no identity association.
F12
Submission rate limiting
Configured maximum of submissions per Telegram identifier, per commodity, per market, per day. Rejections logged and counted; the rejection count is queryable. This is the abuse control claim for the demonstration.
F13
Contribution consent
A single-sentence statement in Amharic and English, presented at /start and retrievable via /terms, establishing that submitted prices may be published and used commercially in aggregated and anonymised form. Consent state and version recorded against the contributor identifier.
F14
Day-zero baseline
A hand-captured price set for all ten cells, collected at an operating market before validation goes live, loaded as seed. F3 has no functioning range rules before this exists; it is a dependency of the pipeline workstream, not a data-team convenience.

No scheduled processes exist in this build. All computation is triggered on write.
9. Removed from the build
Moved to the roadmap. Deferred rather than rejected.
Item
Reason
Installable PWA, offline cached prices
Distribution mechanism, not a test of contribution behaviour
Fair-price assessment
Consumer retention feature; does not bear on the hypothesis
Contribution history, streaks, leaderboards
Retention mechanics for a loop not yet demonstrated to exist. Note: FPCA evidence indicates this is the correct long-term retention lever, and it returns to the roadmap as a priority — but it cannot be validated in a seven-day window.
Deep-link identity linking
Sole purpose was to enable the three items above; removing them removes the cross-workstream dependency

Capacity released is reassigned to data, recruitment, and demonstration. This is the intended effect of the change, not a side effect.
10. Requirement-to-hypothesis trace
Requirement
Serves
F1, F2, F4, F11, F13
Will an individual submit a price?
F3, F5, F8, F12, F14
Is the resulting value defensible?
F6, F7, F10
Is the result legible to the eventual customer?
F9
Is any of the above measurable?

Any proposed addition must be placed in this table before it is accepted. Items that cannot be placed are out of scope by definition.

Part III — Commercial strategy
11. What we have actually built
A Telegram bot, a normalisation pipeline, a validator, and a dashboard. None of that is the business. A competent team could rebuild it in three weeks. Code is not the moat, and neither is the model layer.
Four assets accumulate, and they are the company:
A contributor network — humans in specific markets who submit reliably. Slow to build, slow to copy.
A provenance-clean dataset that compounds — every month of history increases its value and puts a new entrant a month further behind.
A method with a credibility story — validated, documented, citable. This is what allows an institution to put our number in a report bearing their name.
Institutional relationships — the least visible asset and probably the most valuable.
The demonstration proves the machine runs. The business is whether anyone pays for what comes out of it.
12. The question that decides everything
Not whether the data is valuable. Whose budget line does this replace, and how large is it?
Selling something new is difficult. Selling something an organisation already buys, faster and cheaper, is a normal transaction with an existing procurement process.
Market price monitoring in Ethiopia is performed today by enumerators with clipboards, funded by WFP, FAO, FEWS NET, the World Bank, IFPRI’s Ethiopia programme, the Agricultural Transformation Institute, and a range of NGOs. It is expensive, slow, geographically thin, and suspended precisely when access becomes difficult — which is when the data matters most.
We are not pitching innovation to these organisations. We are offering the same output, more often, in more places, at lower cost.
13. The wedge: sell collection before selling data
The entry product is commissioned collection, not a data marketplace.
An organisation specifies commodities, markets, and frequency. We deliver on their schedule with provenance and confidence attached. They pay for the collection.
Why this first:
The budget exists today. No new line has to be created.
Rights are clean. We collect it, we own it, they license it. No partner-data contamination.
It funds contributor incentives from customer revenue rather than runway. This resolves the contribution-payment question without placing an unpriced liability on the balance sheet.
Every commissioned contract builds the general asset. We are paid to extend the dataset we will later license. The customer funds the moat.
This resembles a services business initially. That is acceptable. Most data companies began by being paid to collect something specific, then found the aggregate worth more than any individual contract.
14. The number that determines whether this is a business
Fully-loaded cost per validated observation.
Enumerator collection has a known cost per observation — it appears in every survey budget. If ours is materially lower, there is a company. If comparable, there is a survey firm with better software. If higher, there is a research project.
Tracked from day one, per stream:
Stream
Calculation
Crowd
(incentives + moderation + validation cost) ÷ observations passing validation
Anchor agent
(wages + transport + supervision) ÷ observations logged
Blended
Weighted by actual mix

The denominator excludes rejected submissions, which still incur cost. Reviewed monthly: crowd cost should fall as density rises; agent cost is approximately linear with coverage. If crowd cost does not fall, the crowd is a distribution channel rather than an economic advantage — a conclusion to reach internally before an investor reaches it.
15. Phasing
Phase 1 — earn the right (0–6 months). One paying commissioned contract, however small. Two to four markets, covered deeply. A monthly public price note with methodology attached: marketing that functions as a public good and serves as the discovery channel for institutions. Establish cost per validated observation.
Phase 2 — become infrastructure (6–18 months). Three to five recurring customers. Sufficient continuous history that our series is the one cited for informal-market prices. Coverage expands where contracts fund it, not where a coverage map looks impressive. Subscription and API access become viable because history now exists to subscribe to.
Phase 3 — the asset pays (18 months onward). Licensing, derived products, and buyers who need price data as an input rather than an output: lenders sizing agricultural loans, insurers pricing index products, distributors routing stock, exchanges. These customers have the largest budgets and will not engage before credibility and history exist.
16. Revenue structure
One dataset, two audiences, one of which pays.
Free, permanently: the consumer surface. Price lookup and fair-price assessment. Not a revenue line — the contributor acquisition channel and the public legitimacy of the project. Every price view offers a one-tap route into contributing.
Paid: institutional access, in three forms, ordered by reachability.


Line
Notes
1
Commissioned collection
Funded coverage of specified commodities and markets on a customer schedule. Replaces an existing budget line. Cleanest rights position; funds contributor incentives from revenue.
2
Index subscription and API
Recurring institutional access. Requires accumulated history and established methodology credibility.
3
Data licensing
Bulk licensing of the contributed layer, subject to contributor consent and per-record licence classification.

Government and partner-supplied data seeds and contextualises the index. It is classified at record level and is not resold.
17. Failure modes
Founder-funded collection. Paying for coverage out of pocket to appear larger buys a number that does not compound. Expand only where a customer or a validated retention loop pays for it.
Quiet failure of the free-crowd assumption. If contributors require payment to persist, the cost structure is a survey firm’s. Not fatal — survey firms are real businesses — but it is a different company with different margins, and we need to know which one we are operating.
Government relationship ambiguity. The Ethiopian Statistical Service is simultaneously partner, data source, potential customer, regulator, and nearest analogue to a competitor. That relationship is defined narrowly and in writing, early. No single ministry’s disposition should determine whether the company exists.
Selling the vision instead of the delivery. The standing temptation is to pitch the national real-time index. Sell what can be delivered in eight weeks, deliver it, then sell the next thing.
18. What we do not yet know
Whether Ethiopian contributors behave like Nigerian ones. The FPCA result is encouraging and not transferable by assumption. The current build tests one thing: whether an individual at point of purchase will submit a price unprompted, and whether enough of them exist to produce a defensible market-day value.
What a submission costs. The mix of volunteer contribution, paid anchor capture, and eventual incentives determines whether this is a data business or a survey firm with better software.
Whether the crowd holds without payment. Payment is the obvious lever and changes the cost structure permanently. We test the unpaid loop first, deliberately: a working unpaid loop is an asset, a paid one is a payroll.

Part IV — Next 30 days


Action
Note
1
Ten discovery conversations. WFP Ethiopia, FEWS NET, FAO, IFPRI Ethiopia, ATI, two banks, two NGOs, ESS.
One question each: how do you obtain market price data today, at what frequency, and at what cost? Not a sales call — locating the budget line.
2
Instrument cost per validated observation.
Beginning now, before operational habits form.
3
One paid pilot, however small.
A signed contract for a modest sum outweighs a letter of intent for a large one.
4
Publish one public price note.
Methodology attached, gaps shown as gaps. The cheapest credibility available.
5
Schema changes: licence class, consent record, rate limit.
Inexpensive at schema-freeze, unrecoverable afterwards.
6
Define the ESS relationship in writing.
Before there is anything at stake in it.


Appendix — corrections from v1
v1
v2
Reason
“Official CPI arrives months late”
CPI is monthly; the gap is granularity and frequency
Factually incorrect and independently checkable. The real gap is stronger and survives scrutiny.
“Where coverage is thin, we impute instead of leaving a hole”
No imputation; insufficient-data published as such
Contradicted the PRD and removed the value proposition for all three named buyers.
“Crowdsourced collection has worked elsewhere in Africa” (unattributed)
FPCA / JRC / IITA / Wageningen, Nigeria, 2019–2021, peer-reviewed
An unsourced claim invites one question we could not answer. It is now a citation.
Price context as primary retention mechanism
Price context acquires; social comparison retains
RCT evidence: social norms increased submissions; information disclosure did not.
“Two revenue lines: free consumer tool and licensed data”
One revenue side, three forms; consumer tool is acquisition
A free product is not a revenue line.
Receipt upload and paid agent routes described as current
Marked as roadmap
Both are out of scope in the current build.
Six markets, twelve commodities
Two markets, five commodities
Submission volume at the activation target cannot populate 48–72 cells at a three-submission threshold.
Full consumer PWA with identity linking
Read-only price page and static handoff
Tested consumer retention rather than the stated hypothesis, at roughly 40% of build capacity.


