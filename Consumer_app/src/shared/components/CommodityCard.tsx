import type { Lang, Published, Insufficient } from '@/data'
import { getC, getMkt, getP } from '@/data'
import StatusBadge from './StatusBadge'

export default function CommodityCard({ commodityId, marketId, lang, onClick }: {
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
    <button onClick={onClick} className="group text-left bg-white rounded-2xl overflow-hidden border border-[#E8E4DC] card-hover w-full"
      style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
      <div className="relative aspect-[4/3] overflow-hidden bg-[#F1EFE9]">
        <img src={c.img} alt={c.en} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold text-white"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
          📍 {lang === 'am' ? m.am : m.en}
        </div>
        <StatusBadge p={p} lang={lang} />
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between mb-1">
          <div>
            <p className="font-semibold text-[#1A1814] text-base leading-tight">{lang === 'am' ? c.am : c.en}</p>
            <p className="text-xs text-[#9C9590] mt-0.5" style={{ fontFamily: "'Noto Sans Ethiopic',sans-serif" }}>{c.am}</p>
          </div>
          {pub && (
            <div className="text-right flex-shrink-0 ml-3">
              <span className="font-bold text-[#1A1814] leading-none" style={{ fontFamily: "'Clash Display','Inter',sans-serif", fontSize: 26 }}>{pub.price}</span>
              <p className="text-xs text-[#9C9590] mt-0.5">{lang === 'am' ? c.unitAm : c.unit}</p>
            </div>
          )}
        </div>
        {pub ? (
          <>
            <div className="h-px bg-[#E8E4DC] my-3" />
            <div className="flex items-center justify-between text-xs text-[#9C9590]">
              <span>{lang === 'en' ? 'Range' : 'ክልል'} {pub.low}–{pub.high}</span>
              <span>{pub.reports} {lang === 'en' ? 'reports' : 'ሪፖርቶች'}</span>
            </div>
          </>
        ) : (
          <div className="mt-3">
            <p className="text-sm font-semibold text-[#C47D1A]">{lang === 'en' ? 'Not enough reports yet' : 'በቂ ሪፖርቶች የሉም'}</p>
            {!(p as Insufficient).zero && (
              <p className="text-xs text-[#9C9590] mt-1">{(p as Insufficient).current} of 3 needed</p>
            )}
          </div>
        )}
      </div>
    </button>
  )
}
