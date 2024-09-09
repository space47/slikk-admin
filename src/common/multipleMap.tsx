import React, { useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { FaMapMarkerAlt } from 'react-icons/fa' // You can use any icon library you prefer

// Fix for default icon issues with leaflet
import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'

let DefaultIcon = L.icon({
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

interface MultipleMapProps {
    latitudes: number[]
    longitudes: number[]
    amount: any[]
}

const CurrentLocationButton = ({
    setCenter,
}: {
    setCenter: React.Dispatch<React.SetStateAction<[number, number]>>
}) => {
    const map = useMap()

    const handleClick = () => {
        map.setView([12.9014, 77.65122], 13) // Adjust the zoom level as needed
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

const MultipleMap: React.FC<MultipleMapProps> = ({
    latitudes,
    longitudes,
    amount,
}) => {
    const currLat = 12.9014
    const currLong = 77.65122
    const R = 6371

    const markers = latitudes.map((lat, index) => {
        const lon = longitudes[index]
        const dLat = (lat - currLat) * (Math.PI / 180)
        const dLon = (lon - currLong) * (Math.PI / 180)

        const rLat1 = currLat * (Math.PI / 180)
        const rLat2 = lat * (Math.PI / 180)

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLon / 2) *
                Math.sin(dLon / 2) *
                Math.cos(rLat1) *
                Math.cos(rLat2)
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

        const distance = (R * c).toFixed(2)

        return { lat, lon, amount: amount[index], distance }
    })

    return (
        <MapContainer
            center={[currLat, currLong]}
            zoom={13}
            style={{ height: '100vh', width: '100%' }}
        >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {markers.map((marker, index) => (
                <Marker key={index} position={[marker.lat, marker.lon]}>
                    <Popup>
                        <div>
                            <p>Amount: Rs.{marker.amount}</p>
                            <p>Distance: {marker.distance} km</p>
                        </div>
                    </Popup>
                </Marker>
            ))}

            <Marker position={[currLat, currLong]} icon={officeIcon}>
                <Popup>
                    <div>
                        <p>SlikkSync Technologies</p>
                    </div>
                </Popup>
            </Marker>

            <CurrentLocationButton setCenter={() => {}} />
        </MapContainer>
    )
}

export default MultipleMap
