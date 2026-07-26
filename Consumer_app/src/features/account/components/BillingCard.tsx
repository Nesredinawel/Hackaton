import { useEffect, useState } from 'react'
import type { BillingPlan, Lang, SubscriptionPlanInfo } from '@/data'
import { fetchPlans, formatBirr, startChapaCheckout } from '@/data'

/** Amounts come from the API rather than the UI constants, so the price shown is the
    price Chapa will actually charge. */
export default function BillingCard({ lang }: { lang: Lang }) {
  const [plans, setPlans] = useState<SubscriptionPlanInfo[] | null>(null)
  const [busy, setBusy] = useState<BillingPlan | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    void fetchPlans()
      .then((list) => { if (active) setPlans(list) })
      .catch(() => { if (active) setPlans([]) })
    return () => { active = false }
  }, [])

  const amountFor = (plan: BillingPlan): string | null => {
    const match = plans?.find((p) => p.billing_plan === plan)
    return match ? formatBirr(match.amount_etb) : null
  }

  const pay = async (plan: BillingPlan): Promise<void> => {
    setBusy(plan)
    setError(null)
    try {
      const session = await startChapaCheckout(plan)
      window.location.assign(session.checkout_url)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not start checkout.')
      setBusy(null)
    }
  }

  const options: { plan: BillingPlan; labelEn: string; labelAm: string; noteEn: string }[] = [
    { plan: 'monthly', labelEn: 'Pay monthly', labelAm: 'ወርሃዊ ክፈል', noteEn: '30 days of history' },
    { plan: 'annual', labelEn: 'Pay annually', labelAm: 'ዓመታዊ ክፈል', noteEn: '90 days of history · save 17%' },
  ]

  return (
    <div className="bg-[#181818] rounded-2xl border border-[#282828] p-6 mb-6" style={{ boxShadow: '0 8px 8px rgba(0,0,0,0.3)' }}>
      <p className="text-base font-bold text-white mb-1">
        {lang === 'en' ? 'Subscription' : 'ምዝገባ'}
      </p>
      <p className="text-sm text-[#B3B3B3] mb-4">
        {lang === 'en'
          ? 'Pay with Chapa — telebirr, CBE Birr, or card. You will be redirected to Chapa and returned here once it completes.'
          : 'በChapa ይክፈሉ — ተለብር፣ CBE ብር ወይም ካርድ። ወደ Chapa ተመርተው ሲጠናቀቅ ወደዚህ ይመለሳሉ።'}
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        {options.map((option) => {
          const amount = amountFor(option.plan)
          return (
            <button
              key={option.plan}
              type="button"
              disabled={busy !== null}
              onClick={() => void pay(option.plan)}
              className="flex-1 rounded-2xl border border-[#282828] px-5 py-4 text-left transition-colors hover:border-[#1ED760] disabled:opacity-60 disabled:hover:border-[#282828]"
            >
              <span className="block text-sm font-bold text-white">
                {busy === option.plan
                  ? (lang === 'en' ? 'Opening Chapa…' : 'Chapa እየተከፈተ…')
                  : (lang === 'am' ? option.labelAm : option.labelEn)}
              </span>
              <span className="block text-lg font-bold text-[#1ED760] mt-1">
                {amount ? `${amount} ETB` : '—'}
              </span>
              <span className="block text-xs text-[#B3B3B3] mt-0.5">{option.noteEn}</span>
            </button>
          )
        })}
      </div>

      {error && (
        <p className="mt-4 text-sm" style={{ color: '#F3727F' }}>
          {error}
        </p>
      )}
    </div>
  )
}
