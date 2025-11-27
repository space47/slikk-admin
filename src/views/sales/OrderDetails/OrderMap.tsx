/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, CircleMarker } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-rotatedmarker'
import { FaMapMarkerAlt } from 'react-icons/fa'
import polyline from '@mapbox/polyline'
import axios from 'axios'
import { BsFullscreenExit } from 'react-icons/bs'
import { MdFullscreen } from 'react-icons/md'
import { calculateBearing } from '@/utils/common'

interface Props {
    task_id?: string
    taskData: any
}

const customIcon = (iconUrl: string) =>
    new L.Icon({
        iconUrl,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.4/images/marker-shadow.png',
    })

const officeIcon = L.icon({
    iconUrl: '/img/logo/slikkWare.png',
    iconSize: [30, 45],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
})

const icons = {
    pickup: customIcon('http://maps.google.com/mapfiles/ms/icons/blue-dot.png'),
    drop: customIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png'),
}

const riderDivIcon = L.divIcon({
    html: `<img src="/img/logo/riderOnline-logo.png" style="width: 28px; transform-origin: center center;" />`,
    className: '',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
})

const CurrentLocationButton = () => {
    const map = useMap()
    return (
        <button
            onClick={() => map.setView([12.9014, 77.65122], 13)}
            style={{
                position: 'absolute',
                bottom: 8,
                right: 10,
                backgroundColor: 'white',
                border: 'none',
                borderRadius: 8,
                padding: 8,
                boxShadow: '0 0 5px rgba(0,0,0,0.3)',
                cursor: 'pointer',
            }}
            aria-label="Center map"
        >
            <FaMapMarkerAlt size={20} />
        </button>
    )
}

const OrderMap: React.FC<Props> = ({ taskData }) => {
    const MAP_KEY = import.meta.env.VITE_OLA_API_KEY
    const containerRef = useRef<HTMLDivElement | null>(null)
    const mapContainerRef = useRef<any>(null)
    const riderMarkerRef = useRef<Leaflet.Marker | null>(null)

    const [showOnlyRiderPath, setShowOnlyRiderPath] = useState(false)
    const [isFullScreen, setIsFullScreen] = useState(false)
    const [polyLine, setPolyLine] = useState('')
    const [riderRoutePolyline, setRiderRoutePolyline] = useState('')
    const [mapCenter, setMapCenter] = useState<[number, number] | null>(null)
    const [sourceLatLong, setSourceLatLong] = useState<[number, number]>([0, 0])
    const [destinationLatLong, setDestinationLatLong] = useState<[number, number]>([0, 0])

    const [selectedPointCheckpoints, setSelectedPointCheckpoints] = useState<any>(null)
    const [currentAngle, setCurrentAngle] = useState(0)

    const rawCheckpoints = useMemo(() => {
        if (!taskData?.location_data) return []
        const arr = Object.entries(taskData.location_data).map(([timestamp, coords]) => ({
            lat: Number(coords?.[0]),
            lng: Number(coords?.[1]),
            timestamp,
            ts: new Date(timestamp).getTime(),
        }))
        //Previous checkpoint details
        return arr.map((pt, i, all) => {
            if (i === 0) return { ...pt, prev: null, timeDiffMs: 0, distanceMeters: 0 }

            const prev = all[i - 1]
            const timeDiffMs = pt.ts - prev.ts
            const distanceDiffMeters: number = L.latLng(pt.lat, pt.lng).distanceTo(L.latLng(prev.lat, prev.lng))
            return { ...pt, prev, timeDiffMs, distanceDiffMeters }
        })
    }, [JSON.stringify(taskData?.location_data)])

    //Deduping consecutive identical points
    const filteredCheckpoints = useMemo(() => {
        if (!rawCheckpoints || rawCheckpoints.length === 0) return []
        return rawCheckpoints.filter((pt, i, arr) => {
            if (i === 0) return true
            const prev = arr[i - 1]
            return !(pt.lat === prev.lat && pt.lng === prev.lng)
        })
    }, [rawCheckpoints])

    const checkpointCounts = useMemo(() => {
        const map = new Map<string, number>()
        rawCheckpoints.forEach((pt) => {
            const key = `${pt.lat},${pt.lng}`
            map.set(key, (map.get(key) || 0) + 1)
        })
        return map
    }, [rawCheckpoints])

    const handleCheckpointClick = useCallback(
        (pt) => {
            const checkpointsHere = rawCheckpoints.filter((c) => c.lat === pt.lat && c.lng === pt.lng)

            if (checkpointsHere.length === 0) return

            checkpointsHere.sort((a, b) => a.ts - b.ts)

            const waitMs = checkpointsHere[checkpointsHere.length - 1].ts - checkpointsHere[0].ts
            const waitMin = Math.ceil(waitMs / 60000)

            setSelectedPointCheckpoints({
                coords: pt,
                list: checkpointsHere,
                waitMinutes: waitMin,
                prev: checkpointsHere[0].prev,
                prevTimeDiff: checkpointsHere[0].timeDiffMs,
                prevDistance: checkpointsHere[0].distanceDiffMeters,
            })
        },
        [rawCheckpoints],
    )

    const decodedPolyline = useMemo(() => polyline.decode(polyLine), [polyLine])
    const decodedRiderPolyline = useMemo(() => polyline.decode(riderRoutePolyline), [riderRoutePolyline])

    const fetchRouteDetails = useCallback(
        async (origin: [number, number], destinationPoint: [number, number]) => {
            if (!MAP_KEY) return
            try {
                const response = await axios.post(`https://api.olamaps.io/routing/v1/directions/basic`, null, {
                    params: {
                        origin: origin.join(','),
                        destination: destinationPoint.join(','),
                        alternatives: false,
                        steps: true,
                        overview: 'full',
                        language: 'en',
                        api_key: MAP_KEY,
                    },
                })
                setPolyLine(response.data.routes[0]?.overview_polyline || '')
            } catch (err) {
                console.error('Error fetching route details:', err)
            }
        },
        [MAP_KEY],
    )

    const fetchRiderRoute = useCallback(async () => {
        if (!MAP_KEY) return
        if (!taskData?.runner_latitude > 0 || !taskData?.runner_longitude > 0) return
        const destinationStr = destinationLatLong.join(',')

        try {
            const response = await axios.post(`https://api.olamaps.io/routing/v1/directions/basic`, null, {
                params: {
                    origin: [taskData?.runner_latitude, taskData?.runner_longitude].join(','),
                    destination: destinationStr,
                    alternatives: false,
                    steps: true,
                    overview: 'full',
                    language: 'en',
                    api_key: MAP_KEY,
                },
            })
            setRiderRoutePolyline(response.data.routes[0]?.overview_polyline || '')
        } catch (err) {
            console.error('Error fetching rider route:', err)
        }
    }, [MAP_KEY, destinationLatLong, taskData?.runner_latitude, taskData?.runner_longitude])

    useEffect(() => {
        const marker = riderMarkerRef.current
        marker?.setRotationOrigin('center center')
        marker?.setRotationAngle(currentAngle)
    }, [currentAngle, showOnlyRiderPath])

    // Initialize map center + source/destination when pickup/drop available
    useEffect(() => {
        const pickup = taskData?.pickup_details
        const drop = taskData?.drop_details
        if (!pickup || !drop) return

        const origin: [number, number] = [pickup.latitude, pickup.longitude]
        const dest: [number, number] = [drop.latitude, drop.longitude]

        setMapCenter((prev) => prev || origin)
        setSourceLatLong((prev) => (prev[0] !== origin[0] || prev[1] !== origin[1] ? origin : prev))
        setDestinationLatLong((prev) => (prev[0] !== dest[0] || prev[1] !== dest[1] ? dest : prev))
    }, [
        taskData?.pickup_details?.latitude,
        taskData?.pickup_details?.longitude,
        taskData?.drop_details?.latitude,
        taskData?.drop_details?.longitude,
    ])

    // fetch the main route when source/destination ready
    useEffect(() => {
        if (sourceLatLong[0] > 0 && destinationLatLong[0] > 0) {
            fetchRouteDetails(sourceLatLong, destinationLatLong)
        }
    }, [sourceLatLong, destinationLatLong, fetchRouteDetails])

    // Update rotation & rider route when location_data or runner coords change
    useEffect(() => {
        const lat = taskData?.runner_latitude
        const lng = taskData?.runner_longitude
        if (!lat || !lng) return

        if (filteredCheckpoints.length >= 2) {
            const prev = filteredCheckpoints[filteredCheckpoints.length - 2]
            const curr = filteredCheckpoints[filteredCheckpoints.length - 1]
            const angle = calculateBearing(prev.lat, prev.lng, curr.lat, curr.lng)

            setCurrentAngle(angle)
        }
        if (sourceLatLong[0] > 0 && destinationLatLong[0] > 0) {
            fetchRiderRoute()
        }
    }, [JSON.stringify(taskData?.location_data), taskData?.runner_latitude, taskData?.runner_longitude, fetchRiderRoute])

    const toggleFullScreen = async () => {
        const el = mapContainerRef.current
        if (!el) return
        try {
            if (!document.fullscreenElement) {
                await el.requestFullscreen()
                setIsFullScreen(true)
            } else {
                await document.exitFullscreen()
                setIsFullScreen(false)
            }
        } catch (err) {
            console.error('Fullscreen error', err)
        }
    }
    if (!mapCenter) return null

    return (
        <div ref={containerRef}>
            <div
                ref={mapContainerRef}
                style={{
                    zIndex: 0,
                    width: '100%',
                    height: isFullScreen ? '100vh' : 500,
                    maxWidth: 900,
                    margin: '0 auto',
                    position: 'relative',
                }}
            >
                <MapContainer center={mapCenter} zoom={16} style={{ width: '100%', height: '100%' }}>
                    <div className="leaflet-control" style={{ position: 'absolute', top: 10, right: 10 }}>
                        <button
                            className="p-2 bg-white border-gray-300 border cursor-pointer rounded-md text-xs"
                            onClick={() => setShowOnlyRiderPath((prev) => !prev)}
                        >
                            {showOnlyRiderPath ? 'Show All' : 'Rider Path Only'}
                        </button>
                        <button
                            className="p-2 ml-1 bg-white border-gray-300 border-solid border cursor-pointer rounded-md"
                            onClick={toggleFullScreen}
                        >
                            {isFullScreen ? <BsFullscreenExit /> : <MdFullscreen />}
                        </button>
                    </div>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    {taskData?.pickup_details && (
                        <Marker position={[taskData.pickup_details.latitude, taskData.pickup_details.longitude]} icon={officeIcon}>
                            <Popup>{taskData.pickup_details.name}</Popup>
                        </Marker>
                    )}
                    {taskData?.drop_details && (
                        <Marker position={[taskData.drop_details.latitude, taskData.drop_details.longitude]} icon={icons.drop}>
                            <Popup>{taskData.drop_details.name}</Popup>
                        </Marker>
                    )}
                    {taskData?.runner_latitude && taskData?.runner_longitude && !showOnlyRiderPath && (
                        <Marker ref={riderMarkerRef} position={[taskData.runner_latitude, taskData.runner_longitude]} icon={riderDivIcon}>
                            <Popup>{taskData?.runner_detail?.name}</Popup>
                        </Marker>
                    )}
                    {filteredCheckpoints.length > 1 && (
                        <Polyline positions={filteredCheckpoints} color="black" weight={3} dashArray="4 4" />
                    )}
                    {decodedRiderPolyline.length > 0 && !showOnlyRiderPath && (
                        <Polyline positions={decodedRiderPolyline} color="#FF0000AA" dashArray="8 8" weight={4} />
                    )}
                    {decodedPolyline.length > 0 && !showOnlyRiderPath && <Polyline positions={decodedPolyline} color="#0000FFCC" />}

                    {rawCheckpoints.map((pt, index) => {
                        const key = `${pt.lat},${pt.lng}`
                        const count = checkpointCounts.get(key) || 1
                        const isHeavy = count > 2 // more than 2 checkpoints at same location

                        return (
                            <CircleMarker
                                key={`raw-${index}`}
                                center={[pt.lat, pt.lng]}
                                radius={isHeavy ? 8 : 6}
                                pathOptions={{
                                    color: 'black',
                                    fillColor: isHeavy ? '#FF0000AA' : '#fff',

                                    fillOpacity: 1,
                                }}
                                eventHandlers={{
                                    click: () => {
                                        handleCheckpointClick(pt)
                                    },
                                }}
                            />
                        )
                    })}
                    {selectedPointCheckpoints?.coords && (
                        <Popup
                            position={[selectedPointCheckpoints.coords.lat, selectedPointCheckpoints.coords.lng]}
                            eventHandlers={{
                                remove: () => {
                                    setSelectedPointCheckpoints(null)
                                },
                            }}
                        >
                            <div>
                                <h4 className="font-bold mb-2">Timestamps</h4>
                                {selectedPointCheckpoints.waitMinutes > 0 && (
                                    <p className="text-sm mb-2">
                                        <b>Min. time elapsed:</b> {selectedPointCheckpoints.waitMinutes} min
                                    </p>
                                )}
                                <ul className="text-sm overflow-y-scroll max-h-[150px]">
                                    {selectedPointCheckpoints.list.map((c, i) => (
                                        <li key={i}>
                                            #{i + 1}: <b>{c.timestamp.toLocaleString()}</b>
                                        </li>
                                    ))}
                                </ul>

                                {selectedPointCheckpoints.prev && (
                                    <div className="mb-3 text-sm">
                                        <br />
                                        <b>Previous checkpoint:</b>
                                        <br />
                                        Time taken: {Math.round(selectedPointCheckpoints.prevTimeDiff / 1000)} sec
                                        <br />
                                        Distance: {selectedPointCheckpoints.prevDistance.toFixed(1)} m
                                        <hr className="my-2" />
                                    </div>
                                )}
                            </div>
                        </Popup>
                    )}
                    <CurrentLocationButton />
                </MapContainer>
                <div
                    style={{
                        marginTop: 10,
                        maxWidth: 400,
                        background: 'white',
                        padding: '8px 12px',
                        borderRadius: 6,
                        fontSize: 12,
                        boxShadow: '0 0 6px rgba(0,0,0,0.3)',
                        lineHeight: '16px',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div className="w-5 h-1 bg-black" /> Actual Rider Path
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                        <div className="w-5 h-1 bg-red-500" />
                        Recommended Rider Path
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                        <div className="w-5 h-1 bg-blue-500" /> Warehouse → Delivery Address Shortest Path
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OrderMap
