"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { MapContainer, TileLayer, Marker, Rectangle, useMap, useMapEvents } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

type LatLng = { lat: number; lng: number }

type Bounds = [[number, number], [number, number]]

type MapPickerProps = {
  position: LatLng
  onChange: (pos: LatLng) => void
  bounds: Bounds
}

// Custom purple glowing marker
const purpleIcon = L.divIcon({
  className: "",
  iconSize: [28, 28],
  iconAnchor: [14, 14],
  html: `
    <div style="position:relative;width:28px;height:28px;">
      <div style="position:absolute;inset:-8px;border-radius:9999px;background:radial-gradient(circle, oklch(0.62 0.24 295 / 0.6), transparent 70%);animation:pulse-glow 2.5s ease-in-out infinite;"></div>
      <div style="position:absolute;inset:0;border-radius:9999px;background:linear-gradient(135deg, oklch(0.62 0.24 295), oklch(0.55 0.22 305));box-shadow:0 0 16px oklch(0.62 0.24 295 / 0.8), 0 0 0 2px oklch(0.99 0 0 / 0.9) inset;"></div>
      <div style="position:absolute;left:50%;top:50%;width:8px;height:8px;border-radius:9999px;background:oklch(0.99 0 0);transform:translate(-50%, -50%);"></div>
    </div>
  `,
})

function ClickHandler({ onChange, bounds }: { onChange: (pos: LatLng) => void; bounds: Bounds }) {
  const californiaBounds = L.latLngBounds(
    L.latLng(bounds[0][0], bounds[0][1]),
    L.latLng(bounds[1][0], bounds[1][1]),
  )

  useMapEvents({
    click(e) {
      if (californiaBounds.contains(e.latlng)) {
        onChange({
          lat: Number(e.latlng.lat.toFixed(4)),
          lng: Number(e.latlng.lng.toFixed(4)),
        })
      }
    },
  })
  return null
}

function Recenter({ position }: { position: LatLng }) {
  const map = useMap()
  const initial = useRef(true)
  useEffect(() => {
    if (initial.current) {
      initial.current = false
      return
    }
    map.flyTo([position.lat, position.lng], map.getZoom(), { duration: 0.8 })
  }, [position, map])
  return null
}

export default function MapPicker({ position, onChange, bounds }: MapPickerProps) {
  const [mounted, setMounted] = useState(false)
  const center = useMemo<[number, number]>(
    () => [position.lat, position.lng],
    // Only on first render — subsequent updates handled by Recenter
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const californiaBounds = useMemo(
    () =>
      L.latLngBounds(
        L.latLng(bounds[0][0], bounds[0][1]),
        L.latLng(bounds[1][0], bounds[1][1]),
      ),
    [bounds],
  )

    useEffect(() => {
      setMounted(true)
    }, [])

    if (!mounted) {
      return <div className="flex h-full w-full items-center justify-center rounded-xl bg-card/40 text-sm text-muted-foreground">Loading map...</div>
    }

  return (
    <MapContainer
      center={center}
      zoom={6}
      minZoom={5}
      maxZoom={9}
      scrollWheelZoom={false}
      maxBounds={californiaBounds}
      maxBoundsViscosity={1.0}
      className="h-full w-full rounded-xl overflow-hidden"
      attributionControl={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Rectangle
        bounds={bounds}
        pathOptions={{
          color: "#a855f7",
          weight: 2,
          opacity: 0.8,
          fillColor: "#a855f7",
          fillOpacity: 0.08,
        }}
      />
      <Marker position={[position.lat, position.lng]} icon={purpleIcon} />
      <ClickHandler onChange={onChange} bounds={bounds} />
      <Recenter position={position} />
    </MapContainer>
  )
}
