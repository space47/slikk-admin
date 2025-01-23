/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo, useState, useCallback, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import * as L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { FaMapMarkerAlt } from 'react-icons/fa'
import axios from 'axios'
import _, { sum } from 'lodash'
import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'
import { MdFullscreen } from 'react-icons/md'
import { BsFullscreenExit } from 'react-icons/bs'
import 'leaflet.heat'

const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
})

L.Marker.prototype.options.icon = DefaultIcon

const officeIcon = L.icon({
    iconUrl: '/img/logo/location-pin.png',
    iconSize: [35, 40],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
})

interface UserMapValueProps {
    latitudes: number[]
    longitudes: number[]
}

interface CenterProps {
    setCenter?: any
    currLat: any
    currLong: any
}

const CurrentLocationButton = ({ currLat, currLong }: CenterProps) => {
    const map = useMap()

    const handleClick = () => {
        map?.setView([currLat, currLong], 13)
    }

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
            onClick={handleClick}
        >
            <FaMapMarkerAlt size={24} color="black" />
        </button>
    )
}

// Marker
interface MarkerComponentProps {
    markers: any[]
    currLat?: any
    currLong?: any
    distanceAboveThirty?: any
    distanceBetweenFifteenToThirty?: any
    distanceBelowTen?: any
    distanceBelowTentoFifteen?: any
}

const MarkerComponent = ({ markers, currLat, currLong }: MarkerComponentProps) => {
    const map = useMap()

    useEffect(() => {
        map?.setView([currLat, currLong])
    }, [currLat, currLong, map])

    return (
        <div>
            {markers?.map((marker, index) => <Marker key={index} position={[marker.lat, marker.lon]}></Marker>)}

            <Marker position={[currLat, currLong]} icon={officeIcon}></Marker>

            <CurrentLocationButton setCenter={() => {}} currLat={currLat} currLong={currLong} />
        </div>
    )
}

interface FullScreenMapProps {
    currLat: number
    currLong: number
    markers?: any[]
    style?: React.CSSProperties
}

const FullScreenMap = ({ currLat, currLong, markers, style = { height: '70vh', width: '100%' } }: FullScreenMapProps) => {
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
                <MapContainer center={[currLat, currLong]} zoom={13} style={{ height: '100%', width: '100%' }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <MarkerComponent currLat={currLat} currLong={currLong} markers={markers} />
                </MapContainer>
            )}
        </div>
    )
}

const UserMapValue: React.FC<UserMapValueProps> = ({ latitudes, longitudes }) => {
    const [currLat, setCurrLat] = useState(12.9014)
    const [currLong, setCurrLong] = useState(77.65122)
    const R = 6371
    const [location, setLocation] = useState('')
    const [suggestions, setSuggestions] = useState<any>([])

    const MAP_KEY = import.meta.env.VITE_OLA_API_KEY

    const handleSearchLocation = useCallback(
        _.debounce(async (query: string) => {
            if (!query) {
                setSuggestions([])
                return
            }

            console.log('Debounce query', query)
            try {
                const response = await axios.get(`https://api.olamaps.io/places/v1/autocomplete`, {
                    params: {
                        input: query,
                        language: 'English',
                        api_key: MAP_KEY,
                    },
                })

                const data = response.data?.predictions || []
                const names = data?.map((result: any) => ({
                    name: result?.description,
                    lat: result?.geometry?.location.lat,
                    lng: result?.geometry?.location.lng,
                }))

                setSuggestions(names)
            } catch (error) {
                console.error('Error:', error)
            }
        }, 300),
        [],
    )

    const handleChangeLocation = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
        setLocation(value)
        handleSearchLocation(value)
    }

    const handleSelectSuggestion = (suggestion: any) => {
        setCurrLat(suggestion.lat)
        setCurrLong(suggestion.lng)
        setSuggestions([])
        setLocation(suggestion.name)
    }

    const markers = useMemo(() => {
        const result = latitudes?.map((lat, index) => {
            const lon = longitudes[index]
            const dLat = (lat - currLat) * (Math.PI / 180)
            const dLon = (lon - currLong) * (Math.PI / 180)

            const rLat1 = currLat * (Math.PI / 180)
            const rLat2 = lat * (Math.PI / 180)

            const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(rLat1) * Math.cos(rLat2)
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

            const distance = parseFloat((R * c).toFixed(2))

            return { lat, lon, distance }
        })

        return result
    }, [latitudes, longitudes, currLat, currLong, R])

    return (
        <div className="flex flex-col gap-4">
            <div>
                <input className="rounded-xl" placeholder="Enter location" value={location} onChange={handleChangeLocation} />
                {suggestions?.length > 0 && (
                    <ul className="mt-2 border rounded-xl bg-white shadow-md">
                        {suggestions?.map((suggestion: any, index: any) => (
                            <li
                                key={index}
                                className="p-2 cursor-pointer hover:bg-gray-200"
                                onClick={() => handleSelectSuggestion(suggestion)}
                            >
                                {suggestion?.name}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="flex flex-col gap-10 xl:flex-row">
                <MapContainer center={[currLat, currLong]} zoom={13} style={{ height: '70vh', width: '100%' }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <MarkerComponent currLat={currLat} currLong={currLong} markers={markers} />
                    <FullScreenMap currLat={currLat} currLong={currLong} markers={markers} />
                </MapContainer>
            </div>
        </div>
    )
}

export default UserMapValue
