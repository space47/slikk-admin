/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
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
                zIndex: 1000,
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

    const [isFullScreen, setIsFullScreen] = useState(false)
    const [polyLine, setPolyLine] = useState('')
    const [riderRoutePolyline, setRiderRoutePolyline] = useState('')
    const [mapCenter, setMapCenter] = useState<[number, number] | null>(null)
    const [sourceLatLong, setSourceLatLong] = useState<[number, number]>([0, 0])
    const [destinationLatLong, setDestinationLatLong] = useState<[number, number]>([0, 0])

    const rawCheckpoints = useMemo(() => {
        if (!taskData?.location_data) return []
        return Object.entries(taskData.location_data).map(([, coords]) => coords.map((v: any) => Number(v)) as [number, number])
    }, [JSON.stringify(taskData?.location_data)])

    const filteredCheckpoints = useMemo(() => {
        if (!rawCheckpoints || rawCheckpoints.length === 0) return []
        return rawCheckpoints.filter((pt, i, arr) => {
            if (i === 0) return true
            const prev = arr[i - 1]
            return !(pt[0] === prev[0] && pt[1] === prev[1])
        })
    }, [rawCheckpoints])

    const lastFiveWaypoints = useMemo(() => filteredCheckpoints.slice(-5), [filteredCheckpoints])
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
        if (filteredCheckpoints.length < 2) return

        const originStr = filteredCheckpoints[0].join(',')
        const destinationStr = destinationLatLong.join(',')
        const waypoints = lastFiveWaypoints.map(([lat, lng]) => `${lat},${lng}`).join('|')
        if (!waypoints) return

        try {
            const response = await axios.post(`https://api.olamaps.io/routing/v1/directions/basic`, null, {
                params: {
                    origin: originStr,
                    destination: destinationStr,
                    waypoints,
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
    }, [MAP_KEY, filteredCheckpoints, lastFiveWaypoints, destination])

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
            const [prevLat, prevLng] = filteredCheckpoints[filteredCheckpoints.length - 2]
            const [currLat, currLng] = filteredCheckpoints[filteredCheckpoints.length - 1]
            const angle = calculateBearing(prevLat, prevLng, currLat, currLng)

            const marker = riderMarkerRef.current
            marker?.setRotationOrigin('center center')
            marker?.setRotationAngle(angle)
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
                    width: '100%',
                    height: isFullScreen ? '100vh' : 500,
                    maxWidth: 900,
                    margin: '0 auto',
                    position: 'relative',
                }}
            >
                <MapContainer center={mapCenter} zoom={16} style={{ width: '100%', height: '100%' }}>
                    <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 1000 }}>
                        <button
                            onClick={toggleFullScreen}
                            style={{
                                padding: '8px 12px',
                                background: 'white',
                                border: '1px solid #ccc',
                                borderRadius: 6,
                                cursor: 'pointer',
                            }}
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
                    {taskData?.runner_latitude && taskData?.runner_longitude && (
                        <Marker ref={riderMarkerRef} position={[taskData.runner_latitude, taskData.runner_longitude]} icon={riderDivIcon}>
                            <Popup>{taskData?.runner_detail?.name}</Popup>
                        </Marker>
                    )}
                    {decodedPolyline.length > 0 && <Polyline positions={decodedPolyline} color="blue" />}
                    {decodedRiderPolyline.length > 0 && <Polyline positions={decodedRiderPolyline} color="#FF000080" weight={4} />}
                    <CurrentLocationButton />
                </MapContainer>
            </div>
        </div>
    )
}

export default OrderMap
