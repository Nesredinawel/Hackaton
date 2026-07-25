import { useState } from 'react'
import type { Lang, NavScreen, Published, SortMode } from '@/data'
import { COMMODITIES, getAreaById, getMarketsForArea, getC, getCat, getP } from '@/data'
import { LiveDot, GreenBtn, OutlineBtn, CommodityCard } from '@/shared/components'

export default function CategoryDetailPage({ lang, categoryId, navigate, selectedAreaId }: {
  lang: Lang
  categoryId: string
  navigate: (s: NavScreen) => void
  selectedAreaId: string
}) {
  const area = getAreaById(selectedAreaId)
  const areaMarkets = getMarketsForArea(selectedAreaId)
  const [marketId, setMarketId] = useState(areaMarkets[0]?.id || 'merkato')
  const [sort, setSort] = useState<SortMode>('freshest')
  const cat = getCat(categoryId)
  const items = COMMODITIES.filter(c => cat.items.includes(c.id))

  const sorted = [...items].sort((a, b) => {
    const pa = getP(a.id, marketId), pb = getP(b.id, marketId)
    if (sort === 'az') return a.en.localeCompare(b.en)
    if (sort === 'price') {
      if (pa.status !== 'published') return 1
      if (pb.status !== 'published') return -1
      return (pa as Published).price - (pb as Published).price
    }
    if (pa.status === 'published' && pb.status !== 'published') return -1
    if (pb.status === 'published') return 1
    return 0
  })

  const liveCount = items.filter(c => getP(c.id, marketId).status === 'published').length

  return (
    <div>
      <div className="relative h-52 overflow-hidden">
        <img src={cat.img} alt={cat.en} className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.15), rgba(26,24,20,0.7))' }} />
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto px-6 lg:px-10 pb-6 w-full">
            <div className="flex items-center gap-2 mb-2">
              <LiveDot /><span className="text-xs font-bold text-green-400 uppercase tracking-widest">{liveCount} live</span>
            </div>
            <h1 className="text-3xl font-bold text-white" style={{ fontFamily: "'Clash Display','Inter',sans-serif", letterSpacing: '-0.03em' }}>
              {cat.emoji} {lang === 'am' ? cat.am : cat.en}
            </h1>
            <p className="text-white/60 text-sm mt-0.5" style={{ fontFamily: "'Noto Sans Ethiopic',sans-serif" }}>{cat.am}</p>
          </div>
        </div>
      </div>

      <div className="sticky top-16 z-30 bg-white border-b border-[#E8E4DC]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-3 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            {(['freshest', 'az', 'price'] as SortMode[]).map(s => (
              <OutlineBtn key={s} label={s === 'freshest' ? (lang === 'en' ? 'Freshest' : 'አዲስ') : s === 'az' ? 'A-Z' : (lang === 'en' ? 'Price' : 'ዋጋ')}
                onClick={() => setSort(s)} active={sort === s} />
            ))}
          </div>
          <div className="relative flex-shrink-0">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">📍</span>
            <select value={marketId} onChange={e => setMarketId(e.target.value)}
              className="pl-9 pr-8 py-2 rounded-xl text-sm font-semibold text-[#1A1814] bg-white border border-[#E8E4DC] cursor-pointer">
              {areaMarkets.map(m => <option key={m.id} value={m.id}>{lang === 'am' ? m.am : m.en}</option>)}
            </select>
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 4l4 4 4-4" stroke="#9C9590" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sorted.map(c => (
            <CommodityCard key={c.id} commodityId={c.id} marketId={marketId} lang={lang}
              onClick={() => {
                const p = getP(c.id, marketId)
                navigate(p.status === 'published' ? { id: 'price-detail', commodityId: c.id, marketId } : { id: 'price-no-data', commodityId: c.id, marketId })
              }} />
          ))}
        </div>

        <div className="mt-10 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          style={{ backgroundColor: '#E8F5EE', border: '1px solid #C6E8D6' }}>
          <div>
            <p className="font-semibold text-[#1A1814]">🌿 {lang === 'en' ? "Know a price not listed here?" : 'ያልተዘረዘረ ዋጋ ያውቃሉ?'}</p>
            <p className="text-sm text-[#6B6560] mt-0.5">{lang === 'en' ? 'Report it in 5 seconds.' : 'በ5 ሰኮንድ ዘግቡ።'}</p>
          </div>
          <GreenBtn href="https://t.me/WagaIndexBot" label={lang === 'en' ? 'Report a price →' : 'ዋጋ ዘግብ →'} size="sm" />
        </div>
      </div>
    </div>
  )
}
