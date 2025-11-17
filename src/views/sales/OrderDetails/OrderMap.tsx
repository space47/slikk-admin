/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from 'react'
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

interface props {
    task_id: string
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
    runner: customIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png'),
}

const FullScreenMap = ({ mapCenter, taskData, style = { height: '70vh', width: '100%' }, decodedPolyline }: any) => {
    const mapContainerRef = useRef<HTMLDivElement>(null)
    const [isFullScreen, setIsFullScreen] = useState(false)

    const toggleFullScreen = () => {
        if (mapContainerRef.current) {
            if (!document.fullscreenElement) {
                mapContainerRef.current
                    .requestFullscreen()
                    .then(() => {
                        setIsFullScreen(true)
                    })
                    .catch((err) => {
                        console.error('Error attempting to enable fullscreen mode:', err)
                    })
            } else {
                document
                    .exitFullscreen()
                    .then(() => {
                        setIsFullScreen(false)
                    })
                    .catch((err) => {
                        console.error('Error attempting to exit fullscreen mode:', err)
                    })
            }
        }
    }

    const ridersIcon = L.icon({
        iconUrl: '/img/logo/riderOnline-logo.png',
        iconSize: [20, 40],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
    })

    return (
        <div ref={mapContainerRef} style={{ position: 'relative', ...style }}>
            <button
                onClick={toggleFullScreen}
                style={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    zIndex: 1000,
                    padding: '8px 12px',
                    backgroundColor: 'white',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    cursor: 'pointer',
                }}
            >
                {isFullScreen ? <BsFullscreenExit className="text-2xl font-bold" /> : <MdFullscreen className="text-2xl font-bold" />}
            </button>
            {isFullScreen && (
                <MapContainer center={mapCenter} zoom={16} style={{ width: '100%', height: '100%' }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                    {/* Pickup Marker */}
                    {taskData?.pickup_details && (
                        <Marker position={[taskData?.pickup_details?.latitude, taskData?.pickup_details?.longitude]} icon={officeIcon}>
                            <Popup>{taskData?.pickup_details?.name}</Popup>
                        </Marker>
                    )}

                    {/* Drop Marker */}
                    {taskData?.drop_details && (
                        <Marker position={[taskData?.drop_details?.latitude, taskData?.drop_details?.longitude]} icon={icons.drop}>
                            <Popup>{taskData?.drop_details?.name}</Popup>
                        </Marker>
                    )}

                    {/* Runner Marker */}
                    {taskData?.runner_latitude && taskData?.runner_longitude && (
                        <Marker position={[taskData?.runner_latitude, taskData?.runner_longitude]} icon={ridersIcon}>
                            <Popup>{taskData?.runner_detail?.name}</Popup>
                        </Marker>
                    )}

                    <Polyline positions={decodedPolyline} color="blue" />
                </MapContainer>
            )}
        </div>
    )
}

const OrderMap = ({ taskData }: props) => {
    const [mapCenter, setMapCenter] = useState<[number, number] | null>(null)
    const [polyLine, setPolyLine] = useState('')
    const [sourceLatLong, setSourceLatLong] = useState<[number, number]>([0, 0])
    const [destinationLatLong, setDestinationLatLong] = useState<[number, number]>([0, 0])
    const MAP_KEY = import.meta.env.VITE_OLA_API_KEY

    const riderMarkerRef = useRef<L.Marker<any> | null>(null)
    const lastPickupRef = useRef<{ lat: number; lng: number } | null>(null)
    const lastDropRef = useRef<{ lat: number; lng: number } | null>(null)

    const rawCheckpoints = Object.entries(taskData?.location_data || {})
        .map(([, coords]) => coords)
        .map(([lat, lng]) => [Number(lat), Number(lng)])

    const filteredCheckpoints = rawCheckpoints.filter((pt, i, arr) => {
        if (i === 0) return true
        const prev = arr[i - 1]
        return !(pt[0] === prev[0] && pt[1] === prev[1])
    })

    const [riderRoutePolyline, setRiderRoutePolyline] = useState('')
    const decodedPolyline = polyline.decode(polyLine)
    const decodedRiderPolyline = polyline.decode(riderRoutePolyline)

    const [currentAngle, setCurrentAngle] = useState(0)

    const fetchRouteDetails = async () => {
        try {
            const response = await axios.post(`https://api.olamaps.io/routing/v1/directions/basic`, null, {
                params: {
                    origin: sourceLatLong.join(','),
                    destination: destinationLatLong.join(','),
                    alternatives: false,
                    steps: true,
                    overview: 'full',
                    language: 'en',
                    api_key: MAP_KEY,
                },
            })

            const data = response.data
            setPolyLine(data.routes[0]?.overview_polyline)
        } catch (error) {
            console.error('Error fetching route details:', error)
            return null
        }
    }

    const fetchRiderRoute = async () => {
        if (!destinationLatLong || !sourceLatLong || filteredCheckpoints.length < 2) return

        const waypoints = filteredCheckpoints
            .slice(-5)
            .map(([lat, lng]) => `${Number(lat)},${Number(lng)}`)
            .join('|')

        try {
            const response = await axios.post(`https://api.olamaps.io/routing/v1/directions/basic`, null, {
                params: {
                    origin: filteredCheckpoints?.[0].join(','),
                    destination: destinationLatLong?.join(','),
                    waypoints,
                    alternatives: false,
                    steps: true,
                    overview: 'full',
                    language: 'en',
                    api_key: MAP_KEY,
                },
            })

            setRiderRoutePolyline(response.data.routes[0].overview_polyline)
        } catch (error) {
            console.error('Error fetching rider route:', error)
        }
    }

    //useEffect for fetching route details when source or destination changes
    useEffect(() => {
        const isValidSourceAndDestination =
            sourceLatLong[0] > 0 && sourceLatLong[1] > 0 && destinationLatLong[0] > 0 && destinationLatLong[1] > 0
        if (isValidSourceAndDestination) {
            fetchRouteDetails()
        }
    }, [sourceLatLong, destinationLatLong])

    //useEffect for setting pickup and drop locations (only when they change)
    useEffect(() => {
        const pickup = taskData?.pickup_details
        const drop = taskData?.drop_details
        if (!pickup || !drop) return

        const origin: [number, number] = [pickup.latitude, pickup.longitude]
        const destination: [number, number] = [drop.latitude, drop.longitude]

        setMapCenter((prev) => {
            if (!prev) return origin
            return prev
        })

        const lastPickup = lastPickupRef.current
        if (!lastPickup || lastPickup.lat !== origin[0] || lastPickup.lng !== origin[1]) {
            setSourceLatLong(origin)
            lastPickupRef.current = { lat: origin[0], lng: origin[1] }
        }

        const lastDrop = lastDropRef.current
        if (!lastDrop || lastDrop.lat !== destination[0] || lastDrop.lng !== destination[1]) {
            setDestinationLatLong(destination)
            lastDropRef.current = { lat: destination[0], lng: destination[1] }
        }
    }, [
        taskData?.pickup_details?.latitude,
        taskData?.pickup_details?.longitude,
        taskData?.drop_details?.latitude,
        taskData?.drop_details?.longitude,
    ])

    useEffect(() => {
        const lat = taskData?.runner_latitude
        const lng = taskData?.runner_longitude
        if (!lat || !lng) return

        // Need at least 2 points to compute direction
        if (filteredCheckpoints.length >= 2) {
            const [prevLat, prevLng] = filteredCheckpoints[filteredCheckpoints.length - 2]
            const [currLat, currLng] = filteredCheckpoints[filteredCheckpoints.length - 1]

            const angle = calculateBearing(prevLat, prevLng, currLat, currLng)
            console.log('Calculated angle:', angle)

            setCurrentAngle(angle)

            const marker = riderMarkerRef.current
            if (marker && marker.setRotationAngle) {
                marker.setRotationAngle(angle)
                marker.setRotationOrigin('center center')
            }
        }
        const isValidSourceAndDestination =
            sourceLatLong[0] > 0 && sourceLatLong[1] > 0 && destinationLatLong[0] > 0 && destinationLatLong[1] > 0
        if (isValidSourceAndDestination) fetchRiderRoute()
    }, [JSON.stringify(taskData?.location_data), taskData?.runner_latitude, taskData?.runner_longitude])

    const riderIcon = L.divIcon({
        html: `<img id="rider-image" src="/img/logo/riderOnline-logo.png" style="width: 28px; transform-origin: center center;" />`,
        className: '',
        iconSize: [30, 30],
        iconAnchor: [15, 15],
    })
    if (!mapCenter) {
        return
    }

    const CurrentLocationButton = () => {
        const map = useMap()
        const handleClick = () => {
            map.setView([12.9014, 77.65122], 13)
        }

        return (
            <button
                onClick={handleClick}
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
            >
                <FaMapMarkerAlt size={24} color="black" />
            </button>
        )
    }

    return (
        <div className="relative flex flex-col gap-10 ">
            <div className="relative w-full" style={{ height: '500px', maxWidth: '900px' }}>
                <MapContainer center={mapCenter} zoom={16} style={{ width: '100%', height: '100%', position: 'relative', zIndex: 0 }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                    {/* Pickup Marker */}
                    {taskData?.pickup_details && (
                        <Marker position={[taskData?.pickup_details?.latitude, taskData?.pickup_details?.longitude]} icon={officeIcon}>
                            <Popup>{taskData?.pickup_details?.name}</Popup>
                        </Marker>
                    )}

                    {/* Drop Marker */}
                    {taskData?.drop_details && (
                        <Marker position={[taskData?.drop_details?.latitude, taskData?.drop_details?.longitude]} icon={icons.drop}>
                            <Popup>{taskData?.drop_details?.name}</Popup>
                        </Marker>
                    )}

                    {/* Runner Marker */}
                    {taskData?.runner_latitude && taskData?.runner_longitude && (
                        <Marker
                            ref={riderMarkerRef}
                            position={[taskData?.runner_latitude, taskData?.runner_longitude]}
                            icon={riderIcon}
                            rotationAngle={currentAngle}
                            rotationOrigin="center center"
                        >
                            <Popup>{taskData?.runner_detail?.name}</Popup>
                        </Marker>
                    )}

                    <Polyline positions={decodedPolyline} color="blue" />
                    {decodedRiderPolyline.length > 0 && <Polyline positions={decodedRiderPolyline} color="red" weight={4} />}
                    <CurrentLocationButton />
                    <FullScreenMap mapCenter={mapCenter} taskData={taskData} decodedPolyline={decodedPolyline} />
                </MapContainer>
            </div>
        </div>
    )
}

export default OrderMap
