import { useState } from 'react'
import type { Lang, NavScreen, Published, Insufficient } from '@/data'
import { MARKETS, getC, getP } from '@/data'
import { ReportPriceBand, LiveDot } from '@/shared/components'

const display = { fontFamily: "'SpotifyMixUITitle','CircularSp','Helvetica Neue',Helvetica,Arial,sans-serif" } as const

type Sort = 'price-asc' | 'price-desc' | 'name'

export default function CommodityOverviewPage({ lang, commodityId, navigate }: {
  lang: Lang
  commodityId: string
  navigate: (s: NavScreen) => void
}) {
  const c = getC(commodityId)
  const [sort, setSort] = useState<Sort>('price-asc')

  const rows = MARKETS.map(m => {
    const p = getP(c.id, m.id)
    return { market: m, price: p }
  })

  const sorted = [...rows].sort((a, b) => {
    if (sort === 'name') return a.market.en.localeCompare(b.market.en)
    const pa = a.price.status === 'published' ? (a.price as Published).price : -1
    const pb = b.price.status === 'published' ? (b.price as Published).price : -1
    return sort === 'price-asc' ? pa - pb : pb - pa
  })

  const published = rows.filter(r => r.price.status === 'published').map(r => (r.price as Published).price)
  const avg = published.length > 0 ? Math.round(published.reduce((a, b) => a + b, 0) / published.length) : 0
  const min = published.length > 0 ? Math.min(...published) : 0
  const max = published.length > 0 ? Math.max(...published) : 0

  return (
    <div className="theme-bg min-h-full">
      {/* Hero */}
      <div className="relative overflow-hidden theme-bg border-b theme-border">
        <div className="absolute inset-0 opacity-20">
          <img src={c.img} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 theme-card-image-scrim" />
        <div className="relative max-w-6xl mx-auto px-6 lg:px-10 py-12 lg:py-16">
          <button onClick={() => navigate({ id: 'home' })} className="text-xs theme-text-subtle hover:theme-text mb-4 flex items-center gap-1 transition-colors">
            &larr; {lang === 'en' ? 'Back to items' : 'ወደ ምግቦች'}
          </button>
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 border-2 theme-border">
              <img src={c.img} alt={c.en} className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-3xl font-bold theme-text" style={{ ...display, letterSpacing: '-0.03em' }}>
                {c.emoji} {lang === 'am' ? c.am : c.en}
              </h1>
              <p className="theme-text-muted text-sm mt-1">{lang === 'am' ? c.unitAm : c.unit} · {MARKETS.length} {lang === 'en' ? 'markets in Addis Ababa' : 'ገበያዎች'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="border-b theme-border theme-surface">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 py-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { value: avg > 0 ? `~${avg}` : '—', label: lang === 'en' ? 'Avg price' : 'አverage ዋጋ', cls: 'theme-stat-value' },
              { value: min > 0 ? String(min) : '—', label: lang === 'en' ? 'Lowest' : 'ቅነስ', cls: 'theme-stat-value-accent' },
              { value: max > 0 ? String(max) : '—', label: lang === 'en' ? 'Highest' : 'ከፍተኛ', cls: 'theme-stat-value-warning' },
              { value: `${published.length}/${MARKETS.length}`, label: lang === 'en' ? 'Live' : 'ቀጥታ', cls: 'theme-stat-value-accent' },
            ].map(s => (
              <div key={s.label} className="text-center">
                <p className={`text-xl font-bold ${s.cls}`}>{s.value}</p>
                <p className="text-[10px] theme-text-muted uppercase tracking-wider">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Market cards */}
      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-8">
        <div className="flex flex-wrap items-center gap-2 mb-5">
          <span className="theme-eyebrow">{lang === 'en' ? 'Sort by' : 'ደርድር'}:</span>
          {([['price-asc', lang === 'en' ? 'Price: low → high' : 'ዋጋ: ቅነስ → ከፍተኛ'], ['price-desc', lang === 'en' ? 'Price: high → low' : 'ዋጋ: ከፍተኛ → ቅነስ'], ['name', 'A-Z']] as const).map(([val, label]) => (
            <button
              key={val}
              onClick={() => setSort(val)}
              className={`theme-chip ${sort === val ? 'theme-chip-active' : ''}`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {sorted.map((row, i) => {
            const pub = row.price.status === 'published' ? row.price as Published : null
            const insuff = row.price.status === 'insufficient' ? row.price as Insufficient : null

            return (
              <button
                key={row.market.id}
                onClick={() => pub
                  ? navigate({ id: 'price-detail', commodityId: c.id, marketId: row.market.id })
                  : navigate({ id: 'price-no-data', commodityId: c.id, marketId: row.market.id })}
                className="text-left rounded-2xl theme-card theme-card-interactive overflow-hidden group"
              >
                <div className="relative h-24 overflow-hidden">
                  <img src={row.market.img} alt={row.market.en} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="w-6 h-6 rounded-full theme-image-badge flex items-center justify-center text-[10px] font-bold">
                      {i + 1}
                    </span>
                  </div>
                  <div className="absolute top-2.5 right-2.5">
                    {pub ? (
                      <div className="flex items-center gap-1 theme-image-badge rounded-full px-2 py-0.5">
                        <LiveDot />
                        <span className="text-[9px] theme-text-muted font-medium">{pub.freshness}</span>
                      </div>
                    ) : (
                      <span className="theme-badge-warning text-[9px] font-bold px-2 py-0.5 rounded-full">
                        {insuff!.current}/3
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-4">
                  <p className="text-sm font-bold theme-text mb-2 group-hover:theme-accent transition-colors truncate">
                    {lang === 'am' ? row.market.am : row.market.en}
                  </p>

                  {pub ? (
                    <div className="flex items-end justify-between gap-2">
                      <div>
                        <p className="text-2xl font-bold theme-text leading-none" style={{ ...display, letterSpacing: '-0.03em' }}>
                          {pub.price} <span className="text-xs font-medium theme-text-muted">birr</span>
                        </p>
                        <p className="text-[10px] theme-text-dim mt-1">{pub.low}–{pub.high} range</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[10px] theme-text-dim">{pub.reports} {lang === 'en' ? 'reports' : 'ሪፖርቶች'}</p>
                        <p className="text-[10px] theme-text-dim">{pub.contributors} {lang === 'en' ? 'people' : 'ሰዎች'}</p>
                      </div>
                    </div>
                  ) : (
                    <span className="text-sm font-semibold text-[var(--warning)]">⚠ {lang === 'en' ? 'Not enough data' : 'በቂ ዳታ የለም'}</span>
                  )}
                </div>
              </button>
            )
          })}
        </div>

        <div className="mt-8">
          <ReportPriceBand lang={lang} commodityId={c.id} marketId={MARKETS[0].id} />
        </div>
      </div>
    </div>
  )
}
