import type { Lang, NavScreen } from '@/data'
import { getC, getMkt, getP } from '@/data'
import { StatRow, ReportPriceCta } from '@/shared/components'

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
      <div className="rounded-3xl p-8 mb-6 text-center" style={{ backgroundColor: '#1F1F1F', border: '1px solid #1DB954' }}>
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl bg-[#1ED760]">&#10003;</div>
        <h1 className="text-3xl font-bold text-white mb-1" style={{ fontFamily: "'SpotifyMixUITitle','CircularSp','Helvetica Neue',Helvetica,Arial,sans-serif", letterSpacing: '-0.03em' }}>
          {lang === 'en' ? 'Thank you' : 'አመሰግናለሁ'}
        </h1>
        <p className="text-[#B3B3B3] mt-2">{lang === 'en' ? 'Your report helps everyone who shops in this market.' : 'ሪፖርትዎ ሁሉም ሰዎችን ይረዳል።'}</p>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <img src={c.img} alt={c.en} className="w-10 h-10 rounded-xl object-cover" />
        <p className="text-sm text-[#B3B3B3]">{lang === 'am' ? c.am : c.en} · 📍 {lang === 'am' ? m.am : m.en}</p>
      </div>

      <div className="bg-[#181818] rounded-2xl p-6 border border-[#282828] mb-5" style={{ boxShadow: '0 8px 8px rgba(0,0,0,0.3)' }}>
        {p.status === 'published' ? (
          <>
            <div className="flex items-baseline gap-2 mb-4">
              <span style={{ fontFamily: "'SpotifyMixUITitle','CircularSp','Helvetica Neue',Helvetica,Arial,sans-serif", fontSize: 52, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.05em', lineHeight: 1 }}>{p.price}</span>
              <span className="text-lg text-[#B3B3B3]">birr / {lang === 'am' ? c.unitAm : c.unit}</span>
            </div>
            <StatRow label={lang === 'en' ? 'Reports' : 'ሪፖርቶች'} value={`${p.reports + 1} (including yours)`} />
            <StatRow label={lang === 'en' ? 'Updated' : 'ዝማኔ'} value={lang === 'en' ? 'Just now' : 'አሁን'} />
          </>
        ) : (
          <p className="text-[#B3B3B3]">{lang === 'en' ? 'Your report is being processed.' : 'ሪፖርትዎ እየተሰራ ነው።'}</p>
        )}
      </div>

      <div className="bg-[#181818] rounded-2xl p-5 border border-[#282828]">
        <p className="font-semibold text-white mb-3">{lang === 'en' ? 'What next?' : 'ቀጥሎ?'}</p>
        <div className="flex flex-col gap-2">
          <button onClick={() => navigate({ id: 'home' })}
            className="flex items-center justify-between px-4 py-3 rounded-full text-sm font-semibold text-[#1ED760] bg-[#1F1F1F] hover:bg-[#1DB954] transition-colors">
            {lang === 'en' ? 'Back to index' : 'ወደ ኢንዴክስ'} <span>&rarr;</span>
          </button>
          <div className="pt-1">
            <ReportPriceCta lang={lang} commodityId={c.id} marketId={m.id} size="md" fullWidth variant="secondary" />
          </div>
        </div>
      </div>
    </div>
  )
}
