/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo, useRef, useState } from 'react'
import { MapContainer, Marker, TileLayer, useMapEvents, Polygon, Polyline, Tooltip } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import * as L from 'leaflet'
import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'
import { Point } from './riderZoneCommon'
import store, { useAppSelector } from '@/store'
import { USER_PROFILE_DATA } from '@/store/types/company.types'
import { BsArrowsFullscreen } from 'react-icons/bs'
import { Button } from '@/components/ui'
import { LiveZones } from '@/store/types/riderZone.type'

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
    zones: LiveZones[]
    polygonPoints: Point[]
    setPolygonPoints: React.Dispatch<React.SetStateAction<Point[]>>
}

const geoJsonToLatLngs = (coordinates: number[][][]) => coordinates[0].map(([lng, lat]) => [lat, lng] as [number, number])

const ZoneMap = ({ zones, polygonPoints, setPolygonPoints }: RiderAddProps) => {
    const storeList = useAppSelector<USER_PROFILE_DATA['store']>((state) => state.company.store)
    const storeCodes = store.getState().storeSelect.store_ids
    const storeData = useMemo(() => {
        return storeList?.find((item) => item?.id === storeCodes[0])
    }, [storeList, storeCodes])

    const position = useMemo(() => {
        return storeData ? { lat: (storeData as any).latitude, lng: (storeData as any).longitude } : null
    }, [storeData])
    const [isDrawing, setIsDrawing] = useState(false)

    const fullScreenRef = useRef<HTMLDivElement | null>(null)
    const defaultCenter: [number, number] = [12.9182266, 77.6202128]

    const MapEvents = () => {
        useMapEvents({
            click: (e) => {
                if (!isDrawing) return
                setPolygonPoints((prev) => [...prev, e.latlng])
            },
        })
        return null
    }

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
            <div className="flex gap-3">
                <Button type="button" size="sm" variant={isDrawing ? 'gray' : 'blue'} disabled={isDrawing} onClick={handleSetZone}>
                    Set Zone
                </Button>

                <Button
                    type="button"
                    size="sm"
                    disabled={!isDrawing || polygonPoints.length < 3}
                    variant="accept"
                    onClick={handleCompletePolygon}
                >
                    Complete
                </Button>

                <Button type="button" variant="reject" size="sm" onClick={handleClearPolygon}>
                    Clear
                </Button>
            </div>
            <div ref={fullScreenRef} className="relative w-full h-screen">
                <Button
                    type="button"
                    variant="new"
                    size="sm"
                    className="absolute top-3 right-3 z-[1000]"
                    icon={<BsArrowsFullscreen className="text-xl" />}
                    onClick={toggleFullscreen}
                ></Button>

                <MapContainer
                    center={position ? [position.lat, position.lng] : defaultCenter}
                    zoom={13}
                    style={{
                        height: '100%',
                        width: '100%',
                    }}
                    className="rounded-lg"
                >
                    <MapEvents />
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
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
                                <Tooltip sticky>Zone: {zone.name}</Tooltip>
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

                            {polygonPoints?.map((item, idx) => (
                                <Marker
                                    key={idx}
                                    position={[item.lat, item.lng]}
                                    icon={PinIcon}
                                    eventHandlers={{
                                        click: () => {
                                            setPolygonPoints((prev) => prev.filter((_, index) => index !== idx))
                                        },
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
