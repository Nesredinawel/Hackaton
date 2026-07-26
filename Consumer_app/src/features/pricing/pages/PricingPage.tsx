import { useState } from 'react'
import type { Lang, NavScreen, Plan, PlanFeature, BillingPlan } from '@/data'
import { PLANS, PLAN_GUARANTEES, CONTACT_EMAIL, PRO_MONTHLY_PRICE, PRO_ANNUAL_PRICE } from '@/data'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const display = { fontFamily: "'SpotifyMixUITitle','CircularSp','Helvetica Neue',Helvetica,Arial,sans-serif" } as const
const sectionTitle = 'text-[11px] font-bold uppercase tracking-[0.14em] text-primary'

function FeatureRow({ f, lang, enterprise }: { f: PlanFeature; lang: Lang; enterprise?: boolean }) {
  const label = lang === 'am' ? f.am : f.en
  const note = lang === 'am' ? f.noteAm : f.noteEn

  const mark =
    f.state === 'yes' ? <span className="text-primary">✓</span>
    : f.state === 'partial' ? <span className="text-[var(--warning)]">◐</span>
    : <span className="text-muted-foreground">✗</span>

  return (
    <li className="flex items-start gap-2.5 py-1.5">
      <span className="mt-0.5 text-sm flex-shrink-0 w-4 text-center font-bold">{mark}</span>
      <span className={cn('text-sm leading-snug', f.state === 'no' ? 'text-muted-foreground' : enterprise ? 'text-white/85' : 'text-muted-foreground')}>
        {label}
        {note && (
          <span className={cn('ml-1.5 text-xs', enterprise ? 'text-white/55' : 'text-muted-foreground')}>· {note}</span>
        )}
      </span>
    </li>
  )
}

function PlanCard({ plan, lang, billing, navigate }: {
  plan: Plan
  lang: Lang
  billing: BillingPlan
  navigate: (s: NavScreen) => void
}) {
  const enterprise = plan.variant === 'dark'
  const popular = plan.variant === 'popular'

  const priceLabel =
    plan.tier === 'professional'
      ? billing === 'annual'
        ? `$${PRO_ANNUAL_PRICE} / ${lang === 'en' ? 'year' : 'ዓመት'}`
        : `$${PRO_MONTHLY_PRICE} / ${lang === 'en' ? 'month' : 'ወር'}`
      : lang === 'am' ? plan.taglineAm : plan.taglineEn

  const cta =
    plan.tier === 'public'
      ? { label: lang === 'en' ? 'Browse staples →' : 'ምግቦችን አስስ →', action: () => navigate({ id: 'staples' }), variant: 'secondary' as const }
      : plan.tier === 'professional'
        ? { label: lang === 'en' ? 'Start Professional →' : 'ፕሮፌሽናል ጀምር →', action: () => navigate({ id: 'sign-up' }), variant: 'default' as const }
        : { label: lang === 'en' ? 'Talk to us →' : 'አነጋግረን →', action: () => navigate({ id: 'enterprise-enquiry' }), variant: 'default' as const }

  return (
    <Card
      className={cn(
        'relative flex flex-col',
        enterprise && 'pricing-card-enterprise border-transparent bg-[#121212] text-white',
        popular && 'ring-2 ring-primary',
      )}
    >
      {popular && (
        <Badge className="absolute -top-3 left-6">
          {lang === 'en' ? 'Most popular' : 'ተመራጭ'}
        </Badge>
      )}

      <CardHeader>
        <CardTitle className={cn('text-sm font-bold', !enterprise && 'text-foreground')}>
          {lang === 'am' ? plan.nameAm : plan.nameEn}
        </CardTitle>
        <p
          className={enterprise ? 'text-white' : 'text-foreground'}
          style={{ ...display, fontSize: 30, fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.1 }}
        >
          {priceLabel}
        </p>
        {plan.tier === 'professional' && billing === 'annual' && (
          <p className="text-xs text-primary font-semibold">{lang === 'en' ? 'Save 17%' : '17% ቁጠባ'}</p>
        )}
        {plan.tier === 'public' && (
          <p className={cn('text-xs', enterprise ? 'text-white/55' : 'text-muted-foreground')}>
            {lang === 'en' ? 'No card. No expiry.' : 'ካርድ የለም። ማብቂያ የለም።'}
          </p>
        )}
        {plan.tier === 'enterprise' && (
          <p className="text-xs text-white/55">{lang === 'en' ? 'Annual contract' : 'ዓመታዊ ውል'}</p>
        )}
      </CardHeader>

      <CardContent className="flex-1">
        <ul>
          {plan.features.map(f => (
            <FeatureRow key={f.en} f={f} lang={lang} enterprise={enterprise} />
          ))}
        </ul>
      </CardContent>

      <CardFooter className="flex-col gap-3 border-0 bg-transparent pt-0">
        <Button variant={cta.variant} className="w-full" onClick={cta.action}>
          {cta.label}
        </Button>
        {plan.tier === 'professional' && (
          <p className={cn('text-[13px] text-center', enterprise ? 'text-white/55' : 'text-muted-foreground')}>
            {lang === 'en' ? '14-day free trial' : 'የ14 ቀን ነጻ ሙከራ'}
          </p>
        )}
      </CardFooter>
    </Card>
  )
}

export default function PricingPage({ lang, navigate }: { lang: Lang; navigate: (s: NavScreen) => void }) {
  const [billing, setBilling] = useState<BillingPlan>('annual')

  return (
    <div className="theme-bg min-h-full">
      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-8 lg:py-16">
        <div className="max-w-2xl mb-10">
          <p className={sectionTitle + ' mb-2'}>
            {lang === 'en' ? 'Pricing' : 'ዋጋ'}
          </p>
          <h1 className="text-foreground font-bold mb-3" style={{ ...display, fontSize: 'clamp(30px,4vw,44px)', letterSpacing: '-0.03em' }}>
            {lang === 'en' ? 'Plans' : 'ዕቅዶች'}
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed">
            {lang === 'en'
              ? 'Data access for everyone. Depth for those who need it.'
              : 'ዳታ ለሁሉም። ጥልቀት ለሚፈልጉት።'}
          </p>
        </div>

        <div className="flex justify-start lg:justify-end mb-8">
          <div className="pricing-billing-toggle inline-flex rounded-full p-1">
            <Button
              type="button"
              variant={billing === 'monthly' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setBilling('monthly')}
              className="rounded-full"
            >
              {lang === 'en' ? 'Monthly' : 'ወርሃዊ'}
            </Button>
            <Button
              type="button"
              variant={billing === 'annual' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setBilling('annual')}
              className="rounded-full"
            >
              {lang === 'en' ? 'Annual −17%' : 'ዓመታዊ −17%'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {PLANS.map(plan => (
            <PlanCard key={plan.tier} plan={plan} lang={lang} billing={billing} navigate={navigate} />
          ))}
        </div>

        <div className="mt-14">
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-5">
            {lang === 'en' ? 'All plans' : 'ሁሉም ዕቅዶች'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PLAN_GUARANTEES.map(g => (
              <Card key={g.en} size="sm">
                <CardContent className="flex items-start gap-2.5 pt-0">
                  <span className="text-primary font-bold">✓</span>
                  <span className="text-sm text-muted-foreground">{lang === 'am' ? g.am : g.en}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-2 text-sm">
          <span className="text-muted-foreground">{lang === 'en' ? 'Questions?' : 'ጥያቄ አለዎት?'}</span>
          <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-primary hover:underline">{CONTACT_EMAIL}</a>
        </div>
      </div>
    </div>
  )
}
