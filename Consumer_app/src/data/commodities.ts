import type { Commodity } from './types'
import { IMG } from './images'

export const COMMODITIES: Commodity[] = [
  { id: 'teff', emoji: '🌾', en: 'Teff', am: 'ጤፍ', unit: 'per kg', unitAm: 'በኪሎ', img: IMG.teff },
  { id: 'wheat', emoji: '🌿', en: 'Wheat', am: 'ስንዴ', unit: 'per kg', unitAm: 'በኪሎ', img: IMG.wheat },
  { id: 'maize', emoji: '🌽', en: 'Maize', am: 'በሩር', unit: 'per kg', unitAm: 'በኪሎ', img: IMG.maize },
  { id: 'onion', emoji: '🧅', en: 'Onion', am: 'ሽንኩርት', unit: 'per kg', unitAm: 'በኪሎ', img: IMG.onion },
  { id: 'cookingoil', emoji: '🫙', en: 'Cooking Oil', am: 'የምግብ ዘይት', unit: 'per litre', unitAm: 'በሊትር', img: IMG.cookingoil },
]

export const BASKET_IDS = COMMODITIES.map(c => c.id)
