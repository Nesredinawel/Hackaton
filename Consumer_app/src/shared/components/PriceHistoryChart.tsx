import type { HistoryPoint } from '@/data'

const display = { fontFamily: "'SpotifyMixUITitle','CircularSp','Helvetica Neue',Helvetica,Arial,sans-serif" } as const

/** Compact responsive SVG line chart for daily price history. */
export default function PriceHistoryChart({ points, unit }: { points: HistoryPoint[]; unit: string }) {
  const W = 640
  const H = 200
  const padX = 12
  const padY = 18

  const prices = points.map((p) => p.price)
  const min = Math.min(...prices)
  const max = Math.max(...prices)
  const range = Math.max(1, max - min)

  const x = (i: number) => padX + (i / Math.max(1, points.length - 1)) * (W - padX * 2)
  const y = (v: number) => padY + (1 - (v - min) / range) * (H - padY * 2)

  const line = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(p.price).toFixed(1)}`).join(' ')
  const area = `${line} L${x(points.length - 1).toFixed(1)},${H - padY} L${x(0).toFixed(1)},${H - padY} Z`

  const first = points[0]
  const last = points[points.length - 1]
  const change = last && first ? last.price - first.price : 0
  const pct = first ? Math.round((change / first.price) * 100) : 0

  return (
    <div>
      <div className="flex items-baseline justify-between mb-3">
        <div>
          <span className="text-2xl font-bold theme-text" style={{ ...display, letterSpacing: '-0.03em' }}>
            {last?.price}
          </span>
          <span className="text-sm theme-text-muted ml-1.5">birr / {unit}</span>
        </div>
        <span className={`text-sm font-semibold ${change >= 0 ? 'text-[var(--warning)]' : 'theme-accent'}`}>
          {change >= 0 ? '▲' : '▼'} {Math.abs(pct)}% · {points.length}d
        </span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 'auto' }} preserveAspectRatio="none">
        <defs>
          <linearGradient id="wagaArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--green)" stopOpacity="0.18" />
            <stop offset="100%" stopColor="var(--green)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#wagaArea)" />
        <path d={line} fill="none" stroke="var(--green)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        {last && (
          <circle
            cx={x(points.length - 1)}
            cy={y(last.price)}
            r="3.5"
            fill="var(--green)"
            stroke="var(--chart-dot-stroke)"
            strokeWidth="1.5"
          />
        )}
      </svg>
      <div className="flex justify-between text-[10px] theme-text-muted mt-1">
        <span>{first?.date}</span>
        <span>{last?.date}</span>
      </div>
    </div>
  )
}
