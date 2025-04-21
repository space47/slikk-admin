import React, { useEffect, useRef, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { FaMapMarkerAlt } from 'react-icons/fa'
import polyline from '@mapbox/polyline'
import axios from 'axios'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { BsFullscreenExit } from 'react-icons/bs'
import { MdFullscreen } from 'react-icons/md'

interface props {
    task_id: string
}

const customIcon = (iconUrl: string) =>
    new L.Icon({
        iconUrl,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.4/images/marker-shadow.png',
    })

const officeIcon = L.icon({
    iconUrl: '/img/logo/slikkWare.png',
    iconSize: [30, 45],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
})

const icons = {
    pickup: customIcon('http://maps.google.com/mapfiles/ms/icons/blue-dot.png'),
    drop: customIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png'),
    runner: customIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png'),
}

const FullScreenMap = ({ mapCenter, taskData, style = { height: '70vh', width: '100%' }, decodedPolyline }: any) => {
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

    const ridersIcon = L.icon({
        iconUrl: '/img/logo/riderOnline-logo.png',
        iconSize: [20, 40],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
    })

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
                <MapContainer center={mapCenter} zoom={16} style={{ width: '100%', height: '100%' }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                    {/* Pickup Marker */}
                    {taskData?.pickup_details && (
                        <Marker position={[taskData?.pickup_details?.latitude, taskData?.pickup_details?.longitude]} icon={officeIcon}>
                            <Popup>{taskData?.pickup_details?.name}</Popup>
                        </Marker>
                    )}

                    {/* Drop Marker */}
                    {taskData?.drop_details && (
                        <Marker position={[taskData?.drop_details?.latitude, taskData?.drop_details?.longitude]} icon={icons.drop}>
                            <Popup>{taskData?.drop_details?.name}</Popup>
                        </Marker>
                    )}

                    {/* Runner Marker */}
                    {taskData?.runner_latitude && taskData?.runner_longitude && (
                        <Marker position={[taskData?.runner_latitude, taskData?.runner_longitude]} icon={ridersIcon}>
                            <Popup>{taskData?.runner_detail?.name}</Popup>
                        </Marker>
                    )}

                    <Polyline positions={decodedPolyline} color="blue" />
                </MapContainer>
            )}
        </div>
    )
}

const OrderMap = ({ task_id }: props) => {
    const [mapCenter, setMapCenter] = useState<[number, number] | null>(null)
    const [waypoints, setWaypoints] = useState<[number, number][]>([])
    // const { taskData } = useAppSelector<TASKDETAILS>((state) => state.taskData)

    const [taskData, setTaskData] = useState<any>()

    const fetchTableData = async () => {
        try {
            const response = await axioisInstance.get(`/logistic/slikk/task?task_id=${task_id}`)
            const data = response.data.data
            setTaskData(data)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchTableData()
        const intervalId = setInterval(() => {
            fetchTableData()
        }, 60000)

        return () => clearInterval(intervalId)
    }, [task_id])

    const [polyLine, setPolyLine] = useState('')
    const [sourceLatLong, setSourceLatLong] = useState<[number, number]>([0, 0])
    const [destinationLatLong, setDestinationLatLong] = useState<[number, number]>([0, 0])

    const decodedPolyline = polyline.decode(polyLine)

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
    }, [sourceLatLong, destinationLatLong])

    useEffect(() => {
        if (taskData?.pickup_details && taskData?.drop_details) {
            const origin: [number, number] = [taskData?.pickup_details?.latitude, taskData?.pickup_details?.longitude]
            const destination: [number, number] = [taskData?.drop_details?.latitude, taskData?.drop_details?.longitude]
            setMapCenter(origin)
            setWaypoints([origin, destination])

            setSourceLatLong(origin)
            setDestinationLatLong(destination)
        }
    }, [taskData])

    if (!mapCenter) {
        return <p className="flex justify-between items-center h-screen">Loading map...</p>
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

    console.log('Map set in trip Map', decodedPolyline)
    const ridersIcon = L.icon({
        iconUrl: '/img/logo/riderOnline-logo.png',
        iconSize: [20, 40],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
    })

    return (
        <div className="relative flex flex-col gap-10 ">
            <div className="relative w-full" style={{ height: '500px' }}>
                <MapContainer center={mapCenter} zoom={16} style={{ width: '100%', height: '100%', position: 'relative', zIndex: 0 }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                    {/* Pickup Marker */}
                    {taskData?.pickup_details && (
                        <Marker position={[taskData?.pickup_details?.latitude, taskData?.pickup_details?.longitude]} icon={officeIcon}>
                            <Popup>{taskData?.pickup_details?.name}</Popup>
                        </Marker>
                    )}

                    {/* Drop Marker */}
                    {taskData?.drop_details && (
                        <Marker position={[taskData?.drop_details?.latitude, taskData?.drop_details?.longitude]} icon={icons.drop}>
                            <Popup>{taskData?.drop_details?.name}</Popup>
                        </Marker>
                    )}

                    {/* Runner Marker */}
                    {taskData?.runner_latitude && taskData?.runner_longitude && (
                        <Marker position={[taskData?.runner_latitude, taskData?.runner_longitude]} icon={ridersIcon}>
                            <Popup>{taskData?.runner_detail?.name}</Popup>
                        </Marker>
                    )}

                    <Polyline positions={decodedPolyline} color="blue" />
                    <CurrentLocationButton setCenter={() => {}} />
                    <FullScreenMap mapCenter={mapCenter} taskData={taskData} decodedPolyline={decodedPolyline} />
                </MapContainer>
            </div>
        </div>
    )
}

export default OrderMap
