/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import * as L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { FaMapMarkerAlt } from 'react-icons/fa'
import { MdFullscreen } from 'react-icons/md'
import { BsFullscreenExit } from 'react-icons/bs'
import 'leaflet.heat'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '@/store'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'
import icon from 'leaflet/dist/images/marker-icon.png'
import { fetchCompanyStore } from '@/store/slices/companyStoreSlice/companyStore.slice'

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

interface ReturnOrderMapProps {
    locationDetails: any[]
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

// Marker Component
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

const FullScreenMap = ({ currLat, currLong, markers }: { currLat: number; currLong: number; markers: any[] }) => {
    const mapContainerRef = useRef<HTMLDivElement>(null)
    const [isFullScreen, setIsFullScreen] = useState(false)

    const toggleFullScreen = () => {
        if (mapContainerRef.current) {
            if (!document.fullscreenElement) {
                mapContainerRef.current
                    .requestFullscreen()
                    .then(() => setIsFullScreen(true))
                    .catch((err) => console.error('Error enabling fullscreen:', err))
            } else {
                document
                    .exitFullscreen()
                    .then(() => setIsFullScreen(false))
                    .catch((err) => console.error('Error exiting fullscreen:', err))
            }
        }
    }

    return (
        <div ref={mapContainerRef} style={{ position: 'relative', height: '70vh', width: '100%' }}>
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

const ReturnOrderMap: React.FC<ReturnOrderMapProps> = ({ locationDetails }) => {
    const dispatch = useAppDispatch()
    const [currLat, setCurrLat] = useState<number>(12.920216)
    const [currLong, setCurrLong] = useState<number>(77.649326)

    useEffect(() => {
        dispatch(fetchCompanyStore())
    }, [dispatch])

    return (
        <div className="flex flex-col gap-4">
            <MapContainer center={[currLat, currLong]} zoom={13} style={{ height: '70vh', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                <MarkerComponent currLat={currLat} currLong={currLong} markers={locationDetails} />

                <FullScreenMap currLat={currLat} currLong={currLong} markers={locationDetails} />
            </MapContainer>
        </div>
    )
}

export default ReturnOrderMap
