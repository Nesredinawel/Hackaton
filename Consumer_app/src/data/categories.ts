import type { Category } from './types'
import { IMG } from './images'

export const CATEGORIES: Category[] = [
  { id: 'food', emoji: '🥬', en: 'Food & Groceries', am: 'ምግብና ግሮሰሪ', img: IMG.vegetables, items: ['tomato', 'teff', 'onion', 'potato', 'lentil'] },
  { id: 'electronics', emoji: '📱', en: 'Electronics', am: 'ኤሌክትሮኒክስ', img: IMG.electronics, items: ['smartphone', 'charger', 'earphones', 'powerbank', 'usbcable'] },
  { id: 'clothing', emoji: '👗', en: 'Clothing & Textiles', am: 'ልብስና ጨርቆች', img: IMG.textiles, items: ['tshirt', 'jeans', 'shoes', 'netela', 'dress'] },
  { id: 'household', emoji: '🏠', en: 'Household Essentials', am: 'የቤት አስፈላጊ ዕቃዎች', img: IMG.household, items: ['cookingoil', 'soap', 'detergent', 'sugar', 'salt'] },
  { id: 'health', emoji: '💊', en: 'Health & Pharmacy', am: 'ጤናና ፋርማሲ', img: IMG.health, items: ['paracetamol', 'amoxicillin', 'bandage', 'antiseptic', 'vitaminc'] },
  { id: 'transport', emoji: '🚌', en: 'Transport', am: 'ትራንስፖርት', img: IMG.transport, items: ['citybus', 'minibus', 'bajaj', 'taxi'] },
]
