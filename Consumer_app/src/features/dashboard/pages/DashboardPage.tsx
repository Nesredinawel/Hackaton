import { useEffect, useMemo, useState } from 'react'
import type { Lang, NavScreen } from '@/data'
import {
  COMMODITIES,
  canAccess,
  recordExport,
  exportsUsedToday,
  exportQuota,
  PRO_MONTHLY_PRICE,
  PRO_EXPORTS_PER_DAY,
  getTier,
  startDemoTrial,
} from '@/data'
import {
  askCopilot,
  basketPressureAlerts,
  buildHonestPanelCsv,
  downloadCsv,
  fetchAffordability,
  fetchAlerts,
  fetchHeatmap,
  generateMonthlyBrief,
  type AffordabilitySnapshot,
  type AlertsSnapshot,
  type CopilotResult,
  type HeatmapSnapshot,
  type SpikeAlert,
} from '@/data/live'
import { fromApiCommodity, fromApiMarket } from '@/lib/api'
import { downloadBriefAsWord, printBriefAsPdf } from '@/lib/briefDocument'
import { Btn, ChangeBadge, LiveDot } from '@/shared/components'

const display = { fontFamily: "'SpotifyMixUITitle','CircularSp','Helvetica Neue',Helvetica,Arial,sans-serif" } as const

function bandClass(band: string): string {
  if (band === 'crisis' || band === 'alert') return 'theme-badge-warning'
  if (band === 'stress') return 'theme-badge-warning'
  return 'theme-badge-published'
}

export default function DashboardPage({ lang, navigate }: {
  lang: Lang
  navigate: (s: NavScreen) => void
}) {
  const [sessionTick, setSessionTick] = useState(0)
  const access = useMemo(() => canAccess('dashboard'), [sessionTick])
  const en = lang === 'en'
  const [afford, setAfford] = useState<AffordabilitySnapshot | null>(null)
  const [copilot, setCopilot] = useState<CopilotResult | null>(null)
  const [heat, setHeat] = useState<HeatmapSnapshot | null>(null)
  const [alertsSnap, setAlertsSnap] = useState<AlertsSnapshot | null>(null)
  const [loading, setLoading] = useState(true)
  const [exportMsg, setExportMsg] = useState<'idle' | 'done' | 'limit' | 'error'>('idle')
  const [exportStats, setExportStats] = useState<{ published: number; insufficient: number } | null>(null)
  const [briefMsg, setBriefMsg] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [lastBrief, setLastBrief] = useState<{
    title: string
    generated_at?: string
    mode?: string
    markdown: string
  } | null>(null)

  useEffect(() => {
    if (!access.allowed) {
      setLoading(false)
      return
    }
    let cancelled = false
    setLoading(true)
    const language = lang === 'am' ? 'am' : 'en'
    Promise.all([
      fetchAffordability(),
      askCopilot(50000, language),
      fetchHeatmap(null),
      fetchAlerts('stress'),
    ])
      .then(([a, c, h, al]) => {
        if (cancelled) return
        setAfford(a)
        setCopilot(c)
        setHeat(h)
        setAlertsSnap(al)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [access.allowed, lang])

  const alertRows: SpikeAlert[] = useMemo(() => {
    const spikes = alertsSnap?.alerts ?? []
    if (spikes.length > 0) return spikes
    return basketPressureAlerts(afford)
  }, [alertsSnap, afford])

  const doPanelExport = async () => {
    const exportAccess = canAccess('export')
    if (!exportAccess.allowed) {
      setExportMsg(exportAccess.reason === 'limit' ? 'limit' : 'error')
      return
    }
    const panel = await buildHonestPanelCsv()
    if (!panel) {
      setExportMsg('error')
      return
    }
    downloadCsv(panel.csv, panel.filename)
    recordExport()
    setExportStats({ published: panel.cells_published, insufficient: panel.cells_insufficient })
    setExportMsg('done')
  }

  const doGenerateBrief = async () => {
    setBriefMsg('loading')
    const brief = await generateMonthlyBrief(50000, lang === 'am' ? 'am' : 'en')
    if (!brief?.markdown) {
      setBriefMsg('error')
      return
    }
    const date = brief.generated_at?.slice(0, 10) ?? 'today'
    const payload = {
      title: brief.title || 'Waga monthly cash-assistance brief',
      generatedAt: brief.generated_at,
      mode: brief.mode,
      markdown: brief.markdown,
      filename: `waga_brief_${date}.doc`,
    }
    setLastBrief({
      title: payload.title,
      generated_at: brief.generated_at,
      mode: brief.mode,
      markdown: brief.markdown,
    })
    downloadBriefAsWord(payload)
    setBriefMsg('done')
  }

  if (!access.allowed) {
    return (
      <div className="theme-bg min-h-full">
        <div className="max-w-lg mx-auto px-6 py-20 text-center">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider theme-badge-warning mb-4">
            Professional
          </span>
          <h1 className="theme-text text-2xl font-bold mb-3" style={display}>
            {en ? 'Programme dashboard' : 'Programme dashboard'}
          </h1>
          <p className="text-sm theme-text-muted leading-relaxed mb-6">
            {en
              ? 'Basket inflation, coverage honesty, cited cash-assistance guidance, and market pressure — the layer programmes pay for.'
              : 'Basket inflation, coverage honesty, cited cash-assistance guidance, and market pressure.'}
          </p>
          <Btn variant="primary" size="lg" fullWidth onClick={() => navigate({ id: 'sign-up' })}>
            {en ? `Start trial · $${PRO_MONTHLY_PRICE}/mo →` : `Start trial · $${PRO_MONTHLY_PRICE}/mo →`}
          </Btn>
          <Btn
            variant="secondary"
            size="lg"
            fullWidth
            className="mt-3"
            onClick={() => {
              startDemoTrial()
              setSessionTick((n) => n + 1)
            }}
          >
            {en ? 'Continue as demo Pro →' : 'Continue as demo Pro →'}
          </Btn>
          <button
            type="button"
            onClick={() => navigate({ id: 'pricing' })}
            className="mt-4 block w-full text-sm theme-text-muted hover:theme-accent"
          >
            {en ? 'See plans' : 'See plans'}
          </button>
        </div>
      </div>
    )
  }

  const coverage = afford?.coverage
  const drivers = [...(afford?.items ?? [])]
    .filter(i => i.status === 'published' && i.contribution_to_change_pct != null)
    .sort((a, b) => Math.abs(b.contribution_to_change_pct ?? 0) - Math.abs(a.contribution_to_change_pct ?? 0))

  const liveMarkets = (heat?.markets ?? []).filter(m => m.cells_published > 0)
  const thinMarkets = (heat?.markets ?? []).filter(m => m.cells_published < m.cells_expected)

  return (
    <div className="theme-bg min-h-full">
      <div className="border-b theme-border theme-surface">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 py-10 lg:py-12">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] theme-accent mb-2">
                {en ? 'Professional · Programme dashboard' : 'Professional · Programme dashboard'}
              </p>
              <h1 className="theme-text text-3xl font-bold mb-2" style={{ ...display, letterSpacing: '-0.03em' }}>
                {en ? 'Cash assistance decisions' : 'Cash assistance decisions'}
              </h1>
              <p className="text-sm theme-text-muted max-w-xl">
                {en
                  ? 'Published index only — no imputed prices. Gaps stay visible so transfers rest on real observations.'
                  : 'Published index only — no imputed prices. Gaps stay visible.'}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Btn
                variant="primary"
                size="sm"
                onClick={() => void doGenerateBrief()}
                disabled={briefMsg === 'loading'}
              >
                {briefMsg === 'loading' ? 'Generating brief…' : 'Download brief (Word)'}
              </Btn>
              <Btn
                variant="secondary"
                size="sm"
                disabled={briefMsg === 'loading' || !lastBrief}
                onClick={() => {
                  if (!lastBrief) return
                  printBriefAsPdf({
                    title: lastBrief.title,
                    generatedAt: lastBrief.generated_at,
                    mode: lastBrief.mode,
                    markdown: lastBrief.markdown,
                  })
                }}
              >
                Save as PDF
              </Btn>
              <Btn variant="secondary" size="sm" onClick={() => void doPanelExport()}>
                ↓ Export panel CSV
              </Btn>
              <Btn variant="secondary" size="sm" onClick={() => navigate({ id: 'map' })}>
                Open map
              </Btn>
            </div>
            {briefMsg === 'done' && (
              <p className="text-[11px] theme-accent font-semibold mt-2">
                ✓ Word brief downloaded — use “Save as PDF” if you need a PDF.
              </p>
            )}
            {briefMsg === 'error' && (
              <p className="text-[11px] text-[var(--warning)] font-semibold mt-2">Brief failed — try again after API is live.</p>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-10 space-y-6">
        {loading && (
          <p className="text-sm theme-text-muted">{en ? 'Loading live index…' : 'Loading…'}</p>
        )}

        {/* Coverage honesty — what paying programmes need to trust */}
        {coverage && (
          <div className="rounded-2xl theme-card p-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { v: `${coverage.cells_published}/${coverage.cells_expected}`, l: en ? 'Cells published' : 'Published' },
              { v: String(coverage.cells_insufficient), l: en ? 'Insufficient' : 'Insufficient' },
              { v: `${Math.round(coverage.coverage_pct)}%`, l: en ? 'Coverage' : 'Coverage' },
              { v: String(liveMarkets.length), l: en ? 'Markets live' : 'Markets live' },
            ].map(s => (
              <div key={s.l}>
                <p className="text-xl font-bold theme-text tabular-nums" style={display}>{s.v}</p>
                <p className="text-[10px] uppercase tracking-wider theme-text-dim mt-0.5">{s.l}</p>
              </div>
            ))}
          </div>
        )}

        <div className="grid gap-4 lg:grid-cols-2">
          {/* Basket inflation */}
          <section className="rounded-2xl theme-card p-6 lg:p-7">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] theme-accent mb-1">
                  {en ? 'Staple basket' : 'Staple basket'}
                </p>
                <p className="text-xs theme-text-muted">
                  {en ? '5 staples · 5-person household · 30 days' : '5 staples · 30 days'}
                </p>
              </div>
              {afford?.band && (
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                  afford.band === 'Severe' || afford.band === 'Critical'
                    ? 'theme-badge-warning'
                    : 'theme-badge-published'
                }`}>
                  {afford.band}
                </span>
              )}
            </div>

            {afford?.status === 'published' && afford.cost_now != null ? (
              <>
                <div className="flex flex-wrap items-end gap-3 mb-5">
                  <p className="theme-text font-bold tabular-nums leading-none" style={{ ...display, fontSize: 40, letterSpacing: '-0.04em' }}>
                    {Math.round(afford.cost_now).toLocaleString()}
                    <span className="text-base font-medium theme-text-muted ml-1.5">ETB</span>
                  </p>
                  {afford.cost_prior != null && afford.cost_prior > 0 && (
                    <ChangeBadge pct={afford.change_pct} suffix={en ? 'vs prior month' : 'MoM'} />
                  )}
                </div>
                {afford.cost_prior != null && afford.cost_prior > 0 && (
                  <div className="grid grid-cols-2 gap-3 mb-5">
                    <div className="rounded-xl theme-surface-2 px-3 py-2.5">
                      <p className="text-[10px] uppercase tracking-wider theme-text-dim mb-0.5">Prior</p>
                      <p className="text-sm font-bold theme-text tabular-nums">
                        {Math.round(afford.cost_prior).toLocaleString()} ETB
                      </p>
                    </div>
                    {afford.change_abs != null && (
                      <div className="rounded-xl theme-surface-2 px-3 py-2.5">
                        <p className="text-[10px] uppercase tracking-wider theme-text-dim mb-0.5">Extra cost</p>
                        <p className={`text-sm font-bold tabular-nums ${afford.change_abs > 0 ? 'text-[var(--warning)]' : 'theme-accent'}`}>
                          {afford.change_abs > 0 ? '+' : ''}{Math.round(afford.change_abs).toLocaleString()} ETB
                        </p>
                      </div>
                    )}
                  </div>
                )}
                {drivers.length > 0 && (
                  <div className="border-t theme-border pt-4">
                    <p className="text-[10px] font-bold uppercase tracking-wider theme-text-dim mb-2">
                      {en ? 'Contribution to basket rise' : 'Contribution to rise'}
                    </p>
                    <ul className="space-y-2">
                      {drivers.slice(0, 5).map(item => {
                        const cid = fromApiCommodity(item.commodity_code)
                        const c = COMMODITIES.find(x => x.id === cid)
                        return (
                          <li key={item.commodity_code} className="flex items-center justify-between gap-2 text-sm">
                            <span className="theme-text-muted truncate">
                              {c?.emoji} {c ? (lang === 'am' ? c.am : c.en) : item.commodity_code}
                            </span>
                            <div className="flex items-center gap-2 shrink-0">
                              <ChangeBadge pct={item.change_pct} size="sm" />
                              <span className="text-[11px] font-semibold theme-text tabular-nums">
                                {item.contribution_to_change_pct != null
                                  ? `${item.contribution_to_change_pct > 0 ? '+' : ''}${item.contribution_to_change_pct}pp`
                                  : '—'}
                              </span>
                            </div>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <div className="rounded-xl theme-surface-2 px-4 py-6 text-sm theme-text-muted">
                {en
                  ? 'Basket not published — one or more staples still insufficient. No imputed total.'
                  : 'Basket not published — insufficient staples. No imputed total.'}
                {afford?.missing_commodities && afford.missing_commodities.length > 0 && (
                  <p className="mt-2 text-xs">
                    Missing: {afford.missing_commodities.join(', ')}
                  </p>
                )}
              </div>
            )}
          </section>

          {/* Cited copilot / Addis AI */}
          <section className="rounded-2xl theme-card p-6 lg:p-7 flex flex-col">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] theme-accent mb-2">
              {en ? 'Addis AI guidance' : 'Addis AI guidance'}
            </p>
            {copilot?.mode && (
              <p className="text-[10px] theme-text-dim mb-2 uppercase tracking-wider">
                {copilot.mode === 'addis_ai' ? 'Live narrative · facts locked' : 'Rule-based fallback · facts locked'}
                {copilot.model ? ` · ${copilot.model}` : ''}
              </p>
            )}
            {copilot?.answer ? (
              <>
                <p className="text-sm theme-text-muted leading-relaxed flex-1">{copilot.answer}</p>
                {copilot.recommendation && (
                  <div className="mt-4 rounded-xl theme-surface-2 px-3 py-3">
                    <p className="text-[10px] uppercase tracking-wider theme-text-dim mb-1">
                      Suggested transfer uplift
                    </p>
                    <p className="text-lg font-bold theme-text tabular-nums" style={display}>
                      +{copilot.recommendation.band_low_pct}–{copilot.recommendation.band_high_pct}%
                    </p>
                    {copilot.recommendation.confidence && (
                      <p className="text-[11px] theme-text-dim mt-1">
                        Confidence: {copilot.recommendation.confidence}
                        {copilot.recommendation.confidence_reason
                          ? ` · ${copilot.recommendation.confidence_reason}`
                          : ''}
                      </p>
                    )}
                  </div>
                )}
                {copilot.impact && (
                  <div className="mt-3 rounded-xl border theme-border px-3 py-3">
                    <p className="text-[10px] uppercase tracking-wider theme-text-dim mb-1">
                      Cost of doing nothing
                    </p>
                    <p className="text-sm font-bold theme-text tabular-nums">
                      {Math.round(copilot.impact.monthly_total_etb).toLocaleString()} ETB / month
                    </p>
                    <p className="text-[11px] theme-text-muted mt-1">
                      {copilot.impact.household_count.toLocaleString()} households
                      {' · '}
                      {Math.round(copilot.impact.gap_per_household_etb).toLocaleString()} ETB each
                    </p>
                  </div>
                )}
                {copilot.citations && copilot.citations.length > 0 && (
                  <div className="mt-4 border-t theme-border pt-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider theme-text-dim mb-2">
                      Citations
                    </p>
                    <ul className="space-y-1.5">
                      {copilot.citations.map((cite, i) => (
                        <li key={`${cite.label}-${i}`} className="text-[11px] theme-text-muted">
                          <span className="font-semibold theme-text">{cite.label}</span>
                          {cite.value != null && (
                            <> · {typeof cite.value === 'number' ? cite.value.toLocaleString() : cite.value}
                              {cite.unit ? ` ${cite.unit}` : ''}
                            </>
                          )}
                          {cite.source && <span className="theme-text-dim"> · {cite.source}</span>}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm theme-text-muted">
                {loading
                  ? (en ? 'Loading Addis AI guidance…' : 'Loading…')
                  : afford?.status === 'published'
                    ? (en ? 'Guidance unavailable right now — try refresh.' : 'Guidance unavailable.')
                    : (en ? 'Copilot unavailable until the basket is published.' : 'Copilot unavailable.')}
              </p>
            )}
          </section>
        </div>

        {/* Spike / pressure alert feed */}
        <section className="rounded-2xl theme-card p-6 lg:p-7">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] theme-accent mb-1">
                Alert feed
              </p>
              <p className="text-xs theme-text-muted">
                {(alertsSnap?.alerts?.length ?? 0) > 0
                  ? `Spike detector · ${alertsSnap?.method_version ?? 'waga-spike-v1'} · ${alertsSnap?.window_days ?? 30}d window`
                  : 'Basket MoM pressure (spike history still thin — not imputed z-scores)'}
              </p>
            </div>
            <span className="text-[11px] theme-text-dim tabular-nums">
              {alertRows.length} active
            </span>
          </div>

          {alertRows.length === 0 ? (
            <p className="text-sm theme-text-muted py-4">
              No stress-or-above alerts right now.
            </p>
          ) : (
            <ul className="space-y-2">
              {alertRows.slice(0, 8).map((a, i) => {
                const cid = fromApiCommodity(a.commodity_code)
                const c = COMMODITIES.find(x => x.id === cid)
                const marketLabel = a.market_code === 'addis_ababa'
                  ? 'City basket'
                  : fromApiMarket(a.market_code)
                return (
                  <li
                    key={`${a.market_code}-${a.commodity_code}-${i}`}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-xl theme-surface-2 px-3 py-2.5"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold theme-text truncate">
                        {c?.emoji} {c ? (lang === 'am' ? c.am : c.en) : a.commodity_code}
                        <span className="font-normal theme-text-muted"> · {marketLabel}</span>
                      </p>
                      <p className="text-[11px] theme-text-dim mt-0.5">
                        {a.kind === 'basket_mom'
                          ? `MoM ${a.pct_above_expected > 0 ? '+' : ''}${a.pct_above_expected}% · prior ${a.expected} → now ${a.value} ETB`
                          : `${a.pct_above_expected > 0 ? '+' : ''}${a.pct_above_expected}% vs trend · spike ${a.spike}`}
                      </p>
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${bandClass(a.band)}`}>
                      {a.band}
                    </span>
                  </li>
                )
              })}
            </ul>
          )}
        </section>

        <div className="grid gap-4 lg:grid-cols-2">
          {/* Market pressure */}
          <section className="rounded-2xl theme-card p-6 lg:p-7">
            <div className="flex items-end justify-between gap-3 mb-5">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] theme-accent mb-1">
                  Market pressure
                </p>
                <p className="text-xs theme-text-muted">
                  Thin coverage listed honestly
                </p>
              </div>
              <Btn variant="secondary" size="sm" onClick={() => navigate({ id: 'map' })}>
                Heatmap →
              </Btn>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider theme-text-dim mb-2 flex items-center gap-1.5">
                  <LiveDot size="sm" /> Live ({liveMarkets.length})
                </p>
                <ul className="space-y-1.5">
                  {liveMarkets.slice(0, 5).map(m => (
                    <li key={m.market_code} className="flex items-center justify-between text-sm gap-2">
                      <span className="theme-text truncate">{m.market_name_en ?? fromApiMarket(m.market_code)}</span>
                      <span className="text-[11px] theme-text-muted tabular-nums shrink-0">
                        {m.cells_published}/{m.cells_expected}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider theme-text-dim mb-2">
                  Thin ({thinMarkets.length})
                </p>
                <ul className="space-y-1.5">
                  {thinMarkets.slice(0, 5).map(m => (
                    <li key={m.market_code} className="flex items-center justify-between text-sm gap-2">
                      <span className="theme-text-muted truncate">{m.market_name_en ?? fromApiMarket(m.market_code)}</span>
                      <span className="text-[11px] text-[var(--warning)] font-semibold tabular-nums shrink-0">
                        {m.cells_published}/{m.cells_expected}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Honest export */}
          <section className="rounded-2xl theme-card p-6 lg:p-7 flex flex-col">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] theme-accent mb-1">
              Provenance export
            </p>
            <p className="text-xs theme-text-muted mb-4 leading-relaxed">
              Full market×commodity panel. Insufficient-data rows included with blank price — never filled in.
            </p>
            <div className="mt-auto space-y-3">
              {exportMsg === 'limit' && (
                <div className="rounded-xl p-3 theme-badge-warning text-sm font-semibold">
                  Daily export limit reached ({PRO_EXPORTS_PER_DAY}/day on Professional).
                </div>
              )}
              {exportMsg === 'error' && (
                <div className="rounded-xl p-3 theme-badge-warning text-sm font-semibold">
                  Export failed. Try again or check your plan.
                </div>
              )}
              {exportMsg === 'done' && exportStats && (
                <div className="rounded-xl p-3 theme-badge-published text-sm font-semibold">
                  ✓ Downloaded · {exportStats.published} published · {exportStats.insufficient} insufficient
                </div>
              )}
              <Btn variant="primary" size="md" fullWidth onClick={() => void doPanelExport()}>
                ↓ Download panel CSV
              </Btn>
              {getTier() === 'professional' && (
                <p className="text-[11px] theme-text-dim text-center">
                  {exportsUsedToday()} of {exportQuota()} used today
                </p>
              )}
            </div>
          </section>
        </div>

        <p className="text-[11px] theme-text-dim text-center pb-6">
          Every figure traces to published index cells. AI never invents a price.
        </p>
      </div>
    </div>
  )
}
