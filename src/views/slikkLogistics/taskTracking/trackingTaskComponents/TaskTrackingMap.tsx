import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useAppSelector } from '@/store'
import { TASKDETAILS } from '@/store/types/tasks.type'
import { FaMapMarkerAlt } from 'react-icons/fa'

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

const TaskTrackingMap = () => {
    const [mapCenter, setMapCenter] = useState<[number, number] | null>(null)
    const [waypoints, setWaypoints] = useState<[number, number][]>([])
    const { taskData } = useAppSelector<TASKDETAILS>((state) => state.taskData)

    useEffect(() => {
        if (taskData?.pickup_details && taskData?.drop_details) {
            const origin: [number, number] = [taskData.pickup_details.latitude, taskData.pickup_details.longitude]
            const destination: [number, number] = [taskData.drop_details.latitude, taskData.drop_details.longitude]

            // Set initial map center and waypoints
            setMapCenter(destination)
            setWaypoints([origin, destination])
        }
    }, [taskData])

    if (!mapCenter) {
        return <p>Loading map...</p>
    }

    const CurrentLocationButton = ({ setCenter }: { setCenter: React.Dispatch<React.SetStateAction<[number, number]>> }) => {
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

    return (
        <div className="relative flex flex-col gap-10">
            <div className="relative w-full" style={{ height: '500px' }}>
                <MapContainer center={mapCenter} zoom={16} style={{ width: '100%', height: '100%' }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                    {/* Pickup Marker */}
                    {taskData?.pickup_details && (
                        <Marker position={[taskData.pickup_details.latitude, taskData.pickup_details.longitude]} icon={icons.pickup}>
                            <Popup>{taskData.pickup_details.name}</Popup>
                        </Marker>
                    )}

                    {/* Drop Marker */}
                    {taskData?.drop_details && (
                        <Marker position={[taskData.drop_details.latitude, taskData.drop_details.longitude]} icon={icons.drop}>
                            <Popup>{taskData.drop_details.name}</Popup>
                        </Marker>
                    )}

                    {/* Runner Marker */}
                    {taskData?.runner_latitude && taskData?.runner_longitude && (
                        <Marker position={[taskData.runner_latitude, taskData.runner_longitude]} icon={icons.runner}>
                            <Popup>{taskData.runner_detail?.name}</Popup>
                        </Marker>
                    )}

                    {/* Route Polyline */}
                    {waypoints.length > 1 && <Polyline positions={waypoints} color="blue" />}
                    <CurrentLocationButton setCenter={() => {}} />
                </MapContainer>
            </div>
        </div>
    )
}

export default TaskTrackingMap
