import type { Lang, NavScreen, PriceData } from '@/data'
import { getC, getMkt, getP, tgLink } from '@/data'
import { StatRow } from '@/shared/components'

export default function PriceConfirmedPage({ lang, commodityId, marketId, navigate }: {
  lang: Lang
  commodityId: string
  marketId: string
  navigate: (s: NavScreen) => void
}) {
  const c = getC(commodityId)
  const m = getMkt(marketId)
  const p = getP(commodityId, marketId)

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <div className="rounded-3xl p-8 mb-6 text-center" style={{ backgroundColor: '#E8F5EE', border: '1px solid #C6E8D6' }}>
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl bg-[#1D7A4E]">✅</div>
        <h1 className="text-3xl font-bold text-[#1A1814] mb-1" style={{ fontFamily: "'Clash Display','Inter',sans-serif", letterSpacing: '-0.03em' }}>
          {lang === 'en' ? 'Thank you' : 'አመሰግናለሁ'}
        </h1>
        <p className="text-[#6B6560] mt-2">{lang === 'en' ? 'Your report helps everyone who shops in this market.' : 'ሪፖርትዎ ሁሉም ሰዎችን ይረዳል።'}</p>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <img src={c.img} alt={c.en} className="w-10 h-10 rounded-xl object-cover" />
        <p className="text-sm text-[#6B6560]">{lang === 'am' ? c.am : c.en} · 📍 {lang === 'am' ? m.am : m.en}</p>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-[#E8E4DC] mb-5" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        {p.status === 'published' ? (
          <>
            <div className="flex items-baseline gap-2 mb-4">
              <span style={{ fontFamily: "'Clash Display','Inter',sans-serif", fontSize: 52, fontWeight: 700, color: '#1A1814', letterSpacing: '-0.05em', lineHeight: 1 }}>{p.price}</span>
              <span className="text-lg text-[#9C9590]">birr / {lang === 'am' ? c.unitAm : c.unit}</span>
            </div>
            <StatRow label={lang === 'en' ? 'Reports' : 'ሪፖርቶች'} value={`${p.reports + 1} (including yours)`} />
            <StatRow label={lang === 'en' ? 'Updated' : 'ዝማኔ'} value={lang === 'en' ? 'Just now ●' : 'አሁን ●'} />
          </>
        ) : (
          <p className="text-[#6B6560]">{lang === 'en' ? 'Your report is being processed.' : 'ሪፖርትዎ እየተሰራ ነው።'}</p>
        )}
      </div>

      <div className="bg-white rounded-2xl p-5 border border-[#E8E4DC]">
        <p className="font-semibold text-[#1A1814] mb-3">{lang === 'en' ? 'What next?' : 'ቀጥሎ?'}</p>
        <div className="flex flex-col gap-2">
          <button onClick={() => navigate({ id: 'categories' })}
            className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold text-[#1D7A4E] bg-[#E8F5EE] hover:bg-[#C6E8D6] transition-colors">
            {lang === 'en' ? 'Browse all categories' : 'ሁሉም ምድቦች'} <span>→</span>
          </button>
          <a href={tgLink(c.id, m.id)} target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold text-[#6B6560] border border-[#E8E4DC] hover:border-[#9C9590] transition-colors">
            {lang === 'en' ? 'Report another price' : 'ሌላ ዋጋ ዘግብ'} <span>→</span>
          </a>
        </div>
      </div>
    </div>
  )
}
