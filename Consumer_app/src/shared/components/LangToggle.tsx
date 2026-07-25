import type { Lang } from '@/data'

export default function LangToggle({ lang, onToggle }: {
  lang: Lang
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      aria-label={lang === 'en' ? 'Switch to Amharic' : 'Switch to English'}
      onClick={onToggle}
      className="nav-toggle nav-toggle-lang"
    >
      <span className="nav-toggle-swap" key={lang} style={lang === 'am' ? { fontFamily: "'Noto Sans Ethiopic', sans-serif" } : undefined}>
        {lang === 'en' ? 'EN' : 'አማ'}
      </span>
    </button>
  )
}
