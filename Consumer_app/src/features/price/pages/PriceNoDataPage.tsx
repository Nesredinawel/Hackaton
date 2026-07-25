import type { Lang, NavScreen, Insufficient, Published } from '@/data'
import { MARKETS, getC, getP } from '@/data'
import { LiveDot, ProgressDots, ReportPriceCta, reportPriceCopy } from '@/shared/components'

const display = { fontFamily: "'SpotifyMixUITitle','CircularSp','Helvetica Neue',Helvetica,Arial,sans-serif" } as const

export default function PriceNoDataPage({ lang, commodityId, marketId, navigate }: {
  lang: Lang
  commodityId: string
  marketId: string
  navigate: (s: NavScreen) => void
}) {
  const c = getC(commodityId)
  const m = MARKETS.find(mk => mk.id === marketId)!
  const p = getP(commodityId, marketId) as Insufficient
  const other = MARKETS.find(mk => mk.id !== marketId)
  const reportCopy = reportPriceCopy(lang)

  return (
    <div className="theme-bg min-h-full">
      <div className="relative overflow-hidden theme-badge-warning border-b theme-border" style={{ minHeight: 240 }}>
        <div className="relative max-w-5xl mx-auto px-6 lg:px-10 py-12 lg:py-16">
          <p className="text-sm font-semibold mb-2">{c.emoji} {lang === 'am' ? c.am : c.en} · 📍 {lang === 'am' ? m.am : m.en}</p>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">⚠</span>
            <h1 className="text-3xl font-bold" style={{ ...display, letterSpacing: '-0.03em' }}>
              {lang === 'en' ? 'Not enough reports yet' : 'በቂ ሪፖርቶች የሉም'}
            </h1>
          </div>
          <p className="text-sm opacity-80">{lang === 'en' ? 'This price will appear once 3 reports are collected in 72 hours.' : 'ይህ ዋጋ 72 ሰዓት ውስጥ 3 ሪፖርቶች ሲሟሉ ይታያል።'}</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 lg:px-10 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-5">
            <div className="theme-card rounded-2xl p-6">
              <h3 className="text-base font-bold theme-text mb-4">{lang === 'en' ? 'Progress to first price' : 'ወደ መጀመሪያ ዋጋ'}</h3>
              <ProgressDots current={p.current} />
              <p className="text-sm theme-text-muted mt-3 mb-6">
                {p.zero ? (lang === 'en' ? 'No reports yet in the last 72 hours.' : 'ባለፉት 72 ሰዓታት ምንም ሪፖርቶች የሉም።')
                  : `${p.current} of 3 ${lang === 'en' ? 'reports collected so far.' : 'ሪፖርቶች ተሰብስበዋል።'}`}
              </p>
              <ReportPriceCta lang={lang} commodityId={c.id} marketId={m.id} size="md" fullWidth />
              <p className="text-xs theme-text-dim mt-3">{reportCopy.hint}</p>
            </div>

            {other && (() => {
              const op = getP(c.id, other.id)
              if (op.status !== 'published') return null
              return (
                <button
                  onClick={() => navigate({ id: 'price-detail', commodityId: c.id, marketId: other.id })}
                  className="w-full text-left theme-card theme-card-interactive rounded-2xl overflow-hidden"
                >
                  <div className="h-24 relative overflow-hidden">
                    <img src={other.img} alt={other.en} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-3 left-4 flex items-center gap-2">
                      <LiveDot /><span className="theme-text text-sm font-semibold">📍 {lang === 'am' ? other.am : other.en} — {lang === 'en' ? 'data available' : 'ዳታ ይገኛል'}</span>
                    </div>
                  </div>
                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <span className="theme-stat-value" style={{ fontSize: 26, fontWeight: 700 }}>{(op as Published).price}</span>
                      <span className="text-sm theme-text-muted ml-2">birr / {lang === 'am' ? c.unitAm : c.unit}</span>
                    </div>
                    <span className="text-sm font-semibold theme-accent">{lang === 'en' ? 'View detail →' : 'ዝርዝር →'}</span>
                  </div>
                </button>
              )
            })()}
          </div>

          <div>
            <div className="rounded-2xl overflow-hidden border theme-border">
              <img src={c.img} alt={c.en} className="w-full aspect-video object-cover grayscale opacity-60" />
              <div className="p-4 theme-badge-warning">
                <p className="text-sm font-semibold">⚠ {lang === 'en' ? 'Waiting for reports' : 'ሪፖርቶቹን በጠባቂ'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
