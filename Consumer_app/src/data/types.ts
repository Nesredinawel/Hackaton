export type Lang = 'en' | 'am'

export type NavScreen =
  | { id: 'home' }
  | { id: 'search' }
  | { id: 'map' }
  | { id: 'categories' }
  | { id: 'category-detail'; categoryId: string }
  | { id: 'commodity-overview'; commodityId: string }
  | { id: 'price-detail'; commodityId: string; marketId: string }
  | { id: 'price-no-data'; commodityId: string; marketId: string }
  | { id: 'price-confirmed'; commodityId: string; marketId: string }
  | { id: 'about' }

export type Published = {
  status: 'published'
  price: number
  low: number
  high: number
  reports: number
  contributors: number
  agents: number
  freshness: string
  stale: boolean
}

export type Insufficient = {
  status: 'insufficient'
  current: number
  zero: boolean
}

export type PriceData = Published | Insufficient

export type SortMode = 'freshest' | 'az' | 'price'

export type Area = {
  id: string
  en: string
  am: string
  region: string
  lat: number
  lng: number
  zoom: number
  image: string
}

export type Region = {
  id: string
  en: string
  am: string
  areas: Area[]
}

export type Category = {
  id: string
  emoji: string
  en: string
  am: string
  img: string
  items: string[]
}

export type Commodity = {
  id: string
  emoji: string
  en: string
  am: string
  category: string
  unit: string
  unitAm: string
  img: string
}

export type Market = {
  id: string
  en: string
  am: string
  img: string
  area: string
}
