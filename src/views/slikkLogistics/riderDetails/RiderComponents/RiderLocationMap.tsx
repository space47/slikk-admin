import React, { useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { FaMapMarkerAlt } from 'react-icons/fa'

// Fix for default icon issues with Leaflet
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

interface RiderLocationMapProps {
    latitudes: string // Comma-separated string of latitudes
    longitudes: string // Comma-separated string of longitudes
    amount: string // Comma-separated string of amounts
}

const CurrentLocationButton = ({ setCenter }: { setCenter: (center: [number, number]) => void }) => {
    const map = useMap()

    const handleClick = () => {
        const currentLocation: [number, number] = [12.9014, 77.65122] // Adjust to your current location
        map.setView(currentLocation, 13)
        setCenter(currentLocation)
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
                borderRadius: '50%',
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

const RiderLocationMap: React.FC<RiderLocationMapProps> = ({ latitudes, longitudes, amount }) => {
    const currLat = 12.9014
    const currLong = 77.65122

    // Split comma-separated strings into arrays and parse them as numbers
    const latitudeArray = latitudes.split(',').map((lat) => parseFloat(lat.trim()))
    const longitudeArray = longitudes.split(',').map((lon) => parseFloat(lon.trim()))
    const amountArray = amount.split(',').map((amt) => amt.trim())

    // Combine latitudes, longitudes, and amounts into marker objects
    const markers = latitudeArray.map((lat, index) => ({
        lat,
        lon: longitudeArray[index],
        amount: amountArray[index],
    }))

    const [center, setCenter] = useState<[number, number]>([currLat, currLong])

    return (
        <MapContainer center={center} zoom={13} style={{ height: '100vh', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {markers.map((marker, index) => (
                <Marker key={index} position={[marker.lat, marker.lon]}>
                    <Popup>
                        <div>
                            <p>Amount: Rs.{marker.amount}</p>
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

            <CurrentLocationButton setCenter={setCenter} />
        </MapContainer>
    )
}

export default RiderLocationMap
