import type { Lang, NavScreen, Published } from '@/data'
import { COMMODITIES, MARKETS, getP } from '@/data'
import { ItemCard, LiveDot, Btn } from '@/shared/components'

const display = { fontFamily: "'SpotifyMixUITitle','CircularSp','Helvetica Neue',Helvetica,Arial,sans-serif" } as const

export default function StaplesPage({ lang, navigate }: { lang: Lang; navigate: (s: NavScreen) => void }) {
  const totalLive = COMMODITIES.flatMap(c => MARKETS.map(m => getP(c.id, m.id)))
    .filter(p => p.status === 'published').length

  return (
    <div className="theme-bg min-h-full">
      <section className="border-b theme-border">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 py-14 lg:py-20">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div className="max-w-xl">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] theme-accent mb-2">
                {lang === 'en' ? 'Browse' : 'አስስ'}
              </p>
              <h1 className="theme-text text-3xl lg:text-4xl font-bold mb-3" style={{ ...display, letterSpacing: '-0.03em' }}>
                {lang === 'en' ? 'Staple foods' : 'አስፈላጊ ምግቦች'}
              </h1>
              <p className="text-sm theme-text-muted leading-relaxed">
                {lang === 'en'
                  ? 'Live prices across Addis Ababa markets. Tap a staple to compare every market.'
                  : 'በአዲስ አበባ ገበያዎች ቀጥታ ዋጋዎች። ሁሉንም ገበያዎች ለማወዳደር ሸቀጥ ይምረጡ።'}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full theme-card text-xs font-semibold theme-text-muted">
                <LiveDot size="sm" />
                <span><span className="theme-text tabular-nums">{totalLive}</span> {lang === 'en' ? 'live prices' : 'ቀጥታ'}</span>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full theme-card text-xs font-semibold theme-text-muted">
                <span className="theme-text tabular-nums">{COMMODITIES.length}</span> {lang === 'en' ? 'staples' : 'ምግቦች'}
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full theme-card text-xs font-semibold theme-text-muted">
                <span className="theme-text tabular-nums">{MARKETS.length}</span> {lang === 'en' ? 'markets' : 'ገበያዎች'}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 lg:px-10 py-12 lg:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 items-stretch">
          {COMMODITIES.map(c => {
            const prices = MARKETS.map(m => getP(c.id, m.id)).filter((p): p is Published => p.status === 'published')
            const avg = prices.length > 0 ? Math.round(prices.reduce((s, p) => s + p.price, 0) / prices.length) : 0
            const min = prices.length > 0 ? Math.min(...prices.map(p => p.price)) : 0
            const max = prices.length > 0 ? Math.max(...prices.map(p => p.price)) : 0

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
                noDataLabel={lang === 'en' ? 'No data yet' : 'ገና ዳታ የለም'}
                onClick={() => navigate({ id: 'commodity-overview', commodityId: c.id })}
              />
            )
          })}
        </div>
      </section>

      <section className="border-t theme-border">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 py-12">
          <div className="rounded-2xl theme-card px-6 py-8 lg:px-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-sm font-bold theme-text mb-1">
                {lang === 'en' ? 'Need market context?' : 'የገበያ መረጃ ይፈልጋሉ?'}
              </p>
              <p className="text-xs theme-text-muted">
                {lang === 'en' ? 'Compare areas with the price heatmap on Professional.' : 'በፕሮፌሽናል ሂትማፕ ገበያዎችን ያወዳድሩ።'}
              </p>
            </div>
            <Btn variant="secondary" size="md" onClick={() => navigate({ id: 'map' })} className="shrink-0">
              {lang === 'en' ? 'Explore map' : 'ካርታ አስስ'}
            </Btn>
          </div>
        </div>
      </section>
    </div>
  )
}
