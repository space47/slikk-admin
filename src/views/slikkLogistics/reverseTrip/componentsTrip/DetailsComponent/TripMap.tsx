import React, { useEffect, useState } from 'react'
import { GoogleMap, MarkerF, LoadScript, DirectionsRenderer, useJsApiLoader } from '@react-google-maps/api'
import axiosInstance from '@/utils/intercepter/globalInterceptorSetup'
import { LogisticTask } from './DetailsCommon'

interface LogisticsMapProps {
    logistic_tasks: LogisticTask[]
    trip_id: string
}

const TripMap: React.FC<LogisticsMapProps> = ({ logistic_tasks, trip_id }) => {
    const [logData, setLogData] = useState<LogisticTask[]>([])
    const [mapRef, setMapRef] = useState<google.maps.Map>()
    const [direction, setDirection] = useState<google.maps.DirectionsResult | null>(null)

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: import.meta.env.VITE_MAP_API_KEY,
        libraries: ['places'],
    })

    const handleOnLoad = (map: google.maps.Map) => {
        setMapRef(map)

        if (logData.length > 1) {
            const DirectionsService = new google.maps.DirectionsService()
            const origin = new google.maps.LatLng(logData[0].pickup_details.latitude, logData[0].pickup_details.longitude)

            const destination = new google.maps.LatLng(
                logData[logData.length - 1].drop_details.latitude,
                logData[logData.length - 1].drop_details.longitude,
            )

            const waypoints = logData.slice(1, logData.length - 1).map((task) => ({
                location: new google.maps.LatLng(task.drop_details.latitude, task.drop_details.longitude),
                stopover: true,
            }))

            DirectionsService.route(
                {
                    origin,
                    destination,
                    waypoints,
                    travelMode: google.maps.TravelMode.DRIVING,
                },
                (result, status) => {
                    if (status === google.maps.DirectionsStatus.OK) {
                        setDirection(result)
                    } else {
                        console.error(`Error fetching directions: ${status}`)
                    }
                },
            )
        }
    }

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

    const zoom = 16
    const mapContainerStyle = { width: '100%', height: '500px' }

    const icons = {
        pickup: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
        drop: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
        runner: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
    }

    return (
        <div className="flex flex-col gap-10 w-[80%]">
            {isLoaded && logData.length > 0 ? (
                <GoogleMap
                    onLoad={handleOnLoad}
                    mapContainerStyle={mapContainerStyle}
                    zoom={zoom}
                    center={{
                        lat: logData[0].drop_details.latitude,
                        lng: logData[0].drop_details.longitude,
                    }}
                    options={{
                        fullscreenControl: true,
                        keyboardShortcuts: false,
                        mapTypeControl: false,
                        streetViewControl: false,
                        zoomControlOptions: { position: 9 },
                    }}
                >
                    {logData.map((item, index) => (
                        <React.Fragment key={index}>
                            <MarkerF
                                position={{
                                    lat: item.pickup_details.latitude,
                                    lng: item.pickup_details.longitude,
                                }}
                                icon={icons.pickup}
                                label={{
                                    text: `${item?.pickup_details.name}`,
                                    color: 'white',
                                    fontSize: '13px',
                                    fontWeight: 'bold',
                                }}
                            />
                            <MarkerF
                                position={{
                                    lat: item.drop_details.latitude,
                                    lng: item.drop_details.longitude,
                                }}
                                icon={icons.drop}
                                label={{
                                    text: `${item?.drop_details.name}`,
                                    color: 'white',
                                    fontSize: '13px',
                                    fontWeight: 'bold',
                                }}
                            />
                            {item.runner_latitude && item.runner_longitude && (
                                <MarkerF
                                    position={{
                                        lat: item.runner_latitude,
                                        lng: item.runner_longitude,
                                    }}
                                    icon={icons.runner}
                                    label={{
                                        text: `${item?.runner_detail?.name}`,
                                        color: 'white',
                                        fontSize: '13px',
                                        fontWeight: 'bold',
                                    }}
                                />
                            )}
                        </React.Fragment>
                    ))}
                    {direction && <DirectionsRenderer directions={direction} />}
                </GoogleMap>
            ) : (
                <p>Loading map...</p>
            )}
        </div>
    )
}

export default TripMap
