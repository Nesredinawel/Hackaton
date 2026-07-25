import type { Lang, Published } from '@/data'
import { getC, getMkt, getP } from '@/data'
import LiveDot from './LiveDot'

export default function PriceChip({ commodityId, marketId, lang, onClick }: {
  commodityId: string
  marketId: string
  lang: Lang
  onClick: () => void
}) {
  const c = getC(commodityId)
  const m = getMkt(marketId)
  const p = getP(commodityId, marketId)
  const pub = p.status === 'published' ? p as Published : null

  return (
    <button onClick={onClick} className="flex-shrink-0 bg-white rounded-2xl p-4 text-left border border-[#E8E4DC] hover:shadow-md transition-shadow"
      style={{ minWidth: 148, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0 bg-[#F1EFE9]">
          <img src={c.img} alt={c.en} className="w-full h-full object-cover" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#1A1814] leading-tight truncate">{lang === 'am' ? c.am : c.en}</p>
          <p className="text-xs text-[#9C9590]">📍 {lang === 'am' ? m.am : m.en}</p>
        </div>
      </div>
      {pub ? (
        <>
          <p className="font-bold text-[#1A1814] leading-none" style={{ fontFamily: "'Clash Display','Inter',sans-serif", fontSize: 22 }}>{pub.price}</p>
          <p className="text-xs text-[#9C9590] mt-0.5 mb-1.5">{lang === 'am' ? c.unitAm : c.unit}</p>
          <div className="flex items-center gap-1"><LiveDot /><span className="text-xs text-[#9C9590]">{pub.freshness}</span></div>
        </>
      ) : (
        <p className="text-sm font-semibold text-[#C47D1A] mt-1">⚠ No data</p>
      )}
    </button>
  )
}
