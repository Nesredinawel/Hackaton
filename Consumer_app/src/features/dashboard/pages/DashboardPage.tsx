import { Fragment, useEffect, useMemo, useState } from 'react'
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
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { fromApiCommodity, fromApiMarket } from '@/lib/api'
import { downloadBriefAsWord, printBriefAsPdf } from '@/lib/briefDocument'
import { ChangeBadge, LiveDot } from '@/shared/components'

const display = { fontFamily: "'SpotifyMixUITitle','CircularSp','Helvetica Neue',Helvetica,Arial,sans-serif" } as const

const sectionTitle = 'text-[11px] font-bold uppercase tracking-[0.14em] text-primary'

function bandBadgeClass(band: string): string {
  if (band === 'crisis' || band === 'alert' || band === 'stress') return 'theme-badge-warning border-transparent'
  return 'theme-badge-published border-transparent'
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
      <div className="theme-bg min-h-full flex items-center justify-center px-6 py-16 lg:py-24">
        <Card className="max-w-md w-full text-center">
          <CardHeader className="items-center gap-3 pb-2">
            <Badge variant="outline" className="theme-badge-warning border-transparent text-[10px] font-bold uppercase tracking-wider">
              Professional
            </Badge>
            <CardTitle className="text-2xl lg:text-3xl font-bold theme-text" style={display}>
              {en ? 'Programme dashboard' : 'Programme dashboard'}
            </CardTitle>
            <CardDescription className="text-sm leading-relaxed max-w-sm mx-auto">
              {en
                ? 'Basket inflation, coverage honesty, cited cash-assistance guidance, and market pressure — the layer programmes pay for.'
                : 'Basket inflation, coverage honesty, cited cash-assistance guidance, and market pressure.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full" size="lg" onClick={() => navigate({ id: 'sign-up' })}>
              {en ? `Start trial · $${PRO_MONTHLY_PRICE}/mo →` : `Start trial · $${PRO_MONTHLY_PRICE}/mo →`}
            </Button>
            <Button
              variant="secondary"
              className="w-full"
              size="lg"
              onClick={() => {
                startDemoTrial()
                setSessionTick((n) => n + 1)
              }}
            >
              {en ? 'Continue as demo Pro →' : 'Continue as demo Pro →'}
            </Button>
          </CardContent>
          <CardFooter className="justify-center border-0 bg-transparent pt-0">
            <Button variant="link" onClick={() => navigate({ id: 'pricing' })}>
              {en ? 'See plans' : 'See plans'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  const coverage = afford?.coverage
  const drivers = [...(afford?.items ?? [])]
    .filter(i => i.status === 'published' && i.contribution_to_change_pct != null)
    .sort((a, b) => Math.abs(b.contribution_to_change_pct ?? 0) - Math.abs(a.contribution_to_change_pct ?? 0))

  const liveMarkets = (heat?.markets ?? []).filter(m => m.cells_published > 0)
  const thinMarkets = (heat?.markets ?? []).filter(m => m.cells_published < m.cells_expected)

  const coverageStats = coverage
    ? [
        { v: `${coverage.cells_published}/${coverage.cells_expected}`, l: en ? 'Cells published' : 'Published' },
        { v: String(coverage.cells_insufficient), l: en ? 'Insufficient' : 'Insufficient' },
        { v: `${Math.round(coverage.coverage_pct)}%`, l: en ? 'Coverage' : 'Coverage' },
        { v: String(liveMarkets.length), l: en ? 'Markets live' : 'Markets live' },
      ]
    : []

  return (
    <div className="theme-bg min-h-full">
      <div className="border-b theme-border theme-surface">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 py-8 lg:py-10">
          <div className="space-y-5 lg:space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5 lg:gap-8">
              <div className="min-w-0 flex-1">
                <p className={`${sectionTitle} mb-2`}>
                  {en ? 'Professional · Programme dashboard' : 'Professional · Programme dashboard'}
                </p>
                <h1 className="theme-text text-3xl lg:text-4xl font-bold" style={{ ...display, letterSpacing: '-0.03em' }}>
                  {en ? 'Cash assistance decisions' : 'Cash assistance decisions'}
                </h1>
                <p className="text-sm text-muted-foreground max-w-xl mt-2 leading-relaxed">
                  {en
                    ? 'Published index only — no imputed prices. Gaps stay visible so transfers rest on real observations.'
                    : 'Published index only — no imputed prices. Gaps stay visible.'}
                </p>
              </div>
              <div
                className="flex flex-wrap items-center gap-2 shrink-0 lg:max-w-md lg:justify-end"
                role="toolbar"
                aria-label={en ? 'Dashboard actions' : 'Dashboard actions'}
              >
                <Button
                  size="sm"
                  onClick={() => void doGenerateBrief()}
                  disabled={briefMsg === 'loading'}
                >
                  {briefMsg === 'loading' ? 'Generating brief…' : 'Download brief (Word)'}
                </Button>
                <Button
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
                </Button>
                <Button variant="secondary" size="sm" onClick={() => void doPanelExport()}>
                  ↓ Export panel CSV
                </Button>
                <Button variant="secondary" size="sm" onClick={() => navigate({ id: 'map' })}>
                  Open map
                </Button>
              </div>
            </div>
            {briefMsg === 'done' && (
              <Alert className="theme-badge-published border-transparent">
                <AlertDescription className="text-foreground font-semibold">
                  ✓ Word brief downloaded — use “Save as PDF” if you need a PDF.
                </AlertDescription>
              </Alert>
            )}
            {briefMsg === 'error' && (
              <Alert variant="destructive" className="theme-badge-warning border-transparent">
                <AlertDescription className="text-[var(--warning)] font-semibold">
                  Brief failed — try again after API is live.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-8 lg:py-10 space-y-6 lg:space-y-8">
        {loading && (
          <div className="space-y-3">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-24 w-full rounded-xl" />
          </div>
        )}

        {coverageStats.length > 0 && (
          <Card>
            <CardContent className="overflow-x-auto pt-6">
              <div className="flex min-w-max sm:min-w-0 sm:w-full items-stretch">
                {coverageStats.map((s, i) => (
                  <Fragment key={s.l}>
                    {i > 0 && (
                      <Separator orientation="vertical" className="mx-4 sm:mx-6 h-auto self-stretch" />
                    )}
                    <div className="flex-1 min-w-[5.5rem]">
                      <p className="text-xl lg:text-2xl font-bold theme-text tabular-nums whitespace-nowrap" style={display}>{s.v}</p>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1 whitespace-nowrap">{s.l}</p>
                    </div>
                  </Fragment>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 lg:gap-8 lg:grid-cols-2 lg:items-stretch">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className={sectionTitle}>
                {en ? 'Staple basket' : 'Staple basket'}
              </CardTitle>
              <CardDescription className="text-xs">
                {en ? '5 staples · 5-person household · 30 days' : '5 staples · 30 days'}
              </CardDescription>
              {afford?.band && (
                <CardAction>
                  <Badge
                    variant="outline"
                    className={
                      afford.band === 'Severe' || afford.band === 'Critical'
                        ? 'theme-badge-warning border-transparent text-[10px] font-bold uppercase tracking-wider'
                        : 'theme-badge-published border-transparent text-[10px] font-bold uppercase tracking-wider'
                    }
                  >
                    {afford.band}
                  </Badge>
                </CardAction>
              )}
            </CardHeader>
            <CardContent>
              {afford?.status === 'published' && afford.cost_now != null ? (
                <>
                  <div className="flex flex-wrap items-end gap-3 mb-5">
                    <p className="theme-text font-bold tabular-nums leading-none" style={{ ...display, fontSize: 40, letterSpacing: '-0.04em' }}>
                      {Math.round(afford.cost_now).toLocaleString()}
                      <span className="text-base font-medium text-muted-foreground ml-1.5">ETB</span>
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
                    <>
                      <Separator className="mb-4" />
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
                    </>
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
            </CardContent>
          </Card>

          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle className={sectionTitle}>
                {en ? 'Addis AI guidance' : 'Addis AI guidance'}
              </CardTitle>
              {copilot?.mode && (
                <CardDescription className="text-[10px] uppercase tracking-wider">
                  {copilot.mode === 'addis_ai' ? 'Live narrative · facts locked' : 'Rule-based fallback · facts locked'}
                  {copilot.model ? ` · ${copilot.model}` : ''}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="flex flex-1 flex-col">
              {copilot?.answer ? (
                <>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1">{copilot.answer}</p>
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
                    <>
                      <Separator className="my-4" />
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
                    </>
                  )}
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {loading
                    ? (en ? 'Loading Addis AI guidance…' : 'Loading…')
                    : afford?.status === 'published'
                      ? (en ? 'Guidance unavailable right now — try refresh.' : 'Guidance unavailable.')
                      : (en ? 'Copilot unavailable until the basket is published.' : 'Copilot unavailable.')}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="sm:flex-row sm:items-end sm:justify-between">
            <div>
              <CardTitle className={sectionTitle}>Alert feed</CardTitle>
              <CardDescription className="text-xs">
                {(alertsSnap?.alerts?.length ?? 0) > 0
                  ? `Spike detector · ${alertsSnap?.method_version ?? 'waga-spike-v1'} · ${alertsSnap?.window_days ?? 30}d window`
                  : 'Basket MoM pressure (spike history still thin — not imputed z-scores)'}
              </CardDescription>
            </div>
            <Badge variant="secondary" className="tabular-nums shrink-0">
              {alertRows.length} active
            </Badge>
          </CardHeader>
          <CardContent>
            {alertRows.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4">
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
                      <Badge variant="outline" className={`text-[10px] font-bold uppercase tracking-wider ${bandBadgeClass(a.band)}`}>
                        {a.band}
                      </Badge>
                    </li>
                  )
                })}
              </ul>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:gap-8 lg:grid-cols-2 lg:items-stretch">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className={sectionTitle}>Market pressure</CardTitle>
              <CardDescription className="text-xs">Thin coverage listed honestly</CardDescription>
              <CardAction>
                <Button variant="secondary" size="sm" onClick={() => navigate({ id: 'map' })}>
                  Heatmap →
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>

          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle className={sectionTitle}>Provenance export</CardTitle>
              <CardDescription className="text-xs leading-relaxed">
                Full market×commodity panel. Insufficient-data rows included with blank price — never filled in.
              </CardDescription>
            </CardHeader>
            <CardContent className="mt-auto space-y-3">
              {exportMsg === 'limit' && (
                <Alert variant="destructive" className="theme-badge-warning border-transparent">
                  <AlertDescription className="text-[var(--warning)] font-semibold">
                    Daily export limit reached ({PRO_EXPORTS_PER_DAY}/day on Professional).
                  </AlertDescription>
                </Alert>
              )}
              {exportMsg === 'error' && (
                <Alert variant="destructive" className="theme-badge-warning border-transparent">
                  <AlertDescription className="text-[var(--warning)] font-semibold">
                    Export failed. Try again or check your plan.
                  </AlertDescription>
                </Alert>
              )}
              {exportMsg === 'done' && exportStats && (
                <Alert className="theme-badge-published border-transparent">
                  <AlertDescription className="text-foreground font-semibold">
                    ✓ Downloaded · {exportStats.published} published · {exportStats.insufficient} insufficient
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
            <CardFooter className="flex-col gap-3 border-0 bg-transparent pt-0">
              <Button className="w-full" onClick={() => void doPanelExport()}>
                ↓ Download panel CSV
              </Button>
              {getTier() === 'professional' && (
                <p className="text-[11px] theme-text-dim text-center w-full">
                  {exportsUsedToday()} of {exportQuota()} used today
                </p>
              )}
            </CardFooter>
          </Card>
        </div>

        <p className="text-[11px] theme-text-dim text-center pb-6">
          Every figure traces to published index cells. AI never invents a price.
        </p>
      </div>
    </div>
  )
}
