import { apiBaseUrl } from './api'

/* Backend JWT session. Separate from the localStorage account store in data/accounts.ts,
   which stays the source of truth for UI tier gating. This layer only exists so that
   authenticated calls (Chapa checkout) can reach the API. */

const ACCESS_KEY = 'waga_access_token'
const REFRESH_KEY = 'waga_refresh_token'

export type TokenBundle = {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
}

export type SessionCredentials = {
  email: string
  password: string
  fullName: string
  organisation: string | null
  language: 'en' | 'am'
}

export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string | null,
    message: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

function storeTokens(bundle: TokenBundle): void {
  localStorage.setItem(ACCESS_KEY, bundle.access_token)
  localStorage.setItem(REFRESH_KEY, bundle.refresh_token)
}

export function clearBackendSession(): void {
  localStorage.removeItem(ACCESS_KEY)
  localStorage.removeItem(REFRESH_KEY)
}

export function hasBackendSession(): boolean {
  return localStorage.getItem(ACCESS_KEY) !== null
}

/** The API returns either {error:{code,message}} or FastAPI's {detail}. Normalise both. */
async function toApiError(response: Response): Promise<ApiError> {
  let code: string | null = null
  let message = `Request failed (${response.status})`
  try {
    const body: unknown = await response.json()
    const envelope = body as { error?: { code?: unknown; message?: unknown }; detail?: unknown }
    const inner = envelope.error
    if (inner && typeof inner.code === 'string') code = inner.code
    if (inner && typeof inner.message === 'string') message = inner.message
    else if (typeof envelope.detail === 'string') message = envelope.detail
  } catch {
    // Non-JSON body — keep the status-based message.
  }
  return new ApiError(response.status, code, message)
}

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${apiBaseUrl()}${path}`, {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!response.ok) throw await toApiError(response)
  return response.json() as Promise<T>
}

export async function backendLogin(email: string, password: string): Promise<TokenBundle> {
  return postJson<TokenBundle>('/auth/login', { email, password })
}

export async function backendRegister(creds: SessionCredentials): Promise<TokenBundle> {
  return postJson<TokenBundle>('/auth/subscriber/register', {
    email: creds.email,
    password: creds.password,
    full_name: creds.fullName || creds.email,
    organisation: creds.organisation,
    language: creds.language,
  })
}

async function refreshSession(): Promise<boolean> {
  const refreshToken = localStorage.getItem(REFRESH_KEY)
  if (!refreshToken) return false
  try {
    storeTokens(await postJson<TokenBundle>('/auth/refresh', { refresh_token: refreshToken }))
    return true
  } catch {
    clearBackendSession()
    return false
  }
}

/**
 * Guarantee a backend session for the given account, reusing any stored tokens.
 * Logs in when the account already exists on the API, registers when it does not.
 */
export async function ensureBackendSession(creds: SessionCredentials): Promise<void> {
  if (hasBackendSession()) return
  try {
    storeTokens(await backendLogin(creds.email, creds.password))
    return
  } catch (error) {
    if (!(error instanceof ApiError) || error.status !== 401) throw error
  }
  try {
    storeTokens(await backendRegister(creds))
  } catch (error) {
    if (error instanceof ApiError && error.status === 409) {
      throw new ApiError(
        409,
        'email_already_registered',
        'This email already has an account on the Waga API with a different password. Sign in with that password, or use another email.',
      )
    }
    throw error
  }
}

/** Authenticated request that transparently refreshes an expired access token once. */
export async function authedRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const send = async (): Promise<Response> =>
    fetch(`${apiBaseUrl()}${path}`, {
      ...init,
      headers: {
        Accept: 'application/json',
        ...(init.body ? { 'Content-Type': 'application/json' } : {}),
        ...(init.headers ?? {}),
        Authorization: `Bearer ${localStorage.getItem(ACCESS_KEY) ?? ''}`,
      },
    })

  let response = await send()
  if (response.status === 401 && (await refreshSession())) {
    response = await send()
  }
  if (!response.ok) throw await toApiError(response)
  return response.json() as Promise<T>
}
