import React, { useEffect, useState } from 'react'
import { GoogleMap, MarkerF, LoadScript, Polyline } from '@react-google-maps/api'
import axiosInstance from '@/utils/intercepter/globalInterceptorSetup'
import { LogisticTask } from './DetailsCommon'

interface LogisticsMapProps {
    logistic_tasks: LogisticTask[]
    trip_id: string
}

const TripMap: React.FC<LogisticsMapProps> = ({ logistic_tasks, trip_id }) => {
    const [logData, setLogData] = useState<LogisticTask[]>([])
    const [mapref, setMapRef] = useState<google.maps.Map>()

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

    const zoom = 12
    const mapContainerStyle = {
        width: '100%',
        height: '500px',
    }

    const googleMapsApiKey = import.meta.env.VITE_MAP_API_KEY

    const icons = {
        pickup: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
        drop: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
        runner: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
    }

    const labels = {
        pickup: { text: 'Pickup', color: 'white', fontSize: '10px', fontWeight: 'bold' },
        drop: { text: 'Drop', color: 'white', fontSize: '10px', fontWeight: 'bold' },
        runner: { text: 'Runner', color: 'white', fontSize: '10px', fontWeight: 'bold' },
    }

    const handleOnLoad = (map: google.maps.Map) => {
        setMapRef(map)
    }

    return (
        <LoadScript googleMapsApiKey={googleMapsApiKey}>
            <div className="flex flex-col gap-10  w-[80%]">
                {logData.map((item, index) => (
                    <div key={index}>
                        <div className="font-semibold text-xl mb-2">
                            TaskId: <span className="font-bold">{item.task_id}</span>
                        </div>
                        <GoogleMap
                            onLoad={handleOnLoad}
                            mapContainerStyle={mapContainerStyle}
                            zoom={zoom}
                            center={{
                                lat: item?.drop_details.latitude,
                                lng: item?.drop_details.longitude,
                            }}
                            options={{
                                fullscreenControl: true,
                                keyboardShortcuts: false,
                                mapTypeControl: false,
                                streetViewControl: false,
                                zoomControlOptions: {
                                    position: 9,
                                },
                            }}
                        >
                            {/* Pickup Marker */}
                            <MarkerF
                                position={{
                                    lat: item?.pickup_details.latitude,
                                    lng: item?.pickup_details.longitude,
                                }}
                                icon={icons.pickup}
                                label={labels.pickup}
                            />

                            {/* Drop Marker */}
                            <MarkerF
                                position={{
                                    lat: item?.drop_details.latitude,
                                    lng: item?.drop_details.longitude,
                                }}
                                icon={icons.drop}
                                label={labels.drop}
                            />

                            {/* Runner Marker */}
                            <MarkerF
                                position={{
                                    lat: item?.runner_latitude,
                                    lng: item?.runner_longitude,
                                }}
                                icon={icons.runner}
                                label={labels.runner}
                            />
                        </GoogleMap>
                    </div>
                ))}
            </div>
        </LoadScript>
    )
}

export default TripMap
