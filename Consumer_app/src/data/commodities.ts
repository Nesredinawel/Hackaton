import type { Commodity } from './types'
import { IMG } from './images'

export const COMMODITIES: Commodity[] = [
  { id: 'tomato', emoji: '🍅', en: 'Tomato', am: 'ቲማቲም', category: 'food', unit: 'per kg', unitAm: 'በኪሎ', img: IMG.tomato },
  { id: 'teff', emoji: '🌾', en: 'Teff', am: 'ጤፍ', category: 'food', unit: 'per kg', unitAm: 'በኪሎ', img: IMG.teff },
  { id: 'onion', emoji: '🧅', en: 'Onion', am: 'ሽንኩርት', category: 'food', unit: 'per kg', unitAm: 'በኪሎ', img: IMG.onion },
  { id: 'potato', emoji: '🥔', en: 'Potato', am: 'ድንች', category: 'food', unit: 'per kg', unitAm: 'በኪሎ', img: IMG.potato },
  { id: 'lentil', emoji: '🫘', en: 'Lentil', am: 'ምስር', category: 'food', unit: 'per kg', unitAm: 'በኪሎ', img: IMG.lentil },

  { id: 'smartphone', emoji: '📱', en: 'Smartphone', am: 'ስልክ', category: 'electronics', unit: 'per item', unitAm: 'በእቃ', img: IMG.smartphone },
  { id: 'charger', emoji: '🔌', en: 'Phone Charger', am: 'ቻርጀር', category: 'electronics', unit: 'per piece', unitAm: 'በቁራጭ', img: IMG.charger },
  { id: 'earphones', emoji: '🎧', en: 'Earphones', am: 'ጆሮ ማዳመጫ', category: 'electronics', unit: 'per pair', unitAm: 'በጥንድ', img: IMG.earphones },
  { id: 'powerbank', emoji: '🔋', en: 'Power Bank', am: 'ፓወር ባንክ', category: 'electronics', unit: 'per item', unitAm: 'በእቃ', img: IMG.powerbank },
  { id: 'usbcable', emoji: '🔗', en: 'USB Cable', am: 'USB ሽቦ', category: 'electronics', unit: 'per piece', unitAm: 'በቁራጭ', img: IMG.usbcable },

  { id: 'tshirt', emoji: '👕', en: 'T-Shirt', am: 'ቲሸርት', category: 'clothing', unit: 'per piece', unitAm: 'በቁራጭ', img: IMG.tshirt },
  { id: 'jeans', emoji: '👖', en: 'Jeans', am: 'ጂንስ', category: 'clothing', unit: 'per pair', unitAm: 'በጥንድ', img: IMG.jeans },
  { id: 'shoes', emoji: '👟', en: 'Shoes', am: 'ጫማ', category: 'clothing', unit: 'per pair', unitAm: 'በጥንድ', img: IMG.shoes },
  { id: 'netela', emoji: '🧣', en: 'Netela / Shawl', am: 'ነጠላ', category: 'clothing', unit: 'per piece', unitAm: 'በቁራጭ', img: IMG.netela },
  { id: 'dress', emoji: '👗', en: 'Dress', am: 'ቀሚስ', category: 'clothing', unit: 'per piece', unitAm: 'በቁራጭ', img: IMG.dress },

  { id: 'cookingoil', emoji: '🫙', en: 'Cooking Oil', am: 'የምግብ ዘይት', category: 'household', unit: 'per litre', unitAm: 'በሊትር', img: IMG.cookingoil },
  { id: 'soap', emoji: '🧼', en: 'Bar Soap', am: 'ሳሙና', category: 'household', unit: 'per bar', unitAm: 'በፉጦ', img: IMG.soap },
  { id: 'detergent', emoji: '🧹', en: 'Detergent', am: 'ዱቄት ሳሙና', category: 'household', unit: 'per kg', unitAm: 'በኪሎ', img: IMG.detergent },
  { id: 'sugar', emoji: '🍬', en: 'Sugar', am: 'ስኳር', category: 'household', unit: 'per kg', unitAm: 'በኪሎ', img: IMG.sugar },
  { id: 'salt', emoji: '🧂', en: 'Salt', am: 'ጨው', category: 'household', unit: 'per kg', unitAm: 'በኪሎ', img: IMG.salt },

  { id: 'paracetamol', emoji: '💊', en: 'Paracetamol', am: 'ፓራሲታሞል', category: 'health', unit: 'per strip', unitAm: 'በስትሪፕ', img: IMG.paracetamol },
  { id: 'amoxicillin', emoji: '💉', en: 'Amoxicillin', am: 'አሞክሲሲሊን', category: 'health', unit: 'per strip', unitAm: 'በስትሪፕ', img: IMG.pills },
  { id: 'bandage', emoji: '🩹', en: 'Bandage Roll', am: 'ፋሻ', category: 'health', unit: 'per roll', unitAm: 'በጠቅልሎ', img: IMG.bandage },
  { id: 'antiseptic', emoji: '🧪', en: 'Antiseptic', am: 'አንቲሴፕቲክ', category: 'health', unit: 'per bottle', unitAm: 'በጠርሙስ', img: IMG.antiseptic },
  { id: 'vitaminc', emoji: '🍊', en: 'Vitamin C', am: 'ቫይታሚን ሲ', category: 'health', unit: 'per strip', unitAm: 'በስትሪፕ', img: IMG.bandage },

  { id: 'citybus', emoji: '🚌', en: 'City Bus Fare', am: 'ከተማ አውቶቡስ', category: 'transport', unit: 'per trip', unitAm: 'በጉዞ', img: IMG.citybus },
  { id: 'minibus', emoji: '🚐', en: 'Minibus (Weyane)', am: 'ሚኒባስ', category: 'transport', unit: 'per trip', unitAm: 'በጉዞ', img: IMG.minibus },
  { id: 'bajaj', emoji: '🛺', en: 'Bajaj', am: 'ባጃጅ', category: 'transport', unit: 'per trip', unitAm: 'በጉዞ', img: IMG.blueBus },
  { id: 'taxi', emoji: '🚕', en: 'Lada Taxi', am: 'ላዳ ታክሲ', category: 'transport', unit: 'per trip', unitAm: 'በጉዞ', img: IMG.africaStreet },
]
