import type { Lang, NavScreen } from '@/data'
import { getAccount, COMMODITIES } from '@/data'

export default function UpgradeSuccessPage({ lang, navigate }: { lang: Lang; navigate: (s: NavScreen) => void }) {
  const account = getAccount()
  const firstCommodity = COMMODITIES[0]?.id ?? 'teff'

  const actions = [
    {
      icon: '📈',
      titleEn: 'View 30-day history', titleAm: 'የ30 ቀን ታሪክ እይ',
      bodyEn: 'See how prices have moved.', bodyAm: 'ዋጋዎች እንዴት እንደተንቀሳቀሱ እይ።',
      ctaEn: 'Browse prices →', ctaAm: 'ዋጋዎችን አስስ →',
      go: () => navigate({ id: 'commodity-overview', commodityId: firstCommodity }),
    },
    {
      icon: '↓',
      titleEn: 'Export price data', titleAm: 'የዋጋ ዳታ አውጣ',
      bodyEn: 'Download a CSV with full provenance attached.', bodyAm: 'ሙሉ ምንጭ ያለበት CSV አውርድ።',
      ctaEn: 'Go to export →', ctaAm: 'ወደ ማውጣት →',
      go: () => navigate({ id: 'commodity-overview', commodityId: firstCommodity }),
    },
    {
      icon: '⚖',
      titleEn: 'Compare markets', titleAm: 'ገበያዎችን አነጻጽር',
      bodyEn: 'See one commodity across all markets on one screen.', bodyAm: 'አንድ ሸቀጥ በሁሉም ገበያዎች በአንድ ማያ ገጽ እይ።',
      ctaEn: 'Compare now →', ctaAm: 'አሁን አነጻጽር →',
      go: () => navigate({ id: 'commodity-overview', commodityId: firstCommodity }),
    },
  ]

  return (
    <div className="max-w-lg mx-auto px-6 py-14">
      <div className="rounded-2xl p-6 mb-8 text-center" style={{ backgroundColor: '#1F1F1F', border: '1px solid #1DB954' }}>
        <span className="text-3xl block mb-2">✅</span>
        <h1 className="font-bold text-white mb-1" style={{ fontFamily: "'SpotifyMixUITitle','CircularSp','Helvetica Neue',Helvetica,Arial,sans-serif", fontSize: 24, letterSpacing: '-0.03em' }}>
          {lang === 'en' ? 'Welcome to Professional' : 'ወደ ፕሮፌሽናል እንኳን በደህና መጡ'}
        </h1>
        <p className="text-sm text-[#B3B3B3]">
          {lang === 'en'
            ? `Your account is active${account ? `, ${account.fullName.split(' ')[0]}` : ''}. 14-day trial started.`
            : 'መለያዎ ንቁ ነው። የ14 ቀን ሙከራ ተጀምሯል።'}
        </p>
      </div>

      <h2 className="text-sm font-bold text-[#B3B3B3] uppercase tracking-widest mb-4">{lang === 'en' ? 'What you can do now' : 'አሁን ምን ማድረግ ይችላሉ'}</h2>
      <div className="space-y-3">
        {actions.map((a) => (
          <div key={a.titleEn} className="bg-[#181818] rounded-2xl border border-[#282828] p-5" style={{ boxShadow: '0 8px 8px rgba(0,0,0,0.3)' }}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{a.icon}</span>
              <p className="text-sm font-bold text-white">{lang === 'am' ? a.titleAm : a.titleEn}</p>
            </div>
            <p className="text-sm text-[#B3B3B3] mb-3">{lang === 'am' ? a.bodyAm : a.bodyEn}</p>
            <button onClick={a.go} className="text-sm font-semibold text-[#1ED760] hover:underline">
              {lang === 'am' ? a.ctaAm : a.ctaEn}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 text-sm text-[#B3B3B3]">
        {lang === 'en' ? 'Need Enterprise?' : 'ኢንተርፕራይዝ ይፈልጋሉ?'}{' '}
        <button onClick={() => navigate({ id: 'enterprise-enquiry' })} className="font-semibold text-[#1ED760] hover:underline">
          {lang === 'en' ? 'Talk to us →' : 'አነጋግረን →'}
        </button>
      </div>
    </div>
  )
}
