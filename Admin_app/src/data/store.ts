import type {
  AgentProfile,
  EnterpriseEnquiry,
  MarketCode,
  Redemption,
  SubscriptionStatus,
  Tier,
  UserAccount,
} from './types'
import {
  approveApplication,
  clearTokens,
  fetchDashboard,
  getAccessToken,
  listApplications,
  listRedeemRequests,
  login,
  rejectApplication,
  resolveRedeem,
  saveSession,
  savedDisplayName,
  type ApiApplication,
} from '@/lib/api'

/* Shared localStorage keys — same as Consumer_app demo store */

const PROFILE_KEY = 'waga_agent_profile'
const REDEMPTIONS_KEY = 'waga_redemptions'
const ACCOUNTS_KEY = 'waga_accounts'
const ENQUIRIES_KEY = 'waga_enterprise_enquiries'
const ADMIN_SESSION_KEY = 'waga_admin_session'

const DEMO_ADMIN = {
  email: 'admin@waga.com',
  password: 'admin123',
  name: 'Super Admin',
}

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

/* ── Admin auth ─────────────────────────────────────────────── */

export function isAdminSignedIn(): boolean {
  return Boolean(getAccessToken()) || read<string | null>(ADMIN_SESSION_KEY, null) === DEMO_ADMIN.email
}

export type AdminSignInResult = { ok: true } | { ok: false; error: string }

export async function adminSignIn(email: string, password: string): Promise<AdminSignInResult> {
  const normalized = email.trim().toLowerCase()
  try {
    const tokens = await login(normalized, password)
    const name =
      tokens.user?.display_name
      || tokens.user?.full_name
      || tokens.user?.email
      || DEMO_ADMIN.name
    saveSession(tokens.access_token, tokens.refresh_token, name)
    localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(normalized))
    return { ok: true }
  } catch (error) {
    // Offline / demo fallback for local mock password only.
    if (normalized === DEMO_ADMIN.email && password === DEMO_ADMIN.password) {
      localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(DEMO_ADMIN.email))
      return { ok: true }
    }
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'invalid_credentials',
    }
  }
}

export function adminSignOut(): void {
  clearTokens()
  localStorage.removeItem(ADMIN_SESSION_KEY)
}

export function adminDisplayName(): string {
  return savedDisplayName() || DEMO_ADMIN.name
}

/* ── Agents (live applications API) ───────────────────────── */

function mapApplication(row: ApiApplication): AgentProfile {
  return {
    id: row.id,
    full_name: row.full_name,
    phone_number: row.phone_number,
    city: row.city,
    subcity: row.subcity ?? '',
    preferred_market_code: row.preferred_market_code as MarketCode,
    market_label: row.preferred_market_code,
    languages: row.languages ?? '',
    consent_honest_reporting: true,
    notes: row.notes,
    telegram_username: row.telegram_username,
    status: row.status as AgentProfile['status'],
    submittedAt: row.created_at?.slice(0, 10) ?? today(),
    reviewedAt: row.reviewed_at?.slice(0, 10) ?? null,
    approvedAt: row.status === 'approved' ? row.reviewed_at?.slice(0, 10) ?? null : null,
    streak: 0,
    bestStreak: 0,
    totalReports: 0,
    points: 0,
    level: 1,
    lastReportDate: null,
  }
}

export async function fetchPendingApplications(): Promise<AgentProfile[]> {
  try {
    const rows = await listApplications('pending')
    return rows.map(mapApplication)
  } catch (error) {
    console.warn('fetchPendingApplications failed', error)
    const local = getAgentProfile()
    return local && local.status === 'pending' ? [local] : []
  }
}

export function getAgentProfile(): AgentProfile | null {
  return read<AgentProfile | null>(PROFILE_KEY, null)
}

export async function approveAgent(applicationId?: string): Promise<AgentProfile | null> {
  if (applicationId && getAccessToken()) {
    const row = await approveApplication(applicationId)
    return mapApplication(row)
  }
  const profile = getAgentProfile()
  if (!profile) return null
  profile.status = 'approved'
  profile.approvedAt = today()
  profile.reviewedAt = today()
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
  return profile
}

export async function rejectAgent(applicationId?: string): Promise<AgentProfile | null> {
  if (applicationId && getAccessToken()) {
    const row = await rejectApplication(applicationId)
    return mapApplication(row)
  }
  const profile = getAgentProfile()
  if (!profile) return null
  profile.status = 'rejected'
  profile.reviewedAt = today()
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
  return profile
}

export async function loadLiveDashboardStats(): Promise<{
  pendingAgents: number
  approvedAgents: number
  pendingRedemptions: number
  totalAccounts: number
  totalEnquiries: number
} | null> {
  try {
    const dash = await fetchDashboard()
    const s = dash.stats ?? {}
    return {
      pendingAgents: Number(s.pending_agents ?? 0),
      approvedAgents: Number(s.approved_agents ?? 0),
      pendingRedemptions: Number(s.pending_redemptions ?? 0),
      totalAccounts: Number(s.total_accounts ?? 0),
      totalEnquiries: Number(s.total_enquiries ?? 0),
    }
  } catch {
    return null
  }
}

export async function fetchLiveRedemptions(): Promise<Redemption[]> {
  try {
    const rows = await listRedeemRequests('pending')
    return rows.map((row) => ({
      id: row.id,
      amount: Number(row.points_redeemed),
      phone: row.telegram_id ?? '—',
      status: row.status === 'paid' ? 'completed' : 'pending',
      requestedAt: row.created_at?.slice(0, 10) ?? today(),
      completedAt: row.resolved_at?.slice(0, 10) ?? null,
    }))
  } catch {
    return getRedemptions()
  }
}

export async function completeLiveRedemption(id: string): Promise<void> {
  if (getAccessToken()) {
    await resolveRedeem(id, 'paid')
    return
  }
  completeRedemption(id)
}

/* ── Accounts ─────────────────────────────────────────────── */

export function getAllAccounts(): UserAccount[] {
  return read<UserAccount[]>(ACCOUNTS_KEY, [])
}

export function updateAccountTier(email: string, tier: Tier): UserAccount | null {
  const accounts = getAllAccounts()
  const account = accounts.find((a) => a.email === email)
  if (!account) return null
  account.tier = tier
  if (tier === 'enterprise') {
    account.subscriptionStatus = 'active'
  }
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts))
  return account
}

export function updateAccountStatus(email: string, status: SubscriptionStatus): UserAccount | null {
  const accounts = getAllAccounts()
  const account = accounts.find((a) => a.email === email)
  if (!account) return null
  account.subscriptionStatus = status
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts))
  return account
}

/* ── Enterprise enquiries ─────────────────────────────────── */

export function getEnquiries(): EnterpriseEnquiry[] {
  return read<EnterpriseEnquiry[]>(ENQUIRIES_KEY, [])
}

export function updateEnquiryStatus(
  id: string,
  status: EnterpriseEnquiry['status'],
): EnterpriseEnquiry | null {
  const enquiries = getEnquiries()
  const enquiry = enquiries.find((e) => e.id === id)
  if (!enquiry) return null
  enquiry.status = status
  localStorage.setItem(ENQUIRIES_KEY, JSON.stringify(enquiries))
  return enquiry
}

/* ── Redemptions ──────────────────────────────────────────── */

export function getRedemptions(): Redemption[] {
  return read<Redemption[]>(REDEMPTIONS_KEY, [])
}

export function completeRedemption(id: string): Redemption | null {
  const redemptions = getRedemptions()
  const red = redemptions.find((r) => r.id === id)
  if (!red) return null
  red.status = 'completed'
  red.completedAt = today()
  localStorage.setItem(REDEMPTIONS_KEY, JSON.stringify(redemptions))
  return red
}

/* ── Dashboard stats ──────────────────────────────────────── */

export type LinePoint = { label: string; value: number }
export type BarPoint = { label: string; value: number; color?: string }

export function getDashboardStats() {
  const agent = getAgentProfile()
  const accounts = getAllAccounts()
  const enquiries = getEnquiries()
  const redemptions = getRedemptions()

  const totalRedemptionPoints = redemptions.reduce((s, r) => s + r.amount, 0)
  const trialAccounts = accounts.filter((a) => a.subscriptionStatus === 'trial').length
  const activeAccounts = accounts.filter((a) => a.subscriptionStatus === 'active').length

  return {
    pendingAgents: agent?.status === 'pending' ? 1 : 0,
    approvedAgents: agent?.status === 'approved' ? 1 : 0,
    rejectedAgents: agent?.status === 'rejected' ? 1 : 0,
    totalAccounts: accounts.length,
    proAccounts: accounts.filter((a) => a.tier === 'professional').length,
    enterpriseAccounts: accounts.filter((a) => a.tier === 'enterprise').length,
    trialAccounts,
    activeAccounts,
    newEnquiries: enquiries.filter((e) => e.status === 'new').length,
    totalEnquiries: enquiries.length,
    pendingRedemptions: redemptions.filter((r) => r.status === 'pending').length,
    completedRedemptions: redemptions.filter((r) => r.status === 'completed').length,
    totalRedemptionPoints,
    agentReports: agent?.totalReports ?? 0,
    agentPoints: agent?.points ?? 0,
  }
}

export function getDashboardAnalytics() {
  const stats = getDashboardStats()
  const accounts = getAllAccounts()
  const enquiries = getEnquiries()
  const redemptions = getRedemptions()

  const scale = Math.max(1, stats.totalAccounts + stats.totalEnquiries + stats.pendingAgents + 2)

  const weeklyActivity: LinePoint[] = [
    { label: 'Mon', value: Math.round(scale * 0.72) },
    { label: 'Tue', value: Math.round(scale * 0.85) },
    { label: 'Wed', value: Math.round(scale * 0.78) },
    { label: 'Thu', value: Math.round(scale * 0.94) },
    { label: 'Fri', value: Math.round(scale * 1.05) },
    { label: 'Sat', value: Math.round(scale * 0.68) },
    { label: 'Sun', value: Math.round(scale * 0.74) },
  ]

  const subscriptionMix: BarPoint[] = [
    {
      label: 'Trial',
      value: accounts.filter((a) => a.subscriptionStatus === 'trial').length,
      color: 'var(--announcement)',
    },
    {
      label: 'Active',
      value: accounts.filter((a) => a.subscriptionStatus === 'active').length,
      color: 'var(--green)',
    },
    {
      label: 'Pro',
      value: stats.proAccounts,
      color: 'var(--green)',
    },
    {
      label: 'Enterprise',
      value: stats.enterpriseAccounts,
      color: '#a78bfa',
    },
  ]

  const enquiryPipeline: BarPoint[] = (
    ['new', 'contacted', 'qualified', 'contracted', 'closed'] as const
  ).map((stage, i) => ({
    label: stage.charAt(0).toUpperCase() + stage.slice(1),
    value: enquiries.filter((e) => e.status === stage).length,
    color: ['var(--announcement)', 'var(--warning)', 'var(--green)', '#a78bfa', 'var(--text-dim)'][i],
  }))

  const redemptionTrend: LinePoint[] = [
    { label: 'W1', value: Math.max(0, stats.completedRedemptions) },
    { label: 'W2', value: Math.max(0, stats.pendingRedemptions + 1) },
    { label: 'W3', value: Math.max(0, stats.pendingRedemptions) },
    { label: 'W4', value: Math.max(0, stats.completedRedemptions + stats.pendingRedemptions) },
  ]

  const operationsLoad: BarPoint[] = [
    { label: 'Agents', value: stats.pendingAgents + stats.approvedAgents, color: 'var(--warning)' },
    { label: 'Accounts', value: stats.totalAccounts, color: 'var(--green)' },
    { label: 'Leads', value: stats.totalEnquiries, color: 'var(--announcement)' },
    { label: 'Payouts', value: stats.pendingRedemptions + stats.completedRedemptions, color: 'var(--negative)' },
  ]

  const mrrEstimate = stats.proAccounts * 29 + stats.enterpriseAccounts * 499

  return {
    weeklyActivity,
    subscriptionMix,
    enquiryPipeline,
    redemptionTrend,
    operationsLoad,
    mrrEstimate,
    conversionRate: stats.totalEnquiries
      ? Math.round(((stats.enterpriseAccounts + stats.proAccounts) / Math.max(1, stats.totalEnquiries)) * 100)
      : 0,
  }
}

export function getNavBadges() {
  const stats = getDashboardStats()
  return {
    agents: stats.pendingAgents,
    accounts: stats.totalAccounts,
    enterprise: stats.newEnquiries,
    redemptions: stats.pendingRedemptions,
  }
}

export function pointsToBirr(points: number): number {
  return Math.floor(points)
}

/** Populate demo records when localStorage is empty (useful when admin runs on a separate port). */
export function seedDemoData(): void {
  if (!getAgentProfile()) {
    const profile = {
      id: 'app_demo',
      full_name: 'Selam Tadesse',
      phone_number: '+251911234567',
      city: 'Addis Ababa',
      subcity: 'Kirkos',
      preferred_market_code: 'merkato' as const,
      market_label: 'Merkato',
      languages: 'Amharic, English',
      consent_honest_reporting: true,
      notes: 'Available weekday mornings. Has Telegram.',
      telegram_username: 'selam_reports',
      status: 'pending' as const,
      submittedAt: today(),
      reviewedAt: null,
      approvedAt: null,
      streak: 0,
      bestStreak: 0,
      totalReports: 0,
      points: 0,
      level: 1,
      lastReportDate: null,
    }
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
  }

  if (getAllAccounts().length === 0) {
    localStorage.setItem(
      ACCOUNTS_KEY,
      JSON.stringify([
        {
          id: 'acc_demo_1',
          email: 'demo@waga.com',
          password: 'demo123',
          fullName: 'Demo Subscriber',
          organisation: 'Addis Foods Co.',
          tier: 'professional',
          subscriptionStatus: 'trial',
          billingPlan: 'monthly',
          trialStartedAt: today(),
          trialEndsAt: today(),
          createdAt: today(),
          language: 'en',
        },
        {
          id: 'acc_demo_2',
          email: 'hanna@grain.et',
          password: 'demo123',
          fullName: 'Hanna Bekele',
          organisation: 'Ethiopian Grain Council',
          tier: 'enterprise',
          subscriptionStatus: 'active',
          billingPlan: 'annual',
          trialStartedAt: null,
          trialEndsAt: null,
          createdAt: today(),
          language: 'en',
        },
        {
          id: 'acc_demo_3',
          email: 'yohannes@coop.et',
          password: 'demo123',
          fullName: 'Yohannes Alemu',
          organisation: 'Mercato Traders Union',
          tier: 'professional',
          subscriptionStatus: 'active',
          billingPlan: 'monthly',
          trialStartedAt: today(),
          trialEndsAt: today(),
          createdAt: today(),
          language: 'am',
        },
      ]),
    )
  }

  if (getEnquiries().length === 0) {
    localStorage.setItem(
      ENQUIRIES_KEY,
      JSON.stringify([
        {
          id: 'enq_demo_1',
          name: 'Hanna Bekele',
          organisation: 'Ethiopian Grain Council',
          email: 'hanna@grain.et',
          useCase: 'Weekly staple price monitoring for member cooperatives.',
          updateFrequency: 'weekly',
          submittedAt: today(),
          status: 'new',
        },
        {
          id: 'enq_demo_2',
          name: 'Samuel T.',
          organisation: 'AgriTech Ethiopia',
          email: 'samuel@agritech.et',
          useCase: 'API integration for procurement dashboard.',
          updateFrequency: 'daily',
          submittedAt: today(),
          status: 'contacted',
        },
        {
          id: 'enq_demo_3',
          name: 'Meron G.',
          organisation: 'UN WFP Field Office',
          email: 'meron@wfp.org',
          useCase: 'Basket index for food security reporting.',
          updateFrequency: 'weekly',
          submittedAt: today(),
          status: 'qualified',
        },
      ]),
    )
  }

  if (getRedemptions().length === 0) {
    localStorage.setItem(
      REDEMPTIONS_KEY,
      JSON.stringify([
        {
          id: 'red_demo_1',
          amount: 600,
          phone: '+251911234567',
          status: 'pending',
          requestedAt: today(),
          completedAt: null,
        },
        {
          id: 'red_demo_2',
          amount: 500,
          phone: '+251922345678',
          status: 'completed',
          requestedAt: today(),
          completedAt: today(),
        },
      ]),
    )
  }
}
