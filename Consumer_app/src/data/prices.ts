import type { PriceData, Published } from './types'
import { COMMODITIES } from './commodities'
import { MARKETS } from './markets'

const BASE_PRICES: Record<string, { price: number; low: number; high: number; reports: number; contributors: number; agents: number }> = {
  teff:          { price: 120, low: 110, high: 135, reports: 8, contributors: 6, agents: 2 },
  wheat:         { price: 58,  low: 52,  high: 65,  reports: 7, contributors: 5, agents: 2 },
  maize:         { price: 42,  low: 38,  high: 48,  reports: 6, contributors: 5, agents: 1 },
  onion:         { price: 45,  low: 40,  high: 52,  reports: 6, contributors: 5, agents: 1 },
  cookingoil:    { price: 145, low: 130, high: 165, reports: 9, contributors: 7, agents: 2 },
}

const FRESHNESS = ['8 min ago', '12 min ago', '18 min ago', '25 min ago', '35 min ago', '45 min ago', '1 hr ago', '1.5 hrs ago', '2 hrs ago', '3 hrs ago', '4 hrs ago', '6 hrs ago']

function seeded(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280
  return x - Math.floor(x)
}

function generateAllPrices(): Record<string, PriceData> {
  const result: Record<string, PriceData> = {}

  for (const market of MARKETS) {
    const marketSeed = market.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0)

    for (const commodity of COMMODITIES) {
      const base = BASE_PRICES[commodity.id]
      const commoditySeed = commodity.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
      const seed = marketSeed * 17 + commoditySeed * 31

      const r1 = seeded(seed)
      const r2 = seeded(seed + 1)
      const r3 = seeded(seed + 2)
      const r4 = seeded(seed + 3)
      const r5 = seeded(seed + 4)
      const r6 = seeded(seed + 5)

      if (r1 < 0.1) {
        result[`${commodity.id}-${market.id}`] = {
          status: 'insufficient',
          current: Math.floor(r2 * 3),
          zero: r1 < 0.03,
        }
        continue
      }

      const variation = 0.85 + r2 * 0.3
      const price = Math.round(base.price * variation)
      const spread = Math.round((base.high - base.low) * variation * 0.5)
      const freshness = FRESHNESS[Math.floor(r3 * FRESHNESS.length)]
      const stale = r1 > 0.92

      result[`${commodity.id}-${market.id}`] = {
        status: 'published',
        price,
        low: price - spread,
        high: price + spread,
        reports: Math.max(3, Math.round(base.reports * (0.5 + r4 * 0.8))),
        contributors: Math.max(2, Math.round(base.contributors * (0.5 + r5 * 0.8))),
        agents: Math.max(0, Math.round(base.agents * (0.3 + r6 * 0.9))),
        freshness,
        stale,
      }
    }
  }

  return result
}

export const PRICES: Record<string, PriceData> = generateAllPrices()

export const getC = (id: string) => COMMODITIES.find(c => c.id === id)!
export const getMkt = (id: string) => MARKETS.find(m => m.id === id)!
export const getP = (cid: string, mid: string): PriceData =>
  PRICES[`${cid}-${mid}`] ?? { status: 'insufficient', current: 0, zero: true }
export const TG_BOT = 'Waga_ai_bot'

export const tgBotLink = (start?: string) =>
  start
    ? `https://t.me/${TG_BOT}?start=${encodeURIComponent(start)}`
    : `https://t.me/${TG_BOT}`

/** Deep link to report a price for a commodity at a market. */
export const tgLink = (cid: string, mid: string) => tgBotLink(`submit_${cid}_${mid}`)

/** Deep link to register as a field agent in the Telegram bot. */
export const tgAgentLink = () => tgBotLink('register')

export type HistoryPoint = { date: string; price: number; reports: number; userShare: number }

/**
 * Deterministic daily price history for a commodity/market pair, ending today.
 * Used by the Professional/Enterprise history chart & source composition.
 */
export function getPriceHistory(cid: string, mid: string, days: number): HistoryPoint[] {
  const p = getP(cid, mid)
  const base = p.status === 'published' ? p.price : (BASE_PRICES[cid]?.price ?? 60)
  const seed = (cid + mid).split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  const points: HistoryPoint[] = []
  const now = new Date()

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 86400000)
    const wobble = (seeded(seed + i * 7) - 0.5) * 0.18
    const drift = Math.sin((i / days) * Math.PI * 2 + seed) * 0.08
    const price = Math.max(1, Math.round(base * (1 + wobble + drift)))
    points.push({
      date: d.toISOString().split('T')[0],
      price,
      reports: 3 + Math.floor(seeded(seed + i * 3) * 8),
      userShare: 0.45 + seeded(seed + i * 5) * 0.4,
    })
  }
  return points
}

export const ALL_LIVE_PAIRS = COMMODITIES
  .flatMap(c => MARKETS.map(m => ({ c, m, p: getP(c.id, m.id) })))
  .filter(({ p }) => p.status === 'published')

export function avgBasket(marketId: string): number {
  const prices = COMMODITIES.map(c => getP(c.id, marketId)).filter((p): p is Published => p.status === 'published')
  if (prices.length === 0) return 0
  return Math.round(prices.reduce((s, p) => s + p.price, 0) / prices.length)
}

export function liveCount(marketId: string): number {
  return COMMODITIES.filter(c => getP(c.id, marketId).status === 'published').length
}

export type MarketRank = { market: typeof MARKETS[number]; avg: number; live: number; rank: number }

export function getMarketLeaderboard(): MarketRank[] {
  return MARKETS
    .map(m => ({ market: m, avg: avgBasket(m.id), live: liveCount(m.id), rank: 0 }))
    .sort((a, b) => b.avg - a.avg)
    .map((entry, i) => ({ ...entry, rank: i }))
}

export type MarketHeatPoint = {
  lat: number
  lng: number
  intensity: number
  marketId: string
  rank: number
  avg: number
  live: number
}

/** Normalized 0–1 intensity from market leaderboard rank (higher avg basket = hotter). */
export function marketHeatIntensity(avg: number, live: number, minAvg: number, maxAvg: number): number {
  if (avg <= 0) return 0.06
  const span = maxAvg - minAvg || 1
  const priceNorm = (avg - minAvg) / span
  const coverage = live / COMMODITIES.length
  return Math.min(1, Math.max(0.1, priceNorm * 0.82 + coverage * 0.18))
}

export function getMarketHeatPoints(): MarketHeatPoint[] {
  return getCommodityHeatPoints(null)
}

/**
 * Heat by avg basket (commodityId null) or a single staple's published prices.
 * Markets with no live prices get intensity 0 and are skipped by the map layer.
 */
export function getCommodityHeatPoints(commodityId: string | null): MarketHeatPoint[] {
  const rows = MARKETS.map(market => {
    if (commodityId) {
      const p = getP(commodityId, market.id)
      if (p.status !== 'published') {
        return { market, avg: 0, live: 0 }
      }
      return { market, avg: p.price, live: 1 }
    }
    return { market, avg: avgBasket(market.id), live: liveCount(market.id) }
  })

  const priced = rows.filter(e => e.avg > 0)
  const minAvg = priced.length > 0 ? Math.min(...priced.map(e => e.avg)) : 0
  const maxAvg = priced.length > 0 ? Math.max(...priced.map(e => e.avg)) : 1

  const ranked = [...rows]
    .filter(e => e.avg > 0)
    .sort((a, b) => b.avg - a.avg)

  return rows.map(entry => {
    const rank = ranked.findIndex(r => r.market.id === entry.market.id)
    return {
      lat: entry.market.lat,
      lng: entry.market.lng,
      intensity: entry.avg > 0
        ? marketHeatIntensity(entry.avg, entry.live, minAvg, maxAvg)
        : 0,
      marketId: entry.market.id,
      rank: rank >= 0 ? rank : 99,
      avg: entry.avg,
      live: entry.live,
    }
  })
}

/** Gradient stop color for sidebar + legend (matches heatmap layer). */
export function heatIntensityColor(intensity: number): string {
  if (intensity >= 0.78) return '#F3727F'
  if (intensity >= 0.58) return '#FF6B35'
  if (intensity >= 0.38) return '#FFA42B'
  if (intensity >= 0.2) return '#7AE582'
  return '#1ED760'
}

export const HEATMAP_GRADIENT: Record<number, string> = {
  0.1: '#1ED760',
  0.35: '#7AE582',
  0.5: '#FFA42B',
  0.72: '#FF6B35',
  1.0: '#F3727F',
}

export type ItemRank = { commodity: typeof COMMODITIES[number]; avg: number; min: number; max: number; live: number; rank: number }

export function getItemLeaderboard(): ItemRank[] {
  return COMMODITIES.map(c => {
    const published = MARKETS.map(m => getP(c.id, m.id)).filter((p): p is Published => p.status === 'published')
    const prices = published.map(p => p.price)
    return {
      commodity: c,
      avg: prices.length > 0 ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : 0,
      min: prices.length > 0 ? Math.min(...prices) : 0,
      max: prices.length > 0 ? Math.max(...prices) : 0,
      live: published.length,
      rank: 0,
    }
  }).sort((a, b) => b.avg - a.avg).map((item, i) => ({ ...item, rank: i }))
}
