/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo, useState, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap, Tooltip } from 'react-leaflet'
import * as L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { FaMapMarkerAlt } from 'react-icons/fa'
import _ from 'lodash'
import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'
import { MdFullscreen } from 'react-icons/md'
import { BsFullscreenExit } from 'react-icons/bs'
import 'leaflet.heat'
import { RiderData } from './RiderDetailsCommon'
import RiderDetailModal from './RiderComponents/RiderDetailModal'

const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
})

L.Marker.prototype.options.icon = DefaultIcon

const officeIcon = L.icon({
    iconUrl: '/img/logo/slikkWare.png',
    iconSize: [30, 45],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
})

interface RiderFullMapProps {
    riderDetails: RiderData[]
    currentStore: Record<string, number | undefined>
    specificRider?: Record<string, number | undefined>
}

interface CenterProps {
    setCenter?: any
    currLat: any
    currLong: any
}

const CurrentLocationButton = ({ currLat, currLong }: CenterProps) => {
    const map = useMap()

    const handleClick = () => {
        map.setView([currLat, currLong], 13)
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
    setShowRiderModal: (x: boolean) => void
    handleDetails: (x: number) => void
    specificRider?: Record<string, number | undefined>
}

const MarkerComponent = ({ markers, currLat, currLong, handleDetails, specificRider }: MarkerComponentProps) => {
    const map = useMap()
    console.log('specific rider', currLat, currLong)
    useEffect(() => {
        map.setView([currLat, currLong])
    }, [currLat, currLong, map])

    return (
        <div>
            {markers.map((marker, index) => {
                const ridersIcon = L.icon({
                    iconUrl: marker?.status === false ? '/img/logo/riderOffline-logo.png' : '/img/logo/riderOnline-logo.png',
                    iconSize: [20, 40],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34],
                })

                return (
                    <Marker
                        key={index}
                        position={[marker.lat, marker.lon]}
                        eventHandlers={{
                            click: () => handleDetails(marker?.riderMobile),
                        }}
                        icon={ridersIcon}
                    >
                        <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent={false}>
                            <div>
                                <strong>{marker.ridersName}</strong>
                                <br />
                                Distance: {marker.distance} km
                            </div>
                        </Tooltip>
                    </Marker>
                )
            })}

            <Marker position={[currLat, currLong]} icon={officeIcon}>
                <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent={false}>
                    <div>
                        <strong>SlikkSync Technologies</strong>
                    </div>
                </Tooltip>
            </Marker>

            <CurrentLocationButton setCenter={() => {}} currLat={currLat} currLong={currLong} />
        </div>
    )
}

const RiderFullMap: React.FC<RiderFullMapProps> = ({ riderDetails, currentStore, specificRider }) => {
    // const [currLat, setCurrLat] = useState(currentStore?.lat ?? 0)
    // const [currLong, setCurrLong] = useState(currentStore?.long ?? 0)
    const R = 6371
    const [location, setLocation] = useState('')
    const [suggestions, setSuggestions] = useState<any>([])
    const [showRiderModal, setShowRiderModal] = useState(false)
    const [mobileData, setMobileData] = useState<number>()

    const latitudes = riderDetails?.map((rider) => parseFloat(rider?.profile?.current_location?.latitude) || 0)
    const longitudes = riderDetails?.map((rider) => parseFloat(rider?.profile?.current_location?.longitude) || 0)
    const namesOfRiders = riderDetails?.map((rider) => rider?.profile?.first_name)
    const mobileOfRiders = riderDetails?.map((rider) => rider?.profile?.mobile)
    const ifStatusTrue = riderDetails?.map((rider) => rider?.profile?.checked_in_status)

    console.log('current Store', currentStore)

    const handleSelectSuggestion = (suggestion: any) => {
        setSuggestions([])
        setLocation(suggestion.name)
    }

    const markers = useMemo(() => {
        const result = latitudes.map((lat, index) => {
            const lon = longitudes[index]
            const ridersName = namesOfRiders[index]
            const riderMobile = mobileOfRiders[index]
            const riderStatus = ifStatusTrue[index]

            const dLat = (lat - (currentStore?.lat ?? 0)) * (Math.PI / 180)
            const dLon = (lon - (currentStore?.long ?? 0)) * (Math.PI / 180)

            const rLat1 = (currentStore?.lat ?? 0) * (Math.PI / 180)
            const rLat2 = lat * (Math.PI / 180)

            const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(rLat1) * Math.cos(rLat2)
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

            const distance = parseFloat((R * c).toFixed(2))

            return { lat, lon, distance, ridersName, riderMobile, riderStatus }
        })

        return result
    }, [latitudes, longitudes, currentStore?.lat, currentStore?.long, R])

    const handleDetails = (mobile: number) => {
        setMobileData(mobile)
        setShowRiderModal(true)
    }

    return (
        <div className="flex flex-col gap-4">
            <div>
                {suggestions.length > 0 && (
                    <ul className="mt-2 border rounded-xl bg-white shadow-md">
                        {suggestions.map((suggestion: any, index: any) => (
                            <li
                                key={index}
                                className="p-2 cursor-pointer hover:bg-gray-200"
                                onClick={() => handleSelectSuggestion(suggestion)}
                            >
                                {suggestion.name}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="flex flex-col gap-10 xl:flex-row z-0">
                <MapContainer
                    center={[currentStore?.lat ?? 0, currentStore?.long ?? 0]}
                    zoom={13}
                    style={{ height: '70vh', width: '100%' }}
                >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                    <MarkerComponent
                        currLat={currentStore?.lat}
                        currLong={currentStore?.long}
                        markers={markers}
                        setShowRiderModal={setShowRiderModal}
                        handleDetails={handleDetails}
                    />
                </MapContainer>
            </div>
            {showRiderModal && (
                <div style={{ position: 'relative', zIndex: 2000 }}>
                    <RiderDetailModal dialogIsOpen={showRiderModal} setIsOpen={setShowRiderModal} mobile={mobileData} />
                </div>
            )}
        </div>
    )
}

export default RiderFullMap
