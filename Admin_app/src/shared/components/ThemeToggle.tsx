import { applyTheme, type Theme } from '@/app/theme'

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M21 14.5A8.5 8.5 0 1 1 9.5 3a6.5 6.5 0 1 0 11.5 11.5Z" />
    </svg>
  )
}

export default function ThemeToggle({ theme, onChange }: {
  theme: Theme
  onChange: (next: Theme) => void
}) {
  const isDark = theme === 'dark'

  const flip = () => {
    const next: Theme = isDark ? 'light' : 'dark'
    applyTheme(next)
    onChange(next)
  }

  return (
    <button
      type="button"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={flip}
      className="nav-toggle"
    >
      <span className="nav-toggle-swap" key={theme}>
        {isDark ? <SunIcon /> : <MoonIcon />}
      </span>
    </button>
  )
}
