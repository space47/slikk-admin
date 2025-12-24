/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { MapContainer, Marker, TileLayer, Polygon, Polyline, Tooltip, useMap, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import * as L from 'leaflet'
import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'
import { BsArrowsFullscreen } from 'react-icons/bs'
import { Button, Card, Input } from '@/components/ui'
import store, { useAppSelector } from '@/store'
import { USER_PROFILE_DATA } from '@/store/types/company.types'
import { LiveZones } from '@/store/types/riderZone.type'
import { Point } from './riderZoneCommon'
import { usePolygonDrawing } from '@/commonHooks/usePolygonDrawing'

const PinIcon = L.divIcon({
    html: `<div style="width:14px;height:14px;background:#dc2626;border:2px solid white;border-radius:50%"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
})

const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
})

L.Marker.prototype.options.icon = DefaultIcon

interface RiderAddProps {
    isAdd?: boolean
    zones: LiveZones[]
    polygonPoints: Point[]
    setPolygonPoints: React.Dispatch<React.SetStateAction<Point[]>>
}

const geoJsonToLatLngs = (coords: any) => coords?.[0]?.map(([lng, lat]: number[]) => [lat, lng] as [number, number])

const ChangeView = ({ center, zoom }: { center: [number, number]; zoom: number }) => {
    const map = useMap()

    useEffect(() => {
        map.setView(center, zoom)
    }, [center, zoom, map])

    return null
}

const MapClickHandler = ({ onAddPoint }: any) => {
    useMapEvents({
        click(e) {
            onAddPoint(e.latlng)
        },
    })
    return null
}

const ZoneMap = ({ zones, polygonPoints, setPolygonPoints, isAdd }: RiderAddProps) => {
    const storeList = useAppSelector<USER_PROFILE_DATA['store']>((state) => state.company.store)
    const storeCodes = store.getState().storeSelect.store_ids
    const storeData = useMemo(() => storeList?.find((s) => s.id === storeCodes[0]), [storeList, storeCodes])
    const [centerPosition, setCenterPosition] = useState<[number, number] | null>(null)
    const [mapZoom, setMapZoom] = useState(13)
    const [latAndLong, setLatAndLong] = useState('')
    const [manualMarker, setManualMarker] = useState<[number, number] | null>(null)

    const fullScreenRef = useRef<HTMLDivElement | null>(null)

    const { isDrawing, startDrawing, completeDrawing, clearDrawing, addPoint, removePoint } = usePolygonDrawing(
        polygonPoints,
        setPolygonPoints,
    )

    useEffect(() => {
        if (storeData && !centerPosition) {
            setCenterPosition([(storeData as any).latitude, (storeData as any).longitude])
        }
    }, [storeData, centerPosition])

    const handleGenerateMarker = () => {
        if (!latAndLong) {
            setManualMarker(null)
            return
        }

        const parts = latAndLong.split(',')
        if (parts.length !== 2) return

        const lat = parseFloat(parts[0].trim())
        const lng = parseFloat(parts[1].trim())

        if (isNaN(lat) || isNaN(lng)) return

        setManualMarker([lat, lng])
        setCenterPosition([lat, lng])
        setMapZoom(15)
    }

    const toggleFullscreen = () => {
        if (!fullScreenRef.current) return

        if (!document.fullscreenElement) {
            fullScreenRef.current.requestFullscreen()
        } else {
            document.exitFullscreen()
        }
    }

    const polygonLatLngs = polygonPoints.map((p) => [p.lat, p.lng] as [number, number])

    return (
        <div className="flex flex-col gap-4">
            {isAdd && (
                <div className="flex gap-3">
                    <Button size="sm" disabled={isDrawing} onClick={startDrawing}>
                        Set Zone
                    </Button>

                    <Button size="sm" variant="accept" disabled={!isDrawing || polygonPoints.length < 3} onClick={completeDrawing}>
                        Complete
                    </Button>

                    <Button size="sm" variant="reject" onClick={clearDrawing}>
                        Clear
                    </Button>
                </div>
            )}
            {!isAdd && (
                <Card>
                    <div className="flex gap-2 items-center mt-3 mb-6">
                        <Input
                            placeholder="Enter Lat, Long (e.g. 12.9716, 77.5946)"
                            value={latAndLong}
                            onChange={(e) => setLatAndLong(e.target.value)}
                        />
                        <Button variant="new" onClick={handleGenerateMarker}>
                            Generate
                        </Button>
                    </div>
                </Card>
            )}
            <div ref={fullScreenRef} className="relative w-full h-screen">
                <Button
                    size="sm"
                    variant="new"
                    className="absolute top-3 right-3 z-[1000]"
                    icon={<BsArrowsFullscreen className="text-xl" />}
                    onClick={toggleFullscreen}
                />

                <MapContainer
                    center={centerPosition || [12.9182266, 77.6202128]}
                    zoom={mapZoom}
                    className="rounded-lg"
                    style={{ height: '100%', width: '100%' }}
                >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <MapClickHandler onAddPoint={addPoint} />
                    {centerPosition && <ChangeView center={centerPosition} zoom={mapZoom} />}
                    {manualMarker && <Marker position={manualMarker} />}
                    {zones.map((zone) => {
                        if (!zone.geojson?.coordinates?.length) return null

                        return (
                            <Polygon
                                key={zone.id}
                                positions={geoJsonToLatLngs(zone.geojson.coordinates)}
                                pathOptions={{
                                    color: 'red',
                                    fillColor: 'green',
                                    fillOpacity: 0.35,
                                    weight: 2,
                                }}
                            >
                                <Tooltip sticky>{zone.name}</Tooltip>
                            </Polygon>
                        )
                    })}
                    {polygonPoints.length > 0 && (
                        <>
                            {polygonPoints.length >= 3 && (
                                <Polygon
                                    positions={polygonLatLngs}
                                    pathOptions={{
                                        color: '#2563eb',
                                        fillColor: '#3b82f6',
                                        fillOpacity: 0.3,
                                        weight: 3,
                                    }}
                                />
                            )}

                            <Polyline
                                positions={polygonLatLngs}
                                pathOptions={{
                                    color: '#dc2626',
                                    dashArray: '5,5',
                                }}
                            />

                            {polygonPoints.map((p, idx) => (
                                <Marker
                                    key={idx}
                                    position={[p.lat, p.lng]}
                                    icon={PinIcon}
                                    eventHandlers={{
                                        click: () => removePoint(idx),
                                    }}
                                />
                            ))}
                        </>
                    )}
                </MapContainer>
            </div>
        </div>
    )
}

export default ZoneMap
