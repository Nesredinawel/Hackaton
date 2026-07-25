import type { PriceData, Lang } from '@/data'

export default function StatusBadge({ p, lang }: { p: PriceData; lang: Lang }) {
  if (p.status === 'published') {
    if (p.stale) return (
      <div className="absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-semibold text-[#C47D1A]"
        style={{ backgroundColor: 'rgba(254,243,226,0.9)' }}>
        ⚠ {lang === 'en' ? 'Stale' : 'ያለፈ'}
      </div>
    )
    return (
      <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold text-white"
        style={{ backgroundColor: 'rgba(29,122,78,0.9)' }}>
        <LiveDot />{p.freshness}
      </div>
    )
  }
  return (
    <div className="absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-semibold text-[#C47D1A]"
      style={{ backgroundColor: 'rgba(254,243,226,0.9)' }}>⚠ No data</div>
  )
}

function LiveDot() {
  return (
    <span className="relative flex items-center justify-center flex-shrink-0 w-2 h-2">
      <span className="ping-sm absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-40" />
      <span className="relative rounded-full bg-green-500 w-2 h-2" />
    </span>
  )
}
