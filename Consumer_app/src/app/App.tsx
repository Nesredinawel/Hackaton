import { useState, useEffect } from 'react'
import type { Lang, NavScreen } from '@/data'
import { applyTheme, resolveTheme, type Theme } from '@/app/theme'
import Navbar from '@/features/navigation/components/Navbar'
import Footer from '@/features/navigation/components/Footer'
import AppRoutes from './routes'

export default function App() {
  const [lang, setLang] = useState<Lang>('en')
  const [screen, setScreen] = useState<NavScreen>({ id: 'home' })
  const [theme, setTheme] = useState<Theme>(() => resolveTheme())

  useEffect(() => {
    const saved = localStorage.getItem('waga_lang') as Lang | null
    if (saved === 'en' || saved === 'am') setLang(saved)
    applyTheme(resolveTheme())
  }, [])

  const navigate = (next: NavScreen) => {
    setScreen(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const toggleLang = () => {
    const next: Lang = lang === 'en' ? 'am' : 'en'
    setLang(next)
    localStorage.setItem('waga_lang', next)
  }

  return (
    <div className="min-h-screen flex flex-col theme-bg" style={{ fontFamily: "'SpotifyMixUI','CircularSp','Helvetica Neue',Helvetica,Arial,sans-serif" }}>
      <Navbar lang={lang} theme={theme} onThemeChange={setTheme} onToggleLang={toggleLang} navigate={navigate} />
      <main className="flex-1">
        <AppRoutes lang={lang} screen={screen} navigate={navigate} />
      </main>
      <Footer lang={lang} navigate={navigate} />
    </div>
  )
}
