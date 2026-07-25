import { useState } from 'react'
import type { Lang, NavScreen, Published } from '@/data'
import { MARKETS, getC, getP, getPriceHistory, canAccess, historyDepthDays, getTier, recordExport, exportsUsedToday, PRO_EXPORTS_PER_DAY } from '@/data'
import { LiveDot, Btn, RangeBar, StatRow, PriceHistoryChart, PaywallOverlay, PaywallPanel, ReportPriceCta, reportPriceCopy } from '@/shared/components'

const display = { fontFamily: "'SpotifyMixUITitle','CircularSp','Helvetica Neue',Helvetica,Arial,sans-serif" } as const

export default function PriceDetailPage({ lang, commodityId, marketId, navigate }: {
  lang: Lang
  commodityId: string
  marketId: string
  navigate: (s: NavScreen) => void
}) {
  const c = getC(commodityId)
  const m = MARKETS.find(mk => mk.id === marketId)!
  const p = getP(commodityId, marketId) as Published
  const other = MARKETS.find(mk => mk.id !== marketId)

  const tier = getTier()
  const historyAccess = canAccess('history')
  const sourceAccess = canAccess('source')
  const depth = historyDepthDays()
  const [exportMsg, setExportMsg] = useState<'idle' | 'done' | 'limit'>('idle')

  const previewSeries = getPriceHistory(commodityId, marketId, 30)
  const paidSeries = depth === null ? getPriceHistory(commodityId, marketId, 180) : getPriceHistory(commodityId, marketId, Math.max(1, depth))

  const doExport = () => {
    const access = canAccess('export')
    if (!access.allowed) {
      if (access.reason === 'limit') setExportMsg('limit')
      return
    }
    const rows = paidSeries.map(pt => `${c.en},${m.en},${pt.date},${pt.price},${pt.reports},${Math.round(pt.userShare * 100)}%`)
    const csv = `commodity,market,date,price_birr,reports,user_share\n${rows.join('\n')}`
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `waga_${c.id}_${m.id}.csv`
    a.click()
    URL.revokeObjectURL(url)
    recordExport()
    setExportMsg('done')
  }

  const avgUserShare = Math.round((paidSeries.reduce((s, pt) => s + pt.userShare, 0) / paidSeries.length) * 100)
  const confidence = p.reports >= 8
    ? { en: 'High', am: 'ከፍተኛ' }
    : p.reports >= 5
      ? { en: 'Medium', am: 'መካከለኛ' }
      : { en: 'Low', am: 'ዝቅተኛ' }

  const reportCopy = reportPriceCopy(lang)

  return (
    <div className="theme-bg min-h-full">
      {/* Header */}
      <div className="relative overflow-hidden theme-surface border-b theme-border" style={{ minHeight: 280 }}>
        <div className="absolute right-0 inset-y-0 w-1/2 hidden lg:block">
          <img src={c.img} alt={c.en} className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, var(--surface) 0%, transparent 40%)' }} />
        </div>
        <div className="relative max-w-5xl mx-auto px-6 lg:px-10 py-12 lg:py-16">
          <div className="flex items-center gap-2 text-sm mb-5 flex-wrap">
            <button onClick={() => navigate({ id: 'home' })} className="theme-crumb">
              {lang === 'en' ? 'Index' : 'ኢንዴክስ'}
            </button>
            <span className="theme-text-dim">/</span>
            <button onClick={() => navigate({ id: 'commodity-overview', commodityId: c.id })} className="theme-crumb">
              {lang === 'am' ? c.am : c.en}
            </button>
            <span className="theme-text-dim">/</span>
            <span className="theme-crumb-current">📍 {lang === 'am' ? m.am : m.en}</span>
          </div>

          <div className="max-w-xl">
            <h1 className="font-bold theme-text mb-1" style={{ ...display, fontSize: 'clamp(26px,4vw,40px)', letterSpacing: '-0.03em' }}>
              {lang === 'am' ? c.am : c.en}
            </h1>
            <p className="theme-text-muted text-sm mb-5">📍 {lang === 'am' ? m.am : m.en} · {lang === 'en' ? 'Addis Ababa' : 'አዲስ አበባ'}</p>

            <div className="flex items-baseline gap-3 mb-2">
              <span className="theme-stat-value" style={{ fontSize: 'clamp(52px,8vw,80px)', fontWeight: 700, letterSpacing: '-0.05em', lineHeight: 1 }}>
                {p.price}
              </span>
              <span className="text-lg theme-text-muted font-medium">birr / {lang === 'am' ? c.unitAm : c.unit}</span>
            </div>
            <div className="flex items-center gap-2">
              {p.stale
                ? <span className="text-sm font-semibold text-[var(--warning)]">⚠ {lang === 'en' ? 'Stale data' : 'ያለፈ ዳታ'} · {p.freshness}</span>
                : <><LiveDot size="md" /><span className="text-sm theme-text-muted">{lang === 'en' ? 'Updated' : 'ዝማኔ'} {p.freshness}</span></>
              }
            </div>
          </div>
        </div>
      </div>

      {/* Detail */}
      <div className="max-w-5xl mx-auto px-6 lg:px-10 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-5">
            <div className="theme-card rounded-2xl p-6">
              <h3 className="theme-section-label mb-4">
                {lang === 'en' ? `Today at ${m.en}` : `ዛሬ ${m.am}`}
              </h3>
              <RangeBar low={p.low} high={p.high} price={p.price} />
              <div className="mt-4 space-y-0">
                <StatRow label={lang === 'en' ? 'Reports' : 'ሪፖርቶች'} value={String(p.reports)} />
                <StatRow label={lang === 'en' ? 'Contributors' : 'አስተዋጽዖ አድራጊዎች'} value={`${p.contributors} ${lang === 'en' ? 'people' : 'ሰዎች'}`} />
                <StatRow label={lang === 'en' ? 'Field agents' : 'ሜዳ ወኪሎች'} value={`${p.agents} ${lang === 'en' ? 'agents' : 'ወኪሎች'}`} />
                <StatRow label={lang === 'en' ? 'Window' : 'ጊዜ ክልል'} value={lang === 'en' ? 'Last 72 hours' : 'ያለፉ 72 ሰዓታት'} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="theme-section-label">{lang === 'en' ? 'Price history' : 'የዋጋ ታሪክ'}</h3>
                {historyAccess.allowed && (
                  <span className="text-[10px] font-semibold theme-accent">
                    {depth === null ? (lang === 'en' ? 'Full history' : 'ሙሉ ታሪክ') : `${depth}${lang === 'en' ? 'd' : 'ቀን'}`}
                  </span>
                )}
              </div>
              {historyAccess.allowed ? (
                <div className="theme-card rounded-2xl p-6">
                  <PriceHistoryChart points={paidSeries} unit={lang === 'am' ? c.unitAm : c.unit} />
                </div>
              ) : (
                <PaywallOverlay
                  lang={lang}
                  navigate={navigate}
                  icon="📈"
                  titleEn={`See ${lang === 'en' ? '30 days of' : ''} price history`}
                  titleAm="የ30 ቀን የዋጋ ታሪክ እይ"
                  bodyEn={`Track how ${c.en.toLowerCase()} prices have moved at ${m.en} over the last month.`}
                  bodyAm={`${c.am} ዋጋ ባለፈው ወር ${m.am} እንዴት እንደተንቀሳቀሰ ተከታተል።`}
                  preview={
                    <div className="theme-surface p-6">
                      <PriceHistoryChart points={previewSeries} unit={lang === 'am' ? c.unitAm : c.unit} />
                    </div>
                  }
                />
              )}
            </div>

            <div>
              <h3 className="theme-section-label mb-3">{lang === 'en' ? 'Source & confidence' : 'ምንጭ እና መተማመኛ'}</h3>
              {sourceAccess.allowed ? (
                <div className="theme-card rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm theme-text-muted">{lang === 'en' ? 'Source composition' : 'የምንጭ ስብጥር'}</span>
                    <span className="text-xs font-semibold theme-text">{avgUserShare}% {lang === 'en' ? 'user' : 'ተጠቃሚ'} · {100 - avgUserShare}% {lang === 'en' ? 'agent' : 'ወኪል'}</span>
                  </div>
                  <div className="flex h-2.5 rounded-full overflow-hidden mb-5">
                    <div style={{ width: `${avgUserShare}%`, backgroundColor: 'var(--green)' }} />
                    <div style={{ width: `${100 - avgUserShare}%`, backgroundColor: 'var(--warning)' }} />
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t theme-border">
                    <span className="text-sm theme-text-muted">{lang === 'en' ? 'Confidence' : 'መተማመኛ'}</span>
                    <span className={`text-sm font-semibold px-2.5 py-1 rounded-full ${p.reports >= 8 ? 'theme-badge-published' : 'theme-badge-warning'}`}>
                      {lang === 'am' ? confidence.am : confidence.en} · {p.reports} {lang === 'en' ? 'reports' : 'ሪፖርቶች'}
                    </span>
                  </div>
                </div>
              ) : (
                <PaywallPanel
                  lang={lang}
                  navigate={navigate}
                  icon="🧬"
                  titleEn="Source composition & confidence"
                  titleAm="የምንጭ ስብጥር እና መተማመኛ"
                  bodyEn="See how much of this price comes from shoppers versus field agents, and the confidence behind it."
                  bodyAm="ይህ ዋጋ ከተጠቃሚዎች እና ከወኪሎች ምን ያህል እንደመጣ እና ከኋላው ያለውን መተማመኛ እይ።"
                />
              )}
            </div>

            <div>
              <h3 className="theme-section-label mb-3">{lang === 'en' ? 'Export' : 'ማውጣት'}</h3>
              {tier === 'public' ? (
                <PaywallPanel
                  lang={lang}
                  navigate={navigate}
                  icon="↓"
                  titleEn="Export data"
                  titleAm="ዳታ አውጣ"
                  bodyEn="Download validated price data with submission counts, source composition, and confidence indicators. Insufficient-data rows included and marked."
                  bodyAm="የተረጋገጠ የዋጋ ዳታ ከሪፖርት ብዛት፣ ከምንጭ ስብጥር እና ከመተማመኛ ጠቋሚዎች ጋር አውርድ።"
                />
              ) : (
                <div className="theme-card rounded-2xl p-6">
                  <p className="text-sm theme-text-muted mb-4">
                    {lang === 'en'
                      ? 'Download this series as CSV with full provenance attached.'
                      : 'ይህን ተከታታይ ከሙሉ ምንጭ ጋር በCSV አውርድ።'}
                  </p>
                  {exportMsg === 'limit' ? (
                    <div className="rounded-xl p-4 theme-badge-warning">
                      <p className="text-sm font-semibold">
                        {lang === 'en' ? `Daily export limit reached (${PRO_EXPORTS_PER_DAY}/day on Professional).` : `የቀን ማውጫ ገደብ ደርሷል (${PRO_EXPORTS_PER_DAY}/ቀን በፕሮፌሽናል)።`}
                      </p>
                      <button onClick={() => navigate({ id: 'enterprise-enquiry' })} className="text-sm font-semibold theme-accent hover:underline mt-1">
                        {lang === 'en' ? 'Need unlimited? Talk to us →' : 'ያልተገደበ ይፈልጋሉ? አነጋግረን →'}
                      </button>
                    </div>
                  ) : exportMsg === 'done' ? (
                    <div className="rounded-xl p-4 theme-badge-published">
                      <p className="text-sm font-semibold theme-accent">✓ {lang === 'en' ? 'CSV downloaded.' : 'CSV ወርዷል።'}</p>
                    </div>
                  ) : (
                    <Btn variant="primary" size="md" onClick={doExport}>
                      ↓ {lang === 'en' ? 'Export CSV' : 'CSV አውጣ'}
                    </Btn>
                  )}
                  {tier === 'professional' && exportMsg === 'idle' && (
                    <p className="text-xs theme-text-dim mt-2">{exportsUsedToday()} {lang === 'en' ? 'of' : 'ከ'} {PRO_EXPORTS_PER_DAY} {lang === 'en' ? 'used today' : 'ዛሬ ተጠቅሟል'}</p>
                  )}
                </div>
              )}
            </div>

            {other && (
              <div className="theme-card rounded-2xl p-6">
                <h3 className="theme-section-label mb-4">{lang === 'en' ? 'Other market' : 'ሌላ ገበያ'}</h3>
                {(() => {
                  const op = getP(c.id, other.id)
                  return (
                    <button
                      onClick={() => navigate(op.status === 'published'
                        ? { id: 'price-detail', commodityId: c.id, marketId: other.id }
                        : { id: 'price-no-data', commodityId: c.id, marketId: other.id })}
                      className="w-full flex items-center gap-4 p-4 rounded-xl transition-colors duration-100 border theme-border hover:bg-[var(--surface-2)] group"
                    >
                      <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                        <img src={other.img} alt={other.en} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-semibold theme-text group-hover:theme-accent transition-colors">📍 {lang === 'am' ? other.am : other.en}</p>
                      </div>
                      {op.status === 'published'
                        ? <span className="font-bold theme-text" style={{ ...display, fontSize: 20 }}>{(op as Published).price} birr →</span>
                        : <span className="text-sm font-semibold text-[var(--warning)]">⚠ {lang === 'en' ? 'No data' : 'ዳታ የለም'} →</span>
                      }
                    </button>
                  )
                })()}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="theme-highlight p-6">
              <p className="text-base font-bold theme-text mb-1">{reportCopy.bandTitle}</p>
              <p className="text-sm theme-text-muted mb-5">{reportCopy.bandBody}</p>
              <ReportPriceCta lang={lang} commodityId={c.id} marketId={m.id} size="md" fullWidth />
              <p className="text-xs theme-text-dim mt-3 text-center">{reportCopy.hint}</p>
            </div>

            {tier === 'public' && (
              <div className="theme-card rounded-2xl p-6">
                <p className="text-sm font-bold theme-text mb-1">{lang === 'en' ? 'Need more depth?' : 'ተጨማሪ ጥልቀት ይፈልጋሉ?'}</p>
                <p className="text-xs theme-text-muted mb-4">{lang === 'en' ? 'History, source mix, comparison, and export on Professional.' : 'ታሪክ፣ የምንጭ ስብጥር፣ ንጽጽር እና ማውጣት በፕሮፌሽናል።'}</p>
                <button onClick={() => navigate({ id: 'pricing' })} className="text-sm font-semibold theme-accent hover:underline">
                  {lang === 'en' ? 'See plans →' : 'ዕቅዶችን እይ →'}
                </button>
              </div>
            )}

            <div className="rounded-2xl overflow-hidden border theme-border">
              <img src={c.img} alt={c.en} className="w-full aspect-video object-cover" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
