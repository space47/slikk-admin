import React from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default icon issues with leaflet
import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
})

L.Marker.prototype.options.icon = DefaultIcon

interface MultipleMapProps {
    latitudes: any[]
    longitudes: any[]
}

const MultipleMap: React.FC<MultipleMapProps> = ({ latitudes, longitudes }) => {
    // Center the map on the first location if available, otherwise use a default center
    const center =
        latitudes.length > 0 && longitudes.length > 0
            ? [latitudes, longitudes]
            : [12.9716, 77.5946] // Default to Bangalore if no locations

    return (
        <div style={{ height: '500px', width: '100%' }}>
            <MapContainer
                center={center}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {latitudes.map((lat, index) => (
                    <Marker key={index} position={[lat, longitudes[index]]}>
                        <Popup>
                            Location: {lat}, {longitudes[index]}
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    )
}

export default MultipleMap
