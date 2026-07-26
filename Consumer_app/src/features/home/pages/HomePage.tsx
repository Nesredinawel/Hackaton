import { useEffect, useState, type ReactNode } from 'react'
import type { Lang, NavScreen, Published } from '@/data'
import { COMMODITIES, MARKETS, getP, getMarketLeaderboard, getItemLeaderboard, IMG, PLANS, PRO_MONTHLY_PRICE, canAccess } from '@/data'
import { fetchAffordability, type AffordabilitySnapshot } from '@/data/live'
import { fromApiCommodity } from '@/lib/api'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { LiveDot, Btn, ItemCard, ChangeBadge, ReportPriceCta, AgentBotCta, reportPriceCopy, agentBotCopy } from '@/shared/components'

function heatColor(avg: number): string {
  if (avg >= 100) return '#FFA42B'
  if (avg >= 60) return '#FFA42B'
  return '#1ED760'
}

function MedalBadge({ rank }: { rank: number }) {
  if (rank === 0) return <span className="text-sm">🥇</span>
  if (rank === 1) return <span className="text-sm">🥈</span>
  if (rank === 2) return <span className="text-sm">🥉</span>
  return (
    <span className="w-5 h-5 rounded-full theme-surface-2 flex items-center justify-center text-[10px] font-bold theme-text-dim">
      {rank + 1}
    </span>
  )
}

const display = { fontFamily: "'SpotifyMixUITitle','CircularSp','Helvetica Neue',Helvetica,Arial,sans-serif" } as const

function ProPill({ lang }: { lang: Lang }) {
  return (
    <Badge variant="outline" className="ml-1.5 theme-badge-warning border-transparent text-[9px] font-bold uppercase tracking-wider align-middle">
      {lang === 'en' ? 'Pro' : 'ፕሮ'}
    </Badge>
  )
}

function SectionHead({ eyebrow, title, subtitle, align = 'left' }: {
  eyebrow?: string
  title: string
  subtitle?: string
  align?: 'left' | 'center'
}) {
  return (
    <div className={align === 'center' ? 'text-center max-w-lg mx-auto' : 'max-w-xl'}>
      {eyebrow && (
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] theme-accent mb-2">{eyebrow}</p>
      )}
      <h2 className="theme-text text-2xl font-bold mb-2" style={display}>{title}</h2>
      {subtitle && <p className="text-sm theme-text-muted leading-relaxed">{subtitle}</p>}
    </div>
  )
}

function InvolvementCard({ step, visual, icon, eyebrow, title, body, action, accent }: {
  step: string
  visual: string
  icon: string
  eyebrow: string
  title: string
  body: string
  action: ReactNode
  accent?: 'green' | 'amber' | 'blue'
}) {
  const accentStyles = {
    green: { glow: 'rgba(30,215,96,0.35)', badge: 'bg-[#1ED760] text-[#121212]', pill: 'text-[#1ED760]', hover: 'hover:border-[#1ED760]/30' },
    amber: { glow: 'rgba(255,164,43,0.35)', badge: 'bg-[#FFA42B] text-[#121212]', pill: 'text-[#FFA42B]', hover: 'hover:border-[#FFA42B]/30' },
    blue: { glow: 'rgba(83,157,245,0.35)', badge: 'bg-[#539DF5] text-[#121212]', pill: 'text-[#539DF5]', hover: 'hover:border-[#539DF5]/30' },
  }[accent ?? 'green']

  return (
    <article className={`group relative flex flex-col flex-1 min-w-0 rounded-2xl overflow-hidden theme-card theme-card-interactive ${accentStyles.hover}`}>
      <div className="relative aspect-[16/10] overflow-hidden shrink-0">
        <img src={visual} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 theme-card-image-scrim" />
        <div className="absolute inset-0 opacity-80 group-hover:opacity-100 transition-opacity duration-150" style={{ background: `radial-gradient(circle at 30% 100%, ${accentStyles.glow} 0%, transparent 60%)` }} />
        <span className={`absolute top-3 left-3 inline-flex items-center justify-center w-7 h-7 rounded-full text-[11px] font-bold tabular-nums ${accentStyles.badge}`}>
          {step}
        </span>
        <span className={`absolute top-3 right-3 text-[10px] font-bold uppercase tracking-[0.12em] px-2.5 py-1 rounded-full backdrop-blur-sm ${accentStyles.pill}`}
          style={{ backgroundColor: 'color-mix(in srgb, var(--surface) 55%, transparent)' }}
        >
          {eyebrow}
        </span>
        <span className="absolute bottom-3 left-3 text-2xl drop-shadow-md">{icon}</span>
      </div>

      <div className="flex flex-col gap-2.5 p-4 lg:p-5">
        <h3 className="text-base font-bold theme-text leading-snug" style={display}>{title}</h3>
        <p className="text-[13px] theme-text-muted leading-snug line-clamp-3">{body}</p>
        <div className="pt-1">{action}</div>
      </div>
    </article>
  )
}

function PricingTeaserCard({ lang, navigate, plan }: {
  lang: Lang
  navigate: (s: NavScreen) => void
  plan: typeof PLANS[number]
}) {
  const popular = plan.variant === 'popular'
  const name = lang === 'am' ? plan.nameAm : plan.nameEn
  const tagline = lang === 'am' ? plan.taglineAm : plan.taglineEn
  const highlights = plan.features.filter(f => f.state !== 'no').slice(0, 4)

  const cta =
    plan.tier === 'public'
      ? { label: lang === 'en' ? 'Browse staples' : 'ምግቦችን አስስ', action: () => navigate({ id: 'staples' }), variant: 'secondary' as const }
      : plan.tier === 'professional'
        ? { label: lang === 'en' ? 'Start trial' : 'ሙከራ ጀምር', action: () => navigate({ id: 'sign-up' }), variant: 'primary' as const }
        : { label: lang === 'en' ? 'Talk to us' : 'አነጋግረን', action: () => navigate({ id: 'enterprise-enquiry' }), variant: 'secondary' as const }

  return (
    <Card className={`flex flex-col min-w-[260px] lg:min-w-0 lg:flex-1 snap-start ${popular ? 'ring-2 ring-primary' : ''}`}>
      <CardHeader>
        <div className="min-h-[28px]">
          {popular && (
            <Badge>{lang === 'en' ? 'Popular' : 'ተመራጭ'}</Badge>
          )}
        </div>
        <CardTitle className="text-sm font-bold">{name}</CardTitle>
        <p className="text-2xl font-bold tabular-nums leading-none text-foreground" style={{ ...display, letterSpacing: '-0.03em' }}>
          {tagline}
        </p>
      </CardHeader>
      <CardContent className="flex-1 pt-0">
        <ul className="space-y-2">
          {highlights.map(f => (
            <li key={f.en} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="text-primary mt-0.5 shrink-0">✓</span>
              <span>{lang === 'am' ? f.am : f.en}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="border-0 bg-transparent pt-0">
        <Btn variant={cta.variant} size="md" fullWidth onClick={cta.action}>
          {cta.label}
        </Btn>
      </CardFooter>
    </Card>
  )
}

export default function HomePage({ lang, navigate }: { lang: Lang; navigate: (s: NavScreen) => void }) {
  const [afford, setAfford] = useState<AffordabilitySnapshot | null>(null)

  useEffect(() => {
    void fetchAffordability().then(setAfford)
  }, [])

  const totalLive = COMMODITIES.flatMap(c => MARKETS.map(m => getP(c.id, m.id)))
    .filter(p => p.status === 'published').length

  const marketBoard = getMarketLeaderboard().slice(0, 6)
  const itemBoard = getItemLeaderboard()
  const reportCopy = reportPriceCopy(lang)
  const agentCopy = agentBotCopy(lang)
  const mapUnlocked = canAccess('map').allowed
  const defaultCommodityId = COMMODITIES[0]?.id ?? 'teff'
  const defaultMarketId = MARKETS[0]?.id ?? 'merkato'

  return (
    <div className="theme-bg">
      {/* ── Hero ── */}
      <section className="relative isolate overflow-hidden min-h-[min(92vh,880px)] flex items-center justify-center">
        <img
          src={IMG.hero}
          alt=""
          aria-hidden
          fetchPriority="high"
          className="absolute inset-0 -z-10 w-full h-full object-cover object-center scale-105"
        />
        <div className="absolute inset-0 -z-10" style={{ background: 'var(--hero-scrim)' }} />
        <div className="absolute inset-0 -z-10" style={{ background: 'var(--hero-vignette)' }} />
        <div
          className="absolute inset-x-0 bottom-0 -z-10 h-40"
          style={{ background: 'var(--hero-fade)' }}
        />

        <div className="relative w-full max-w-3xl mx-auto px-6 lg:px-10 py-28 lg:py-32 text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] theme-accent mb-5">
            {lang === 'en' ? 'Addis Ababa · Live index' : 'አዲስ አበባ · ቀጥታ ኢንዴክስ'}
          </p>

          <div className="hero-badge inline-flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-bold theme-accent mb-8">
            <LiveDot />
            {totalLive} {lang === 'en' ? 'live prices' : 'ቀጥታ ዋጋዎች'}
          </div>

          <h1
            className="theme-text leading-[1.05] mb-6 mx-auto max-w-2xl"
            style={{ ...display, fontSize: 'clamp(40px,6.5vw,72px)', fontWeight: 700, letterSpacing: '-0.04em' }}
          >
            {lang === 'en' ? <>Food prices,<br />right now.</> : <>የምግብ ዋጋዎች,<br />አሁን።</>}
          </h1>

          <p className="theme-text-muted text-base lg:text-lg leading-relaxed mb-10 max-w-md mx-auto">
            {lang === 'en'
              ? 'Phase-1 Addis staples — published from real agent reports only. Gaps stay visible.'
              : 'Phase-1 አዲስ አበባ ምግቦች — ከእውነተኛ ወኪል ሪፖርቶች ብቻ። ክፍተቶች ይታያሉ።'}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Btn
              variant="primary"
              size="lg"
              onClick={() => navigate({ id: 'staples' })}
              className="w-full sm:w-auto sm:min-w-[168px]"
            >
              {lang === 'en' ? 'Browse staples' : 'ምግቦችን አስስ'}
            </Btn>
            <Btn
              variant="ghost"
              size="lg"
              onClick={() => navigate({ id: 'map' })}
              className="w-full sm:w-auto sm:min-w-[168px]"
            >
              {lang === 'en' ? 'Explore map' : 'ካርታ አስስ'}
              {!mapUnlocked && <ProPill lang={lang} />}
            </Btn>
          </div>

          <div className="hero-stats inline-flex flex-wrap items-center justify-center gap-x-5 gap-y-2 mt-12 px-6 py-3 rounded-full text-xs theme-text-muted">
            <span><span className="font-bold theme-text tabular-nums">{MARKETS.length}</span> {lang === 'en' ? 'markets' : 'ገበያዎች'}</span>
            <span className="hidden sm:inline w-1 h-1 rounded-full bg-[var(--text-dim)] opacity-60" aria-hidden />
            <span><span className="font-bold theme-text tabular-nums">{COMMODITIES.length}</span> {lang === 'en' ? 'staples' : 'ምግቦች'}</span>
            <span className="hidden sm:inline w-1 h-1 rounded-full bg-[var(--text-dim)] opacity-60" aria-hidden />
            <span>{lang === 'en' ? 'Addis Ababa' : 'አዲስ አበባ'}</span>
            <span className="hidden sm:inline w-1 h-1 rounded-full bg-[var(--text-dim)] opacity-60" aria-hidden />
            <span className="theme-text-dim">{lang === 'en' ? 'Inflation from real reports' : 'የዋጋ ግሽበት ከእውነተኛ ሪፖርቶች'}</span>
          </div>
        </div>
      </section>

      {/* Paid value teaser — full decision layer lives on Pro dashboard */}
      <section className="border-t theme-border">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 py-12 lg:py-16">
          <Card>
            <CardContent className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-10 pt-0">
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary mb-2">
                  For programmes
                </p>
                <h2 className="text-foreground text-xl lg:text-2xl font-bold mb-2" style={display}>
                  Programme dashboard
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4 max-w-xl">
                  Basket inflation, coverage honesty, cited cash-assistance guidance, and market pressure — what paying teams use to set transfers.
                </p>
                {afford?.status === 'published' && afford.change_pct != null && (
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className="text-sm text-muted-foreground">
                      Basket now {afford.cost_now != null ? `${Math.round(afford.cost_now).toLocaleString()} ETB` : '—'}
                    </span>
                    <ChangeBadge pct={afford.change_pct} size="sm" suffix="MoM" />
                    {afford.band && (
                      <Badge variant="outline" className="theme-badge-warning border-transparent text-[10px] font-bold uppercase tracking-wider">
                        {afford.band}
                      </Badge>
                    )}
                  </div>
                )}
                <Button onClick={() => navigate(canAccess('dashboard').allowed ? { id: 'dashboard' } : { id: 'sign-up' })}>
                  {canAccess('dashboard').allowed ? 'Open dashboard →' : 'Unlock with Professional →'}
                </Button>
              </div>
              <ul className="shrink-0 space-y-2 text-sm text-muted-foreground lg:w-64">
                {[
                  'Coverage: published vs insufficient',
                  'Cited transfer uplift + impact',
                  'Map & heatmap for area pressure',
                ].map(item => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ── Browse staples ── */}
      <section className="border-t theme-border">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 py-20 lg:py-28">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-10 lg:mb-12">
            <SectionHead
              eyebrow={lang === 'en' ? 'Browse' : 'አስስ'}
              title={lang === 'en' ? 'Staple foods' : 'አስፈላጊ ምግቦች'}
              subtitle={lang === 'en' ? 'Compare live prices across every Addis market.' : 'በአዲስ አበባ ገበያዎች ቀጥታ ዋጋዎችን ያወዳድሩ።'}
            />
            <Btn
              variant="secondary"
              size="md"
              onClick={() => navigate({ id: 'staples' })}
              className="shrink-0 w-full sm:w-auto"
            >
              {lang === 'en' ? 'View all staples' : 'ሁሉንም ምግቦች'}
            </Btn>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 items-stretch">
            {COMMODITIES.map(c => {
              const prices = MARKETS.map(m => getP(c.id, m.id)).filter((p): p is Published => p.status === 'published')
              if (prices.length === 0) return null
              const avg = Math.round(prices.reduce((s, p) => s + p.price, 0) / prices.length)
              const min = Math.min(...prices.map(p => p.price))
              const max = Math.max(...prices.map(p => p.price))
              const inflation = afford?.items?.find(
                i => fromApiCommodity(i.commodity_code) === c.id && i.status === 'published',
              )?.change_pct ?? null

              return (
                <ItemCard
                  key={c.id}
                  image={c.img}
                  emoji={c.emoji}
                  title={lang === 'am' ? c.am : c.en}
                  unit={lang === 'am' ? c.unitAm : c.unit}
                  avg={avg}
                  min={min}
                  max={max}
                  liveCount={prices.length}
                  totalMarkets={MARKETS.length}
                  changePct={inflation}
                  onClick={() => navigate({ id: 'commodity-overview', commodityId: c.id })}
                />
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Leaderboards ── */}
      <section className="border-y theme-border">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 py-20 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
                <SectionHead
                  eyebrow={lang === 'en' ? 'Markets' : 'ገበያዎች'}
                  title={lang === 'en' ? 'Top by basket price' : 'በቅርጫት ዋጋ'}
                />
                <Btn
                  variant="secondary"
                  size="md"
                  onClick={() => navigate({ id: 'map' })}
                  className="shrink-0"
                >
                  {lang === 'en' ? 'Explore map' : 'ካርታ አስስ'}
                  {!mapUnlocked && <ProPill lang={lang} />}
                </Btn>
              </div>
              <Card className="overflow-hidden p-0 gap-0">
                {marketBoard.map((entry, i) => (
                  <button
                    key={entry.market.id}
                    onClick={() => navigate({ id: 'map' })}
                    className={`w-full flex items-center gap-3 px-5 py-4 text-left transition-colors duration-100 hover:bg-muted/50 ${i < marketBoard.length - 1 ? 'border-b border-border' : ''}`}
                  >
                    <MedalBadge rank={entry.rank} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold theme-text truncate">{lang === 'am' ? entry.market.am : entry.market.en}</p>
                      <p className="text-[11px] theme-text-dim">{entry.live}/5 {lang === 'en' ? 'live' : 'ቀጥታ'}</p>
                    </div>
                    <span
                      className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-[#121212] tabular-nums"
                      style={{ backgroundColor: heatColor(entry.avg) }}
                    >
                      {entry.avg}
                    </span>
                  </button>
                ))}
              </Card>
            </div>

            <div>
              <div className="mb-8">
                <SectionHead
                  eyebrow={lang === 'en' ? 'Commodities' : 'ሸቀጦች'}
                  title={lang === 'en' ? 'Items by avg price' : 'በአማካይ ዋጋ'}
                />
              </div>
              <Card className="overflow-hidden p-0 gap-0">
                {itemBoard.map((entry, i) => (
                  <button
                    key={entry.commodity.id}
                    onClick={() => navigate({ id: 'commodity-overview', commodityId: entry.commodity.id })}
                    className={`w-full flex items-center gap-3 px-5 py-4 text-left transition-colors duration-100 hover:bg-muted/50 ${i < itemBoard.length - 1 ? 'border-b border-border' : ''}`}
                  >
                    <MedalBadge rank={entry.rank} />
                    <span className="text-lg flex-shrink-0">{entry.commodity.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold theme-text">{lang === 'am' ? entry.commodity.am : entry.commodity.en}</p>
                      <p className="text-[11px] theme-text-dim tabular-nums">{entry.min}–{entry.max} · {entry.live}/{MARKETS.length}</p>
                    </div>
                    <p className="text-base font-bold theme-text flex-shrink-0 tabular-nums" style={display}>
                      {entry.avg} <span className="text-[10px] font-medium theme-text-muted">birr</span>
                    </p>
                  </button>
                ))}
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="max-w-6xl mx-auto px-6 lg:px-10 py-20 lg:py-24">
        <SectionHead
          align="center"
          eyebrow={lang === 'en' ? 'Methodology' : 'ዘዴ'}
          title={lang === 'en' ? 'How it works' : 'እንዴት ይሰራል'}
          subtitle={lang === 'en' ? 'Validated prices. No estimates. Gaps shown honestly.' : 'የተረጋገጡ ዋጋዎች። ግምት የለም።'}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
          {[
            { n: '01', en: 'Open Telegram and register as a field agent.', am: 'ቴሌግራም ክፈት እና እንደ ሜዳ ወኪል ይመዝገቡ።' },
            { n: '02', en: 'Report prices from your market in ~5 seconds.', am: 'ከገበያዎ ዋጋ በ~5 ሰኮንድ ዘግቡ።' },
            { n: '03', en: '3+ verified reports in 72 hours → published.', am: '72 ሰዓት ውስጥ 3+ ሪፖርቶች → ይታያል።' },
          ].map(s => (
            <Card key={s.n}>
              <CardContent className="pt-0">
                <Badge className="mb-4">{s.n}</Badge>
                <p className="text-sm text-muted-foreground leading-relaxed">{lang === 'am' ? s.am : s.en}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ── Pricing ── */}
      <section className="border-y theme-border theme-surface-muted">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 py-20 lg:py-24">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10">
            <SectionHead
              eyebrow={lang === 'en' ? 'Pricing' : 'ዋጋ'}
              title={lang === 'en' ? 'Simple, honest plans' : 'ቀላል፣ ግልጽ ዕቅዶች'}
              subtitle={lang === 'en' ? `Public is free forever. Professional from $${PRO_MONTHLY_PRICE}/month.` : `ሕዝባዊ ለዘላለም ነጻ። ፕሮፌሽናል ከ$${PRO_MONTHLY_PRICE}/ወር።`}
            />
            <Btn variant="secondary" size="md" onClick={() => navigate({ id: 'pricing' })} className="shrink-0 self-start lg:self-auto">
              {lang === 'en' ? 'Compare all features' : 'ሁሉንም ባህሪያት አወዳድር'}
            </Btn>
          </div>
          <div className="flex flex-row gap-4 overflow-x-auto snap-x snap-mandatory pb-2 lg:overflow-visible lg:pb-0">
            {PLANS.map(plan => (
              <PricingTeaserCard key={plan.tier} lang={lang} navigate={navigate} plan={plan} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Get involved ── */}
      <section className="border-t theme-border">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 py-20 lg:py-28">
          <SectionHead
            align="center"
            eyebrow={lang === 'en' ? 'Get involved' : 'ተሳትፍ'}
            title={lang === 'en' ? 'Three ways to use Waga' : 'ዋጋን ለመጠቀም 3 መንገዶች'}
            subtitle={lang === 'en' ? 'Agents report prices. Earn rewards, or unlock deeper data for your organisation.' : 'ወኪሎች ዋጋ ይሰጣሉ። ገቢ ያግኙ፣ ወይም ተጨማሪ ዳታ ይክፈቱ።'}
          />
          <div className="mt-12 flex flex-row items-stretch gap-3 sm:gap-4 lg:gap-5">
            <InvolvementCard
              step="01"
              visual={IMG.hero}
              icon="📱"
              accent="green"
              eyebrow={lang === 'en' ? 'Contribute' : 'አስተዋጽዖ'}
              title={lang === 'en' ? 'Report a price' : 'ዋጋ ዘግብ'}
              body={reportCopy.bandBody}
              action={
                <ReportPriceCta
                  lang={lang}
                  commodityId={defaultCommodityId}
                  marketId={defaultMarketId}
                  size="md"
                  fullWidth
                />
              }
            />
            <InvolvementCard
              step="02"
              visual={COMMODITIES[0]?.img ?? IMG.marketA}
              icon="🎯"
              accent="amber"
              eyebrow={lang === 'en' ? 'Earn' : 'ገቢ'}
              title={lang === 'en' ? 'Become an agent' : 'ወኪል ሁን'}
              body={agentCopy.bandBody}
              action={
                <AgentBotCta lang={lang} size="md" fullWidth variant="secondary" />
              }
            />
            <InvolvementCard
              step="03"
              visual={COMMODITIES[3]?.img ?? IMG.marketB}
              icon="📈"
              accent="blue"
              eyebrow={lang === 'en' ? 'Depth' : 'ጥልቀት'}
              title={lang === 'en' ? 'Pro & Enterprise' : 'ፕሮ & ኢንተርፕራይዝ'}
              body={lang === 'en' ? 'History, source mix, export, and API for organisations.' : 'ታሪክ፣ ምንጭ፣ ማውጣት እና ኤ፲አይ ለድርጅቶች።'}
              action={
                <Btn variant="secondary" size="md" fullWidth onClick={() => navigate({ id: 'pricing' })}>
                  {lang === 'en' ? 'See pricing' : 'ዋጋ እይ'}
                </Btn>
              }
            />
          </div>
        </div>
      </section>

      {/* ── Bottom CTA band ── */}
      <section className="border-t theme-border">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 py-16 lg:py-20">
          <Card>
            <CardContent className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 pt-0">
              <div className="max-w-lg">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary mb-2">
                  {lang === 'en' ? 'Start free' : 'በነጻ ጀምር'}
                </p>
                <h2 className="text-foreground text-2xl font-bold mb-2" style={display}>
                  {lang === 'en' ? 'Check any price today. Upgrade when you need depth.' : 'የዛሬን ዋጋ ይመልከቱ። ጥልቀት ሲፈልጉ ያሳድጉ።'}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {lang === 'en' ? 'Public access is free forever. Professional plans from $29/month.' : 'ሕዝባዊ መዳረሻ ለዘላለም ነጻ። ፕሮፌሽናል ከ$29/ወር።'}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full lg:w-auto">
                <Button size="lg" onClick={() => navigate({ id: 'staples' })} className="sm:min-w-[160px]">
                  {lang === 'en' ? 'Browse staples' : 'ምግቦችን አስስ'}
                </Button>
                <Button variant="secondary" size="lg" onClick={() => navigate({ id: 'sign-up' })} className="sm:min-w-[160px]">
                  {lang === 'en' ? 'Start Pro trial' : 'ፕሮ ሙከራ ጀምር'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
