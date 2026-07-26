import { useState } from 'react'
import type { Lang, NavScreen, UserAccount } from '@/data'
import {
  getAccount, signOut, cancelSubscription, exportsUsedToday, exportQuota, historyDepthDays,
  PRO_EXPORTS_PER_DAY,
} from '@/data'
import BillingCard from '../components/BillingCard'

function planLabel(account: UserAccount, lang: Lang): string {
  if (account.tier === 'enterprise') return lang === 'en' ? 'Enterprise' : 'ኢንተርፕራይዝ'
  return lang === 'en' ? 'Professional' : 'ፕሮፌሽናል'
}

function statusLabel(account: UserAccount, lang: Lang): string {
  switch (account.subscriptionStatus) {
    case 'trial': return lang === 'en' ? `Trial · ends ${account.trialEndsAt}` : `ሙከራ · ${account.trialEndsAt} ያበቃል`
    case 'active': return lang === 'en' ? 'Active' : 'ንቁ'
    case 'cancelled': return lang === 'en' ? 'Cancelled' : 'ተሰርዟል'
    case 'expired': return lang === 'en' ? 'Expired' : 'ጊዜው አልፎበታል'
    default: return lang === 'en' ? 'Free' : 'ነጻ'
  }
}

export default function AccountPage({ lang, navigate }: { lang: Lang; navigate: (s: NavScreen) => void }) {
  const [account, setAccount] = useState<UserAccount | null>(getAccount)

  if (!account) {
    return (
      <div className="max-w-lg mx-auto px-6 py-16 text-center">
        <div className="bg-[#181818] rounded-2xl border border-[#282828] p-8" style={{ boxShadow: '0 8px 8px rgba(0,0,0,0.3)' }}>
          <span className="text-4xl block mb-4">👤</span>
          <h1 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "'SpotifyMixUITitle','CircularSp','Helvetica Neue',Helvetica,Arial,sans-serif" }}>
            {lang === 'en' ? 'You are not signed in' : 'አልገቡም'}
          </h1>
          <p className="text-sm text-[#B3B3B3] mb-6">
            {lang === 'en' ? 'Sign in to manage your plan, or start a free trial.' : 'ዕቅድዎን ለማስተዳደር ይግቡ፣ ወይም ነጻ ሙከራ ይጀምሩ።'}
          </p>
          <div className="flex flex-col gap-2.5">
            <button onClick={() => navigate({ id: 'sign-in' })}
              className="w-full py-3 rounded-full text-sm font-semibold text-[#121212] bg-[#1ED760] hover:bg-[#1DB954] transition-colors">
              {lang === 'en' ? 'Sign in' : 'ግባ'}
            </button>
            <button onClick={() => navigate({ id: 'pricing' })}
              className="w-full py-3 rounded-full text-sm font-semibold text-white border border-[#282828] hover:border-[#B3B3B3] transition-colors">
              {lang === 'en' ? 'See plans' : 'ዕቅዶችን እይ'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  const used = exportsUsedToday()
  const quota = exportQuota()
  const isEnterprise = account.tier === 'enterprise'
  const depth = historyDepthDays()

  const doSignOut = () => { signOut(); navigate({ id: 'home' }) }
  const doCancel = () => { cancelSubscription(); setAccount(getAccount()) }

  const Row = ({ l, v }: { l: string; v: string }) => (
    <div className="flex items-center justify-between py-2.5 border-b border-[#181818] last:border-0">
      <span className="text-sm text-[#B3B3B3]">{l}</span>
      <span className="text-sm font-semibold text-white">{v}</span>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto px-6 lg:px-10 py-12">
      <h1 className="font-bold text-white mb-8" style={{ fontFamily: "'SpotifyMixUITitle','CircularSp','Helvetica Neue',Helvetica,Arial,sans-serif", fontSize: 28, letterSpacing: '-0.03em' }}>
        {lang === 'en' ? 'My account' : 'የእኔ መለያ'}
      </h1>

      {/* Plan card */}
      <div className="bg-[#181818] rounded-2xl border border-[#282828] p-6 mb-6" style={{ boxShadow: '0 8px 8px rgba(0,0,0,0.3)' }}>
        <div className="flex items-center gap-2 mb-1">
          <span>{isEnterprise ? '🏛' : '⭐'}</span>
          <h2 className="text-lg font-bold text-white" style={{ fontFamily: "'SpotifyMixUITitle','CircularSp','Helvetica Neue',Helvetica,Arial,sans-serif" }}>{planLabel(account, lang)}</h2>
        </div>
        <p className="text-sm text-[#B3B3B3] mb-3">{statusLabel(account, lang)}</p>
        <p className="text-sm text-white mb-4">{account.email}</p>
        <div className="flex flex-wrap gap-4 text-sm mb-2">
          <button onClick={() => navigate({ id: 'dashboard' })} className="font-semibold text-[#1ED760] hover:underline">
            {lang === 'en' ? 'Open programme dashboard →' : 'Open programme dashboard →'}
          </button>
          {!isEnterprise && account.subscriptionStatus !== 'cancelled' && (
            <button onClick={doCancel} className="text-[#B3B3B3] hover:text-[#F3727F] transition-colors">{lang === 'en' ? 'Cancel plan' : 'Cancel plan'}</button>
          )}
        </div>
      </div>

      {!isEnterprise && account.subscriptionStatus !== 'active' && <BillingCard lang={lang} />}

      {/* Usage */}
      <h3 className="text-sm font-bold text-[#B3B3B3] uppercase tracking-widest mb-4">{lang === 'en' ? 'Usage this month' : 'የዚህ ወር አጠቃቀም'}</h3>
      <div className="bg-[#181818] rounded-2xl border border-[#282828] p-6 mb-6 space-y-5" style={{ boxShadow: '0 8px 8px rgba(0,0,0,0.3)' }}>
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-white">{lang === 'en' ? 'CSV exports' : 'CSV ማውጫዎች'}</span>
            <span className="text-xs text-[#B3B3B3]">{isEnterprise ? (lang === 'en' ? 'Unlimited' : 'ያልተገደበ') : `${used} ${lang === 'en' ? 'of' : 'ከ'} ${PRO_EXPORTS_PER_DAY}/${lang === 'en' ? 'day' : 'ቀን'}`}</span>
          </div>
          {!isEnterprise && (
            <div className="h-2 rounded-full bg-[#181818] overflow-hidden">
              <div className="h-full rounded-full bg-[#1ED760] transition-all" style={{ width: `${Math.min(100, quota > 0 ? (used / quota) * 100 : 0)}%` }} />
            </div>
          )}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-white">{lang === 'en' ? 'History access' : 'የታሪክ መዳረሻ'}</span>
          <span className="text-xs text-[#B3B3B3]">
            {depth === null ? (lang === 'en' ? 'Full history' : 'ሙሉ ታሪክ') : `${depth} ${lang === 'en' ? 'days available' : 'ቀናት ይገኛሉ'}`}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-white">{lang === 'en' ? 'API access' : 'የኤፒአይ መዳረሻ'}</span>
          <span className="text-xs text-[#B3B3B3]">{isEnterprise ? (lang === 'en' ? 'Enabled' : 'ነቅቷል') : (lang === 'en' ? 'Not included in your plan' : 'በዕቅድዎ ውስጥ የለም')}</span>
        </div>
      </div>

      {/* Upgrade CTA (Professional only) */}
      {!isEnterprise && (
        <div className="rounded-2xl p-6 mb-6" style={{ backgroundColor: '#1F1F1F', border: '1px solid #1DB954' }}>
          <p className="text-base font-bold text-white mb-1">{lang === 'en' ? 'Need more?' : 'ተጨማሪ ይፈልጋሉ?'}</p>
          <p className="text-sm text-[#B3B3B3] mb-4">
            {lang === 'en' ? 'Enterprise includes full history, API, basket costing, and more.' : 'ኢንተርፕራይዝ ሙሉ ታሪክ፣ ኤፒአይ፣ የቅርጫት ወጪ እና ሌሎችን ያካትታል።'}
          </p>
          <button onClick={() => navigate({ id: 'enterprise-enquiry' })}
            className="py-2.5 px-5 rounded-full text-sm font-semibold text-[#121212] bg-[#1ED760] hover:bg-[#1DB954] transition-colors">
            {lang === 'en' ? 'Talk to us →' : 'አነጋግረን →'}
          </button>
        </div>
      )}

      {/* Account settings */}
      <h3 className="text-sm font-bold text-[#B3B3B3] uppercase tracking-widest mb-4">{lang === 'en' ? 'Account settings' : 'የመለያ ቅንብሮች'}</h3>
      <div className="bg-[#181818] rounded-2xl border border-[#282828] p-6 mb-6" style={{ boxShadow: '0 8px 8px rgba(0,0,0,0.3)' }}>
        <Row l={lang === 'en' ? 'Name' : 'ስም'} v={account.fullName || '—'} />
        <Row l={lang === 'en' ? 'Email' : 'ኢሜይል'} v={account.email} />
        {account.organisation && <Row l={lang === 'en' ? 'Organisation' : 'ድርጅት'} v={account.organisation} />}
        <Row l={lang === 'en' ? 'Member since' : 'አባል ከ'} v={account.createdAt} />
      </div>

      <button onClick={doSignOut} className="text-sm text-[#B3B3B3] hover:text-[#F3727F] transition-colors">
        {lang === 'en' ? 'Sign out' : 'ውጣ'}
      </button>
    </div>
  )
}
