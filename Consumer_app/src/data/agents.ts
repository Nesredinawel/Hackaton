import type { AgentProfile, AgentApplication, Redemption, MarketCode } from './types'
import { POINTS_PER_REPORT, STREAK_BONUS, REDEMPTION_THRESHOLD, TELEBIRR_RATE, MARKET_OPTIONS } from './types'

const PROFILE_KEY = 'waga_agent_profile'
const REDEMPTIONS_KEY = 'waga_redemptions'

function today(): string {
  return new Date().toISOString().split('T')[0]
}

function daysBetween(a: string, b: string): number {
  const da = new Date(a)
  const db = new Date(b)
  return Math.floor((db.getTime() - da.getTime()) / 86400000)
}

export function getProfile(): AgentProfile | null {
  try {
    const raw = localStorage.getItem(PROFILE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

export function saveProfile(profile: AgentProfile): void {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
}

export function clearProfile(): void {
  localStorage.removeItem(PROFILE_KEY)
}

export function hasExistingApplication(): boolean {
  return getProfile() !== null
}

export function getApplicationStatus(): 'none' | 'pending' | 'approved' | 'rejected' {
  const p = getProfile()
  if (!p) return 'none'
  return p.status
}

export function marketLabel(code: MarketCode): string {
  const opt = MARKET_OPTIONS.find(o => o.code === code)
  return opt ? opt.en : code
}

export function createApplication(data: {
  full_name: string
  phone_number: string
  city: string
  subcity: string
  preferred_market_code: MarketCode
  market_label: string
  languages: string
  notes: string | null
  telegram_username: string | null
}): AgentProfile {
  const app: AgentApplication = {
    id: `app_${Date.now()}`,
    full_name: data.full_name,
    phone_number: data.phone_number,
    city: data.city,
    subcity: data.subcity,
    preferred_market_code: data.preferred_market_code,
    market_label: data.market_label,
    languages: data.languages,
    consent_honest_reporting: true,
    notes: data.notes,
    telegram_username: data.telegram_username,
    status: 'pending',
    submittedAt: today(),
    reviewedAt: null,
  }

  const profile: AgentProfile = {
    ...app,
    approvedAt: null,
    streak: 0,
    bestStreak: 0,
    totalReports: 0,
    points: 0,
    level: 1,
    lastReportDate: null,
  }

  saveProfile(profile)
  return profile
}

export function approveAgent(): AgentProfile | null {
  const profile = getProfile()
  if (!profile) return null
  profile.status = 'approved'
  profile.approvedAt = today()
  profile.reviewedAt = today()
  saveProfile(profile)
  return profile
}

export function rejectAgent(): AgentProfile | null {
  const profile = getProfile()
  if (!profile) return null
  profile.status = 'rejected'
  profile.reviewedAt = today()
  saveProfile(profile)
  return profile
}

export function recordReport(): AgentProfile | null {
  const profile = getProfile()
  if (!profile || profile.status !== 'approved') return null

  const t = today()

  if (profile.lastReportDate === t) return profile

  const pointsEarned = POINTS_PER_REPORT

  if (profile.lastReportDate) {
    const diff = daysBetween(profile.lastReportDate, t)
    if (diff === 1) {
      profile.streak += 1
      profile.points += pointsEarned + STREAK_BONUS
    } else if (diff > 1) {
      profile.streak = 1
      profile.points += pointsEarned
    }
  } else {
    profile.streak = 1
    profile.points += pointsEarned
  }

  profile.bestStreak = Math.max(profile.bestStreak, profile.streak)
  profile.totalReports += 1
  profile.lastReportDate = t
  profile.level = Math.floor(profile.totalReports / 10) + 1

  saveProfile(profile)
  return profile
}

export function getRedemptions(): Redemption[] {
  try {
    const raw = localStorage.getItem(REDEMPTIONS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

export function requestRedemption(amount: number): Redemption | null {
  const profile = getProfile()
  if (!profile || profile.status !== 'approved') return null
  if (amount < REDEMPTION_THRESHOLD || amount > profile.points) return null

  const redemption: Redemption = {
    id: `red_${Date.now()}`,
    amount,
    phone: profile.phone_number,
    status: 'pending',
    requestedAt: today(),
    completedAt: null,
  }

  const redemptions = getRedemptions()
  redemptions.push(redemption)
  localStorage.setItem(REDEMPTIONS_KEY, JSON.stringify(redemptions))

  profile.points -= amount
  saveProfile(profile)

  return redemption
}

export function completeRedemption(id: string): Redemption | null {
  const redemptions = getRedemptions()
  const red = redemptions.find(r => r.id === id)
  if (!red) return null
  red.status = 'completed'
  red.completedAt = today()
  localStorage.setItem(REDEMPTIONS_KEY, JSON.stringify(redemptions))
  return red
}

export function pointsToBirr(points: number): number {
  return Math.floor(points * TELEBIRR_RATE)
}

export function levelName(level: number): string {
  if (level >= 10) return 'Gold'
  if (level >= 5) return 'Silver'
  return 'Bronze'
}

export function levelColor(level: number): string {
  if (level >= 10) return '#FFA42B'
  if (level >= 5) return '#B3B3B3'
  return '#FFA42B'
}

export function streakEmoji(streak: number): string {
  if (streak >= 30) return '🔥🔥🔥'
  if (streak >= 14) return '🔥🔥'
  if (streak >= 7) return '🔥'
  if (streak >= 3) return '⚡'
  return '✨'
}
