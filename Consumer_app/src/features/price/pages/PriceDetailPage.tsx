import type { Lang, NavScreen, Published } from '@/data'
import { CATEGORIES, MARKETS, getC, getP, tgLink } from '@/data'
import { LiveDot, GreenBtn, RangeBar, StatRow } from '@/shared/components'

export default function PriceDetailPage({ lang, commodityId, marketId, navigate }: {
  lang: Lang
  commodityId: string
  marketId: string
  navigate: (s: NavScreen) => void
}) {
  const c = getC(commodityId)
  const m = MARKETS.find(mk => mk.id === marketId)!
  const p = getP(commodityId, marketId) as Published
  const cat = CATEGORIES.find(ct => ct.items.includes(c.id))!
  const others = MARKETS.filter(mk => mk.id !== marketId)

  return (
    <div>
      <div className="relative overflow-hidden" style={{ backgroundColor: '#F1EFE9', minHeight: 280 }}>
        <div className="absolute right-0 inset-y-0 w-1/2 hidden lg:block">
          <img src={c.img} alt={c.en} className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, #F1EFE9 0%, transparent 40%)' }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-10 py-12 lg:py-16">
          <div className="flex items-center gap-2 text-sm text-[#9C9590] mb-5 flex-wrap">
            <button onClick={() => navigate({ id: 'category-detail', categoryId: cat.id })} className="hover:text-[#1D7A4E] transition-colors">
              {cat.emoji} {lang === 'am' ? cat.am : cat.en}
            </button>
            <span>/</span>
            <button onClick={() => navigate({ id: 'commodity-overview', commodityId: c.id })} className="hover:text-[#1D7A4E] transition-colors">
              {lang === 'am' ? c.am : c.en}
            </button>
            <span>/</span>
            <span className="text-[#1A1814] font-medium">📍 {lang === 'am' ? m.am : m.en}</span>
          </div>

          <div className="max-w-xl">
            <h1 className="font-bold text-[#1A1814] mb-1"
              style={{ fontFamily: "'Clash Display','Inter',sans-serif", fontSize: 'clamp(26px,4vw,40px)', letterSpacing: '-0.03em' }}>
              {lang === 'am' ? c.am : c.en}
            </h1>
            <p className="text-[#6B6560] text-sm mb-5">📍 {lang === 'am' ? m.am : m.en}</p>
            <div className="flex items-baseline gap-3 mb-2">
              <span style={{ fontFamily: "'Clash Display','Inter',sans-serif", fontSize: 'clamp(52px,8vw,80px)', fontWeight: 700, color: '#1A1814', letterSpacing: '-0.05em', lineHeight: 1 }}>
                {p.price}
              </span>
              <span className="text-lg text-[#9C9590] font-medium">birr / {lang === 'am' ? c.unitAm : c.unit}</span>
            </div>
            <div className="flex items-center gap-2">
              {p.stale
                ? <span className="text-sm font-semibold text-[#C47D1A]">⚠ {lang === 'en' ? 'Stale data' : 'ያለፈ ዳታ'} · {p.freshness}</span>
                : <><LiveDot size="md" /><span className="text-sm text-[#6B6560]">{lang === 'en' ? 'Updated' : 'ዝማኔ'} {p.freshness}</span></>
              }
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-white rounded-2xl p-6 border border-[#E8E4DC]" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              <h3 className="text-xs font-bold text-[#9C9590] uppercase tracking-widest mb-4">{lang === 'en' ? `Today at ${m.en}` : `ዛሬ ${m.am}`}</h3>
              <RangeBar low={p.low} high={p.high} price={p.price} />
              <div className="mt-4 space-y-0">
                <StatRow label={lang === 'en' ? 'Reports' : 'ሪፖርቶች'} value={String(p.reports)} />
                <StatRow label={lang === 'en' ? 'Contributors' : 'አስተዋጽዖ አድራጊዎች'} value={`${p.contributors} ${lang === 'en' ? 'people' : 'ሰዎች'}`} />
                <StatRow label={lang === 'en' ? 'Field agents' : 'ሜዳ ወኪሎች'} value={`${p.agents} ${lang === 'en' ? 'agents' : 'ወኪሎች'}`} />
                <StatRow label={lang === 'en' ? 'Window' : 'ጊዜ ክልል'} value={lang === 'en' ? 'Last 72 hours' : 'ያለፉ 72 ሰዓታት'} />
              </div>
            </div>

            {others.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-[#E8E4DC]" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <h3 className="text-xs font-bold text-[#9C9590] uppercase tracking-widest mb-4">{lang === 'en' ? 'Other markets' : 'ሌሎች ገበያዎች'}</h3>
                {others.map(mk => {
                  const op = getP(c.id, mk.id)
                  return (
                    <button key={mk.id}
                      onClick={() => navigate(op.status === 'published' ? { id: 'price-detail', commodityId: c.id, marketId: mk.id } : { id: 'price-no-data', commodityId: c.id, marketId: mk.id })}
                      className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-[#F8F7F4] transition-colors border border-[#E8E4DC]">
                      <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                        <img src={mk.img} alt={mk.en} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-semibold text-[#1A1814]">📍 {lang === 'am' ? mk.am : mk.en}</p>
                      </div>
                      {op.status === 'published'
                        ? <span className="font-bold text-[#1A1814]" style={{ fontFamily: "'Clash Display','Inter',sans-serif", fontSize: 20 }}>{op.price} birr →</span>
                        : <span className="text-sm font-semibold text-[#C47D1A]">⚠ No data →</span>
                      }
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl p-6" style={{ backgroundColor: '#E8F5EE', border: '1px solid #C6E8D6' }}>
              <p className="text-base font-bold text-[#1A1814] mb-1">{lang === 'en' ? `Paid a different price at ${m.en}?` : `${m.am} የተለየ ዋጋ ከፈሉ?`}</p>
              <p className="text-sm text-[#6B6560] mb-5">{lang === 'en' ? 'Your report improves accuracy for everyone.' : 'ሪፖርትዎ ሁሉም ሰዎችን ይረዳል።'}</p>
              <GreenBtn href={tgLink(c.id, m.id)} label={lang === 'en' ? 'Report this price →' : 'ይህን ዋጋ ዘግብ →'} />
              <p className="text-xs text-[#9C9590] mt-3 text-center">{lang === 'en' ? 'Opens Telegram. 5 seconds.' : 'ቴሌግራምን ይከፍታል።'}</p>
            </div>
            <div className="rounded-2xl overflow-hidden border border-[#E8E4DC]">
              <img src={c.img} alt={c.en} className="w-full aspect-video object-cover" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
