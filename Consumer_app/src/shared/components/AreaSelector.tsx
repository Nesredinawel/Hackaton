import { useState, useRef, useEffect } from 'react'
import type { Lang, Area } from '@/data'
import { REGIONS, ALL_AREAS, getAreaById, getMarketsForArea } from '@/data'

export default function AreaSelector({ lang, selectedAreaId, onSelectArea, onOpenMap }: {
  lang: Lang
  selectedAreaId: string
  onSelectArea: (areaId: string) => void
  onOpenMap: () => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const selectedArea = getAreaById(selectedAreaId)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-semibold border border-[#E8E4DC] hover:border-[#9C9590] bg-white transition-colors">
        <span className="text-sm">📍</span>
        <span className="text-[#1A1814] max-w-[120px] truncate">{selectedArea ? (lang === 'am' ? selectedArea.am : selectedArea.en) : 'All Ethiopia'}</span>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className={`text-[#9C9590] transition-transform ${open ? 'rotate-180' : ''}`}>
          <path d="M2 4l3 3 3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-[#E8E4DC] overflow-hidden z-[9999]">
          {/* Search / Map button */}
          <div className="p-3 border-b border-[#E8E4DC]">
            <button
              onClick={() => { onOpenMap(); setOpen(false) }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-[#1D7A4E] bg-[#E8F5EE] hover:bg-[#C6E8D6] transition-colors">
              <span className="text-base">🗺️</span>
              {lang === 'en' ? 'Open Map Browser' : 'ካርታ ተቃኝ ክፍት'}
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="ml-auto">
                <path d="M5 3l5 4-5 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {/* City list */}
          <div className="max-h-72 overflow-y-auto p-2">
            {REGIONS.map(region => (
              <div key={region.id}>
                <p className="text-[10px] font-bold text-[#9C9590] uppercase tracking-widest px-2 pt-2 pb-1">
                  {lang === 'am' ? region.am : region.en}
                </p>
                {region.areas.map(area => {
                  const isActive = area.id === selectedAreaId
                  const markets = getMarketsForArea(area.id)
                  return (
                    <button
                      key={area.id}
                      onClick={() => { onSelectArea(area.id); setOpen(false) }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${isActive ? 'bg-[#1D7A4E] text-white' : 'text-[#1A1814] hover:bg-[#F8F7F4]'}`}>
                      <span className="text-sm">📍</span>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${isActive ? 'text-white' : ''}`}>{lang === 'am' ? area.am : area.en}</p>
                        <p className={`text-xs ${isActive ? 'text-white/60' : 'text-[#9C9590]'}`}>{markets.length} {lang === 'en' ? 'markets' : 'ገበያዎች'}</p>
                      </div>
                      {isActive && <div className="w-1.5 h-1.5 rounded-full bg-white flex-shrink-0" />}
                    </button>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
