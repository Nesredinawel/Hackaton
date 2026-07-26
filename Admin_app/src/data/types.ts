export type Lang = 'en' | 'am'

export type AgentStatus = 'pending' | 'approved' | 'rejected'

export type MarketCode =
  | 'merkato' | 'shola' | 'ehil_berenda' | 'atikilt_tera'
  | 'piazza' | 'saris' | 'akaki' | 'asko' | 'kera' | 'other' | 'either'

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

export type Tier = 'public' | 'professional' | 'enterprise'

export type SubscriptionStatus = 'none' | 'trial' | 'active' | 'cancelled' | 'expired'

export type BillingPlan = 'monthly' | 'annual'

export type UpdateFrequency = 'daily' | 'weekly' | 'monthly'

export type UserAccount = {
  id: string
  email: string
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

export type AdminScreen =
  | { id: 'dashboard' }
  | { id: 'agents' }
  | { id: 'accounts' }
  | { id: 'payments' }
  | { id: 'plans' }
  | { id: 'enterprise' }
  | { id: 'redemptions' }

export const TELEBIRR_RATE = 1
