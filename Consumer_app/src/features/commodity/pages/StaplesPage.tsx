import { useEffect, useState } from 'react'
import type { Lang, NavScreen, Published } from '@/data'
import { COMMODITIES, MARKETS, getP } from '@/data'
import { fetchAffordability, type AffordabilitySnapshot } from '@/data/live'
import { fromApiCommodity } from '@/lib/api'
import { ItemCard, LiveDot, Btn } from '@/shared/components'

const display = { fontFamily: "'SpotifyMixUITitle','CircularSp','Helvetica Neue',Helvetica,Arial,sans-serif" } as const

export default function StaplesPage({ lang, navigate }: { lang: Lang; navigate: (s: NavScreen) => void }) {
  const [afford, setAfford] = useState<AffordabilitySnapshot | null>(null)
  const totalLive = COMMODITIES.flatMap(c => MARKETS.map(m => getP(c.id, m.id)))
    .filter(p => p.status === 'published').length

  useEffect(() => {
    fetchAffordability().then(setAfford)
  }, [])

  const en = lang === 'en'

  return (
    <div className="theme-bg min-h-full">
      <section className="border-b theme-border">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 py-14 lg:py-20">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div className="max-w-xl">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] theme-accent mb-2">
                {en ? 'Browse' : '\u12a0\u1235\u1235'}
              </p>
              <h1 className="theme-text text-3xl lg:text-4xl font-bold mb-3" style={{ ...display, letterSpacing: '-0.03em' }}>
                {en ? 'Staple foods' : '\u12a0\u1235\u1348\u120b\u130a \u121d\u130d\u1266\u127d'}
              </h1>
              <p className="text-sm theme-text-muted leading-relaxed">
                {en
                  ? 'Live prices and month-over-month inflation across Addis markets. Tap a staple to compare.'
                  : '\u1260\u12a0\u12f2\u1235 \u12a0\u1260\u1263 \u1308\u1260\u12eb\u12ce\u127d \u1240\u1325\u1273 \u12cb\u130b \u12a5\u1293 \u12c8\u122d\u1203\u12ca \u12e8\u12cb\u130b \u130d\u123d\u1260\u1275\u1362 \u1208\u121b\u12c8\u12f3\u12f0\u122d \u1238\u1245\u1325 \u12ed\u121d\u1228\u1321\u1362'}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full theme-card text-xs font-semibold theme-text-muted">
                <LiveDot size="sm" />
                <span>
                  <span className="theme-text tabular-nums">{totalLive}</span>{' '}
                  {en ? 'live prices' : '\u1240\u1325\u1273'}
                </span>
              </div>
              {afford?.change_pct != null && (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full theme-card text-xs font-semibold text-[var(--warning)]">
                  <span className="tabular-nums font-bold">
                    {afford.change_pct > 0 ? '+' : ''}{afford.change_pct}%
                  </span>
                  <span className="theme-text-muted font-medium">
                    {en ? 'basket MoM' : '\u1245\u122d\u132b\u1275 \u12c8\u122d'}
                  </span>
                </div>
              )}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full theme-card text-xs font-semibold theme-text-muted">
                <span className="theme-text tabular-nums">{MARKETS.length}</span>{' '}
                {en ? 'markets' : '\u1308\u1260\u12eb\u12ce\u127d'}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 lg:px-10 py-12 lg:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 items-stretch">
          {COMMODITIES.map(c => {
            const prices = MARKETS.map(m => getP(c.id, m.id)).filter((p): p is Published => p.status === 'published')
            if (prices.length === 0) return null
            const avg = Math.round(prices.reduce((s, p) => s + p.price, 0) / prices.length)
            const min = Math.min(...prices.map(p => p.price))
            const max = Math.max(...prices.map(p => p.price))
            const changePct = afford?.items?.find(
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
                changePct={changePct}
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
                {en ? 'Need market context?' : '\u12e8\u1308\u1260\u12eb \u1218\u1228\u1303 \u12ed\u1348\u120d\u130b\u1209\u1362'}
              </p>
              <p className="text-xs theme-text-muted">
                {en
                  ? 'Compare areas with the price heatmap on Professional.'
                  : '\u1260\u1355\u122e\u134c\u123d\u1293\u120d \u1202\u1275\u121b\u1355 \u1308\u1260\u12eb\u12ce\u127d\u1295 \u12eb\u12c8\u12f3\u12f5\u1229\u1362'}
              </p>
            </div>
            <Btn variant="secondary" size="md" onClick={() => navigate({ id: 'map' })} className="shrink-0">
              {en ? 'Explore map' : '\u12ab\u122d\u1273 \u12a0\u1235\u1235'}
            </Btn>
          </div>
        </div>
      </section>
    </div>
  )
}
