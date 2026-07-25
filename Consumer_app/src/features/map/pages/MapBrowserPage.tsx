import { useState, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import type { Lang, NavScreen, Area } from '@/data'
import { REGIONS, ALL_AREAS, getMarketsForArea } from '@/data'
import { getAreaById } from '@/data'
import 'leaflet/dist/leaflet.css'

function CityIcon({ selected, hovered }: { selected?: boolean; hovered?: boolean }) {
  const size = selected ? 28 : hovered ? 22 : 18
  return (
    <div style={{ width: size, height: size, position: 'relative' }}>
      {selected && (
        <div className="absolute inset-0 rounded-full bg-[#1D7A4E] opacity-20 animate-ping" />
      )}
      <div className={`absolute inset-0 rounded-full border-2 ${selected ? 'border-[#1D7A4E] bg-[#1D7A4E]' : hovered ? 'border-[#1D7A4E] bg-white' : 'border-[#9C9590] bg-white'}`}
        style={{ boxShadow: selected ? '0 0 0 4px rgba(29,122,78,0.2)' : '0 2px 8px rgba(0,0,0,0.15)' }}>
        {selected && <div className="absolute inset-0 flex items-center justify-center"><div className="w-2 h-2 rounded-full bg-white" /></div>}
      </div>
    </div>
  )
}

function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap()
  useMemo(() => {
    map.setView(center, zoom, { animate: true, duration: 0.8 })
  }, [center, zoom, map])
  return null
}

export default function MapBrowserPage({ lang, selectedAreaId, onSelectArea, navigate }: {
  lang: Lang
  selectedAreaId: string
  onSelectArea: (areaId: string) => void
  navigate: (s: NavScreen) => void
}) {
  const [hoveredArea, setHoveredArea] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const selectedArea = getAreaById(selectedAreaId)
  const center: [number, number] = selectedArea ? [selectedArea.lat, selectedArea.lng] : [9.025, 38.747]
  const zoom = selectedArea ? selectedArea.zoom : 6

  const handleSelect = (areaId: string) => {
    onSelectArea(areaId)
  }

  return (
    <div className="relative h-[calc(100vh-64px)] flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-96' : 'w-0'} transition-all duration-300 overflow-hidden bg-white border-r border-[#E8E4DC] flex-shrink-0 z-[1000]`}>
        <div className="w-96 h-full flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-[#E8E4DC]">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold text-[#1A1814]" style={{ fontFamily: "'Clash Display','Inter',sans-serif", letterSpacing: '-0.03em' }}>
                {lang === 'en' ? 'Browse by City' : 'ከከተማ በድጋፍ'}
              </h2>
              <button onClick={() => setSidebarOpen(false)} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#9C9590] hover:bg-[#F1EFE9] transition-colors">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
              </button>
            </div>
            <p className="text-sm text-[#9C9590]">
              {lang === 'en' ? `${ALL_AREAS.length} cities · ${REGIONS.length} regions` : `${ALL_AREAS.length} ከተማዎች · ${REGIONS.length} ክልሎች`}
            </p>
          </div>

          {/* City list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {REGIONS.map(region => (
              <div key={region.id}>
                <p className="text-xs font-bold text-[#9C9590] uppercase tracking-widest mb-2 px-1">
                  {lang === 'am' ? region.am : region.en}
                </p>
                <div className="space-y-1">
                  {region.areas.map(area => {
                    const isActive = area.id === selectedAreaId
                    const isHovered = area.id === hoveredArea
                    const markets = getMarketsForArea(area.id)
                    return (
                      <button
                        key={area.id}
                        onClick={() => handleSelect(area.id)}
                        onMouseEnter={() => setHoveredArea(area.id)}
                        onMouseLeave={() => setHoveredArea(null)}
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all ${isActive
                          ? 'bg-[#1D7A4E] text-white shadow-md'
                          : isHovered
                            ? 'bg-[#E8F5EE] text-[#1A1814]'
                            : 'text-[#1A1814] hover:bg-[#F8F7F4]'
                          }`}>
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${isActive ? 'bg-white/20' : 'bg-[#F1EFE9]'}`}>
                          <span className="text-sm">📍</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-semibold truncate ${isActive ? 'text-white' : ''}`}>
                            {lang === 'am' ? area.am : area.en}
                          </p>
                          <p className={`text-xs ${isActive ? 'text-white/60' : 'text-[#9C9590]'}`}>
                            {markets.length} {lang === 'en' ? 'markets' : 'ገበያዎች'}
                          </p>
                        </div>
                        {isActive && <div className="w-2 h-2 rounded-full bg-white flex-shrink-0" />}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          {selectedArea && (
            <div className="p-4 border-t border-[#E8E4DC] bg-[#F8F7F4]">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-[#1D7A4E]" />
                <span className="text-sm font-semibold text-[#1A1814]">
                  {lang === 'am' ? selectedArea.am : selectedArea.en}
                </span>
              </div>
              <button
                onClick={() => navigate({ id: 'home' })}
                className="w-full px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#1D7A4E] hover:bg-[#166040] transition-colors">
                {lang === 'en' ? `View prices in ${selectedArea.en} →` : `በ${selectedArea.am} ዋጋዎች →`}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar toggle */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="absolute top-4 left-4 z-[1000] px-3 py-2 bg-white rounded-xl shadow-lg border border-[#E8E4DC] flex items-center gap-2 text-sm font-semibold text-[#1A1814] hover:bg-[#F8F7F4] transition-colors">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
          {lang === 'en' ? 'Cities' : 'ከተማዎች'}
        </button>
      )}

      {/* Map */}
      <div className="flex-1 relative">
        <MapContainer
          center={[9.025, 38.747]}
          zoom={6}
          className="h-full w-full"
          zoomControl={false}
          attributionControl={false}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />
          <MapController center={center} zoom={zoom} />

          {ALL_AREAS.map(area => {
            const isSelected = area.id === selectedAreaId
            const isHovered = area.id === hoveredArea
            const icon = L.divIcon({
              className: '',
              html: `<div style="width:${isSelected ? 28 : isHovered ? 22 : 18}px;height:${isSelected ? 28 : isHovered ? 22 : 18}px;position:relative;">
                ${isSelected ? '<div style="position:absolute;inset:0;border-radius:50%;background:#1D7A4E;opacity:0.2;animation:ping 2s cubic-bezier(0,0,0.2,1) infinite;"></div>' : ''}
                <div style="position:absolute;inset:0;border-radius:50%;border:2px solid ${isSelected ? '#1D7A4E' : isHovered ? '#1D7A4E' : '#9C9590'};background:${isSelected ? '#1D7A4E' : 'white'};box-shadow:${isSelected ? '0 0 0 4px rgba(29,122,78,0.2)' : '0 2px 8px rgba(0,0,0,0.15)'};">
                  ${isSelected ? '<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;"><div style="width:8px;height:8px;border-radius:50%;background:white;"></div></div>' : ''}
                </div>
              </div>`,
              iconSize: [isSelected ? 28 : isHovered ? 22 : 18, isSelected ? 28 : isHovered ? 22 : 18],
              iconAnchor: [isSelected ? 14 : isHovered ? 11 : 9, isSelected ? 14 : isHovered ? 11 : 9],
            })

            return (
              <Marker
                key={area.id}
                position={[area.lat, area.lng]}
                icon={icon}
                eventHandlers={{
                  click: () => handleSelect(area.id),
                  mouseover: () => setHoveredArea(area.id),
                  mouseout: () => setHoveredArea(null),
                }}
              >
                <Popup className="custom-popup">
                  <div className="p-1 text-center">
                    <p className="font-semibold text-[#1A1814] text-sm">{lang === 'am' ? area.am : area.en}</p>
                    <p className="text-xs text-[#9C9590]">{getMarketsForArea(area.id).length} {lang === 'en' ? 'markets' : 'ገበያዎች'}</p>
                  </div>
                </Popup>
              </Marker>
            )
          })}
        </MapContainer>

        {/* Map overlay info */}
        <div className="absolute bottom-6 right-6 z-[1000] bg-white rounded-2xl shadow-xl border border-[#E8E4DC] p-4 max-w-xs">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">🗺️</span>
            <p className="text-sm font-bold text-[#1A1814]">{lang === 'en' ? 'Map Browser' : 'ካርታ ተቃኝ'}</p>
          </div>
          <p className="text-xs text-[#9C9590] mb-3">
            {lang === 'en'
              ? 'Click a city on the map or select from the list to view local market prices.'
              : 'የአካባቢ ገበያ ዋጋዎችን ለማየት በካርታ ላይ ወይም ከዝርዝር ከተማ ይምረጡ።'}
          </p>
          <button
            onClick={() => navigate({ id: 'home' })}
            className="w-full px-3 py-2 rounded-xl text-xs font-semibold text-[#1D7A4E] bg-[#E8F5EE] hover:bg-[#C6E8D6] transition-colors">
            {lang === 'en' ? 'Back to prices →' : 'ወደ ዋጋዎቹ ተመለስ →'}
          </button>
        </div>
      </div>
    </div>
  )
}
