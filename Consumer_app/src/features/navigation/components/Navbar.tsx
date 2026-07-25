import { useState, useRef, useEffect } from 'react'
import type { Lang, NavScreen } from '@/data'
import { COMMODITIES, getP, getMarketsForArea } from '@/data'
import AreaSelector from '@/shared/components/AreaSelector'

export default function Navbar({ lang, onToggleLang, navigate, currentScreen, selectedAreaId, onSelectArea }: {
  lang: Lang
  onToggleLang: () => void
  navigate: (s: NavScreen) => void
  currentScreen: NavScreen
  selectedAreaId: string
  onSelectArea: (areaId: string) => void
}) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const results = query.trim().length > 1
    ? COMMODITIES.filter(c => c.en.toLowerCase().includes(query.toLowerCase()) || c.am.includes(query))
    : []

  const isActive = (ids: string[]) => ids.includes(currentScreen.id)

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-[#E8E4DC]">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex items-center h-16 gap-6">
          {/* Logo */}
          <button onClick={() => navigate({ id: 'home' })} className="flex items-center gap-2 flex-shrink-0">
            <span className="text-xl">🌿</span>
            <span className="font-bold text-[#1A1814] text-lg" style={{ fontFamily: "'Clash Display','Inter',sans-serif", letterSpacing: '-0.05em' }}>WAGA</span>
          </button>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1 text-sm font-medium text-[#6B6560]">
            {[
              { label: lang === 'en' ? 'Map' : 'ካርታ', ids: ['map'], screen: { id: 'map' } as NavScreen },
              { label: lang === 'en' ? 'Categories' : 'ምድቦች', ids: ['categories', 'category-detail', 'commodity-overview', 'price-detail', 'price-no-data', 'price-confirmed'], screen: { id: 'categories' } as NavScreen },
              { label: lang === 'en' ? 'About' : 'ስለ እኛ', ids: ['about'], screen: { id: 'about' } as NavScreen },
            ].map(item => (
              <button key={item.label} onClick={() => navigate(item.screen)}
                className={`px-3 py-2 rounded-lg transition-colors ${isActive(item.ids) ? 'text-[#1D7A4E] bg-[#E8F5EE]' : 'hover:text-[#1A1814] hover:bg-[#F1EFE9]'}`}>
                {item.label}
              </button>
            ))}
          </div>

          {/* Area selector (desktop) */}
          <div className="hidden md:block">
            <AreaSelector lang={lang} selectedAreaId={selectedAreaId} onSelectArea={onSelectArea}
              onOpenMap={() => navigate({ id: 'map' })} />
          </div>

          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-md relative">
            {!searchOpen ? (
              <button onClick={() => { setSearchOpen(true); setTimeout(() => inputRef.current?.focus(), 50) }}
                className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm text-[#9C9590] border border-[#E8E4DC] bg-[#F8F7F4] hover:border-[#9C9590] transition-colors">
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.4" /><path d="M10.5 10.5L13 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
                {lang === 'en' ? 'Search…' : 'ፈልግ…'}
              </button>
            ) : (
              <div className="relative w-full">
                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9C9590]" width="15" height="15" viewBox="0 0 15 15" fill="none"><circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.4" /><path d="M10.5 10.5L13 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
                <input ref={inputRef} value={query} onChange={e => setQuery(e.target.value)}
                  onBlur={() => setTimeout(() => { setSearchOpen(false); setQuery('') }, 200)}
                  className="w-full pl-9 pr-9 py-2.5 rounded-xl text-sm text-[#1A1814] border-2 border-[#1D7A4E] bg-white"
                  style={{ outline: 'none' }}
                  placeholder={lang === 'en' ? 'Search commodities…' : 'ሸቀጦቹን ይፈልጉ…'} />
                {query && <button onMouseDown={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9C9590]">✕</button>}
                {results.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E8E4DC] rounded-xl shadow-xl overflow-hidden z-50 max-h-72 overflow-y-auto">
                    {results.slice(0, 8).map(c => {
                      const p = getP(c.id, 'merkato')
                      return (
                        <button key={c.id}
                          onMouseDown={() => { navigate({ id: 'commodity-overview', commodityId: c.id }); setSearchOpen(false); setQuery('') }}
                          className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-[#F8F7F4] border-b border-[#F1EFE9] last:border-0">
                          <img src={c.img} alt={c.en} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-[#1A1814]">{c.en}</p>
                            <p className="text-xs text-[#9C9590]" style={{ fontFamily: "'Noto Sans Ethiopic',sans-serif" }}>{c.am}</p>
                          </div>
                          {p.status === 'published'
                            ? <span className="text-sm font-bold text-[#1A1814] flex-shrink-0">{p.price} birr</span>
                            : <span className="text-xs font-semibold text-[#C47D1A] flex-shrink-0">No data</span>}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right */}
          <div className="flex items-center gap-3 ml-auto">
            <button onClick={() => navigate({ id: 'search' })} className="md:hidden w-9 h-9 flex items-center justify-center text-[#6B6560] hover:text-[#1A1814] rounded-lg hover:bg-[#F1EFE9] transition-colors">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.5" /><path d="M12.5 12.5L16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            </button>

            {/* Area selector (mobile) */}
            <div className="md:hidden">
              <AreaSelector lang={lang} selectedAreaId={selectedAreaId} onSelectArea={onSelectArea}
                onOpenMap={() => navigate({ id: 'map' })} />
            </div>

            <div className="hidden md:flex rounded-full border border-[#E8E4DC] overflow-hidden text-xs font-bold">
              <button onClick={() => lang !== 'en' && onToggleLang()}
                className={`px-3 py-1.5 transition-colors ${lang === 'en' ? 'bg-[#1D7A4E] text-white' : 'text-[#9C9590] hover:bg-[#F1EFE9]'}`}>EN</button>
              <button onClick={() => lang !== 'am' && onToggleLang()}
                className={`px-3 py-1.5 transition-colors ${lang === 'am' ? 'bg-[#1D7A4E] text-white' : 'text-[#9C9590] hover:bg-[#F1EFE9]'}`}
                style={{ fontFamily: "'Noto Sans Ethiopic',sans-serif", fontSize: 11 }}>አማ</button>
            </div>

            <a href="https://t.me/WagaIndexBot" target="_blank" rel="noopener noreferrer"
              className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-[#1D7A4E] hover:bg-[#166040] transition-colors">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M12.5 1.5L1 5.5l4 1.5 1.5 4 2-3.5L12.5 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" /></svg>
              {lang === 'en' ? 'Report' : 'ዘግብ'}
            </a>

            <button onClick={() => setMobileMenuOpen(v => !v)} className="md:hidden w-9 h-9 flex items-center justify-center text-[#6B6560] rounded-lg hover:bg-[#F1EFE9] transition-colors">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 5h14M2 9h14M2 13h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#E8E4DC] py-3 space-y-1">
            {[
              { label: lang === 'en' ? 'Home' : 'ዋና ገጽ', screen: { id: 'home' } as NavScreen },
              { label: lang === 'en' ? 'Map' : 'ካርታ', screen: { id: 'map' } as NavScreen },
              { label: lang === 'en' ? 'Categories' : 'ምድቦች', screen: { id: 'categories' } as NavScreen },
              { label: lang === 'en' ? 'About' : 'ስለ እኛ', screen: { id: 'about' } as NavScreen },
            ].map(item => (
              <button key={item.label} onClick={() => { navigate(item.screen); setMobileMenuOpen(false) }}
                className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-[#1A1814] hover:bg-[#F1EFE9] transition-colors">
                {item.label}
              </button>
            ))}
            <div className="pt-2 border-t border-[#E8E4DC]">
              <div className="flex rounded-full border border-[#E8E4DC] overflow-hidden text-xs font-bold mx-3">
                <button onClick={() => lang !== 'en' && onToggleLang()}
                  className={`px-3 py-1.5 transition-colors ${lang === 'en' ? 'bg-[#1D7A4E] text-white' : 'text-[#9C9590]'}`}>EN</button>
                <button onClick={() => lang !== 'am' && onToggleLang()}
                  className={`px-3 py-1.5 transition-colors ${lang === 'am' ? 'bg-[#1D7A4E] text-white' : 'text-[#9C9590]'}`}
                  style={{ fontFamily: "'Noto Sans Ethiopic',sans-serif", fontSize: 11 }}>አማ</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
