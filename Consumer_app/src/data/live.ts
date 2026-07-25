import { apiGet, apiPost, fromApiCommodity, fromApiMarket, toApiCommodity, toApiMarket } from '@/lib/api'
import type { HistoryPoint, PriceData } from './types'
import { PRICES } from './prices'

type Envelope<T> = { meta?: unknown; data: T }

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

export type AffordabilitySnapshot = {
  status: string
  cost_now: number | null
  cost_prior: number | null
  change_pct: number | null
  band: string | null
  score: number | null
}

export async function fetchAffordability(): Promise<AffordabilitySnapshot | null> {
  try {
    const payload = await apiGet<Envelope<AffordabilitySnapshot>>('/affordability')
    return payload.data
  } catch {
    return null
  }
}

export type CopilotResult = {
  answer: string
  recommendation?: {
    action: string
    band_low_pct: number
    band_high_pct: number
    confidence: string
  }
  impact?: {
    household_count: number
    gap_per_household_etb: number
    monthly_total_etb: number
  }
}

export async function askCopilot(householdCount = 50000): Promise<CopilotResult | null> {
  try {
    const payload = await apiPost<Envelope<CopilotResult>>('/copilot/ask', {
      question: 'How should we adjust cash assistance for Addis this month?',
      household_count: householdCount,
      language: 'en',
    })
    return payload.data
  } catch {
    return null
  }
}
