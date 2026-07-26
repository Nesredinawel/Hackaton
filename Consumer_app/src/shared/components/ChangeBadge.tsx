/** Compact ▲/▼ change chip for inflation and cross-market deltas. */
export default function ChangeBadge({
  pct,
  size = 'md',
  suffix,
}: {
  pct: number | null | undefined
  size?: 'sm' | 'md'
  /** Extra label after the %, e.g. "vs prior" */
  suffix?: string
}) {
  if (pct == null || Number.isNaN(pct)) return null
  const up = pct > 0
  const flat = pct === 0
  const abs = Math.abs(Math.round(pct * 10) / 10)
  const label = flat ? '0%' : `${up ? '+' : '−'}${abs}%`
  const color = flat
    ? 'theme-text-muted'
    : up
      ? 'text-[var(--warning)]'
      : 'theme-accent'
  const pad = size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-1 text-xs'
  return (
    <span
      className={`inline-flex items-center gap-0.5 rounded-full font-bold tabular-nums ${pad} ${color}`}
      style={{ background: 'color-mix(in srgb, currentColor 12%, transparent)' }}
    >
      {!flat && <span aria-hidden>{up ? '▲' : '▼'}</span>}
      {label}
      {suffix ? <span className="font-medium opacity-80 ml-0.5">{suffix}</span> : null}
    </span>
  )
}

/** Percent a market price sits above/below the city average. */
export function vsAvgPct(price: number, avg: number): number | null {
  if (avg <= 0) return null
  return Math.round(((price - avg) / avg) * 1000) / 10
}
