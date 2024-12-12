import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import axiosInstance from '@/utils/intercepter/globalInterceptorSetup'
import { LogisticTask } from './DetailsCommon'
import { MdCloseFullscreen, MdOutlineFullscreen } from 'react-icons/md'
import { FaMapMarkerAlt } from 'react-icons/fa'
import FullTripMap from './FullTripMap'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import polyline from '@mapbox/polyline'

interface LogisticsMapProps {
    logistic_tasks?: LogisticTask[]
    trip_id: string
}

interface FullMapProps {
    setFullTripMap: any
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
const FullMapButton = ({ trip_id }: LogisticsMapProps) => {
    const navigate = useNavigate()
    const handleFullMap = () => {
        navigate(`/app/tryAndBuy/fullTripMap/${trip_id}`)
    }

    return (
        <button
            onClick={handleFullMap}
            style={{
                position: 'absolute',
                bottom: '10px',
                left: '10px',
                backgroundColor: 'white',
                border: 'none',
                borderRadius: '50%',
                padding: '10px',
                boxShadow: '0 0 5px rgba(0,0,0,0.3)',
                cursor: 'pointer',
                zIndex: 1000,
            }}
        >
            <MdOutlineFullscreen size={24} color="black" />
        </button>
    )
}

const TripMap: React.FC<LogisticsMapProps> = ({ logistic_tasks, trip_id }) => {
    const [logData, setLogData] = useState<LogisticTask[]>([])
    const [fullTripMap, setFullTripMap] = useState(false)
    const [polyLine, setPolyLine] = useState('')
    const [sourceLatLong, setSourceLatLong] = useState<[number, number]>([0, 0])
    const [destinationLatLong, setDestinationLatLong] = useState<[number, number]>([0, 0])

    const decodedPolyline = polyline.decode(polyLine)

    console.log('object', decodedPolyline)

    console.log('sourceLat', sourceLatLong)
    console.log('destLat', destinationLatLong)

    const fetchMainData = async () => {
        try {
            const response = await axiosInstance.get(`/logistic/slikk/trip?trip_id=${trip_id}`)
            const data = response.data?.data.logistic_tasks || []
            setLogData(data)

            if (data.length > 0) {
                const firstTask = data[0]
                setSourceLatLong([firstTask.pickup_details?.latitude || 0, firstTask.pickup_details?.longitude || 0])
                setDestinationLatLong([firstTask.drop_details?.latitude || 0, firstTask.drop_details?.longitude || 0])
            }
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    }

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
        fetchMainData()
    }, [trip_id])

    useEffect(() => {
        if (sourceLatLong[0] !== 0 && destinationLatLong[0] !== 0) {
            fetchRouteDetails()
        }
    }, [sourceLatLong, destinationLatLong])

    if (logData.length === 0) {
        return <p>Loading map...</p>
    }

    console.log('Overview PolyLine', polyLine)

    const center: [number, number] = [logData[0].drop_details?.latitude || 0, logData[0].drop_details?.longitude || 0]

    const positions = logData.map((task) => ({
        pickup: [task.pickup_details?.latitude || 0, task.pickup_details?.longitude || 0],
        drop: [task.drop_details?.latitude || 0, task.drop_details?.longitude || 0],
        runner: task.runner_latitude && task.runner_longitude ? [task.runner_latitude, task.runner_longitude] : null,
    }))

    return (
        <div className="relative flex flex-col gap-10">
            <div className="relative w-full" style={{ height: '500px' }}>
                <MapContainer center={center} zoom={16} style={{ width: '100%', height: '100%' }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                    {positions.map((position, index) => (
                        <React.Fragment key={index}>
                            <Marker position={position.pickup} icon={icons.pickup}>
                                <Popup>{logData[index]?.pickup_details?.name}</Popup>
                            </Marker>
                            <Marker position={position.drop} icon={icons.drop}>
                                <Popup>{logData[index]?.drop_details?.name}</Popup>
                            </Marker>
                            {position.runner && (
                                <Marker position={position.runner} icon={icons.runner}>
                                    <Popup>{logData[index]?.runner_detail?.name}</Popup>
                                </Marker>
                            )}
                        </React.Fragment>
                    ))}

                    <Polyline positions={decodedPolyline} color="blue" />
                    <CurrentLocationButton setCenter={() => {}} />

                    <FullMapButton trip_id={trip_id} />
                </MapContainer>
            </div>
        </div>
    )
}

export default TripMap
