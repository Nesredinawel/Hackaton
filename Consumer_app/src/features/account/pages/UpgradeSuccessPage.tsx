import type { Lang, NavScreen } from '@/data'
import { getAccount, COMMODITIES } from '@/data'

export default function UpgradeSuccessPage({ lang, navigate }: { lang: Lang; navigate: (s: NavScreen) => void }) {
  const account = getAccount()
  const firstCommodity = COMMODITIES[0]?.id ?? 'teff'

  const actions = [
    {
      icon: '◎',
      titleEn: 'Open programme dashboard',
      titleAm: 'Open programme dashboard',
      bodyEn: 'Basket inflation, Addis AI guidance, monthly brief, and coverage honesty.',
      bodyAm: 'Basket inflation, Addis AI guidance, monthly brief, and coverage honesty.',
      ctaEn: 'Open dashboard →',
      ctaAm: 'Open dashboard →',
      go: () => navigate({ id: 'dashboard' }),
    },
    {
      icon: '📈',
      titleEn: 'View 30-day history',
      titleAm: 'View 30-day history',
      bodyEn: 'See how prices have moved.',
      bodyAm: 'See how prices have moved.',
      ctaEn: 'Browse prices →',
      ctaAm: 'Browse prices →',
      go: () => navigate({ id: 'commodity-overview', commodityId: firstCommodity }),
    },
    {
      icon: '↓',
      titleEn: 'Export price data',
      titleAm: 'Export price data',
      bodyEn: 'Download a CSV with full provenance attached.',
      bodyAm: 'Download a CSV with full provenance attached.',
      ctaEn: 'Go to export →',
      ctaAm: 'Go to export →',
      go: () => navigate({ id: 'commodity-overview', commodityId: firstCommodity }),
    },
  ]

  return (
    <div className="max-w-lg mx-auto px-6 py-14">
      <div className="rounded-2xl p-6 mb-8 text-center" style={{ backgroundColor: '#1F1F1F', border: '1px solid #1DB954' }}>
        <span className="text-3xl block mb-2">✅</span>
        <h1 className="font-bold text-white mb-1" style={{ fontFamily: "'SpotifyMixUITitle','CircularSp','Helvetica Neue',Helvetica,Arial,sans-serif", fontSize: 24, letterSpacing: '-0.03em' }}>
          {lang === 'en' ? 'Welcome to Professional' : 'Welcome to Professional'}
        </h1>
        <p className="text-sm text-[#B3B3B3]">
          {lang === 'en'
            ? `Your account is active${account ? `, ${account.fullName.split(' ')[0]}` : ''}. 14-day trial started.`
            : `Your account is active${account ? `, ${account.fullName.split(' ')[0]}` : ''}. 14-day trial started.`}
        </p>
        <button
          type="button"
          onClick={() => navigate({ id: 'dashboard' })}
          className="mt-4 inline-flex items-center justify-center rounded-full bg-[#1ED760] px-5 py-2.5 text-sm font-bold text-[#121212] hover:brightness-110"
        >
          Open programme dashboard →
        </button>
      </div>

      <h2 className="text-sm font-bold text-[#B3B3B3] uppercase tracking-widest mb-4">
        What you can do now
      </h2>
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
        Need Enterprise?{' '}
        <button onClick={() => navigate({ id: 'enterprise-enquiry' })} className="font-semibold text-[#1ED760] hover:underline">
          Talk to us →
        </button>
      </div>
    </div>
  )
}
