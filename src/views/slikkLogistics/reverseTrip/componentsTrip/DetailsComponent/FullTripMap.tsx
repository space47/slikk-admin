import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import axiosInstance from '@/utils/intercepter/globalInterceptorSetup'
import { LogisticTask } from './DetailsCommon'
import { MdCloseFullscreen, MdOutlineFullscreen } from 'react-icons/md'
import { FaMapMarkerAlt } from 'react-icons/fa'
import { useNavigate, useParams } from 'react-router-dom'

interface LogisticsMapProps {
    logistic_tasks: LogisticTask[]
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
const FullMapButton = ({ setFullTripMap }: FullMapProps) => {
    const navigate = useNavigate()
    const handleFullMap = () => {
        navigate(-1)
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
            <MdCloseFullscreen size={24} color="black" />
        </button>
    )
}

const FullTripMap = () => {
    const [logData, setLogData] = useState<LogisticTask[]>([])
    const [fullTripMap, setFullTripMap] = useState(false)
    const { trip_id } = useParams()

    const fetchMainData = async () => {
        try {
            const response = await axiosInstance.get(`/logistic/slikk/trip?trip_id=${trip_id}`)
            const data = response.data?.data.logistic_tasks || []
            setLogData(data)
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    }

    useEffect(() => {
        fetchMainData()
        const intervalId = setInterval(fetchMainData, 60000)
        return () => clearInterval(intervalId)
    }, [trip_id])

    if (logData.length === 0) {
        return <p>Loading map...</p>
    }

    const center: [number, number] = [logData[0].drop_details?.latitude || 0, logData[0].drop_details?.longitude || 0]

    const positions = logData.map((task) => ({
        pickup: [task.pickup_details?.latitude || 0, task.pickup_details?.longitude || 0],
        drop: [task.drop_details?.latitude || 0, task.drop_details?.longitude || 0],
        runner: task.runner_latitude && task.runner_longitude ? [task.runner_latitude, task.runner_longitude] : null,
    }))

    const waypoints = logData.map((task) => [task.drop_details?.latitude || 0, task.drop_details?.longitude || 0])

    return (
        <div className="relative flex flex-col gap-10">
            {/* Relative wrapper for positioning */}
            <div className="relative w-[97rem] h-[47rem]">
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

                    <Polyline positions={waypoints} color="blue" />
                    <CurrentLocationButton setCenter={() => {}} />

                    <FullMapButton setFullTripMap={setFullTripMap} />
                </MapContainer>
            </div>
        </div>
    )
}

export default FullTripMap
