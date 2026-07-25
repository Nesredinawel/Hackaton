export type Lang = 'en' | 'am'

export type NavScreen =
  | { id: 'home' }
  | { id: 'staples' }
  | { id: 'map' }
  | { id: 'commodity-overview'; commodityId: string }
  | { id: 'price-detail'; commodityId: string; marketId: string }
  | { id: 'price-no-data'; commodityId: string; marketId: string }
  | { id: 'price-confirmed'; commodityId: string; marketId: string }
  | { id: 'agent-register' }
  | { id: 'agent-dashboard' }
  | { id: 'pricing' }
  | { id: 'sign-up' }
  | { id: 'sign-in' }
  | { id: 'account' }
  | { id: 'enterprise-enquiry' }
  | { id: 'upgrade-success' }

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

export type Commodity = {
  id: string
  emoji: string
  en: string
  am: string
  unit: string
  unitAm: string
  img: string
}

export type Market = {
  id: string
  en: string
  am: string
  img: string
  lat: number
  lng: number
}

export type AgentStatus = 'pending' | 'approved' | 'rejected'

export type MarketCode =
  | 'merkato' | 'shola' | 'ehil_berenda' | 'atikilt_tera'
  | 'piazza' | 'saris' | 'akaki' | 'asko' | 'kera' | 'other' | 'either'

export const MARKET_OPTIONS: { code: MarketCode; en: string; am: string }[] = [
  { code: 'merkato', en: 'Merkato', am: 'መርካቶ' },
  { code: 'shola', en: 'Shola Gebeya', am: 'ሸላ ገበያ' },
  { code: 'ehil_berenda', en: 'Ehil Berenda', am: ' tjejer በረንዳ' },
  { code: 'atikilt_tera', en: 'Atikilt Tera', am: 'አትኩልት ጥራ' },
  { code: 'piazza', en: 'Piazza', am: 'ፒያצה' },
  { code: 'saris', en: 'Saris', am: 'ሳሪስ' },
  { code: 'akaki', en: 'Akaki', am: 'አቃቂ' },
  { code: 'asko', en: 'Asko', am: 'አስቆ' },
  { code: 'kera', en: 'Kera', am: 'ከራ' },
  { code: 'other', en: 'Other', am: 'ሌላ' },
  { code: 'either', en: 'Either / Flexible', am: 'የትም ቢሆን' },
]

export type AgentApplication = {
  id: string
  full_name: string
  phone_number: string
  city: string
  subcity: string
  preferred_market_code: MarketCode
  market_label: string
  languages: string
  consent_honest_reporting: boolean
  notes: string | null
  telegram_username: string | null
  status: AgentStatus
  submittedAt: string
  reviewedAt: string | null
}

export type AgentProfile = AgentApplication & {
  approvedAt: string | null
  streak: number
  bestStreak: number
  totalReports: number
  points: number
  level: number
  lastReportDate: string | null
}

export type Redemption = {
  id: string
  amount: number
  phone: string
  status: 'pending' | 'completed'
  requestedAt: string
  completedAt: string | null
}

export const POINTS_PER_REPORT = 10
export const STREAK_BONUS = 5
export const REDEMPTION_THRESHOLD = 500
export const TELEBIRR_RATE = 1

/* ─────────────────────────────────────────────────────────────
   Data access tiers, accounts & pricing
   ───────────────────────────────────────────────────────────── */

// The three access layers. Public is anonymous (no account).
export type Tier = 'public' | 'professional' | 'enterprise'

export type SubscriptionStatus = 'none' | 'trial' | 'active' | 'cancelled' | 'expired'

export type BillingPlan = 'monthly' | 'annual'

export type UpdateFrequency = 'daily' | 'weekly' | 'monthly'

// A registered account. Absence of an account = public tier.
export type UserAccount = {
  id: string
  email: string
  // Mock only — never do this in production. Stored to emulate sign-in.
  password: string
  fullName: string
  organisation: string | null
  tier: Tier
  subscriptionStatus: SubscriptionStatus
  billingPlan: BillingPlan | null
  trialStartedAt: string | null
  trialEndsAt: string | null
  createdAt: string
  language: Lang
}

export type EnterpriseEnquiry = {
  id: string
  name: string
  organisation: string
  email: string
  useCase: string
  updateFrequency: UpdateFrequency
  submittedAt: string
  status: 'new' | 'contacted' | 'qualified' | 'contracted' | 'closed'
}

// Which gated surface a paywall / access check is guarding.
export type GateFeature =
  | 'history'
  | 'source'
  | 'confidence'
  | 'comparison'
  | 'map'
  | 'export'
  | 'api'
  | 'basket'

// Professional export ceiling (per day). Enterprise = unlimited.
export const PRO_EXPORTS_PER_DAY = 1

// History depth by plan, in days. Enterprise = full (null = no limit).
export const HISTORY_DAYS = {
  monthly: 30,
  annual: 90,
} as const

// Pricing anchors (published on the consumer app).
export const PRO_MONTHLY_PRICE = 29
export const PRO_ANNUAL_PRICE = 290
export const TRIAL_DAYS = 14
