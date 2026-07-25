import type { Market } from './types'
import { IMG } from './images'

export const MARKETS: Market[] = [
  { id: 'merkato', en: 'Merkato', am: 'መርካቶ', img: IMG.heroMarket, area: 'addis-ababa' },
  { id: 'shola', en: 'Shola Market', am: 'ሾላ', img: IMG.foodOverhead, area: 'addis-ababa' },

  { id: 'bahir-dar-merkato', en: 'Bahir Dar Merkato', am: 'ባሕር ዳር መርካቶ', img: IMG.vegetables, area: 'bahir-dar' },
  { id: 'bahir-dar-kebele', en: 'Kebele Market', am: 'ቀበሌ ገበያ', img: IMG.foodOverhead, area: 'bahir-dar' },

  { id: 'gondar-merkato', en: 'Gondar Merkato', am: 'ጎንደር መርካቶ', img: IMG.vegetables, area: 'gondar' },

  { id: 'adama-merkato', en: 'Adama Merkato', am: 'አዳማ መርካቶ', img: IMG.electronics, area: 'adama' },
  { id: 'adama-shola', en: 'Shola Adama', am: 'ሾላ አዳማ', img: IMG.textiles, area: 'adama' },

  { id: 'jimma-merkato', en: 'Jimma Merkato', am: 'ጅማ መርካቶ', img: IMG.textiles, area: 'jimma' },

  { id: 'hawassa-merkato', en: 'Hawassa Merkato', am: 'ሐዋሳ መርካቶ', img: IMG.household, area: 'hawassa' },
  { id: 'hawassa-tabor', en: 'Tabor Market', am: 'ታቦር ገበያ', img: IMG.health, area: 'hawassa' },

  { id: 'arba-minch-merkato', en: 'Arba Minch Merkato', am: 'አርባ ምንጭ መርካቶ', img: IMG.health, area: 'arba-minch' },

  { id: 'dire-dawa-merkato', en: 'Dire Dawa Merkato', am: 'ድሬ ዳዋ መርካቶ', img: IMG.transport, area: 'dire-dawa' },

  { id: 'harar-jugol', en: 'Harar Jugol Market', am: 'ሐረር ጁጎል ገበያ', img: IMG.africaStreet, area: 'harar' },

  { id: 'mekelle-merkato', en: 'Mekelle Merkato', am: 'መቀሌ መርካቶ', img: IMG.heroMarket, area: 'mekelle' },
]

export const getMarketsForArea = (areaId: string): Market[] =>
  MARKETS.filter(m => m.area === areaId)

export const DEFAULT_MARKETS = getMarketsForArea('addis-ababa')
