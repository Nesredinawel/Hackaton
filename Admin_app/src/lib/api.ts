const API_URL = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '')
  ?? 'https://waga-2h0w.onrender.com/api/v1'

const TOKEN_KEY = 'waga_admin_access_token'
const REFRESH_KEY = 'waga_admin_refresh_token'
const NAME_KEY = 'waga_admin_display_name'

export function apiBaseUrl(): string {
  return API_URL
}

export function getAccessToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function clearTokens(): void {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(REFRESH_KEY)
  localStorage.removeItem(NAME_KEY)
}

export function saveSession(access: string, refresh: string, displayName?: string): void {
  localStorage.setItem(TOKEN_KEY, access)
  localStorage.setItem(REFRESH_KEY, refresh)
  if (displayName) localStorage.setItem(NAME_KEY, displayName)
}

export function savedDisplayName(): string {
  return localStorage.getItem(NAME_KEY) ?? 'Admin'
}

async function parseError(response: Response): Promise<string> {
  const text = await response.text()
  try {
    const json = JSON.parse(text) as { detail?: unknown; error?: { message?: string } }
    if (typeof json.detail === 'string') return json.detail
    if (json.error?.message) return json.error.message
  } catch {
    /* ignore */
  }
  return text.slice(0, 200) || `HTTP ${response.status}`
}

export async function apiFetch<T>(
  path: string,
  init: RequestInit & { auth?: boolean } = {},
): Promise<T> {
  const headers = new Headers(init.headers)
  headers.set('Accept', 'application/json')
  if (init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }
  if (init.auth !== false) {
    const token = getAccessToken()
    if (token) headers.set('Authorization', `Bearer ${token}`)
  }
  const response = await fetch(`${API_URL}${path}`, { ...init, headers })
  if (!response.ok) {
    throw new Error(await parseError(response))
  }
  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}

export type TokenResponse = {
  access_token: string
  refresh_token: string
  token_type: string
  user?: { email?: string; display_name?: string; full_name?: string }
}

export async function login(email: string, password: string): Promise<TokenResponse> {
  return apiFetch<TokenResponse>('/auth/login', {
    method: 'POST',
    auth: false,
    body: JSON.stringify({ email, password }),
  })
}

export type ApiApplication = {
  id: string
  telegram_id: string
  telegram_username: string | null
  full_name: string
  phone_number: string
  city: string
  subcity: string | null
  preferred_market_code: string
  visit_frequency: string
  languages: string | null
  notes: string | null
  status: string
  created_at: string
  reviewed_at: string | null
}

export async function listApplications(status = 'pending'): Promise<ApiApplication[]> {
  return apiFetch<ApiApplication[]>(`/admin/agent-applications?status=${encodeURIComponent(status)}`)
}

export async function approveApplication(id: string): Promise<ApiApplication> {
  return apiFetch<ApiApplication>(`/admin/agent-applications/${id}/approve`, { method: 'POST' })
}

export async function rejectApplication(id: string, reviewNote?: string): Promise<ApiApplication> {
  return apiFetch<ApiApplication>(`/admin/agent-applications/${id}/reject`, {
    method: 'POST',
    body: JSON.stringify({ review_note: reviewNote ?? null }),
  })
}

export type DashboardPayload = {
  stats: Record<string, number>
  analytics?: unknown
}

export async function fetchDashboard(): Promise<DashboardPayload> {
  return apiFetch<DashboardPayload>('/admin/dashboard')
}

export type ApiRedeem = {
  id: string
  telegram_id: string
  points_redeemed: number
  birr_amount: string | number
  status: string
  created_at: string
  resolved_at: string | null
}

export async function listRedeemRequests(status = 'pending'): Promise<ApiRedeem[]> {
  return apiFetch<ApiRedeem[]>(
    `/admin/agent-rewards/redeem-requests?status=${encodeURIComponent(status)}`,
  )
}

export async function resolveRedeem(id: string, status: 'paid' | 'rejected'): Promise<ApiRedeem> {
  return apiFetch<ApiRedeem>(`/admin/agent-rewards/redeem-requests/${id}/resolve`, {
    method: 'POST',
    body: JSON.stringify({ status }),
  })
}
