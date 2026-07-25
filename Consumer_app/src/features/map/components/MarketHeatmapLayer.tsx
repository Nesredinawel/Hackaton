import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet.heat'
import { HEATMAP_GRADIENT } from '@/data'

type HeatTuple = [number, number, number]

export default function MarketHeatmapLayer({
  points,
  active,
  theme,
}: {
  points: HeatTuple[]
  active: boolean
  theme: 'dark' | 'light'
}) {
  const map = useMap()

  useEffect(() => {
    if (!active || points.length === 0) return

    const layer = (L as typeof L & {
      heatLayer: (latlngs: HeatTuple[], options?: object) => L.Layer
    }).heatLayer(points, {
      radius: theme === 'dark' ? 52 : 48,
      blur: theme === 'dark' ? 42 : 38,
      maxZoom: 15,
      minOpacity: theme === 'dark' ? 0.42 : 0.38,
      max: 1,
      gradient: HEATMAP_GRADIENT,
    })

    layer.addTo(map)
    return () => {
      map.removeLayer(layer)
    }
  }, [map, points, active, theme])

  return null
}
