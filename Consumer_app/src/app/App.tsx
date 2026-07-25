import { useState, useEffect } from 'react'
import type { Lang, NavScreen } from '@/data'
import { DEFAULT_AREA } from '@/data'
import Navbar from '@/features/navigation/components/Navbar'
import Footer from '@/features/navigation/components/Footer'
import AppRoutes from './routes'

export default function App() {
  const [lang, setLang] = useState<Lang>('en')
  const [screen, setScreen] = useState<NavScreen>({ id: 'home' })
  const [history] = useState<NavScreen[]>([])
  const [selectedAreaId, setSelectedAreaId] = useState(DEFAULT_AREA.id)

  useEffect(() => {
    const saved = localStorage.getItem('waga_lang') as Lang | null
    if (saved === 'en' || saved === 'am') setLang(saved)
    const savedArea = localStorage.getItem('waga_area')
    if (savedArea) setSelectedAreaId(savedArea)
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

  const selectArea = (areaId: string) => {
    setSelectedAreaId(areaId)
    localStorage.setItem('waga_area', areaId)
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F8F7F4', fontFamily: "'Inter',system-ui,sans-serif" }}>
      <Navbar lang={lang} onToggleLang={toggleLang} navigate={navigate} currentScreen={screen}
        selectedAreaId={selectedAreaId} onSelectArea={selectArea} />
      <main className="flex-1">
        <AppRoutes lang={lang} screen={screen} navigate={navigate}
          selectedAreaId={selectedAreaId} onSelectArea={selectArea} />
      </main>
      <Footer lang={lang} navigate={navigate} />
    </div>
  )
}
