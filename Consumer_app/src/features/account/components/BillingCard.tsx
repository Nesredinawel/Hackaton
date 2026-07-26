import { useEffect, useState } from 'react'
import type { BillingPlan, Lang, SubscriptionPlanInfo } from '@/data'
import { fetchPlans, formatBirr, startChapaCheckout } from '@/data'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

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
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-base">
          {lang === 'en' ? 'Subscription' : 'ምዝገባ'}
        </CardTitle>
        <CardDescription>
          {lang === 'en'
            ? 'Pay with Chapa — telebirr, CBE Birr, or card. You will be redirected to Chapa and returned here once it completes.'
            : 'በChapa ይክፈሉ — ተለብር፣ CBE ብር ወይም ካርድ። ወደ Chapa ተመርተው ሲጠናቀቅ ወደዚህ ይመለሳሉ።'}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 pt-0">
        <div className="flex flex-col sm:flex-row gap-3">
          {options.map((option) => {
            const amount = amountFor(option.plan)
            return (
              <Button
                key={option.plan}
                type="button"
                variant="outline"
                disabled={busy !== null}
                onClick={() => void pay(option.plan)}
                className="flex-1 h-auto flex-col items-start rounded-xl px-5 py-4 text-left hover:border-primary"
              >
                <span className="block text-sm font-bold text-foreground">
                  {busy === option.plan
                    ? (lang === 'en' ? 'Opening Chapa…' : 'Chapa እየተከፈተ…')
                    : (lang === 'am' ? option.labelAm : option.labelEn)}
                </span>
                <span className="block text-lg font-bold text-primary mt-1">
                  {amount ? `${amount} ETB` : '—'}
                </span>
                <span className="block text-xs text-muted-foreground mt-0.5 font-normal">{option.noteEn}</span>
              </Button>
            )
          })}
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
