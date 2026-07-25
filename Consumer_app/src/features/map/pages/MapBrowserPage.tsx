import { useState, useMemo, useEffect } from 'react'
import { MapContainer, TileLayer, useMap, ZoomControl } from 'react-leaflet'
import type { Lang, NavScreen, Published } from '@/data'
import {
  COMMODITIES,
  MARKETS,
  getP,
  getMarketLeaderboard,
  getMarketHeatPoints,
  heatIntensityColor,
  canAccess,
  PRO_MONTHLY_PRICE,
} from '@/data'
import { useTheme } from '@/app/theme'
import { LiveDot, ReportPriceCta, Btn } from '@/shared/components'
import MarketHeatmapLayer from '@/features/map/components/MarketHeatmapLayer'
import 'leaflet/dist/leaflet.css'

const ADDIS_CENTER: [number, number] = [9.019, 38.755]
const display = { fontFamily: "'SpotifyMixUITitle','CircularSp','Helvetica Neue',Helvetica,Arial,sans-serif" } as const

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
              {lang === 'en' ? 'Explore map' : 'ካርታ አስስ'}
            </h1>
            <p className="text-sm theme-text-muted leading-relaxed mb-6">
              {lang === 'en'
                ? 'Interactive heatmap across 30 markets, area leaderboard, and cross-market browsing — included on Professional.'
                : 'በ30 ገበያዎች ሂትማፕ፣ የአካባቢ ሊደርቦርድ እና ተጨማሪ መረጃ — በፕሮፌሽናል ውስጥ።'}
            </p>
            <Btn variant="primary" size="lg" fullWidth onClick={() => navigate({ id: 'sign-up' })}>
              {lang === 'en' ? 'Start Professional trial →' : 'ፕሮፌሽናል ሙከራ ጀምር →'}
            </Btn>
            <button
              onClick={() => navigate({ id: 'pricing' })}
              className="mt-4 text-sm theme-text-muted hover:theme-accent transition-colors"
            >
              {lang === 'en' ? `From $${PRO_MONTHLY_PRICE}/mo · See plans` : `ከ$${PRO_MONTHLY_PRICE}/ወር · ዕቅዶች`}
            </button>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-[360px] border-t lg:border-t-0 lg:border-l theme-border theme-surface flex flex-col flex-shrink-0">
        <div className="p-6 border-b theme-border">
          <p className="text-[10px] font-bold uppercase tracking-widest theme-accent mb-1">Professional</p>
          <h2 className="text-sm font-bold theme-text mb-2">{lang === 'en' ? 'What you unlock' : 'ምን ይከፈትዎታል'}</h2>
          <ul className="space-y-2.5">
            {[
              lang === 'en' ? 'Price heatmap by area' : 'በአካባቢ የዋጋ ሂትማፕ',
              lang === 'en' ? 'Market leaderboard' : 'የገበያ ሊደርቦርድ',
              lang === 'en' ? 'Tap any market for live prices' : 'ቀጥታ ዋጋዎች',
              lang === 'en' ? 'Plus history, export & more' : 'ታሪክ፣ ማውጫ እና ተጨማሪ',
            ].map(item => (
              <li key={item} className="flex items-center gap-2 text-sm theme-text-muted">
                <span className="theme-accent text-xs">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="p-6 mt-auto">
          <Btn variant="secondary" size="md" fullWidth onClick={() => navigate({ id: 'home' })}>
            {lang === 'en' ? 'Back to home' : 'ወደ ቤት'}
          </Btn>
        </div>
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
    () => getMarketHeatPoints().map(p => [p.lat, p.lng, p.intensity] as [number, number, number]),
    [],
  )

  if (!mapAccess.allowed) {
    return <MapPaywall lang={lang} navigate={navigate} theme={theme} heatPoints={heatPoints} />
  }

  return (
    <MapBrowserUnlocked lang={lang} navigate={navigate} theme={theme} heatPoints={heatPoints} />
  )
}

function MapBrowserUnlocked({ lang, navigate, theme, heatPoints }: {
  lang: Lang
  navigate: (s: NavScreen) => void
  theme: 'dark' | 'light'
  heatPoints: [number, number, number][]
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const selected = selectedId ? MARKETS.find(m => m.id === selectedId) : null

  const leaderboard = useMemo(() => getMarketLeaderboard(), [])
  const heatByMarket = useMemo(
    () => new Map(getMarketHeatPoints().map(p => [p.marketId, p])),
    [],
  )
  const rankByMarket = useMemo(
    () => new Map(leaderboard.map(e => [e.market.id, e.rank])),
    [leaderboard],
  )

  const filteredMarkets = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = q
      ? MARKETS.filter(m => m.en.toLowerCase().includes(q) || m.am.includes(q))
      : MARKETS
    return [...list].sort((a, b) => (rankByMarket.get(a.id) ?? 99) - (rankByMarket.get(b.id) ?? 99))
  }, [query, rankByMarket])

  const tileUrl = theme === 'light'
    ? 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'

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

        <div className="absolute top-4 left-4 z-[1000]">
          <div className="theme-card rounded-xl px-4 py-2.5">
            <div className="flex items-center gap-2">
              <LiveDot size="md" />
              <div>
                <p className="text-[11px] font-bold theme-text uppercase tracking-widest">
                  {lang === 'en' ? 'Addis Ababa' : 'አዲስ አበባ'}
                </p>
                <p className="text-[10px] theme-text-muted">
                  {MARKETS.length} {lang === 'en' ? 'markets' : 'ገበያዎች'} · {lang === 'en' ? 'Price heat' : 'የዋጋ ሙቀት'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 left-6 z-[1000] theme-card rounded-xl px-4 py-3.5 min-w-[200px]">
          <p className="text-[10px] font-bold theme-text-muted uppercase tracking-widest mb-2.5">
            {lang === 'en' ? 'Avg basket heat' : 'አverage ሙቀት'}
          </p>
          <div
            className="h-2.5 rounded-full mb-2"
            style={{
              background: 'linear-gradient(to right, #1ED760 0%, #7AE582 28%, #FFA42B 52%, #FF6B35 76%, #F3727F 100%)',
            }}
          />
          <div className="flex justify-between text-[10px] theme-text-dim font-medium">
            <span>{lang === 'en' ? 'Lower' : 'ዝቅ'}</span>
            <span>{lang === 'en' ? 'Higher' : 'ከፍ'}</span>
          </div>
          <p className="text-[10px] theme-text-dim mt-2 leading-relaxed">
            {lang === 'en' ? 'Area leaderboard · tap a market to explore' : 'የአካባቢ ሊደርቦርድ · ገበያ ይንኩ'}
          </p>
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
          />
        ) : (
          <MarketList
            lang={lang}
            onSelect={setSelectedId}
            query={query}
            onQueryChange={setQuery}
            filteredMarkets={filteredMarkets}
            heatByMarket={heatByMarket}
            rankByMarket={rankByMarket}
          />
        )}
      </div>
    </div>
  )
}

function MarketList({ lang, onSelect, query, onQueryChange, filteredMarkets, heatByMarket, rankByMarket }: {
  lang: Lang
  onSelect: (id: string) => void
  query: string
  onQueryChange: (q: string) => void
  filteredMarkets: typeof MARKETS
  heatByMarket: Map<string, ReturnType<typeof getMarketHeatPoints>[number]>
  rankByMarket: Map<string, number>
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b theme-border">
        <p className="text-[10px] font-bold uppercase tracking-widest theme-accent mb-1">
          {lang === 'en' ? 'Explore' : 'አስስ'}
        </p>
        <h2 className="text-sm font-bold theme-text mb-1">
          {lang === 'en' ? 'Markets by price' : 'ገበያዎች በዋጋ'}
        </h2>
        <p className="text-[11px] theme-text-muted mb-3 leading-relaxed">
          {lang === 'en' ? 'Ranked by avg basket · select to view prices.' : 'በአverage ቅርጫት · ዋጋዎችን ለማየት ይምረጡ።'}
        </p>
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 theme-text-muted" width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.2" />
            <path d="M10 10L12 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          <input
            value={query}
            onChange={e => onQueryChange(e.target.value)}
            placeholder={lang === 'en' ? 'Search markets…' : 'ገበያ ፈልግ…'}
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
          const rank = rankByMarket.get(m.id)

          return (
            <button
              key={m.id}
              onClick={() => onSelect(m.id)}
              className="w-full text-left rounded-xl p-3 theme-card theme-card-interactive flex items-center gap-3 group"
            >
              {rank !== undefined ? <MedalBadge rank={rank} /> : null}
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
                <p className="text-[10px] theme-text-muted">
                  {heat?.live ?? 0}/5 {lang === 'en' ? 'live' : 'ቀጥታ'}
                  {rank !== undefined && ` · #${rank + 1}`}
                </p>
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
            <p className="text-sm theme-text-muted">{lang === 'en' ? 'No markets found' : 'ገበያ አልተገኘም'}</p>
          </div>
        )}
      </div>
    </div>
  )
}

function MarketDetail({ market, lang, navigate, onBack, heat }: {
  market: { id: string; en: string; am: string; img: string; lat: number; lng: number }
  lang: Lang
  navigate: (s: NavScreen) => void
  onBack: () => void
  heat?: { intensity: number; avg: number; live: number; rank: number }
}) {
  const color = heatIntensityColor(heat?.intensity ?? 0.2)
  const live = heat?.live ?? 0
  const avg = heat?.avg ?? 0

  return (
    <div className="flex flex-col h-full">
      <div className="relative h-32 overflow-hidden flex-shrink-0">
        <img src={market.img} alt={market.en} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute inset-0 flex items-end p-4">
          <div className="w-full">
            <button onClick={onBack} className="text-[11px] text-white/70 hover:text-white mb-1.5 flex items-center gap-1 transition-colors">
              &larr; {lang === 'en' ? 'All markets' : 'ሁሉም ገበያዎች'}
            </button>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
              <p className="text-white font-bold text-base">{lang === 'am' ? market.am : market.en}</p>
              {heat && (
                <span className="text-[10px] font-bold text-white/70 ml-auto">
                  #{heat.rank + 1} {lang === 'en' ? 'rank' : 'ደረጃ'}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 border-b theme-border flex-shrink-0">
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: avg > 0 ? `~${avg}` : '—', label: lang === 'en' ? 'Avg birr' : 'Avg ብር', cls: 'theme-stat-value' },
            { value: String(live), label: lang === 'en' ? 'Live' : 'ቀጥታ', cls: 'theme-stat-value-accent' },
            { value: String(5 - live), label: lang === 'en' ? 'Gaps' : 'ክፍተቶች', cls: 'theme-stat-value-warning' },
          ].map(s => (
            <div key={s.label} className="theme-stat-cell py-2 text-center">
              <p className={`text-base font-bold ${s.cls}`}>{s.value}</p>
              <p className="text-[9px] theme-text-muted uppercase tracking-wider">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="space-y-1.5">
          {COMMODITIES.map(c => {
            const p = getP(c.id, market.id)
            const published = p.status === 'published' ? p as Published : null

            return (
              <button
                key={c.id}
                onClick={() => {
                  if (published) navigate({ id: 'price-detail', commodityId: c.id, marketId: market.id })
                  else navigate({ id: 'price-no-data', commodityId: c.id, marketId: market.id })
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
                {published ? (
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold theme-text" style={display}>
                      {published.price} <span className="text-[10px] font-medium theme-text-muted">birr</span>
                    </p>
                    <p className="text-[10px] theme-text-muted">{published.freshness}</p>
                  </div>
                ) : (
                  <span className="text-xs font-semibold text-[var(--warning)] flex-shrink-0">
                    ⚠ {lang === 'en' ? 'No data' : 'ዳታ የለም'}
                  </span>
                )}
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
