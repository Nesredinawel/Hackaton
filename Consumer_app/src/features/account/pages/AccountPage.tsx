import { useState } from 'react'
import type { Lang, NavScreen, UserAccount } from '@/data'
import {
  getAccount, signOut, cancelSubscription, exportsUsedToday, exportQuota, historyDepthDays,
  PRO_EXPORTS_PER_DAY,
} from '@/data'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import BillingCard from '../components/BillingCard'

const display = { fontFamily: "'SpotifyMixUITitle','CircularSp','Helvetica Neue',Helvetica,Arial,sans-serif" } as const
const sectionTitle = 'text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground'

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
      <div className="max-w-lg mx-auto px-6 py-8 lg:py-16">
        <Card className="text-center">
          <CardHeader className="items-center gap-3">
            <span className="text-4xl">👤</span>
            <CardTitle className="text-xl font-bold" style={display}>
              {lang === 'en' ? 'You are not signed in' : 'አልገቡም'}
            </CardTitle>
            <CardDescription>
              {lang === 'en' ? 'Sign in to manage your plan, or start a free trial.' : 'ዕቅድዎን ለማስተዳደር ይግቡ፣ ወይም ነጻ ሙከራ ይጀምሩ።'}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2.5">
            <Button className="w-full" size="lg" onClick={() => navigate({ id: 'sign-in' })}>
              {lang === 'en' ? 'Sign in' : 'ግባ'}
            </Button>
            <Button variant="secondary" className="w-full" size="lg" onClick={() => navigate({ id: 'pricing' })}>
              {lang === 'en' ? 'See plans' : 'ዕቅዶችን እይ'}
            </Button>
          </CardContent>
        </Card>
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
    <div className="flex items-center justify-between py-2.5">
      <span className="text-sm text-muted-foreground">{l}</span>
      <span className="text-sm font-semibold text-foreground">{v}</span>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto px-6 lg:px-10 py-8 lg:py-12">
      <h1 className="font-bold text-foreground mb-8" style={{ ...display, fontSize: 28, letterSpacing: '-0.03em' }}>
        {lang === 'en' ? 'My account' : 'የእኔ መለያ'}
      </h1>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-2">
            <span>{isEnterprise ? '🏛' : '⭐'}</span>
            <CardTitle className="text-lg font-bold" style={display}>{planLabel(account, lang)}</CardTitle>
            <Badge variant="outline" className="ml-auto">{statusLabel(account, lang)}</Badge>
          </div>
          <CardDescription>{account.email}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <Button variant="link" className="h-auto p-0" onClick={() => navigate({ id: 'dashboard' })}>
            {lang === 'en' ? 'Open programme dashboard →' : 'Open programme dashboard →'}
          </Button>
          {!isEnterprise && account.subscriptionStatus !== 'cancelled' && (
            <Button variant="ghost" size="sm" onClick={doCancel} className="text-destructive hover:text-destructive">
              {lang === 'en' ? 'Cancel plan' : 'Cancel plan'}
            </Button>
          )}
        </CardContent>
      </Card>

      {!isEnterprise && account.subscriptionStatus !== 'active' && <BillingCard lang={lang} />}

      <p className={sectionTitle + ' mb-4'}>{lang === 'en' ? 'Usage this month' : 'የዚህ ወር አጠቃቀም'}</p>
      <Card className="mb-6">
        <CardContent className="space-y-5 pt-0">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-foreground">{lang === 'en' ? 'CSV exports' : 'CSV ማውጫዎች'}</span>
              <span className="text-xs text-muted-foreground">{isEnterprise ? (lang === 'en' ? 'Unlimited' : 'ያልተገደበ') : `${used} ${lang === 'en' ? 'of' : 'ከ'} ${PRO_EXPORTS_PER_DAY}/${lang === 'en' ? 'day' : 'ቀን'}`}</span>
            </div>
            {!isEnterprise && (
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${Math.min(100, quota > 0 ? (used / quota) * 100 : 0)}%` }} />
              </div>
            )}
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-foreground">{lang === 'en' ? 'History access' : 'የታሪክ መዳረሻ'}</span>
            <span className="text-xs text-muted-foreground">
              {depth === null ? (lang === 'en' ? 'Full history' : 'ሙሉ ታሪክ') : `${depth} ${lang === 'en' ? 'days available' : 'ቀናት ይገኛሉ'}`}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-foreground">{lang === 'en' ? 'API access' : 'የኤፒአይ መዳረሻ'}</span>
            <span className="text-xs text-muted-foreground">{isEnterprise ? (lang === 'en' ? 'Enabled' : 'ነቅቷል') : (lang === 'en' ? 'Not included in your plan' : 'በዕቅድዎ ውስጥ የለም')}</span>
          </div>
        </CardContent>
      </Card>

      {!isEnterprise && (
        <Card className="mb-6 theme-highlight border-primary">
          <CardHeader>
            <CardTitle className="text-base">{lang === 'en' ? 'Need more?' : 'ተጨማሪ ይፈልጋሉ?'}</CardTitle>
            <CardDescription>
              {lang === 'en' ? 'Enterprise includes full history, API, basket costing, and more.' : 'ኢንተርፕራይዝ ሙሉ ታሪክ፣ ኤፒአይ፣ የቅርጫት ወጪ እና ሌሎችን ያካትታል።'}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Button onClick={() => navigate({ id: 'enterprise-enquiry' })}>
              {lang === 'en' ? 'Talk to us →' : 'አነጋግረን →'}
            </Button>
          </CardContent>
        </Card>
      )}

      <p className={sectionTitle + ' mb-4'}>{lang === 'en' ? 'Account settings' : 'የመለያ ቅንብሮች'}</p>
      <Card className="mb-6">
        <CardContent className="divide-y pt-0">
          <Row l={lang === 'en' ? 'Name' : 'ስም'} v={account.fullName || '—'} />
          <Row l={lang === 'en' ? 'Email' : 'ኢሜይል'} v={account.email} />
          {account.organisation && <Row l={lang === 'en' ? 'Organisation' : 'ድርጅት'} v={account.organisation} />}
          <Row l={lang === 'en' ? 'Member since' : 'አባል ከ'} v={account.createdAt} />
        </CardContent>
      </Card>

      <Button variant="ghost" onClick={doSignOut} className="text-muted-foreground hover:text-destructive">
        {lang === 'en' ? 'Sign out' : 'ውጣ'}
      </Button>
    </div>
  )
}
