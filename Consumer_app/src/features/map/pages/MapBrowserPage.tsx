import { useState, useMemo, useEffect } from 'react'
import { MapContainer, TileLayer, useMap, ZoomControl } from 'react-leaflet'
import type { Lang, NavScreen, Published } from '@/data'
import {
  COMMODITIES,
  MARKETS,
  getP,
  getCommodityHeatPoints,
  heatIntensityColor,
  canAccess,
  PRO_MONTHLY_PRICE,
} from '@/data'
import { fetchHeatmap, type HeatmapSnapshot } from '@/data/live'
import { fromApiMarket } from '@/lib/api'
import { useTheme } from '@/app/theme'
import { LiveDot, ReportPriceCta, Btn, ChangeBadge } from '@/shared/components'
import MarketHeatmapLayer from '@/features/map/components/MarketHeatmapLayer'
import 'leaflet/dist/leaflet.css'

const ADDIS_CENTER: [number, number] = [9.019, 38.755]
const display = { fontFamily: "'SpotifyMixUITitle','CircularSp','Helvetica Neue',Helvetica,Arial,sans-serif" } as const

type StapleFilter = 'basket' | string
type HeatRow = ReturnType<typeof getCommodityHeatPoints>[number] & { changePct: number | null }

function FitBounds() {
  const map = useMap()
  useEffect(() => {
    const bounds = MARKETS.map(m => [m.lat, m.lng] as [number, number])
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 13 })
  }, [map])
  return null
}

function FlyToMarket({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap()
  useEffect(() => {
    map.flyTo([lat, lng], 14, { duration: 0.75 })
  }, [lat, lng, map])
  return null
}

function MedalBadge({ rank }: { rank: number }) {
  if (rank === 0) return <span className="text-sm">🥇</span>
  if (rank === 1) return <span className="text-sm">🥈</span>
  if (rank === 2) return <span className="text-sm">🥉</span>
  return (
    <span className="w-5 h-5 rounded-full theme-surface-2 flex items-center justify-center text-[10px] font-bold theme-text-dim">
      {rank + 1}
    </span>
  )
}

function MapPreview({ theme, heatPoints, interactive }: {
  theme: 'dark' | 'light'
  heatPoints: [number, number, number][]
  interactive?: boolean
}) {
  const tileUrl = theme === 'light'
    ? 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'

  return (
    <MapContainer
      center={ADDIS_CENTER}
      zoom={12}
      className="w-full h-full z-0"
      zoomControl={false}
      attributionControl={false}
      dragging={interactive}
      scrollWheelZoom={interactive}
      doubleClickZoom={interactive}
      touchZoom={interactive}
      boxZoom={interactive}
      keyboard={interactive}
      style={{ background: 'var(--map-bg)' }}
    >
      <TileLayer url={tileUrl} />
      <FitBounds />
      {heatPoints.length > 0 && <MarketHeatmapLayer points={heatPoints} active theme={theme} />}
    </MapContainer>
  )
}

function MapPaywall({ lang, navigate, theme, heatPoints }: {
  lang: Lang
  navigate: (s: NavScreen) => void
  theme: 'dark' | 'light'
  heatPoints: [number, number, number][]
}) {
  const liveMarkets = useMemo(
    () => getCommodityHeatPoints(null).filter(p => p.live > 0).length,
    [],
  )
  const en = lang === 'en'

  return (
    <div className="flex flex-col lg:flex-row" style={{ height: 'calc(100vh - 64px)' }}>
      <div className="flex-1 relative theme-map-bg overflow-hidden">
        <div className="absolute inset-0 scale-[1.02] blur-[6px] opacity-70 pointer-events-none">
          <MapPreview theme={theme} heatPoints={heatPoints} />
        </div>
        <div className="absolute inset-0 bg-[var(--overlay-scrim)]" />

        <div className="absolute inset-0 flex items-center justify-center p-6 z-10">
          <div className="w-full max-w-md theme-modal rounded-2xl p-8 text-center border theme-border shadow-2xl">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider theme-badge-warning mb-4">
              Professional
            </span>
            <span className="text-4xl block mb-4">🗺️</span>
            <h1 className="theme-text text-2xl font-bold mb-2" style={{ ...display, letterSpacing: '-0.03em' }}>
              {en ? 'Price & inflation map' : 'Price & inflation map'}
            </h1>
            <p className="text-sm theme-text-muted leading-relaxed mb-6">
              {en
                ? `Interactive heatmap across ${liveMarkets} live markets — compare basket cost by area, filter by staple, and spot where prices run hot.`
                : `Interactive heatmap · ${liveMarkets} live markets · filter by staple.`}
            </p>
            <Btn variant="primary" size="lg" fullWidth onClick={() => navigate({ id: 'sign-up' })}>
              {en ? 'Start Professional trial →' : 'Start Professional trial →'}
            </Btn>
            <button
              onClick={() => navigate({ id: 'pricing' })}
              className="mt-4 text-sm theme-text-muted hover:theme-accent transition-colors"
            >
              {en ? `From $${PRO_MONTHLY_PRICE}/mo · See plans` : `From $${PRO_MONTHLY_PRICE}/mo`}
            </button>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex w-[320px] border-l theme-border theme-surface flex-col p-6 justify-center">
        <p className="text-[10px] font-bold uppercase tracking-widest theme-accent mb-1">Professional</p>
        <h2 className="text-lg font-bold theme-text mb-4" style={display}>
          {en ? 'What you unlock' : 'What you unlock'}
        </h2>
        <ul className="space-y-3 text-sm theme-text-muted">
          {[
            'Price heatmap by area',
            'Filter heat by staple',
            '7-day inflation heat (when series exist)',
            'Market leaderboard + drill-down',
          ].map(item => (
            <li key={item} className="flex items-start gap-2">
              <span className="theme-accent mt-0.5">✓</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default function MapBrowserPage({ lang, navigate }: {
  lang: Lang
  navigate: (s: NavScreen) => void
}) {
  const mapAccess = canAccess('map')
  const theme = useTheme()
  const heatPoints = useMemo(
    () => getCommodityHeatPoints(null)
      .filter(p => p.intensity > 0)
      .map(p => [p.lat, p.lng, p.intensity] as [number, number, number]),
    [],
  )

  if (!mapAccess.allowed) {
    return <MapPaywall lang={lang} navigate={navigate} theme={theme} heatPoints={heatPoints} />
  }

  return <MapBrowserUnlocked lang={lang} navigate={navigate} theme={theme} />
}

function MapBrowserUnlocked({ lang, navigate, theme }: {
  lang: Lang
  navigate: (s: NavScreen) => void
  theme: 'dark' | 'light'
}) {
  const en = lang === 'en'
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [staple, setStaple] = useState<StapleFilter>('basket')
  const [apiHeat, setApiHeat] = useState<HeatmapSnapshot | null>(null)
  const selected = selectedId ? MARKETS.find(m => m.id === selectedId) : null

  useEffect(() => {
    let cancelled = false
    const commodityId = staple === 'basket' ? null : staple
    fetchHeatmap(commodityId).then(snap => {
      if (!cancelled) setApiHeat(snap)
    })
    return () => { cancelled = true }
  }, [staple])

  const commodityId = staple === 'basket' ? null : staple

  const heatByMarket = useMemo(() => {
    const base = getCommodityHeatPoints(commodityId)
    const apiByMarket = new Map<string, number>()
    let hasInflation = false
    for (const m of apiHeat?.markets ?? []) {
      if (m.heat != null) {
        hasInflation = true
        apiByMarket.set(fromApiMarket(m.market_code), m.heat)
      }
    }

    if (hasInflation) {
      const heats = [...apiByMarket.values()]
      const minH = Math.min(...heats)
      const maxH = Math.max(...heats)
      const span = maxH - minH || 1
      return new Map(
        base.map(p => {
          const pct = apiByMarket.get(p.marketId)
          if (pct == null || p.avg <= 0) {
            return [p.marketId, { ...p, changePct: null as number | null }]
          }
          const intensity = Math.min(1, Math.max(0.12, (pct - minH) / span))
          return [p.marketId, { ...p, intensity, changePct: pct as number | null }]
        }),
      )
    }

    return new Map(base.map(p => [p.marketId, { ...p, changePct: null as number | null }]))
  }, [commodityId, apiHeat])

  const heatPoints = useMemo(
    () => [...heatByMarket.values()]
      .filter(p => p.intensity > 0 && p.avg > 0)
      .map(p => [p.lat, p.lng, p.intensity] as [number, number, number]),
    [heatByMarket],
  )

  const usingInflation = [...heatByMarket.values()].some(p => p.changePct != null)

  const liveMarkets = useMemo(
    () => MARKETS.filter(m => {
      const h = heatByMarket.get(m.id)
      return h && h.live > 0
    }),
    [heatByMarket],
  )

  const filteredMarkets = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = liveMarkets.filter(m =>
      !q || m.en.toLowerCase().includes(q) || m.am.includes(q),
    )
    return [...list].sort(
      (a, b) => (heatByMarket.get(a.id)?.rank ?? 99) - (heatByMarket.get(b.id)?.rank ?? 99),
    )
  }, [query, liveMarkets, heatByMarket])

  const tileUrl = theme === 'light'
    ? 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'

  const filters: { id: StapleFilter; label: string }[] = [
    { id: 'basket', label: en ? 'Basket' : 'Basket' },
    ...COMMODITIES.map(c => ({
      id: c.id,
      label: `${c.emoji} ${lang === 'am' ? c.am : c.en}`,
    })),
  ]

  return (
    <div className="flex flex-col lg:flex-row" style={{ height: 'calc(100vh - 64px)' }}>
      <div className="flex-1 relative theme-map-bg">
        <MapContainer
          center={ADDIS_CENTER}
          zoom={12}
          className="w-full h-full z-0"
          zoomControl={false}
          attributionControl={false}
          style={{ background: 'var(--map-bg)' }}
        >
          <TileLayer url={tileUrl} />
          <FitBounds />
          <ZoomControl position="bottomright" />
          {heatPoints.length > 0 && <MarketHeatmapLayer points={heatPoints} active theme={theme} />}
          {selected && <FlyToMarket lat={selected.lat} lng={selected.lng} />}
        </MapContainer>

        <div className="absolute top-4 left-4 right-4 z-[1000] flex flex-col gap-2 max-w-xl">
          <div className="theme-card rounded-xl px-4 py-2.5 w-fit">
            <div className="flex items-center gap-2">
              <LiveDot size="md" />
              <div>
                <p className="text-[11px] font-bold theme-text uppercase tracking-widest">
                  {en ? 'Addis Ababa' : 'Addis Ababa'}
                </p>
                <p className="text-[10px] theme-text-muted">
                  {liveMarkets.length} {en ? 'markets with prices' : 'markets with prices'}
                  {' · '}
                  {usingInflation
                    ? (en ? '7d inflation heat' : '7d inflation heat')
                    : (en ? 'Price-level heat' : 'Price-level heat')}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {filters.map(f => (
              <button
                key={f.id}
                type="button"
                onClick={() => setStaple(f.id)}
                className={`theme-chip text-[11px] ${staple === f.id ? 'theme-chip-active' : ''}`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="absolute bottom-6 left-6 z-[1000] theme-card rounded-xl px-4 py-3.5 min-w-[200px]">
          <p className="text-[10px] font-bold theme-text-muted uppercase tracking-widest mb-2.5">
            {usingInflation
              ? (en ? '7-day price change' : '7-day price change')
              : (en ? 'Relative price level' : 'Relative price level')}
          </p>
          <div
            className="h-2.5 rounded-full mb-2"
            style={{
              background: 'linear-gradient(to right, #1ED760 0%, #7AE582 28%, #FFA42B 52%, #FF6B35 76%, #F3727F 100%)',
            }}
          />
          <div className="flex justify-between text-[10px] theme-text-dim font-medium">
            <span>{usingInflation ? 'Cooler' : 'Cheaper'}</span>
            <span>{usingInflation ? 'Hotter' : 'Costlier'}</span>
          </div>
          {!usingInflation && (
            <p className="text-[10px] theme-text-dim mt-2 leading-relaxed">
              {en
                ? 'Inflation heat appears when 7-day prior prices exist.'
                : 'Inflation heat appears when 7-day prior prices exist.'}
            </p>
          )}
        </div>
      </div>

      <div className="w-full lg:w-[360px] border-t lg:border-t-0 lg:border-l theme-border theme-surface flex flex-col flex-shrink-0">
        {selected ? (
          <MarketDetail
            market={selected}
            lang={lang}
            navigate={navigate}
            onBack={() => setSelectedId(null)}
            heat={heatByMarket.get(selected.id)}
            staple={staple}
          />
        ) : (
          <MarketList
            lang={lang}
            onSelect={setSelectedId}
            query={query}
            onQueryChange={setQuery}
            filteredMarkets={filteredMarkets}
            heatByMarket={heatByMarket}
            usingInflation={usingInflation}
            staple={staple}
          />
        )}
      </div>
    </div>
  )
}

function MarketList({ lang, onSelect, query, onQueryChange, filteredMarkets, heatByMarket, usingInflation, staple }: {
  lang: Lang
  onSelect: (id: string) => void
  query: string
  onQueryChange: (q: string) => void
  filteredMarkets: typeof MARKETS
  heatByMarket: Map<string, HeatRow>
  usingInflation: boolean
  staple: StapleFilter
}) {
  const en = lang === 'en'
  const stapleLabel = staple === 'basket'
    ? 'Basket'
    : (COMMODITIES.find(c => c.id === staple)?.[lang === 'am' ? 'am' : 'en'] ?? staple)

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b theme-border">
        <p className="text-[10px] font-bold uppercase tracking-widest theme-accent mb-1">
          {en ? 'Explore' : 'Explore'}
        </p>
        <h2 className="text-sm font-bold theme-text mb-1">
          Markets · {stapleLabel}
        </h2>
        <p className="text-[11px] theme-text-muted mb-3 leading-relaxed">
          {usingInflation
            ? 'Ranked by 7-day inflation · only live markets.'
            : 'Ranked by price · only markets with live data.'}
        </p>
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 theme-text-muted" width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.2" />
            <path d="M10 10L12 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          <input
            value={query}
            onChange={e => onQueryChange(e.target.value)}
            placeholder={en ? 'Search markets…' : 'Search markets…'}
            className="theme-input !py-2 !pl-9 !pr-8 !rounded-lg"
          />
          {query && (
            <button onClick={() => onQueryChange('')} className="absolute right-3 top-1/2 -translate-y-1/2 theme-text-muted hover:theme-text text-sm">✕</button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {filteredMarkets.map(m => {
          const heat = heatByMarket.get(m.id)
          const color = heatIntensityColor(heat?.intensity ?? 0.2)
          const rank = heat?.rank

          return (
            <button
              key={m.id}
              onClick={() => onSelect(m.id)}
              className="w-full text-left rounded-xl p-3 theme-card theme-card-interactive flex items-center gap-3 group"
            >
              {rank !== undefined && rank < 99 ? <MedalBadge rank={rank} /> : null}
              <span
                className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold text-[#121212] flex-shrink-0"
                style={{ backgroundColor: color }}
              >
                {heat && heat.avg > 0 ? heat.avg : '—'}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold theme-text truncate group-hover:theme-accent transition-colors">
                  {lang === 'am' ? m.am : m.en}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <p className="text-[10px] theme-text-muted">
                    {heat?.live ?? 0}/{COMMODITIES.length} live
                    {rank !== undefined && rank < 99 && ` · #${rank + 1}`}
                  </p>
                  {heat?.changePct != null && <ChangeBadge pct={heat.changePct} size="sm" />}
                </div>
              </div>
              <div
                className="w-1.5 h-7 rounded-full flex-shrink-0 opacity-70"
                style={{ background: `linear-gradient(to top, transparent, ${color})` }}
              />
            </button>
          )
        })}

        {filteredMarkets.length === 0 && (
          <div className="text-center py-8">
            <p className="text-sm theme-text-muted">
              No markets with live prices for this filter.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function MarketDetail({ market, lang, navigate, onBack, heat, staple }: {
  market: { id: string; en: string; am: string; img: string; lat: number; lng: number }
  lang: Lang
  navigate: (s: NavScreen) => void
  onBack: () => void
  heat?: HeatRow
  staple: StapleFilter
}) {
  const en = lang === 'en'
  const color = heatIntensityColor(heat?.intensity ?? 0.2)
  const live = heat?.live ?? 0
  const avg = heat?.avg ?? 0
  const staples = staple === 'basket'
    ? COMMODITIES
    : COMMODITIES.filter(c => c.id === staple)

  return (
    <div className="flex flex-col h-full">
      <div className="relative h-32 overflow-hidden flex-shrink-0">
        <img src={market.img} alt={market.en} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute inset-0 flex items-end p-4">
          <div className="w-full">
            <button onClick={onBack} className="text-[11px] text-white/70 hover:text-white mb-1.5 flex items-center gap-1 transition-colors">
              &larr; {en ? 'All markets' : 'All markets'}
            </button>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
              <p className="text-white font-bold text-base">{lang === 'am' ? market.am : market.en}</p>
              {heat && heat.rank < 99 && (
                <span className="text-[10px] font-bold text-white/70 ml-auto">
                  #{heat.rank + 1}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 border-b theme-border flex-shrink-0">
        <div className="grid grid-cols-2 gap-2">
          {[
            { value: avg > 0 ? `~${avg}` : '—', label: 'Avg birr', cls: 'theme-stat-value' },
            { value: String(live), label: 'Live prices', cls: 'theme-stat-value-accent' },
          ].map(s => (
            <div key={s.label} className="theme-stat-cell py-2 text-center">
              <p className={`text-base font-bold ${s.cls}`}>{s.value}</p>
              <p className="text-[9px] theme-text-muted uppercase tracking-wider">{s.label}</p>
            </div>
          ))}
        </div>
        {heat?.changePct != null && (
          <div className="mt-2 flex justify-center">
            <ChangeBadge pct={heat.changePct} suffix="7d" />
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="space-y-1.5">
          {staples.map(c => {
            const p = getP(c.id, market.id)
            const published = p.status === 'published' ? p as Published : null
            if (!published) return null

            return (
              <button
                key={c.id}
                onClick={() => {
                  navigate({ id: 'price-detail', commodityId: c.id, marketId: market.id })
                }}
                className="w-full flex items-center gap-3 p-2.5 rounded-lg transition-colors duration-100 border theme-border hover:bg-[var(--surface-2)] group"
              >
                <span className="text-lg flex-shrink-0">{c.emoji}</span>
                <div className="flex-1 text-left min-w-0">
                  <p className="text-sm font-medium theme-text group-hover:theme-accent transition-colors">
                    {lang === 'am' ? c.am : c.en}
                  </p>
                  <p className="text-[10px] theme-text-muted">{lang === 'am' ? c.unitAm : c.unit}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold theme-text" style={display}>
                    {published.price} <span className="text-[10px] font-medium theme-text-muted">birr</span>
                  </p>
                  <p className="text-[10px] theme-text-muted">{published.freshness}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <div className="px-4 py-3 border-t theme-border flex-shrink-0">
        <ReportPriceCta lang={lang} commodityId={COMMODITIES[0].id} marketId={market.id} size="sm" fullWidth />
      </div>
    </div>
  )
}
