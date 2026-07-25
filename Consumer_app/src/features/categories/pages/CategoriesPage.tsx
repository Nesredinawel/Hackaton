import type { Lang, NavScreen, Published } from '@/data'
import { IMG, CATEGORIES, COMMODITIES, MARKETS, getAreaById, getMarketsForArea, getP } from '@/data'
import { LiveDot } from '@/shared/components'

export default function CategoriesPage({ lang, navigate, selectedAreaId }: { lang: Lang; navigate: (s: NavScreen) => void; selectedAreaId: string }) {
  const area = getAreaById(selectedAreaId)
  const areaMarkets = getMarketsForArea(selectedAreaId)

  return (
    <div>
      <div className="relative overflow-hidden" style={{ backgroundColor: '#1A1814', minHeight: 200 }}>
        <img src={area?.image || IMG.heroMarket} alt="markets" className="absolute inset-0 w-full h-full object-cover opacity-20" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-10 py-14">
          <p className="text-xs font-bold text-green-400 uppercase tracking-widest mb-3">
            {lang === 'en' ? `All categories · ${area?.en || 'Ethiopia'}` : 'ሁሉም ምድቦች'}
          </p>
          <h1 className="text-white text-4xl font-bold" style={{ fontFamily: "'Clash Display','Inter',sans-serif", letterSpacing: '-0.03em' }}>
            {lang === 'en' ? 'What do you need to price?' : 'ምን ዋጋ ማወቅ ይፈልጋሉ?'}
          </h1>
          <p className="text-white/50 mt-2">{CATEGORIES.length} {lang === 'en' ? 'categories · ' : 'ምድቦች · '}{areaMarkets.length} {lang === 'en' ? 'markets' : 'ገበያዎች'}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12 space-y-5">
        {CATEGORIES.map(cat => {
          const catCommodities = COMMODITIES.filter(c => cat.items.includes(c.id))
          const liveCount = catCommodities.filter(c => areaMarkets.some(m => getP(c.id, m.id).status === 'published')).length
          const samplePrices = catCommodities.flatMap(c => areaMarkets.map(m => ({ c, m, p: getP(c.id, m.id) }))).filter(x => x.p.status === 'published').slice(0, 3)

          return (
            <div key={cat.id} className="group bg-white rounded-3xl overflow-hidden border border-[#E8E4DC] hover:shadow-xl transition-all duration-300 cursor-pointer"
              onClick={() => navigate({ id: 'category-detail', categoryId: cat.id })}
              style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <div className="flex flex-col md:flex-row">
                <div className="relative md:w-72 h-48 md:h-auto flex-shrink-0 overflow-hidden">
                  <img src={cat.img} alt={cat.en} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.4))' }} />
                  <div className="absolute bottom-4 left-4">
                    <span className="text-3xl">{cat.emoji}</span>
                  </div>
                </div>
                <div className="flex-1 p-6 lg:p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h2 className="text-xl font-bold text-[#1A1814]" style={{ fontFamily: "'Clash Display','Inter',sans-serif", letterSpacing: '-0.02em' }}>
                          {lang === 'am' ? cat.am : cat.en}
                        </h2>
                        <p className="text-sm text-[#9C9590]" style={{ fontFamily: "'Noto Sans Ethiopic',sans-serif" }}>{cat.am}</p>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0 ml-4">
                        <LiveDot />
                        <span className="text-xs font-bold text-[#1D7A4E]">{liveCount} live prices</span>
                      </div>
                    </div>
                    {samplePrices.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {samplePrices.map(({ c, m, p }) => (
                          <div key={`${c.id}-${m.id}`} className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs"
                            style={{ backgroundColor: '#F1EFE9', border: '1px solid #E8E4DC' }}>
                            <img src={c.img} alt={c.en} className="w-4 h-4 rounded-sm object-cover" />
                            <span className="font-medium text-[#1A1814]">{lang === 'am' ? c.am : c.en}</span>
                            <span className="font-bold text-[#1D7A4E]">{(p as Published).price}br</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="flex flex-wrap gap-1.5">
                      {catCommodities.map(c => (
                        <span key={c.id} className="px-2.5 py-1 rounded-full text-xs text-[#6B6560] bg-[#F8F7F4] border border-[#E8E4DC]">
                          {lang === 'am' ? c.am : c.en}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-5 flex items-center justify-between">
                    <p className="text-xs text-[#9C9590]">{catCommodities.length} {lang === 'en' ? 'commodities' : 'ሸቀጦች'} · {areaMarkets.length} {lang === 'en' ? 'markets' : 'ገበያዎች'}</p>
                    <span className="text-sm font-bold text-[#1D7A4E] group-hover:translate-x-1 transition-transform inline-block">
                      {lang === 'en' ? 'Browse prices →' : 'ዋጋዎቹ →'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
