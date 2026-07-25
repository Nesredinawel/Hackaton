import type { Lang, NavScreen, Insufficient, Published } from '@/data'
import { MARKETS, getC, getP, tgLink } from '@/data'
import { LiveDot, GreenBtn, ProgressDots } from '@/shared/components'

export default function PriceNoDataPage({ lang, commodityId, marketId, navigate }: {
  lang: Lang
  commodityId: string
  marketId: string
  navigate: (s: NavScreen) => void
}) {
  const c = getC(commodityId)
  const m = MARKETS.find(mk => mk.id === marketId)!
  const p = getP(commodityId, marketId) as Insufficient
  const others = MARKETS.filter(mk => mk.id !== marketId)

  return (
    <div>
      <div className="relative overflow-hidden" style={{ backgroundColor: '#FEF3E2', borderBottom: '1px solid #F0D9B5', minHeight: 240 }}>
        <div className="absolute right-0 inset-y-0 w-1/3 hidden lg:block opacity-30">
          <img src={c.img} alt={c.en} className="w-full h-full object-cover grayscale" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, #FEF3E2, transparent)' }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-10 py-12 lg:py-16">
          <p className="text-sm text-[#C47D1A] font-semibold mb-2">{c.emoji} {lang === 'am' ? c.am : c.en} · 📍 {lang === 'am' ? m.am : m.en}</p>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">⚠</span>
            <h1 className="text-3xl font-bold text-[#C47D1A]" style={{ fontFamily: "'Clash Display','Inter',sans-serif", letterSpacing: '-0.03em' }}>
              {lang === 'en' ? 'Not enough reports yet' : 'በቂ ሪፖርቶች የሉም'}
            </h1>
          </div>
          <p className="text-[#C47D1A]/70 text-sm">{lang === 'en' ? 'This price will appear once 3 reports are collected in 72 hours.' : 'ይህ ዋጋ 72 ሰዓት ውስጥ 3 ሪፖርቶች ሲሟሉ ይታያል።'}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-white rounded-2xl p-6 border border-[#E8E4DC]" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              <h3 className="text-base font-bold text-[#1A1814] mb-4">{lang === 'en' ? 'Progress to first price' : 'ወደ መጀመሪያ ዋጋ'}</h3>
              <ProgressDots current={p.current} />
              <p className="text-sm text-[#6B6560] mt-3 mb-6">
                {p.zero ? (lang === 'en' ? 'No reports yet in the last 72 hours.' : 'ባለፉት 72 ሰዓታት ምንም ሪፖርቶች የሉም።')
                  : `${p.current} of 3 ${lang === 'en' ? 'reports collected so far.' : 'ሪፖርቶች ተሰብስበዋል።'}`}
              </p>
              <GreenBtn href={tgLink(c.id, m.id)} label={p.zero ? (lang === 'en' ? 'Start the count →' : 'ቆጠራውን ጀምር →') : (lang === 'en' ? 'Add the missing data →' : 'ጎደለ ዳታ ጨምር →')} />
              <p className="text-xs text-[#9C9590] mt-3">{lang === 'en' ? 'Opens Telegram. 5 seconds.' : 'ቴሌግራምን ይከፍታል።'}</p>
            </div>

            {others.map(mk => {
              const op = getP(c.id, mk.id)
              if (op.status !== 'published') return null
              return (
                <button key={mk.id} onClick={() => navigate({ id: 'price-detail', commodityId: c.id, marketId: mk.id })}
                  className="w-full text-left bg-white rounded-2xl overflow-hidden border border-[#E8E4DC] card-hover"
                  style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                  <div className="h-24 relative overflow-hidden">
                    <img src={mk.img} alt={mk.en} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-3 left-4 flex items-center gap-2">
                      <LiveDot /><span className="text-white text-sm font-semibold">📍 {lang === 'am' ? mk.am : mk.en} — data available</span>
                    </div>
                  </div>
                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <span style={{ fontFamily: "'Clash Display','Inter',sans-serif", fontSize: 26, fontWeight: 700, color: '#1A1814' }}>{(op as Published).price}</span>
                      <span className="text-sm text-[#9C9590] ml-2">birr / {lang === 'am' ? c.unitAm : c.unit}</span>
                    </div>
                    <span className="text-sm font-semibold text-[#1D7A4E]">{lang === 'en' ? 'View detail →' : 'ዝርዝር →'}</span>
                  </div>
                </button>
              )
            })}
          </div>

          <div>
            <div className="rounded-2xl overflow-hidden border border-[#E8E4DC]">
              <img src={c.img} alt={c.en} className="w-full aspect-video object-cover grayscale opacity-60" />
              <div className="p-4 bg-[#FEF3E2]">
                <p className="text-sm font-semibold text-[#C47D1A]">⚠ {lang === 'en' ? 'Waiting for reports' : 'ሪፖርቶቹን በጠባቂ'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
