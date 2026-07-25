import type { Lang, NavScreen } from '@/data'
import { IMG, CATEGORIES, getP, MARKETS } from '@/data'
import { LiveDot } from '@/shared/components'

export default function AboutPage({ lang, navigate }: { lang: Lang; navigate: (s: NavScreen) => void }) {
  const steps = [
    { n: '01', en: 'Someone in a market reports a price via Telegram.', am: 'አንድ ሰው በገበያ ውስጥ ሆኖ ቴሌግራም ተጠቅሞ ዋጋ ሪፖርት ያደርጋል።' },
    { n: '02', en: 'The price is checked against recent reports and a verified baseline.', am: 'ዋጋው ከቅርብ ሪፖርቶች እና ከተረጋገጠ ቤዝላይን ጋር ይጣራል።' },
    { n: '03', en: 'If it passes, it joins the published index. Gaps are shown honestly — never estimated.', am: 'ካለፈ ወደ ህትመት ኢንዴክስ ይቀላቀላል። ክፍተቶቹ ታማኝ ሆነው ይታያሉ — ምንም ግምት አይደለም።' },
    { n: '04', en: 'A price needs 3+ validated reports within 72 hours to publish.', am: 'ዋጋ ለመታተም በ72 ሰዓት ውስጥ 3+ የተረጋገጡ ሪፖርቶች ያስፈልጋሉ።' },
  ]

  return (
    <div>
      <div className="relative overflow-hidden" style={{ backgroundColor: '#1A1814', minHeight: 300 }}>
        <img src={IMG.foodOverhead} alt="market overhead" className="absolute inset-0 w-full h-full object-cover opacity-25" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-10 py-20">
          <p className="text-xs font-bold text-green-400 uppercase tracking-widest mb-4">{lang === 'en' ? 'About the platform' : 'ስለ መድረኩ'}</p>
          <h1 className="text-white leading-tight mb-4"
            style={{ fontFamily: "'Clash Display','Inter',sans-serif", fontSize: 'clamp(36px,5vw,60px)', fontWeight: 700, letterSpacing: '-0.04em', maxWidth: 600 }}>
            {lang === 'en' ? 'About Waga Index' : 'ስለ ዋጋ ኢንዴክስ'}
          </h1>
          <p className="text-white/60 text-base leading-relaxed max-w-lg">
            {lang === 'en'
              ? "Real-time price tracking across 6 categories and 29 commodities in Addis Ababa's key markets. Contributed by people. Verified before publication."
              : 'በ6 ምድቦች እና 29 ሸቀጦቹ — ቀጥታ ሪፖርት። ከህትመት በፊት ይረጋገጣል።'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-10">
            <div>
              <h2 className="text-2xl font-bold text-[#1A1814] mb-6" style={{ fontFamily: "'Clash Display','Inter',sans-serif", letterSpacing: '-0.03em' }}>
                {lang === 'en' ? 'How it works' : 'እንዴት ይሰራል'}
              </h2>
              <div className="space-y-4">
                {steps.map(s => (
                  <div key={s.n} className="flex gap-5 bg-white rounded-2xl p-5 border border-[#E8E4DC]" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                    <span className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center text-sm font-bold text-white bg-[#1D7A4E]">{s.n}</span>
                    <p className="text-[#6B6560] leading-relaxed pt-1">{lang === 'am' ? s.am : s.en}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#1A1814] mb-4" style={{ fontFamily: "'Clash Display','Inter',sans-serif", letterSpacing: '-0.03em' }}>
                {lang === 'en' ? 'What gaps mean' : 'ክፍተቶቹ ምን ማለት ናቸው'}
              </h2>
              <div className="bg-[#FEF3E2] rounded-2xl p-6 border border-[#F0D9B5]">
                <p className="text-[#6B6560] leading-relaxed">
                  {lang === 'en'
                    ? '"Not enough reports" means the 3-report threshold was not met in 72 hours. We show the gap — never an estimate. A gap is honest information.'
                    : '"በቂ ሪፖርቶች የሉም" ማለት ደረጃው አልተሟላም ማለት ነው። ክፍተቱን እናሳያለን — ምንም ግምት አይደለም።'}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-[#1A1814] mb-6" style={{ fontFamily: "'Clash Display','Inter',sans-serif", letterSpacing: '-0.03em' }}>
              {lang === 'en' ? 'What we cover' : 'ምን እንሸፍናለን'}
            </h2>
            <div className="bg-white rounded-2xl overflow-hidden border border-[#E8E4DC]" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              {CATEGORIES.map((cat, i) => {
                const liveCount = cat.items.filter(id => MARKETS.some(m => getP(id, m.id).status === 'published')).length
                return (
                  <button key={cat.id}
                    onClick={() => navigate({ id: 'category-detail', categoryId: cat.id })}
                    className={`w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-[#F8F7F4] transition-colors ${i < CATEGORIES.length - 1 ? 'border-b border-[#E8E4DC]' : ''}`}>
                    <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0">
                      <img src={cat.img} alt={cat.en} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-[#1A1814]">{lang === 'am' ? cat.am : cat.en}</p>
                      <p className="text-xs text-[#9C9590]">{cat.items.length} commodities</p>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <LiveDot /><span className="text-xs font-bold text-[#1D7A4E]">{liveCount}</span>
                    </div>
                  </button>
                )
              })}
            </div>

            <div className="mt-6">
              <button onClick={() => navigate({ id: 'home' })} className="text-sm font-semibold text-[#1D7A4E] hover:text-[#166040] transition-colors">
                ← {lang === 'en' ? 'Back to prices' : 'ወደ ዋጋዎቹ ተመለስ'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
