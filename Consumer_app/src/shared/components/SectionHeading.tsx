import type { Lang } from '@/data'

export default function SectionHeading({ label, am, lang, action, onAction }: {
  label: string
  am?: string
  lang: Lang
  action?: string
  onAction?: () => void
}) {
  return (
    <div className="flex items-end justify-between mb-8">
      <div>
        <h2 className="text-2xl font-bold text-[#1A1814] tracking-tight" style={{ fontFamily: "'Clash Display','Inter',sans-serif", letterSpacing: '-0.03em' }}>
          {lang === 'am' && am ? am : label}
        </h2>
        {am && lang === 'en' && (
          <p className="text-sm text-[#9C9590] mt-0.5" style={{ fontFamily: "'Noto Sans Ethiopic',sans-serif" }}>{am}</p>
        )}
      </div>
      {action && onAction && (
        <button onClick={onAction} className="text-sm font-semibold text-[#1D7A4E] hover:text-[#166040] transition-colors flex items-center gap-1">
          {action}
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      )}
    </div>
  )
}
