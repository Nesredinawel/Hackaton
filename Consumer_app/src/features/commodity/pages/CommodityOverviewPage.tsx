import type { Lang, NavScreen, Published, Insufficient } from '@/data'
import { CATEGORIES, getAreaById, getMarketsForArea, getC, getP, tgLink } from '@/data'
import { GreenBtn, ProgressDots } from '@/shared/components'

export default function CommodityOverviewPage({ lang, commodityId, navigate, selectedAreaId }: {
  lang: Lang
  commodityId: string
  navigate: (s: NavScreen) => void
  selectedAreaId: string
}) {
  const c = getC(commodityId)
  const cat = CATEGORIES.find(ct => ct.items.includes(c.id))!
  const area = getAreaById(selectedAreaId)
  const areaMarkets = getMarketsForArea(selectedAreaId)

  return (
    <div>
      <div className="relative h-56 overflow-hidden">
        <img src={c.img} alt={c.en} className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(26,24,20,0.75))' }} />
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto px-6 lg:px-10 pb-6 w-full">
            <p className="text-white/60 text-sm mb-1">{cat.emoji} {lang === 'am' ? cat.am : cat.en}</p>
            <h1 className="text-4xl font-bold text-white" style={{ fontFamily: "'Clash Display','Inter',sans-serif", letterSpacing: '-0.03em' }}>
              {lang === 'am' ? c.am : c.en}
            </h1>
            <p className="text-white/60 text-sm" style={{ fontFamily: "'Noto Sans Ethiopic',sans-serif" }}>{c.am} · {c.unit} · 📍 {area ? (lang === 'am' ? area.am : area.en) : 'Ethiopia'}</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10">
        <h2 className="text-sm font-bold text-[#9C9590] uppercase tracking-widest mb-6">{lang === 'en' ? `All markets in ${area?.en || 'Ethiopia'}` : 'ዛሬ ሁሉም ገበያዎች'}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
          {areaMarkets.map(m => {
            const p = getP(c.id, m.id)
            const pub = p.status === 'published' ? p as Published : null
            return (
              <div key={m.id} className="bg-white rounded-2xl overflow-hidden border border-[#E8E4DC]"
                style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)', borderLeft: !pub ? '4px solid #C47D1A' : undefined }}>
                <div className="h-28 relative overflow-hidden">
                  <img src={m.img} alt={m.en} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-3 left-4">
                    <p className="text-white font-bold">📍 {lang === 'am' ? m.am : m.en}</p>
                  </div>
                </div>
                <div className="p-5">
                  {pub ? (
                    <>
                      <div className="flex items-baseline gap-2 mb-4">
                        <span style={{ fontFamily: "'Clash Display','Inter',sans-serif", fontSize: 40, fontWeight: 700, color: '#1A1814', letterSpacing: '-0.04em', lineHeight: 1 }}>{pub.price}</span>
                        <span className="text-[#9C9590] text-sm">birr / {lang === 'am' ? c.unitAm : c.unit}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                        {[
                          { label: 'Range', value: `${pub.low}-${pub.high}` },
                          { label: 'Reports', value: String(pub.reports) },
                          { label: 'Updated', value: pub.freshness },
                        ].map(r => (
                          <div key={r.label} className="bg-[#F8F7F4] rounded-xl py-2.5">
                            <p className="text-xs text-[#9C9590]">{r.label}</p>
                            <p className="text-sm font-semibold text-[#1A1814] mt-0.5">{r.value}</p>
                          </div>
                        ))}
                      </div>
                      <button onClick={() => navigate({ id: 'price-detail', commodityId: c.id, marketId: m.id })}
                        className="text-sm font-semibold text-[#1D7A4E] hover:text-[#166040]">{lang === 'en' ? 'View full detail' : 'ዝርዝር'} →</button>
                    </>
                  ) : (
                    <>
                      <p className="text-base font-bold text-[#C47D1A] mb-2">⚠ {lang === 'en' ? 'Not enough reports yet' : 'በቂ ሪፖርቶች የሉም'}</p>
                      <ProgressDots current={(p as Insufficient).current} />
                      <p className="text-sm text-[#9C9590] mt-2 mb-4">{(p as Insufficient).current} of 3 needed</p>
                      <a href={tgLink(c.id, m.id)} target="_blank" rel="noopener noreferrer"
                        className="text-sm font-semibold text-[#1D7A4E]">{lang === 'en' ? 'Add data' : 'ዳታ ጨምር'} →</a>
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <div className="rounded-2xl p-6 lg:p-8" style={{ backgroundColor: '#E8F5EE', border: '1px solid #C6E8D6' }}>
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <p className="text-lg font-bold text-[#1A1814] mb-1">{lang === 'en' ? 'Saw a different price?' : 'የተለየ ዋጋ አይተዋል?'}</p>
              <p className="text-sm text-[#9C9590]">{lang === 'en' ? 'Choose your market:' : 'ገበያዎ ይምረጡ:'}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              {areaMarkets.map(m => (
                <GreenBtn key={m.id} href={tgLink(c.id, m.id)} label={`📍 ${lang === 'am' ? m.am : m.en}`} size="sm" />
              ))}
            </div>
          </div>
          <p className="text-xs text-[#9C9590] mt-4">{lang === 'en' ? 'Opens Telegram. 5 seconds.' : 'ቴሌግራምን ይከፍታል።'}</p>
        </div>
      </div>
    </div>
  )
}
