import { useEffect, useState } from 'react'
import type { Lang, NavScreen } from '@/data'
import { AUTH_CHANGED_EVENT, getAccount } from '@/data'
import type { Theme } from '@/app/theme'
import { Button } from '@/components/ui/button'
import { ThemeToggle, LangToggle } from '@/shared/components'

const display = { fontFamily: "'SpotifyMixUITitle','CircularSp','Helvetica Neue',Helvetica,Arial,sans-serif" } as const

export default function Navbar({ lang, theme, onThemeChange, onToggleLang, navigate }: {
  lang: Lang
  theme: Theme
  onThemeChange: (t: Theme) => void
  onToggleLang: () => void
  navigate: (s: NavScreen) => void
}) {
  const [, setAuthTick] = useState(0)
  useEffect(() => {
    const bump = () => setAuthTick((n) => n + 1)
    window.addEventListener(AUTH_CHANGED_EVENT, bump)
    return () => window.removeEventListener(AUTH_CHANGED_EVENT, bump)
  }, [])
  const account = getAccount()

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl theme-nav">
      <div className="max-w-6xl mx-auto px-6 lg:px-10">
        <div className="flex items-center h-14 gap-4">
          <button onClick={() => navigate({ id: 'home' })} className="flex items-center gap-2.5 flex-shrink-0">
            <span className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold leading-none">W</span>
            <span className="font-bold theme-text text-[15px] tracking-tight" style={display}>
              Waga
            </span>
          </button>

          <div className="hidden md:flex items-center gap-1 ml-4">
            <Button variant="ghost" size="sm" onClick={() => navigate({ id: 'staples' })}>
              {lang === 'en' ? 'Prices' : 'Prices'}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate({ id: 'dashboard' })}>
              {lang === 'en' ? 'Dashboard' : 'Dashboard'}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate({ id: 'map' })}>
              {lang === 'en' ? 'Map' : 'Map'}
            </Button>
          </div>

          <div className="flex-1" />

          <div className="flex items-center gap-2 sm:gap-3">
            {account ? (
              <Button variant="secondary" size="sm" onClick={() => navigate({ id: 'account' })} className="gap-2 pl-1.5 pr-3.5">
                <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[11px] font-bold shrink-0">
                  {account.fullName?.charAt(0)?.toUpperCase() || 'A'}
                </span>
                <span className="hidden sm:inline max-w-[100px] truncate normal-case font-medium">{account.fullName.split(' ')[0]}</span>
              </Button>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={() => navigate({ id: 'sign-in' })} className="hidden sm:inline-flex">
                  {lang === 'en' ? 'Sign in' : 'ግባ'}
                </Button>
                <Button size="sm" onClick={() => navigate({ id: 'sign-up' })}>
                  {lang === 'en' ? 'Get started' : 'ጀምር'}
                </Button>
              </>
            )}

            <div className="nav-toggle-group" aria-label="Preferences">
              <ThemeToggle theme={theme} onChange={onThemeChange} />
              <LangToggle lang={lang} onToggle={onToggleLang} />
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
