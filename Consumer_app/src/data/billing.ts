import { apiGet } from '@/lib/api'
import {
  ApiError, authedRequest, clearBackendSession, ensureBackendSession,
  type SessionCredentials,
} from '@/lib/session'
import { activateSubscription, getAccount } from './accounts'
import type { BillingPlan } from './types'

/* Real Chapa checkout against the Waga API.
   Flow: create a checkout -> send the browser to Chapa -> Chapa returns to the app with
   ?payment_id=... -> poll the API, which verifies with Chapa and activates the plan. */

export type PaymentStatus = 'pending' | 'succeeded' | 'failed'

export type SubscriptionPlanInfo = {
  id: string
  code: string
  tier: string
  billing_plan: BillingPlan
  name_en: string
  amount_etb: string
  trial_days: number
  exports_per_day: number
  history_days: number
}

export type CheckoutSession = {
  payment_id: string
  tx_ref: string
  checkout_url: string
  amount_etb: string
  billing_plan: BillingPlan
  status: PaymentStatus
}

export type PaymentRecord = {
  id: string
  amount_etb: string
  billing_plan: BillingPlan
  status: PaymentStatus
  tx_ref: string
  chapa_ref_id: string | null
  checkout_url: string | null
  failure_reason: string | null
  confirmed_at: string | null
  created_at: string
}

const PAYMENT_PARAM = 'payment_id'

export async function fetchPlans(): Promise<SubscriptionPlanInfo[]> {
  return apiGet<SubscriptionPlanInfo[]>('/plans')
}

/** Amount in birr for a plan, formatted with thousands separators. */
export function formatBirr(amount: string | number): string {
  const value = typeof amount === 'string' ? Number(amount) : amount
  if (!Number.isFinite(value)) return '—'
  return value.toLocaleString('en-US', { maximumFractionDigits: 0 })
}

function credentialsForCurrentAccount(): SessionCredentials {
  const account = getAccount()
  if (!account) {
    throw new ApiError(401, 'not_signed_in', 'Sign in before starting a subscription.')
  }
  return {
    email: account.email,
    password: account.password,
    fullName: account.fullName,
    organisation: account.organisation,
    language: account.language,
  }
}

/** Retry once from a clean session, so a stale stored token cannot strand the user. */
async function withBackendSession<T>(run: () => Promise<T>): Promise<T> {
  const creds = credentialsForCurrentAccount()
  await ensureBackendSession(creds)
  try {
    return await run()
  } catch (cause) {
    if (!(cause instanceof ApiError) || cause.status !== 401) throw cause
    clearBackendSession()
    await ensureBackendSession(creds)
    return run()
  }
}

/**
 * Create a Chapa checkout for the signed-in account.
 * Throws ApiError with a readable message when Chapa or the API refuses.
 */
export async function startChapaCheckout(plan: BillingPlan): Promise<CheckoutSession> {
  return withBackendSession(() =>
    authedRequest<CheckoutSession>('/subscriptions/checkout', {
      method: 'POST',
      body: JSON.stringify({ billing_plan: plan }),
    }),
  )
}

export async function fetchPayment(paymentId: string): Promise<PaymentRecord> {
  return withBackendSession(() =>
    authedRequest<PaymentRecord>(`/subscriptions/checkout/${paymentId}`),
  )
}

/**
 * Poll until the payment leaves `pending`. Each call makes the API re-verify with Chapa,
 * so a slow mobile-money confirmation still resolves without a webhook.
 */
export async function waitForPayment(
  paymentId: string,
  { attempts = 8, delayMs = 2500 }: { attempts?: number; delayMs?: number } = {},
): Promise<PaymentRecord> {
  let last = await fetchPayment(paymentId)
  for (let i = 1; i < attempts && last.status === 'pending'; i += 1) {
    await new Promise((resolve) => setTimeout(resolve, delayMs))
    last = await fetchPayment(paymentId)
  }
  return last
}

/** The payment id Chapa appended to the return URL, if this load is a payment return. */
export function readPaymentIdFromUrl(): string | null {
  if (typeof window === 'undefined') return null
  const value = new URLSearchParams(window.location.search).get(PAYMENT_PARAM)
  return value && value.trim() ? value.trim() : null
}

/** Drop the payment id so a refresh does not re-run verification. */
export function clearPaymentIdFromUrl(): void {
  if (typeof window === 'undefined') return
  const url = new URL(window.location.href)
  url.searchParams.delete(PAYMENT_PARAM)
  window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`)
}

export type PaymentOutcome =
  | { status: 'succeeded'; plan: BillingPlan; amountEtb: string }
  | { status: 'failed'; reason: string }
  | { status: 'pending' }

/**
 * Resolve a return from Chapa and, on success, promote the local account to a paid plan.
 * The API is authoritative for the payment result; the local store only mirrors it.
 */
export async function finalisePaymentReturn(paymentId: string): Promise<PaymentOutcome> {
  const payment = await waitForPayment(paymentId)
  if (payment.status === 'succeeded') {
    activateSubscription(payment.billing_plan)
    return { status: 'succeeded', plan: payment.billing_plan, amountEtb: payment.amount_etb }
  }
  if (payment.status === 'failed') {
    return { status: 'failed', reason: payment.failure_reason ?? 'chapa_payment_failed' }
  }
  return { status: 'pending' }
}
