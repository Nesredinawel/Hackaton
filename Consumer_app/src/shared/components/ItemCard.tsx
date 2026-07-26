import LiveDot from './LiveDot'
import ChangeBadge from './ChangeBadge'

const display = { fontFamily: "'SpotifyMixUITitle','CircularSp','Helvetica Neue',Helvetica,Arial,sans-serif" } as const

export default function ItemCard({
  image,
  emoji,
  title,
  unit,
  avg,
  min,
  max,
  liveCount,
  totalMarkets,
  changePct,
  onClick,
}: {
  image: string
  emoji: string
  title: string
  unit: string
  avg: number
  min: number
  max: number
  liveCount?: number
  totalMarkets?: number
  /** Month-over-month inflation for this staple, when known */
  changePct?: number | null
  onClick: () => void
}) {
  const span = max - min || 1
  const avgPct = Math.min(100, Math.max(0, ((avg - min) / span) * 100))

  return (
    <button
      type="button"
      onClick={onClick}
      className="item-card group flex flex-col h-full text-left"
    >
      <div className="item-card-media">
        <img
          src={image}
          alt=""
          className="item-card-image"
        />
        <div className="item-card-scrim" aria-hidden />
        <span className="item-card-emoji" aria-hidden>{emoji}</span>
        {liveCount !== undefined && totalMarkets !== undefined && (
          <span className="item-card-live">
            <LiveDot size="sm" />
            <span className="tabular-nums">{liveCount}/{totalMarkets}</span>
          </span>
        )}
      </div>

      <div className="item-card-body">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="min-w-0 flex-1">
            <p className="item-card-title">{title}</p>
            <p className="item-card-unit">{unit}</p>
          </div>
          <span className="item-card-arrow" aria-hidden>→</span>
        </div>

        <div className="flex items-end justify-between gap-2">
          <p className="item-card-price" style={display}>
            {avg}
            <span className="item-card-price-unit">birr</span>
          </p>
          <ChangeBadge pct={changePct} size="sm" />
        </div>
        <div className="item-card-range mt-2.5">
          <div className="item-card-range-track">
            <div className="item-card-range-gradient" />
            <span className="item-card-range-marker" style={{ left: `${avgPct}%` }} />
          </div>
          <div className="item-card-range-labels">
            <span className="tabular-nums">{min}</span>
            <span className="tabular-nums">{max}</span>
          </div>
        </div>
      </div>
    </button>
  )
}
