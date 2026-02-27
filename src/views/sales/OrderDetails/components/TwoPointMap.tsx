/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { FaMapMarkerAlt } from 'react-icons/fa'
import polyline from '@mapbox/polyline'
import axios from 'axios'
import { BsFullscreenExit } from 'react-icons/bs'
import { MdFullscreen } from 'react-icons/md'

interface props {
    lat: number
    long: number
    storeLat: number
    storeLong: number
    runnerLat?: number
    runnerLong?: number
}

const customIcon = (iconUrl: string) =>
    new L.Icon({
        iconUrl,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.4/images/marker-shadow.png',
    })

const icons = {
    pickup: customIcon('http://maps.google.com/mapfiles/ms/icons/blue-dot.png'),
    drop: customIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png'),
    runner: customIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png'),
}

const riderDivIcon = L.divIcon({
    html: `<img src="/img/logo/riderOnline-logo.png" style="width: 28px; transform-origin: center center;" />`,
    className: '',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
})

const FullScreenMap = ({ mapCenter, storeLat, storeLong, lat, long, style = { height: '70vh', width: '100%' }, decodedPolyline }: any) => {
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

    return (
        <div ref={mapContainerRef} style={{ position: 'relative', ...style }}>
            <button
                onClick={toggleFullScreen}
                style={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
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
                    {storeLat && storeLong && (
                        <Marker position={[storeLat, storeLong]} icon={icons.pickup}>
                            <Popup>Slikk</Popup>
                        </Marker>
                    )}

                    {/* Drop Marker */}
                    {lat && long && (
                        <Marker position={[lat, long]} icon={icons.drop}>
                            <Popup>Drop</Popup>
                        </Marker>
                    )}

                    {/* Runner Marker */}

                    <Polyline positions={decodedPolyline} color="blue" />
                </MapContainer>
            )}
        </div>
    )
}

const TwoPointMap = ({ lat, long, storeLat, storeLong, runnerLat, runnerLong }: props) => {
    const [mapCenter, setMapCenter] = useState<[number, number] | null>(null)

    console.log('map center', storeLat, storeLong, lat, long, mapCenter)

    const [polyLine, setPolyLine] = useState('')
    const [sourceLatLong, setSourceLatLong] = useState<[number, number]>([0, 0])
    const [destinationLatLong, setDestinationLatLong] = useState<[number, number]>([0, 0])

    const isNonEmpty = sourceLatLong[0] > 0 && sourceLatLong[1] > 0

    const decodedPolyline = polyline.decode(polyLine)

    const fetchRouteDetails = async () => {
        const MAP_KEY = import.meta.env.VITE_OLA_API_KEY

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

    useEffect(() => {
        if (isNonEmpty) {
            fetchRouteDetails()
        }
    }, [sourceLatLong, destinationLatLong])

    useEffect(() => {
        if (storeLat) {
            const destination: [number, number] = [lat, long]
            console.log('store lat', storeLat, storeLong)
            setMapCenter([storeLat, storeLong])
            setSourceLatLong([storeLat, storeLong])
            setDestinationLatLong(destination)
        }
    }, [lat, long, storeLat, storeLong])

    if (!mapCenter) {
        return <p className="flex justify-between items-center h-screen">No Location Detected</p>
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
                }}
            >
                <FaMapMarkerAlt size={24} color="black" />
            </button>
        )
    }

    return (
        <div className="relative flex flex-col gap-10">
            <div className="relative w-full z-1" style={{ height: '500px' }}>
                <MapContainer center={mapCenter} zoom={16} style={{ width: '100%', height: '100%', zIndex: 1 }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                    {/* Pickup Marker */}
                    {storeLat && storeLong && (
                        <Marker position={[storeLat, storeLong]} icon={icons.pickup}>
                            <Popup>Slikk</Popup>
                        </Marker>
                    )}
                    {runnerLat && runnerLong && (
                        <Marker position={[runnerLat, runnerLong]} icon={riderDivIcon}>
                            <Popup>Runner</Popup>
                        </Marker>
                    )}
                    {/* Drop Marker */}
                    {lat && long && (
                        <Marker position={[lat, long]} icon={icons.drop}>
                            <Popup>Drop</Popup>
                        </Marker>
                    )}

                    <Polyline positions={decodedPolyline} color="blue" />
                    <CurrentLocationButton />
                    <FullScreenMap
                        mapCenter={mapCenter}
                        storeLat={storeLat}
                        storeLong={storeLong}
                        lat={lat}
                        long={long}
                        decodedPolyline={decodedPolyline}
                    />
                </MapContainer>
            </div>
        </div>
    )
}

export default TwoPointMap
