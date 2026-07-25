import type { Lang, NavScreen, Published } from '@/data'
import { IMG, CATEGORIES, MARKETS, getAreaById, getMarketsForArea, getAllLivePairsForArea, getP } from '@/data'
import { LiveDot, SectionHeading, GreenBtn, CommodityCard, PriceChip } from '@/shared/components'

export default function HomePage({ lang, navigate, selectedAreaId }: { lang: Lang; navigate: (s: NavScreen) => void; selectedAreaId: string }) {
  const area = getAreaById(selectedAreaId)
  const areaMarkets = getMarketsForArea(selectedAreaId)
  const livePairs = getAllLivePairsForArea(selectedAreaId)
  const liveItems = livePairs.slice(0, 8)
  const heroLive = livePairs.slice(0, 4)

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden" style={{ backgroundColor: '#1A1814', minHeight: 520 }}>
        <img src={area?.image || IMG.heroMarket} alt="Ethiopian market" className="absolute inset-0 w-full h-full object-cover opacity-30" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-10 py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-6"
                style={{ backgroundColor: 'rgba(29,122,78,0.3)', color: '#6ee7b7', border: '1px solid rgba(110,231,183,0.3)' }}>
                <LiveDot />{lang === 'en' ? `${livePairs.length} live prices in ${area?.en || 'Ethiopia'}` : `${livePairs.length} ቀጥታ ዋጋዎች`}
              </div>
              <h1 className="text-white leading-none mb-4"
                style={{ fontFamily: "'Clash Display','Inter',sans-serif", fontSize: 'clamp(40px,6vw,72px)', fontWeight: 700, letterSpacing: '-0.04em' }}>
                {lang === 'en' ? <>Market prices,<br />right now.</> : <>የገበያ ዋጋዎች,<br />አሁን።</>}
              </h1>
              <p className="text-white/60 text-base leading-relaxed mb-8 max-w-md">
                {lang === 'en'
                  ? `Food, electronics, clothing, household items, health, and transport — tracked in real time across ${area?.en || "Ethiopia's key markets"}.`
                  : 'ምግብ፣ ኤሌክትሮኒክስ፣ ልብስ፣ የቤት እቃዎች፣ ጤናና ትራንስፖርት — ቀጥታ ሪፖርት።'}
              </p>
              <div className="flex flex-wrap gap-3">
                <GreenBtn label={lang === 'en' ? 'Browse all prices →' : 'ሁሉም ዋጋዎች →'} onClick={() => navigate({ id: 'categories' })} size="lg" />
                <button onClick={() => navigate({ id: 'map' })}
                  className="px-6 py-3.5 rounded-xl text-sm font-semibold text-white/70 hover:text-white border border-white/20 hover:border-white/40 transition-colors">
                  {lang === 'en' ? '🗺️ Browse by map' : '🗺️ በካርታ ተቃኝ'}
                </button>
              </div>
            </div>
            <div className="hidden lg:grid grid-cols-2 gap-3">
              {heroLive.map(({ c, m, p }) => (
                <button key={`${c.id}-${m.id}`} onClick={() => navigate({ id: 'price-detail', commodityId: c.id, marketId: m.id })}
                  className="text-left p-4 rounded-2xl border border-white/10 hover:border-white/25 transition-all"
                  style={{ backgroundColor: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(12px)' }}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0"><img src={c.img} alt={c.en} className="w-full h-full object-cover" /></div>
                    <div>
                      <p className="text-white text-sm font-semibold leading-tight">{lang === 'am' ? c.am : c.en}</p>
                      <p className="text-white/50 text-xs">📍 {lang === 'am' ? m.am : m.en}</p>
                    </div>
                  </div>
                  <p className="text-white font-bold leading-none" style={{ fontFamily: "'Clash Display','Inter',sans-serif", fontSize: 28 }}>{(p as Published).price}</p>
                  <p className="text-white/40 text-xs mt-0.5 mb-1.5">birr / {lang === 'am' ? c.unitAm : c.unit}</p>
                  <div className="flex items-center gap-1"><LiveDot /><span className="text-white/40 text-xs">{(p as Published).freshness}</span></div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Live strip */}
      <section className="border-b border-[#E8E4DC] bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-5">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 flex-shrink-0">
              <LiveDot size="md" />
              <div>
                <span className="text-xs font-bold text-[#1A1814] uppercase tracking-widest block">{lang === 'en' ? 'Live Now' : 'አሁን'}</span>
                <span className="text-[10px] text-[#9C9590]">📍 {area ? (lang === 'am' ? area.am : area.en) : 'Ethiopia'}</span>
              </div>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-1 flex-1" style={{ scrollbarWidth: 'none' }}>
              {liveItems.length > 0 ? liveItems.map(({ c, m }) => (
                <PriceChip key={`${c.id}-${m.id}`} commodityId={c.id} marketId={m.id} lang={lang}
                  onClick={() => navigate({ id: 'price-detail', commodityId: c.id, marketId: m.id })} />
              )) : (
                <p className="text-sm text-[#9C9590] py-2">{lang === 'en' ? 'No live prices in this area yet.' : 'በዚህ አካባቢ ምንም ቀጥታ ዋጋዎች የሉም።'}</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Category grid */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-20">
        <SectionHeading label="Browse by Category" am="ምድብ ይፈልጉ" lang={lang}
          action={lang === 'en' ? 'All categories' : 'ሁሉም ምድቦች'} onAction={() => navigate({ id: 'categories' })} />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map(cat => {
            const liveCount = cat.items.filter(id => areaMarkets.some(m => getP(id, m.id).status === 'published')).length
            return (
              <button key={cat.id} onClick={() => navigate({ id: 'category-detail', categoryId: cat.id })}
                className="group relative text-left rounded-2xl overflow-hidden border border-[#E8E4DC] card-hover"
                style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                <div className="aspect-square overflow-hidden bg-[#F1EFE9]">
                  <img src={cat.img} alt={cat.en} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/10" />
                </div>
                <div className="absolute inset-0 flex flex-col justify-end p-3">
                  <span className="text-lg mb-1">{cat.emoji}</span>
                  <p className="text-xs font-bold text-white leading-tight">{lang === 'am' ? cat.am : cat.en}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <LiveDot />
                    <span className="text-xs text-green-300 font-semibold">{liveCount} live</span>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </section>

      {/* Featured prices */}
      <section style={{ backgroundColor: '#F1EFE9', borderTop: '1px solid #E8E4DC', borderBottom: '1px solid #E8E4DC' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20">
          <SectionHeading label="Featured Prices" am="ዋና ዋና ዋጋዎች" lang={lang}
            action={lang === 'en' ? 'See all →' : 'ሁሉም →'} onAction={() => navigate({ id: 'categories' })} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {livePairs.slice(0, 3).map(({ c, m }) => (
              <CommodityCard key={`${c.id}-${m.id}`} commodityId={c.id} marketId={m.id} lang={lang}
                onClick={() => navigate({ id: 'price-detail', commodityId: c.id, marketId: m.id })} />
            ))}
            {livePairs.length === 0 && (
              <div className="col-span-3 text-center py-10">
                <p className="text-[#9C9590]">{lang === 'en' ? 'No featured prices in this area.' : 'በዚህ አካባቢ ምንም ዋጋዎች የሉም።'}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Map CTA */}
      <section className="relative overflow-hidden" style={{ backgroundColor: '#1D7A4E' }}>
        <img src={IMG.africaStreet} alt="market" className="absolute inset-0 w-full h-full object-cover opacity-15" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-10 py-16">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-white text-3xl font-bold mb-2"
                style={{ fontFamily: "'Clash Display','Inter',sans-serif", letterSpacing: '-0.03em' }}>
                {lang === 'en' ? 'Explore prices across Ethiopia' : 'በኢትዮጵያ ዋጋዎችን ያስሱ'}
              </h2>
              <p className="text-white/60 text-sm mt-1">{lang === 'en' ? 'Browse 8 cities and 14+ markets on the interactive map.' : 'በንግግር ካርታ 8 ከተማዎች እና 14+ ገበያዎች ያስሱ።'}</p>
            </div>
            <button onClick={() => navigate({ id: 'map' })}
              className="flex-shrink-0 px-8 py-4 rounded-xl text-base font-bold text-[#1D7A4E] bg-white hover:bg-[#F8F7F4] transition-colors shadow-lg">
              🗺️ {lang === 'en' ? 'Open Map →' : 'ካርታ ክፍት →'}
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
