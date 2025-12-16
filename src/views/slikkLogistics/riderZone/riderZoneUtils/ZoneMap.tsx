/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { MapContainer, Marker, TileLayer, useMap, useMapEvents, Polygon, Polyline, Tooltip } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import * as L from 'leaflet'
import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'
import { Point } from './riderZoneCommon'
import store, { useAppSelector } from '@/store'
import { USER_PROFILE_DATA } from '@/store/types/company.types'

/* ---------------------------------- Icons --------------------------------- */

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

/* ---------------------------------- Types --------------------------------- */

interface Zone {
    id: number
    geojson: {
        type: 'Polygon'
        coordinates: number[][][]
    }
    name: string
    store_id?: number
}

interface RiderAddProps {
    zones: Zone[]
    polygonPoints: Point[]
    setPolygonPoints: React.Dispatch<React.SetStateAction<Point[]>>
}

/* ----------------------------- Helper Functions ---------------------------- */

// Stable random color per zone
const getColorFromId = (id: number) => {
    let hash = 0
    for (const char of id.toString()) {
        hash = char.charCodeAt(0) + ((hash << 5) - hash)
    }
    const hue = hash % 360
    return {
        stroke: `hsl(${hue}, 70%, 45%)`,
        fill: `hsl(${hue}, 70%, 55%)`,
    }
}

// GeoJSON → Leaflet
const geoJsonToLatLngs = (coordinates: number[][][]) => coordinates[0].map(([lng, lat]) => [lat, lng] as [number, number])

/* -------------------------------- Component ------------------------------- */

const ZoneMap = ({ zones, polygonPoints, setPolygonPoints }: RiderAddProps) => {
    const storeList = useAppSelector<USER_PROFILE_DATA['store']>((state) => state.company.store)
    const storeCodes = store.getState().storeSelect.store_ids

    const storeData = useMemo(() => {
        return storeList?.find((item) => item?.id === storeCodes[0])
    }, [storeList, storeCodes])

    const position = useMemo(() => {
        return storeData ? { lat: (storeData as any).latitude, lng: (storeData as any).longitude } : null
    }, [storeData])

    // const [position] = useState<Point | null>(location)
    const [isDrawing, setIsDrawing] = useState(false)
    const [isFullscreen, setIsFullscreen] = useState(true) // Set to true by default

    const mapWrapperRef = useRef<HTMLDivElement | null>(null)

    const defaultCenter: [number, number] = [12.9182266, 77.6202128]

    /* ----------------------------- Map Events ----------------------------- */

    const MapEvents = () => {
        useMapEvents({
            click: (e) => {
                if (!isDrawing) return
                setPolygonPoints((prev) => [...prev, e.latlng])
            },
        })
        return null
    }

    const SetView = ({ center }: { center: [number, number] }) => {
        const map = useMap()
        map.setView(center, map.getZoom())
        return null
    }

    /* --------------------------- Drawing Logic ---------------------------- */

    const handleSetZone = () => {
        setPolygonPoints([])
        setIsDrawing(true)
    }

    const handleCompletePolygon = () => {
        if (polygonPoints.length < 3) return
        const first = polygonPoints[0]
        const last = polygonPoints[polygonPoints.length - 1]

        if (first.lat !== last.lat || first.lng !== last.lng) {
            setPolygonPoints((prev) => [...prev, first])
        }
        setIsDrawing(false)
    }

    const handleClearPolygon = () => {
        setPolygonPoints([])
        setIsDrawing(false)
    }

    /* -------------------------- Fullscreen Logic -------------------------- */

    const toggleFullscreen = () => {
        if (!mapWrapperRef.current) return

        if (!document.fullscreenElement) {
            mapWrapperRef.current.requestFullscreen()
            setIsFullscreen(true)
        } else {
            document.exitFullscreen()
            setIsFullscreen(false)
        }
    }

    useEffect(() => {
        const onExit = () => {
            if (!document.fullscreenElement) {
                setIsFullscreen(false)
            }
        }
        document.addEventListener('fullscreenchange', onExit)
        return () => document.removeEventListener('fullscreenchange', onExit)
    }, [])

    const polygonLatLngs = polygonPoints.map((p) => [p.lat, p.lng] as [number, number])

    /* -------------------------------- Render ------------------------------ */

    return (
        <div className="flex flex-col gap-4">
            {/* ---------------------------- Controls ---------------------------- */}
            <div className="flex gap-3">
                <button type="button" className="px-4 py-2 bg-blue-600 text-white rounded" onClick={handleSetZone}>
                    Set Zone
                </button>

                <button
                    type="button"
                    disabled={!isDrawing || polygonPoints.length < 3}
                    className="px-4 py-2 bg-green-600 text-white rounded disabled:bg-gray-300"
                    onClick={handleCompletePolygon}
                >
                    Complete
                </button>

                <button type="button" className="px-4 py-2 bg-red-600 text-white rounded" onClick={handleClearPolygon}>
                    Clear
                </button>
            </div>

            {/* ------------------------------ Map ------------------------------ */}
            <div ref={mapWrapperRef} className="relative w-full h-screen">
                {/* Fullscreen Button */}
                <button
                    type="button"
                    onClick={toggleFullscreen}
                    className="absolute top-3 right-3 z-[1000] bg-black/70 text-white px-4 py-2 rounded hover:bg-black transition"
                >
                    {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                </button>

                <MapContainer
                    center={position ? [position.lat, position.lng] : defaultCenter}
                    zoom={13}
                    style={{
                        height: '100%',
                        width: '100%',
                    }}
                    className="rounded-lg"
                >
                    <SetView center={position ? [position.lat, position.lng] : defaultCenter} />
                    <MapEvents />

                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                    {/* Existing Zones */}
                    {zones.map((zone) => {
                        if (!zone.geojson?.coordinates?.length) return null
                        const colors = getColorFromId(zone.id)

                        return (
                            <Polygon
                                key={zone.id}
                                positions={geoJsonToLatLngs(zone.geojson.coordinates)}
                                pathOptions={{
                                    color: colors.stroke,
                                    fillColor: colors.fill,
                                    fillOpacity: 0.35,
                                    weight: 2,
                                }}
                            >
                                <Tooltip sticky>Zone: {zone.name}</Tooltip>
                            </Polygon>
                        )
                    })}

                    {/* Drawing Zone */}
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

                            {polygonPoints.map((p, i) => (
                                <Marker key={i} position={[p.lat, p.lng]} icon={PinIcon} />
                            ))}
                        </>
                    )}
                </MapContainer>
            </div>
        </div>
    )
}

export default ZoneMap
