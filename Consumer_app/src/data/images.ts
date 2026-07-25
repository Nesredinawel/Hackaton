export const IMG = {
  teff: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=400&fit=crop&auto=format',
  wheat: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&h=400&fit=crop&auto=format',
  maize: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=600&h=400&fit=crop&auto=format',
  onion: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&h=400&fit=crop&auto=format',
  cookingoil: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&h=400&fit=crop&auto=format',

  // Local asset — aerial view of an open-air market, used as the landing hero.
  hero: '/hero-market.png',
  marketA: 'https://images.unsplash.com/photo-1579113800032-c38bd7635818?w=600&h=400&fit=crop&auto=format',
  marketB: 'https://images.unsplash.com/photo-1554486855-60050042cd53?w=600&h=400&fit=crop&auto=format',
  marketC: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=600&h=400&fit=crop&auto=format',
  marketD: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=600&h=400&fit=crop&auto=format',
  marketE: 'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=600&h=400&fit=crop&auto=format',
  marketF: 'https://images.unsplash.com/photo-1533900298894-5c1e5597a5fc?w=600&h=400&fit=crop&auto=format',
} as const

const MARKET_IMAGES = [IMG.marketA, IMG.marketB, IMG.marketC, IMG.marketD, IMG.marketE, IMG.marketF]
export const getMarketImage = (index: number) => MARKET_IMAGES[index % MARKET_IMAGES.length]
