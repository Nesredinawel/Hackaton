import { apiGet, apiPost, fromApiCommodity, fromApiMarket, toApiCommodity, toApiMarket } from '@/lib/api'
import type { PriceData } from './types'
import { PRICES, type HistoryPoint } from './prices'

export type CoverageMeta = {
  cells_expected: number
  cells_published: number
  cells_insufficient: number
  coverage_pct: number
}

type EnvelopeMeta = {
  coverage?: CoverageMeta
  generated_at?: string
}

type Envelope<T> = { meta?: EnvelopeMeta; data: T }

type CurrentCell = {
  market_code: string
  commodity_code: string
  status: string
  value: number | null
  n_submissions: number
  n_contributors: number
  insufficient_reason?: string | null
}

type SeriesPoint = {
  date: string
  value: number | null
  status: string
  n_submissions: number
}

let hydrated = false
let hydratePromise: Promise<void> | null = null

function cellToPrice(cell: CurrentCell): PriceData {
  if (cell.status === 'published' && cell.value != null) {
    const price = Math.round(cell.value)
    const spread = Math.max(2, Math.round(price * 0.05))
    return {
      status: 'published',
      price,
      low: price - spread,
      high: price + spread,
      reports: cell.n_submissions,
      contributors: cell.n_contributors,
      agents: Math.min(cell.n_contributors, cell.n_submissions),
      freshness: 'live',
      stale: false,
    }
  }
  return {
    status: 'insufficient',
    current: cell.n_submissions,
    zero: cell.n_submissions === 0,
  }
}

/** Pull live prices into the existing PRICES map (keeps UI helpers sync). */
export async function hydrateLivePrices(): Promise<void> {
  if (hydrated) return
  if (hydratePromise) return hydratePromise

  hydratePromise = (async () => {
    try {
      const payload = await apiGet<Envelope<{ cells: CurrentCell[] }>>('/prices/current')
      const cells = payload.data?.cells ?? []
      for (const cell of cells) {
        const cid = fromApiCommodity(cell.commodity_code)
        const mid = fromApiMarket(cell.market_code)
        PRICES[`${cid}-${mid}`] = cellToPrice(cell)
      }
      hydrated = true
    } catch (error) {
      console.warn('Live price hydrate failed — using mock prices', error)
    }
  })()

  return hydratePromise
}

export function isLiveHydrated(): boolean {
  return hydrated
}

export async function fetchPriceHistory(
  commodityId: string,
  marketId: string,
  days: number,
): Promise<HistoryPoint[] | null> {
  const to = new Date()
  const from = new Date(to.getTime() - Math.max(1, days - 1) * 86400000)
  const qs = new URLSearchParams({
    commodity: toApiCommodity(commodityId),
    market: toApiMarket(marketId),
    from: from.toISOString().slice(0, 10),
    to: to.toISOString().slice(0, 10),
  })
  try {
    const payload = await apiGet<
      Envelope<{ series: Array<{ points: SeriesPoint[] }> }>
    >(`/prices/series?${qs}`)
    const points = payload.data?.series?.[0]?.points ?? []
    const mapped = points
      .filter((p) => p.value != null && p.status === 'published')
      .map((p) => ({
        date: p.date,
        price: Math.round(p.value as number),
        reports: p.n_submissions,
        userShare: 0.5,
      }))
    return mapped.length > 0 ? mapped : null
  } catch {
    return null
  }
}

export type AffordabilityItem = {
  commodity_code: string
  quantity: number
  unit: string
  unit_price_now: number | null
  unit_price_prior: number | null
  cost_now: number | null
  cost_prior: number | null
  change_pct: number | null
  contribution_to_change_pct: number | null
  status: string
}

export type AffordabilitySnapshot = {
  status: string
  cost_now: number | null
  cost_prior: number | null
  prior_date?: string | null
  change_abs?: number | null
  change_pct: number | null
  band: string | null
  score: number | null
  items?: AffordabilityItem[]
  missing_commodities?: string[]
  coverage?: CoverageMeta | null
}

export async function fetchAffordability(): Promise<AffordabilitySnapshot | null> {
  try {
    const payload = await apiGet<Envelope<AffordabilitySnapshot>>('/affordability')
    return {
      ...payload.data,
      coverage: payload.meta?.coverage ?? null,
    }
  } catch {
    return null
  }
}

export type CopilotCitation = {
  label: string
  value?: number | string | null
  unit?: string
  source?: string
  cell_refs?: string[]
}

export type CopilotResult = {
  answer: string
  recommendation?: {
    action: string
    band_low_pct: number
    band_high_pct: number
    confidence: string
    confidence_reason?: string
  }
  impact?: {
    household_count: number
    gap_per_household_etb: number
    monthly_total_etb: number
  }
  citations?: CopilotCitation[]
  mode?: string
  model?: string | null
}

export type MonthlyBrief = {
  title: string
  generated_at: string
  language: string
  executive_summary: string
  markdown: string
  mode: string
  model?: string | null
  household_count?: number
  citations?: CopilotCitation[]
}

export type HeatmapMarket = {
  market_code: string
  market_name_en?: string
  heat: number | null
  band: string | null
  cells_published: number
  cells_expected: number
  cells: Array<{
    commodity_code: string
    status: string
    value: number | null
    pct_change: number | null
    band: string | null
  }>
}

export type HeatmapSnapshot = {
  metric: string
  markets: HeatmapMarket[]
  hottest_cell: { market_code: string; commodity_code: string; pct_change: number } | null
}

/** Live 7d inflation heat. Often null until prior window has published cells. */
export async function fetchHeatmap(commodityId?: string | null): Promise<HeatmapSnapshot | null> {
  try {
    const qs = new URLSearchParams({ metric: 'pct_change_7d' })
    if (commodityId) qs.set('commodity', toApiCommodity(commodityId))
    const payload = await apiGet<Envelope<HeatmapSnapshot>>(`/heatmap?${qs}`)
    return payload.data
  } catch {
    return null
  }
}

export async function askCopilot(
  householdCount = 50000,
  language: 'en' | 'am' = 'en',
): Promise<CopilotResult | null> {
  try {
    const payload = await apiPost<Envelope<CopilotResult>>('/copilot/ask', {
      question: 'How should we adjust cash assistance for Addis this month?',
      household_count: householdCount,
      language,
    })
    return payload.data
  } catch {
    return null
  }
}

export async function generateMonthlyBrief(
  householdCount = 50000,
  language: 'en' | 'am' = 'en',
): Promise<MonthlyBrief | null> {
  try {
    const payload = await apiPost<Envelope<MonthlyBrief>>('/briefs/monthly', {
      household_count: householdCount,
      language,
    })
    return payload.data
  } catch {
    return null
  }
}

export type SpikeAlert = {
  market_code: string
  commodity_code: string
  spike: number
  band: string
  value: number
  expected: number
  median_30d: number
  pct_above_expected: number
  first_detected_at?: string
  consecutive_days?: number
  /** spike = statistical detector; basket_mom = affordability MoM pressure fallback */
  kind?: 'spike' | 'basket_mom'
}

export type AlertsSnapshot = {
  method_version: string
  alps_comparable?: boolean
  alps_comparable_note?: string
  window_days?: number
  alerts: SpikeAlert[]
}

export async function fetchAlerts(minBand = 'stress'): Promise<AlertsSnapshot | null> {
  try {
    const payload = await apiGet<Envelope<AlertsSnapshot>>(`/alerts?min_band=${encodeURIComponent(minBand)}`)
    return {
      ...payload.data,
      alerts: (payload.data?.alerts ?? []).map(a => ({ ...a, kind: 'spike' as const })),
    }
  } catch {
    return null
  }
}

/** When spike history is thin, surface basket MoM pressure as programme alerts (not invented z-scores). */
export function basketPressureAlerts(afford: AffordabilitySnapshot | null): SpikeAlert[] {
  if (!afford?.items) return []
  return afford.items
    .filter(i => i.status === 'published' && i.change_pct != null && Math.abs(i.change_pct) >= 5)
    .map(i => ({
      market_code: 'addis_ababa',
      commodity_code: i.commodity_code,
      spike: Math.abs(i.change_pct ?? 0) / 5,
      band: Math.abs(i.change_pct ?? 0) >= 15
        ? 'crisis'
        : Math.abs(i.change_pct ?? 0) >= 10
          ? 'alert'
          : 'stress',
      value: i.unit_price_now ?? 0,
      expected: i.unit_price_prior ?? 0,
      median_30d: i.unit_price_prior ?? 0,
      pct_above_expected: i.change_pct ?? 0,
      kind: 'basket_mom' as const,
    }))
    .sort((a, b) => Math.abs(b.pct_above_expected) - Math.abs(a.pct_above_expected))
}

export type PanelExportResult = {
  csv: string
  filename: string
  cells_total: number
  cells_published: number
  cells_insufficient: number
}

/** Honest current-panel CSV: every market×commodity cell, including insufficient_data. */
export async function buildHonestPanelCsv(): Promise<PanelExportResult | null> {
  try {
    const payload = await apiGet<Envelope<{ cells: CurrentCell[] }>>(
      '/prices/current?include_insufficient=true',
    )
    const cells = payload.data?.cells ?? []
    const generated = payload.meta?.generated_at ?? new Date().toISOString()
    const coverage = payload.meta?.coverage
    const published = cells.filter(c => c.status === 'published').length
    const insufficient = cells.filter(c => c.status !== 'published').length

    const lines: string[] = [
      '# Waga Index panel export',
      '# method_version: waga-index-v1',
      `# generated_at: ${generated}`,
      '# rule: insufficient_data rows included; price blank when not published; no imputation',
      `# coverage: published=${coverage?.cells_published ?? published} expected=${coverage?.cells_expected ?? cells.length} insufficient=${coverage?.cells_insufficient ?? insufficient}`,
      'market_code,commodity_code,status,price_etb,n_submissions,n_contributors,insufficient_reason',
    ]

    for (const cell of cells) {
      const price = cell.status === 'published' && cell.value != null ? String(cell.value) : ''
      const reason = (cell.insufficient_reason ?? '').replace(/"/g, '""')
      lines.push(
        [
          cell.market_code,
          cell.commodity_code,
          cell.status,
          price,
          String(cell.n_submissions ?? 0),
          String(cell.n_contributors ?? 0),
          reason.includes(',') ? `"${reason}"` : reason,
        ].join(','),
      )
    }

    const day = generated.slice(0, 10)
    return {
      csv: `${lines.join('\n')}\n`,
      filename: `waga_panel_${day}.csv`,
      cells_total: cells.length,
      cells_published: published,
      cells_insufficient: insufficient,
    }
  } catch {
    return null
  }
}

export function downloadCsv(csv: string, filename: string): void {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
