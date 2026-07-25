import type { Market } from './types'
import { getMarketImage } from './images'

export const MARKETS: Market[] = [
  { id: 'merkato', en: 'Merkato', am: 'መርካቶ', img: getMarketImage(0), lat: 9.0170, lng: 38.7490 },
  { id: 'ehil-berenda', en: 'Ehil Berenda', am: 'እहል በረንዳ', img: getMarketImage(1), lat: 9.0155, lng: 38.7555 },
  { id: 'atikilt-tera', en: 'Atikilt Tera', am: 'አትክልት ጤራ', img: getMarketImage(2), lat: 9.0345, lng: 38.7448 },
  { id: 'shola', en: 'Shola Market', am: 'ሾላ ገበያ', img: getMarketImage(3), lat: 9.0400, lng: 38.7510 },
  { id: 'sumale-tera', en: 'Sumale Tera', am: 'ሱማሌ ጤራ', img: getMarketImage(4), lat: 9.0025, lng: 38.7620 },
  { id: 'piassa', en: 'Piassa', am: 'ፒያሳ', img: getMarketImage(5), lat: 9.0370, lng: 38.7470 },
  { id: 'arat-kilo', en: 'Arat Kilo', am: 'አራት ኪሎ', img: getMarketImage(0), lat: 9.0390, lng: 38.7530 },
  { id: 'meskel-square', en: 'Meskel Square', am: 'ምስኩል አደባባይ', img: getMarketImage(1), lat: 9.0330, lng: 38.7620 },
  { id: 'kazanchis', en: 'Kazanchis', am: 'ካዛንቺስ', img: getMarketImage(2), lat: 9.0280, lng: 38.7610 },
  { id: 'bole-medhanealem', en: 'Bole Medhanealem', am: 'ቦሌ መድሀኒዓለም', img: getMarketImage(3), lat: 9.0110, lng: 38.7780 },
  { id: 'bole-rawe', en: 'Bole Rrawe', am: 'ቦሌ ረወ', img: getMarketImage(4), lat: 9.0070, lng: 38.7750 },
  { id: 'megenagna', en: 'Megenagna', am: 'መገናኛ', img: getMarketImage(5), lat: 9.0130, lng: 38.7830 },
  { id: 'edna-mall', en: 'Edna Mall Area', am: 'ኤድና ሞል', img: getMarketImage(0), lat: 9.0100, lng: 38.7810 },
  { id: 'makanissa', en: 'Mekanissa', am: 'መካኒሳ', img: getMarketImage(1), lat: 8.9950, lng: 38.7380 },
  { id: 'kality', en: 'Kality', am: 'ካлитይ', img: getMarketImage(2), lat: 8.9870, lng: 38.7450 },
  { id: 'akaki', en: 'Akaki', am: 'ዓቃቂ', img: getMarketImage(3), lat: 8.9750, lng: 38.7400 },
  { id: 'kolfe', en: 'Kolfe', am: 'ኮልፌ', img: getMarketImage(4), lat: 9.0280, lng: 38.7280 },
  { id: 'nifas-silk', en: 'Nifas Silk', am: 'ንፋስ ስልክ', img: getMarketImage(5), lat: 9.0200, lng: 38.7730 },
  { id: 'koye-feche', en: 'Koye Feche', am: 'ኮየ ፈቻ', img: getMarketImage(0), lat: 9.0050, lng: 38.7900 },
  { id: 'jemo', en: 'Jemo', am: 'เจemo', img: getMarketImage(1), lat: 9.0160, lng: 38.7950 },
  { id: 'gullele', en: 'Gullele', am: 'ጉለሌ', img: getMarketImage(2), lat: 9.0450, lng: 38.7380 },
  { id: 'yeqa', en: 'Yeka', am: 'የካ', img: getMarketImage(3), lat: 9.0420, lng: 38.7750 },
  { id: 'addis-ketema', en: 'Addis Ketema', am: 'አዲስ ከተማ', img: getMarketImage(4), lat: 9.0320, lng: 38.7400 },
  { id: 'arada', en: 'Arada', am: 'አראዳ', img: getMarketImage(5), lat: 9.0360, lng: 38.7450 },
  { id: 'lideta', en: 'Lideta', am: 'ሊደታ', img: getMarketImage(0), lat: 9.0300, lng: 38.7520 },
  { id: 'kirkos', en: 'Kirkos', am: 'ክርቆስ', img: getMarketImage(1), lat: 9.0310, lng: 38.7580 },
  { id: 'limmu-genet', en: 'Limmu Genet', am: 'ልሙ ገነት', img: getMarketImage(2), lat: 9.0030, lng: 38.7530 },
  { id: 'tulu-dimtu', en: 'Tulu Dimtu', am: 'ቱሉ ድምtu', img: getMarketImage(3), lat: 8.9980, lng: 38.7600 },
  { id: 'welenchiti', en: 'Welenchiti', am: 'ወለንቺቲ', img: getMarketImage(4), lat: 9.0480, lng: 38.7650 },
  { id: 'churchill', en: 'Churchill Ave', am: 'ቻርቸስ አበtica', img: getMarketImage(5), lat: 9.0355, lng: 38.7435 },
]

export const getMarketById = (id: string): Market | undefined =>
  MARKETS.find(m => m.id === id)

export const DEFAULT_MARKET = MARKETS[0]
