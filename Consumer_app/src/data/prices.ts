import type { PriceData, Published } from './types'
import { COMMODITIES } from './commodities'
import { CATEGORIES } from './categories'
import { MARKETS, getMarketsForArea } from './markets'

const BASE_PRICES: Record<string, PriceData> = {
  'tomato-merkato': { status: 'published', price: 82, low: 75, high: 90, reports: 9, contributors: 7, agents: 2, freshness: '12 min ago', stale: false },
  'tomato-shola': { status: 'published', price: 78, low: 72, high: 85, reports: 5, contributors: 4, agents: 1, freshness: '34 min ago', stale: false },
  'teff-merkato': { status: 'published', price: 580, low: 560, high: 600, reports: 7, contributors: 5, agents: 2, freshness: '45 min ago', stale: false },
  'teff-shola': { status: 'insufficient', current: 1, zero: false },
  'onion-merkato': { status: 'published', price: 45, low: 40, high: 52, reports: 6, contributors: 5, agents: 1, freshness: '28 min ago', stale: false },
  'onion-shola': { status: 'published', price: 42, low: 38, high: 50, reports: 4, contributors: 3, agents: 1, freshness: '1 hr ago', stale: false },
  'potato-merkato': { status: 'published', price: 30, low: 25, high: 38, reports: 4, contributors: 4, agents: 0, freshness: '1 hr ago', stale: false },
  'potato-shola': { status: 'insufficient', current: 0, zero: true },
  'lentil-merkato': { status: 'insufficient', current: 1, zero: false },
  'lentil-shola': { status: 'published', price: 180, low: 170, high: 195, reports: 4, contributors: 3, agents: 1, freshness: '2 days ago', stale: true },

  'smartphone-merkato': { status: 'published', price: 5200, low: 4500, high: 6000, reports: 6, contributors: 5, agents: 1, freshness: '2 hrs ago', stale: false },
  'smartphone-shola': { status: 'published', price: 4900, low: 4200, high: 5800, reports: 4, contributors: 4, agents: 0, freshness: '3 hrs ago', stale: false },
  'charger-merkato': { status: 'published', price: 180, low: 150, high: 220, reports: 8, contributors: 6, agents: 2, freshness: '55 min ago', stale: false },
  'charger-shola': { status: 'published', price: 170, low: 140, high: 200, reports: 5, contributors: 4, agents: 1, freshness: '1 hr ago', stale: false },
  'earphones-merkato': { status: 'published', price: 250, low: 200, high: 320, reports: 5, contributors: 4, agents: 1, freshness: '1.5 hrs ago', stale: false },
  'earphones-shola': { status: 'insufficient', current: 1, zero: false },
  'powerbank-merkato': { status: 'published', price: 650, low: 580, high: 750, reports: 4, contributors: 3, agents: 1, freshness: '2 hrs ago', stale: false },
  'powerbank-shola': { status: 'insufficient', current: 0, zero: true },
  'usbcable-merkato': { status: 'published', price: 95, low: 70, high: 130, reports: 7, contributors: 6, agents: 1, freshness: '40 min ago', stale: false },
  'usbcable-shola': { status: 'published', price: 90, low: 65, high: 120, reports: 4, contributors: 3, agents: 1, freshness: '2 hrs ago', stale: false },

  'tshirt-merkato': { status: 'published', price: 180, low: 140, high: 230, reports: 6, contributors: 5, agents: 1, freshness: '1 hr ago', stale: false },
  'tshirt-shola': { status: 'published', price: 165, low: 130, high: 210, reports: 4, contributors: 4, agents: 0, freshness: '2 hrs ago', stale: false },
  'jeans-merkato': { status: 'published', price: 650, low: 550, high: 800, reports: 5, contributors: 4, agents: 1, freshness: '3 hrs ago', stale: false },
  'jeans-shola': { status: 'published', price: 620, low: 520, high: 780, reports: 3, contributors: 3, agents: 0, freshness: '4 hrs ago', stale: false },
  'shoes-merkato': { status: 'published', price: 850, low: 700, high: 1100, reports: 5, contributors: 4, agents: 1, freshness: '2 hrs ago', stale: false },
  'shoes-shola': { status: 'published', price: 800, low: 650, high: 1050, reports: 4, contributors: 3, agents: 1, freshness: '3 hrs ago', stale: false },
  'netela-merkato': { status: 'published', price: 320, low: 250, high: 400, reports: 4, contributors: 3, agents: 1, freshness: '4 hrs ago', stale: false },
  'netela-shola': { status: 'insufficient', current: 1, zero: false },
  'dress-merkato': { status: 'insufficient', current: 2, zero: false },
  'dress-shola': { status: 'published', price: 920, low: 750, high: 1200, reports: 3, contributors: 3, agents: 0, freshness: '5 hrs ago', stale: false },

  'cookingoil-merkato': { status: 'published', price: 145, low: 130, high: 165, reports: 8, contributors: 6, agents: 2, freshness: '30 min ago', stale: false },
  'cookingoil-shola': { status: 'published', price: 140, low: 125, high: 160, reports: 5, contributors: 5, agents: 1, freshness: '1 hr ago', stale: false },
  'soap-merkato': { status: 'published', price: 42, low: 35, high: 55, reports: 9, contributors: 7, agents: 2, freshness: '20 min ago', stale: false },
  'soap-shola': { status: 'published', price: 40, low: 33, high: 52, reports: 6, contributors: 5, agents: 1, freshness: '45 min ago', stale: false },
  'detergent-merkato': { status: 'published', price: 85, low: 75, high: 100, reports: 7, contributors: 5, agents: 2, freshness: '1 hr ago', stale: false },
  'detergent-shola': { status: 'published', price: 82, low: 72, high: 98, reports: 4, contributors: 4, agents: 1, freshness: '2 hrs ago', stale: false },
  'sugar-merkato': { status: 'published', price: 75, low: 68, high: 85, reports: 6, contributors: 5, agents: 1, freshness: '1.5 hrs ago', stale: false },
  'sugar-shola': { status: 'insufficient', current: 2, zero: false },
  'salt-merkato': { status: 'published', price: 25, low: 20, high: 32, reports: 7, contributors: 6, agents: 1, freshness: '50 min ago', stale: false },
  'salt-shola': { status: 'published', price: 24, low: 18, high: 30, reports: 4, contributors: 3, agents: 1, freshness: '2 hrs ago', stale: false },

  'paracetamol-merkato': { status: 'published', price: 18, low: 15, high: 24, reports: 8, contributors: 6, agents: 2, freshness: '25 min ago', stale: false },
  'paracetamol-shola': { status: 'published', price: 16, low: 13, high: 22, reports: 5, contributors: 4, agents: 1, freshness: '1 hr ago', stale: false },
  'amoxicillin-merkato': { status: 'published', price: 55, low: 45, high: 70, reports: 6, contributors: 5, agents: 1, freshness: '40 min ago', stale: false },
  'amoxicillin-shola': { status: 'insufficient', current: 1, zero: false },
  'bandage-merkato': { status: 'published', price: 28, low: 22, high: 38, reports: 5, contributors: 4, agents: 1, freshness: '2 hrs ago', stale: false },
  'bandage-shola': { status: 'published', price: 25, low: 20, high: 35, reports: 4, contributors: 3, agents: 1, freshness: '3 hrs ago', stale: false },
  'antiseptic-merkato': { status: 'insufficient', current: 2, zero: false },
  'antiseptic-shola': { status: 'published', price: 95, low: 80, high: 120, reports: 4, contributors: 3, agents: 1, freshness: '4 hrs ago', stale: false },
  'vitaminc-merkato': { status: 'published', price: 35, low: 28, high: 45, reports: 5, contributors: 4, agents: 1, freshness: '1.5 hrs ago', stale: false },
  'vitaminc-shola': { status: 'published', price: 32, low: 26, high: 42, reports: 3, contributors: 3, agents: 0, freshness: '3 hrs ago', stale: false },

  'citybus-merkato': { status: 'published', price: 4, low: 3, high: 5, reports: 12, contributors: 9, agents: 3, freshness: '8 min ago', stale: false },
  'citybus-shola': { status: 'published', price: 4, low: 3, high: 5, reports: 9, contributors: 7, agents: 2, freshness: '15 min ago', stale: false },
  'minibus-merkato': { status: 'published', price: 12, low: 10, high: 15, reports: 10, contributors: 8, agents: 2, freshness: '10 min ago', stale: false },
  'minibus-shola': { status: 'published', price: 12, low: 10, high: 15, reports: 7, contributors: 6, agents: 1, freshness: '20 min ago', stale: false },
  'bajaj-merkato': { status: 'published', price: 25, low: 20, high: 35, reports: 8, contributors: 6, agents: 2, freshness: '30 min ago', stale: false },
  'bajaj-shola': { status: 'insufficient', current: 1, zero: false },
  'taxi-merkato': { status: 'published', price: 120, low: 100, high: 150, reports: 5, contributors: 4, agents: 1, freshness: '1 hr ago', stale: false },
  'taxi-shola': { status: 'published', price: 115, low: 95, high: 145, reports: 4, contributors: 3, agents: 1, freshness: '2 hrs ago', stale: false },
}

const CITY_MULTIPLIERS: Record<string, number> = {
  'addis-ababa': 1.0,
  'bahir-dar': 0.85,
  'gondar': 0.80,
  'adama': 0.92,
  'jimma': 0.85,
  'hawassa': 0.90,
  'arba-minch': 0.82,
  'dire-dawa': 0.95,
  'harar': 0.88,
  'mekelle': 0.83,
}

const FRESHNESS_OPTIONS = ['15 min ago', '30 min ago', '1 hr ago', '2 hrs ago', '3 hrs ago', '4 hrs ago', '6 hrs ago']

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

function generateCityPrices(areaId: string, multiplier: number): Record<string, PriceData> {
  const result: Record<string, PriceData> = {}
  const areaMarkets = MARKETS.filter(m => m.area === areaId)

  for (const commodity of COMMODITIES) {
    for (const market of areaMarkets) {
      const baseKey = `${commodity.id}-merkato`
      const base = BASE_PRICES[baseKey]
      if (!base || base.status !== 'published') continue

      const seed = commodity.id.length * 17 + market.id.length * 31 + areaId.length * 7
      const r = seededRandom(seed)

      if (r < 0.15) {
        result[`${commodity.id}-${market.id}`] = {
          status: 'insufficient',
          current: Math.floor(seededRandom(seed + 1) * 3),
          zero: r < 0.05,
        }
        continue
      }

      const variation = 0.9 + seededRandom(seed + 2) * 0.2
      const price = Math.round(base.price * multiplier * variation)
      const low = Math.round(base.low * multiplier * variation)
      const high = Math.round(base.high * multiplier * variation)
      const freshness = FRESHNESS_OPTIONS[Math.floor(seededRandom(seed + 3) * FRESHNESS_OPTIONS.length)]
      const stale = r > 0.9

      result[`${commodity.id}-${market.id}`] = {
        status: 'published',
        price,
        low,
        high,
        reports: Math.max(3, Math.floor(base.reports * (0.5 + seededRandom(seed + 4) * 0.8))),
        contributors: Math.max(2, Math.floor(base.contributors * (0.5 + seededRandom(seed + 5) * 0.8))),
        agents: Math.max(0, Math.floor(base.agents * (0.3 + seededRandom(seed + 6) * 0.9))),
        freshness,
        stale,
      }
    }
  }

  return result
}

export const PRICES: Record<string, PriceData> = {
  ...BASE_PRICES,
  ...generateCityPrices('bahir-dar', CITY_MULTIPLIERS['bahir-dar']),
  ...generateCityPrices('gondar', CITY_MULTIPLIERS['gondar']),
  ...generateCityPrices('adama', CITY_MULTIPLIERS['adama']),
  ...generateCityPrices('jimma', CITY_MULTIPLIERS['jimma']),
  ...generateCityPrices('hawassa', CITY_MULTIPLIERS['hawassa']),
  ...generateCityPrices('arba-minch', CITY_MULTIPLIERS['arba-minch']),
  ...generateCityPrices('dire-dawa', CITY_MULTIPLIERS['dire-dawa']),
  ...generateCityPrices('harar', CITY_MULTIPLIERS['harar']),
  ...generateCityPrices('mekelle', CITY_MULTIPLIERS['mekelle']),
}

export const getC = (id: string) => COMMODITIES.find(c => c.id === id)!
export const getMkt = (id: string) => MARKETS.find(m => m.id === id)!
export const getCat = (id: string) => CATEGORIES.find(c => c.id === id)!
export const getP = (cid: string, mid: string): PriceData =>
  PRICES[`${cid}-${mid}`] ?? { status: 'insufficient', current: 0, zero: true }
export const tgLink = (cid: string, mid: string) =>
  `https://t.me/WagaIndexBot?start=${encodeURIComponent(`submit_${cid}_${mid}`)}`

export const getMarketsForCurrentArea = (areaId: string) => getMarketsForArea(areaId)

export const getAllLivePairsForArea = (areaId: string) => {
  const markets = getMarketsForArea(areaId)
  return COMMODITIES
    .flatMap(c => markets.map(m => ({ c, m, p: getP(c.id, m.id) })))
    .filter(({ p }) => p.status === 'published')
}

export const ALL_LIVE_PAIRS = getAllLivePairsForArea('addis-ababa')
