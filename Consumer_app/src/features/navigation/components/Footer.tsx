import type { Lang, NavScreen } from '@/data'
import { CATEGORIES } from '@/data'
import LiveDot from '@/shared/components/LiveDot'

export default function Footer({ lang, navigate }: { lang: Lang; navigate: (s: NavScreen) => void }) {
  return (
    <footer style={{ backgroundColor: '#1A1814' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🌿</span>
              <span className="font-bold text-xl text-white" style={{ fontFamily: "'Clash Display','Inter',sans-serif", letterSpacing: '-0.04em' }}>WAGA INDEX</span>
            </div>
            <p className="text-sm text-white/50 leading-relaxed max-w-sm">
              {lang === 'en'
                ? "Real-time price data from Ethiopia's informal markets. Contributed by people in markets. Verified before publication."
                : 'ከኢትዮጵያ ኢንፎርማል ገበያዎች ቀጥታ ዋጋ ዳታ።'}
            </p>
          </div>
          <div>
            <p className="text-xs font-bold text-white/30 uppercase tracking-widest mb-4">{lang === 'en' ? 'Categories' : 'ምድቦች'}</p>
            <ul className="space-y-2">
              {CATEGORIES.map(cat => (
                <li key={cat.id}>
                  <button onClick={() => navigate({ id: 'category-detail', categoryId: cat.id })}
                    className="text-sm text-white/60 hover:text-white transition-colors">
                     {lang === 'am' ? cat.am : cat.en}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-bold text-white/30 uppercase tracking-widest mb-4">{lang === 'en' ? 'Platform' : 'መድረክ'}</p>
            <ul className="space-y-2">
              <li><button onClick={() => navigate({ id: 'about' })} className="text-sm text-white/60 hover:text-white transition-colors">{lang === 'en' ? 'About' : 'ስለ እኛ'}</button></li>
              <li><button onClick={() => navigate({ id: 'about' })} className="text-sm text-white/60 hover:text-white transition-colors">{lang === 'en' ? 'Methodology' : 'ዘዴ'}</button></li>
              <li><a href="https://t.me/WagaIndexBot" target="_blank" rel="noopener noreferrer" className="text-sm text-white/60 hover:text-white transition-colors">{lang === 'en' ? 'Report a price' : 'ዋጋ ዘግብ'}</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-xs text-white/30">© 2025 Waga Index.</p>
          <div className="flex items-center gap-2">
            <LiveDot />
            <span className="text-xs text-white/30">{lang === 'en' ? 'Live data from Ethiopian markets' : 'ከኢትዮጵያ ቀጥታ ዳታ'}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
