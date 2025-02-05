import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { FaMapMarkerAlt } from 'react-icons/fa'
import polyline from '@mapbox/polyline'
import axios from 'axios'
import { TaskData } from '@/store/types/tasks.type'

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

interface props {
    taskData?: TaskData | undefined
    runnerLat: number
    runnerLong: number
}

const RiderLocationMap = ({ taskData, runnerLat, runnerLong }: props) => {
    const [mapCenter, setMapCenter] = useState<[number, number] | null>([12.9001879, 77.6510959])
    const [waypoints, setWaypoints] = useState<[number, number][]>([])

    const [polyLine, setPolyLine] = useState('')
    const [sourceLatLong, setSourceLatLong] = useState<[number, number]>([0, 0])
    const [destinationLatLong, setDestinationLatLong] = useState<[number, number]>([0, 0])

    const decodedPolyline = polyline.decode(polyLine)

    console.log('Datatatata', runnerLat, runnerLong)

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
        fetchRouteDetails()
    }, [sourceLatLong, destinationLatLong, runnerLat, runnerLong])

    useEffect(() => {
        if (taskData?.pickup_details && taskData?.drop_details) {
            const origin: [number, number] = [taskData.pickup_details.latitude, taskData.pickup_details.longitude]
            const destination: [number, number] = [taskData.drop_details.latitude, taskData.drop_details.longitude]
            setMapCenter(destination)
            setWaypoints([origin, destination])

            setSourceLatLong(origin)
            setDestinationLatLong(destination)
        }
    }, [taskData])

    const CurrentLocationButton = ({ setCenter }: { setCenter: React.Dispatch<React.SetStateAction<[number, number]>> }) => {
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

    console.log('Map set in trip Map', decodedPolyline)

    return (
        <div className="relative flex flex-col gap-10">
            <div className="relative xl:w-[400px] rounded-xl" style={{ height: '500px' }}>
                <MapContainer center={mapCenter} zoom={16} style={{ width: 'auto', height: '100%' }}>
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

                    <Marker position={[runnerLat, runnerLong]} icon={icons.runner}>
                        <Popup>{taskData?.runner_detail?.name}</Popup>
                    </Marker>

                    <Polyline positions={decodedPolyline} color="blue" />
                    <CurrentLocationButton setCenter={() => {}} />
                </MapContainer>
            </div>
        </div>
    )
}

export default RiderLocationMap
