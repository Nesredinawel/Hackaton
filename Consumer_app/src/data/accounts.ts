import type {
  UserAccount,
  Tier,
  BillingPlan,
  EnterpriseEnquiry,
  UpdateFrequency,
  GateFeature,
  Lang,
} from './types'
import { PRO_EXPORTS_PER_DAY, HISTORY_DAYS, TRIAL_DAYS } from './types'

/* ─────────────────────────────────────────────────────────────
   Mock account store (localStorage). Public tier = no account.
   This emulates the access model described in the pricing spec.
   ───────────────────────────────────────────────────────────── */

const ACCOUNTS_KEY = 'waga_accounts'
const SESSION_KEY = 'waga_session'
const USAGE_KEY = 'waga_usage'
const ENQUIRIES_KEY = 'waga_enterprise_enquiries'

function today(): string {
  return new Date().toISOString().split('T')[0]
}

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

/* ── Accounts ───────────────────────────────────────────────── */

function allAccounts(): UserAccount[] {
  return read<UserAccount[]>(ACCOUNTS_KEY, [])
}

function persistAccounts(accounts: UserAccount[]): void {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts))
}

/** The currently signed-in account, or null (= public tier). */
export function getAccount(): UserAccount | null {
  const email = read<string | null>(SESSION_KEY, null)
  if (!email) return null
  return allAccounts().find((a) => a.email === email) ?? null
}

/** The effective tier. No account → public. */
export function getTier(): Tier {
  return getAccount()?.tier ?? 'public'
}

export function isSignedIn(): boolean {
  return getAccount() !== null
}

function saveAccount(account: UserAccount): void {
  const accounts = allAccounts()
  const idx = accounts.findIndex((a) => a.email === account.email)
  if (idx >= 0) accounts[idx] = account
  else accounts.push(account)
  persistAccounts(accounts)
}

export type SignUpResult = { ok: true; account: UserAccount } | { ok: false; error: string }

/**
 * Create a Professional account on a free trial.
 * No card required to start (matches P2 spec).
 */
export function signUp(data: {
  fullName: string
  email: string
  password: string
  organisation?: string | null
  language?: Lang
}): SignUpResult {
  const email = data.email.trim().toLowerCase()
  if (!email || !data.password) return { ok: false, error: 'missing_fields' }
  if (allAccounts().some((a) => a.email === email)) {
    return { ok: false, error: 'email_taken' }
  }

  const now = new Date()
  const trialEnds = new Date(now.getTime() + TRIAL_DAYS * 86400000)

  const account: UserAccount = {
    id: `acc_${Date.now()}`,
    email,
    password: data.password,
    fullName: data.fullName.trim(),
    organisation: data.organisation?.trim() || null,
    tier: 'professional',
    subscriptionStatus: 'trial',
    billingPlan: 'monthly',
    trialStartedAt: today(),
    trialEndsAt: trialEnds.toISOString().split('T')[0],
    createdAt: today(),
    language: data.language ?? 'en',
  }

  saveAccount(account)
  localStorage.setItem(SESSION_KEY, JSON.stringify(email))
  return { ok: true, account }
}

export type SignInResult = { ok: true; account: UserAccount } | { ok: false; error: string }

export function signIn(email: string, password: string): SignInResult {
  const normalized = email.trim().toLowerCase()
  const account = allAccounts().find((a) => a.email === normalized)
  if (!account || account.password !== password) {
    return { ok: false, error: 'invalid_credentials' }
  }
  localStorage.setItem(SESSION_KEY, JSON.stringify(normalized))
  return { ok: true, account }
}

/** One-click Professional trial for demos (localStorage only). */
export function startDemoTrial(): SignUpResult {
  const email = 'demo@waga.index'
  const existing = allAccounts().find((a) => a.email === email)
  if (existing) {
    existing.tier = 'professional'
    if (existing.subscriptionStatus === 'none' || existing.subscriptionStatus === 'cancelled') {
      existing.subscriptionStatus = 'trial'
    }
    saveAccount(existing)
    localStorage.setItem(SESSION_KEY, JSON.stringify(email))
    return { ok: true, account: existing }
  }
  return signUp({
    fullName: 'Demo Programme',
    email,
    password: 'demo-waga',
    organisation: 'Waga demo',
    language: 'en',
  })
}

export function signOut(): void {
  localStorage.removeItem(SESSION_KEY)
}

export function setBillingPlan(plan: BillingPlan): UserAccount | null {
  const account = getAccount()
  if (!account) return null
  account.billingPlan = plan
  saveAccount(account)
  return account
}

/** Move an active trial to a paid subscription. */
export function activateSubscription(plan: BillingPlan): UserAccount | null {
  const account = getAccount()
  if (!account) return null
  account.tier = 'professional'
  account.billingPlan = plan
  account.subscriptionStatus = 'active'
  saveAccount(account)
  return account
}

export function cancelSubscription(): UserAccount | null {
  const account = getAccount()
  if (!account) return null
  account.subscriptionStatus = 'cancelled'
  saveAccount(account)
  return account
}

export function updateLanguage(language: Lang): UserAccount | null {
  const account = getAccount()
  if (!account) return null
  account.language = language
  saveAccount(account)
  return account
}

/* ── Usage tracking (exports/day) ───────────────────────────── */

type UsageRecord = { date: string; exportsToday: number }

function getUsage(): UsageRecord {
  const usage = read<UsageRecord>(USAGE_KEY, { date: today(), exportsToday: 0 })
  if (usage.date !== today()) return { date: today(), exportsToday: 0 }
  return usage
}

export function exportsUsedToday(): number {
  if (getTier() === 'public') return 0
  return getUsage().exportsToday
}

/** How many exports the current tier is allowed per day (Infinity = unlimited). */
export function exportQuota(): number {
  const tier = getTier()
  if (tier === 'enterprise') return Infinity
  if (tier === 'professional') return PRO_EXPORTS_PER_DAY
  return 0
}

export function recordExport(): void {
  const usage = getUsage()
  usage.exportsToday += 1
  localStorage.setItem(USAGE_KEY, JSON.stringify(usage))
}

/* ── Access control ─────────────────────────────────────────── */

export type AccessResult = {
  allowed: boolean
  // 'paywall' → not signed in / public; 'upgrade' → signed in but tier too low;
  // 'limit' → correct tier but usage cap hit.
  reason: 'ok' | 'paywall' | 'upgrade' | 'limit'
}

/** Decide whether the current viewer can use a gated feature. */
export function canAccess(feature: GateFeature): AccessResult {
  const tier = getTier()

  // Enterprise-only surfaces.
  const enterpriseOnly: GateFeature[] = ['api', 'basket']
  if (enterpriseOnly.includes(feature)) {
    return tier === 'enterprise'
      ? { allowed: true, reason: 'ok' }
      : { allowed: false, reason: tier === 'public' ? 'paywall' : 'upgrade' }
  }

  // Professional + Enterprise surfaces.
  const proSurfaces: GateFeature[] = [
    'history',
    'source',
    'confidence',
    'comparison',
    'map',
    'dashboard',
    'copilot',
  ]
  if (proSurfaces.includes(feature)) {
    return tier === 'public'
      ? { allowed: false, reason: 'paywall' }
      : { allowed: true, reason: 'ok' }
  }

  // Export — tier + daily quota.
  if (feature === 'export') {
    if (tier === 'public') return { allowed: false, reason: 'paywall' }
    if (exportsUsedToday() >= exportQuota()) return { allowed: false, reason: 'limit' }
    return { allowed: true, reason: 'ok' }
  }

  return { allowed: true, reason: 'ok' }
}

/** History depth in days for the current viewer; null = full history. */
export function historyDepthDays(): number | null {
  const account = getAccount()
  if (!account) return 0
  if (account.tier === 'enterprise') return null
  if (account.tier === 'professional') {
    return account.billingPlan === 'annual' ? HISTORY_DAYS.annual : HISTORY_DAYS.monthly
  }
  return 0
}

/* ── Enterprise enquiries ───────────────────────────────────── */

export function getEnquiries(): EnterpriseEnquiry[] {
  return read<EnterpriseEnquiry[]>(ENQUIRIES_KEY, [])
}

export function submitEnterpriseEnquiry(data: {
  name: string
  organisation: string
  email: string
  useCase: string
  updateFrequency: UpdateFrequency
}): EnterpriseEnquiry {
  const enquiry: EnterpriseEnquiry = {
    id: `enq_${Date.now()}`,
    name: data.name.trim(),
    organisation: data.organisation.trim(),
    email: data.email.trim(),
    useCase: data.useCase.trim(),
    updateFrequency: data.updateFrequency,
    submittedAt: today(),
    status: 'new',
  }
  const enquiries = getEnquiries()
  enquiries.push(enquiry)
  localStorage.setItem(ENQUIRIES_KEY, JSON.stringify(enquiries))
  return enquiry
}
