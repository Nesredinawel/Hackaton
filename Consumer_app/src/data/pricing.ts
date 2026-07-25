import type { Tier } from './types'
import { PRO_MONTHLY_PRICE, PRO_ANNUAL_PRICE } from './types'

export type FeatureState = 'yes' | 'no' | 'partial'

export type PlanFeature = {
  en: string
  am: string
  state: FeatureState
  // Optional qualifier shown next to a partial/limited feature.
  noteEn?: string
  noteAm?: string
}

export type Plan = {
  tier: Tier
  nameEn: string
  nameAm: string
  taglineEn: string
  taglineAm: string
  // 'popular' gives the accent border + badge; 'dark' renders the enterprise card.
  variant: 'plain' | 'popular' | 'dark'
  features: PlanFeature[]
}

const y = (en: string, am: string): PlanFeature => ({ en, am, state: 'yes' })
const n = (en: string, am: string): PlanFeature => ({ en, am, state: 'no' })
const p = (en: string, am: string, noteEn: string, noteAm: string): PlanFeature => ({
  en,
  am,
  state: 'partial',
  noteEn,
  noteAm,
})

export const PLANS: Plan[] = [
  {
    tier: 'public',
    nameEn: 'Public',
    nameAm: 'ሕዝባዊ',
    taglineEn: 'Free · Forever',
    taglineAm: 'ነጻ · ለዘላለም',
    variant: 'plain',
    features: [
      y("Today's prices", 'የዛሬ ዋጋዎች'),
      y('Price range', 'የዋጋ ክልል'),
      y('Report count', 'የሪፖርት ብዛት'),
      y('Freshness', 'ትኩስነት'),
      y('Gaps shown honestly', 'ክፍተቶች በግልጽ ይታያሉ'),
      n('Explore map', 'ካርታ አስስ'),
      n('Price history', 'የዋጋ ታሪክ'),
      n('Source breakdown', 'የምንጭ ትንተና'),
      n('CSV export', 'CSV ማውጣት'),
    ],
  },
  {
    tier: 'professional',
    nameEn: 'Professional',
    nameAm: 'ፕሮፌሽናል',
    taglineEn: `$${PRO_MONTHLY_PRICE} / month`,
    taglineAm: `$${PRO_MONTHLY_PRICE} / ወር`,
    variant: 'popular',
    features: [
      y('Everything in Public', 'በሕዝባዊ ውስጥ ያለ ሁሉ'),
      y('30-day price history', 'የ30 ቀን የዋጋ ታሪክ'),
      y('Source composition', 'የምንጭ ስብጥር'),
      y('Confidence breakdown', 'የመተማመኛ ትንተና'),
      y('Cross-market comparison', 'የገበያ ንጽጽር'),
      y('Explore map & heatmap', 'ካርታ አስስ & ሂትማፕ'),
      p('CSV export', 'CSV ማውጣት', '1 / day', '1 / ቀን'),
      y('Dashboard Lite', 'ዳሽቦርድ ላይት'),
      n('API access', 'የኤፒአይ መዳረሻ'),
      n('Full history', 'ሙሉ ታሪክ'),
    ],
  },
  {
    tier: 'enterprise',
    nameEn: 'Enterprise',
    nameAm: 'ኢንተርፕራይዝ',
    taglineEn: 'Custom pricing',
    taglineAm: 'ብጁ ዋጋ',
    variant: 'dark',
    features: [
      y('Everything in Professional', 'በፕሮፌሽናል ውስጥ ያለ ሁሉ'),
      y('Full price history', 'ሙሉ የዋጋ ታሪክ'),
      y('Full provenance export', 'ሙሉ የምንጭ ማውጫ'),
      y('API access', 'የኤፒአይ መዳረሻ'),
      y('Basket costing (MEB)', 'የቅርጫት ወጪ (MEB)'),
      y('5 seats', '5 መቀመጫዎች'),
      y('99.5% uptime SLA', '99.5% የአገልግሎት ዋስትና'),
      y('Named account contact', 'የተሰየመ የሂሳብ ተጠሪ'),
      p('Commissioned collection', 'የተልእኮ ስብሰባ', 'add-on', 'ተጨማሪ'),
    ],
  },
]

// "All plans" guarantees shown beneath the plan cards.
export const PLAN_GUARANTEES: { en: string; am: string }[] = [
  { en: 'Gaps always shown — never hidden', am: 'ክፍተቶች ሁሌም ይታያሉ — ፈጽሞ አይደበቁም' },
  { en: 'No imputation at any tier', am: 'በምንም ደረጃ ግምት የለም' },
  { en: 'Provenance on every record', am: 'በእያንዳንዱ መዝገብ ላይ ምንጭ' },
  { en: 'Insufficient-data rows in all exports', am: 'በሁሉም ማውጫዎች የበቂ ያልሆነ ዳታ ረድፎች' },
]

export const CONTACT_EMAIL = 'hello@wagaindex.com'
