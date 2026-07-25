import { useState } from 'react'
import type { Lang, NavScreen, Plan, PlanFeature, BillingPlan } from '@/data'
import { PLANS, PLAN_GUARANTEES, CONTACT_EMAIL, PRO_MONTHLY_PRICE, PRO_ANNUAL_PRICE } from '@/data'
import { Btn } from '@/shared/components'

const display = { fontFamily: "'SpotifyMixUITitle','CircularSp','Helvetica Neue',Helvetica,Arial,sans-serif" } as const

function FeatureRow({ f, lang, enterprise }: { f: PlanFeature; lang: Lang; enterprise?: boolean }) {
  const label = lang === 'am' ? f.am : f.en
  const note = lang === 'am' ? f.noteAm : f.noteEn

  const mark =
    f.state === 'yes' ? <span className="theme-accent">✓</span>
    : f.state === 'partial' ? <span className="text-[var(--warning)]">◐</span>
    : <span className="theme-text-dim">✗</span>

  return (
    <li className="flex items-start gap-2.5 py-1.5">
      <span className="mt-0.5 text-sm flex-shrink-0 w-4 text-center font-bold">{mark}</span>
      <span className={`text-sm leading-snug ${f.state === 'no' ? 'theme-text-dim' : enterprise ? 'text-white/85' : 'theme-text-muted'}`}>
        {label}
        {note && (
          <span className={`ml-1.5 text-xs ${enterprise ? 'text-white/55' : 'theme-text-dim'}`}>· {note}</span>
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
        ? { label: lang === 'en' ? 'Start Professional →' : 'ፕሮፌሽናል ጀምር →', action: () => navigate({ id: 'sign-up' }), variant: 'primary' as const }
        : { label: lang === 'en' ? 'Talk to us →' : 'አነጋግረን →', action: () => navigate({ id: 'enterprise-enquiry' }), variant: 'primary' as const }

  return (
    <div
      className={`relative flex flex-col rounded-2xl p-6 border transition-shadow ${
        enterprise
          ? 'pricing-card-enterprise border-transparent'
          : popular
            ? 'theme-card ring-2 ring-[var(--green)]'
            : 'theme-card'
      }`}
    >
      {popular && (
        <span className="absolute -top-3 left-6 inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold text-[var(--text-on-accent)] bg-[var(--green)]">
          {lang === 'en' ? 'Most popular' : 'ተመራጭ'}
        </span>
      )}

      <p className={`text-sm font-bold mb-1 ${enterprise ? 'text-white' : 'theme-text'}`}>
        {lang === 'am' ? plan.nameAm : plan.nameEn}
      </p>
      <p
        className={enterprise ? 'text-white' : 'theme-text'}
        style={{ ...display, fontSize: 30, fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.1 }}
      >
        {priceLabel}
      </p>
      {plan.tier === 'professional' && billing === 'annual' && (
        <p className="text-xs theme-accent font-semibold mt-1">{lang === 'en' ? 'Save 17%' : '17% ቁጠባ'}</p>
      )}
      {plan.tier === 'public' && (
        <p className={`text-xs mt-1 ${enterprise ? 'text-white/55' : 'theme-text-dim'}`}>
          {lang === 'en' ? 'No card. No expiry.' : 'ካርድ የለም። ማብቂያ የለም።'}
        </p>
      )}
      {plan.tier === 'enterprise' && (
        <p className="text-xs text-white/55 mt-1">{lang === 'en' ? 'Annual contract' : 'ዓመታዊ ውል'}</p>
      )}

      <ul className="mt-5 mb-6 flex-1">
        {plan.features.map(f => (
          <FeatureRow key={f.en} f={f} lang={lang} enterprise={enterprise} />
        ))}
      </ul>

      <Btn variant={cta.variant} size="md" fullWidth onClick={cta.action}>
        {cta.label}
      </Btn>

      {plan.tier === 'professional' && (
        <p className={`text-[13px] text-center mt-3 ${enterprise ? 'text-white/55' : 'theme-text-dim'}`}>
          {lang === 'en' ? '14-day free trial' : 'የ14 ቀን ነጻ ሙከራ'}
        </p>
      )}
    </div>
  )
}

export default function PricingPage({ lang, navigate }: { lang: Lang; navigate: (s: NavScreen) => void }) {
  const [billing, setBilling] = useState<BillingPlan>('annual')

  return (
    <div className="theme-bg min-h-full">
      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-12 lg:py-16">
        <div className="max-w-2xl mb-10">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] theme-accent mb-2">
            {lang === 'en' ? 'Pricing' : 'ዋጋ'}
          </p>
          <h1 className="theme-text font-bold mb-3" style={{ ...display, fontSize: 'clamp(30px,4vw,44px)', letterSpacing: '-0.03em' }}>
            {lang === 'en' ? 'Plans' : 'ዕቅዶች'}
          </h1>
          <p className="text-base theme-text-muted leading-relaxed">
            {lang === 'en'
              ? 'Data access for everyone. Depth for those who need it.'
              : 'ዳታ ለሁሉም። ጥልቀት ለሚፈልጉት።'}
          </p>
        </div>

        <div className="flex justify-start lg:justify-end mb-8">
          <div className="pricing-billing-toggle inline-flex rounded-full p-1">
            <button
              type="button"
              onClick={() => setBilling('monthly')}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                billing === 'monthly' ? 'pricing-billing-active' : 'pricing-billing-idle'
              }`}
            >
              {lang === 'en' ? 'Monthly' : 'ወርሃዊ'}
            </button>
            <button
              type="button"
              onClick={() => setBilling('annual')}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                billing === 'annual' ? 'pricing-billing-active-green' : 'pricing-billing-idle'
              }`}
            >
              {lang === 'en' ? 'Annual −17%' : 'ዓመታዊ −17%'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
          {PLANS.map(plan => (
            <PlanCard key={plan.tier} plan={plan} lang={lang} billing={billing} navigate={navigate} />
          ))}
        </div>

        <div className="mt-14">
          <h2 className="text-sm font-bold theme-text-dim uppercase tracking-widest mb-5">
            {lang === 'en' ? 'All plans' : 'ሁሉም ዕቅዶች'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PLAN_GUARANTEES.map(g => (
              <div key={g.en} className="flex items-start gap-2.5 theme-card rounded-2xl p-4">
                <span className="theme-accent font-bold">✓</span>
                <span className="text-sm theme-text-muted">{lang === 'am' ? g.am : g.en}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-2 text-sm">
          <span className="theme-text-muted">{lang === 'en' ? 'Questions?' : 'ጥያቄ አለዎት?'}</span>
          <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold theme-accent hover:underline">{CONTACT_EMAIL}</a>
        </div>
      </div>
    </div>
  )
}
