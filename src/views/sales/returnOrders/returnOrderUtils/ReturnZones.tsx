/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { MapContainer, Marker, TileLayer, Polygon, Polyline, Tooltip, useMap, useMapEvents, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import * as L from 'leaflet'
import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'
import { BsArrowsFullscreen } from 'react-icons/bs'
import { Button, Card, Input } from '@/components/ui'
import store, { useAppSelector } from '@/store'
import { USER_PROFILE_DATA } from '@/store/types/company.types'
import { LiveZones } from '@/store/types/riderZone.type'
import { usePolygonDrawing } from '@/commonHooks/usePolygonDrawing'
import { Point } from '@/views/slikkLogistics/riderZone/riderZoneUtils/riderZoneCommon'
import { FaMapMarkerAlt } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

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

const wareHouseIcon = L.icon({
    iconUrl: '/img/logo/slikkWare.png',
    iconSize: [35, 50],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
})

interface RiderAddProps {
    zones: LiveZones[]
    polygonPoints: Point[]
    setPolygonPoints: React.Dispatch<React.SetStateAction<Point[]>>
    locationDetails: any[]
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

const CurrentLocationButton = ({ currLat, currLong }: { currLat: number; currLong: number }) => {
    const map = useMap()

    return (
        <button
            style={{
                position: 'absolute',
                bottom: '3px',
                right: '10px',
                backgroundColor: 'white',
                border: 'none',
                borderRadius: '20%',
                padding: '10px',
                boxShadow: '0 0 5px rgba(0,0,0,0.3)',
                cursor: 'pointer',
                zIndex: 1000,
            }}
            onClick={() => map.setView([currLat, currLong], 13)}
        >
            <FaMapMarkerAlt size={24} color="black" />
        </button>
    )
}

const MarkerComponent = ({ markers, currLat, currLong }: { markers: any[]; currLat: number; currLong: number }) => {
    const navigate = useNavigate()

    return (
        <>
            {markers.map((marker, index) => (
                <Marker key={index} position={[Number(marker.latitude), Number(marker.longitude)]}>
                    <Popup>
                        <div className="cursor-pointer" onClick={() => navigate(`/app/returnOrders/${marker.return_order_id}`)}>
                            <p>
                                <strong>Order ID:</strong> {marker.return_order_id}
                            </p>
                            <p>
                                <strong>Amount:</strong> Rs. {marker.amount}
                            </p>
                            <p>
                                <strong>Status:</strong> {marker.status}
                            </p>
                            <p>
                                <strong>Rider Name:</strong> {marker.rider.name || 'N/A'}
                            </p>
                            <p>
                                <strong>Rider Mobile:</strong> {marker.rider.mobile || 'N/A'}
                            </p>
                        </div>
                    </Popup>
                </Marker>
            ))}

            <Marker position={[currLat, currLong]} icon={wareHouseIcon}>
                <Popup>
                    <div>
                        <p>
                            <strong>SlikkSync Technologies</strong>
                        </p>
                    </div>
                </Popup>
            </Marker>

            <CurrentLocationButton currLat={currLat} currLong={currLong} />
        </>
    )
}

const ReturnZones = ({ zones, polygonPoints, setPolygonPoints, locationDetails }: RiderAddProps) => {
    const storeList = useAppSelector<USER_PROFILE_DATA['store']>((state) => state.company.store)
    const storeCodes = store.getState().storeSelect.store_ids
    const storeData = useMemo(() => storeList?.find((s) => s.id === storeCodes[0]), [storeList, storeCodes])
    const [centerPosition, setCenterPosition] = useState<[number, number] | null>(null)
    const [mapZoom, setMapZoom] = useState(13)
    const [latAndLong, setLatAndLong] = useState('')
    const [manualMarker, setManualMarker] = useState<[number, number] | null>(null)
    const [currLat, setCurrLat] = useState<number>(12.920216)
    const [currLong, setCurrLong] = useState<number>(77.649326)

    const fullScreenRef = useRef<HTMLDivElement | null>(null)

    const { addPoint, removePoint } = usePolygonDrawing(polygonPoints, setPolygonPoints)

    useEffect(() => {
        if (storeData && !centerPosition) {
            setCenterPosition([(storeData as any).latitude, (storeData as any).longitude])
            setCurrLat((storeData as any).latitude)
            setCurrLong((storeData as any).longitude)
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
            <Card>
                <div className="flex gap-2 items-center mt-3 mb-6">
                    <Input
                        placeholder="Enter Lat, Long (e.g. 12.9716, 77.5946)"
                        value={latAndLong}
                        onChange={(e) => setLatAndLong(e.target.value)}
                    />
                    <Button variant="new" type="button" onClick={handleGenerateMarker}>
                        Generate
                    </Button>
                </div>
            </Card>

            <div ref={fullScreenRef} className="relative w-full h-screen">
                <Button
                    size="sm"
                    variant="new"
                    type="button"
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
                    <MarkerComponent currLat={currLat} currLong={currLong} markers={locationDetails} />
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

export default ReturnZones
