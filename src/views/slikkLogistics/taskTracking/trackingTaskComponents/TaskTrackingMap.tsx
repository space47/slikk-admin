import React, { useState } from 'react'
import { GoogleMap, MarkerF, DirectionsRenderer, useJsApiLoader } from '@react-google-maps/api'

import { useAppSelector } from '@/store'
import { TASKDETAILS } from '@/store/types/tasks.type'

const TaskTrackingMap = () => {
    const [mapRef, setMapRef] = useState<google.maps.Map>()
    const [direction, setDirection] = useState<google.maps.DirectionsResult | null>(null)
    const { taskData } = useAppSelector<TASKDETAILS>((state) => state.taskData)

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: import.meta.env.VITE_MAP_API_KEY,
        libraries: ['places'],
    })

    const handleOnLoad = (map: google.maps.Map) => {
        setMapRef(map)

        const DirectionsService = new google.maps.DirectionsService()
        const origin = new google.maps.LatLng(taskData?.pickup_details?.latitude, taskData?.pickup_details?.longitude)

        const destination = new google.maps.LatLng(taskData.drop_details.latitude, taskData.drop_details.longitude)

        DirectionsService.route(
            {
                origin,
                destination,
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

    const zoom = 16
    const mapContainerStyle = { width: '100%', height: '500px' }

    const icons = {
        pickup: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
        drop: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
        runner: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
    }

    return (
        <div className="flex flex-col gap-10 ">
            {isLoaded ? (
                <GoogleMap
                    onLoad={handleOnLoad}
                    mapContainerStyle={mapContainerStyle}
                    zoom={zoom}
                    center={{
                        lat: taskData.drop_details?.latitude,
                        lng: taskData.drop_details?.longitude,
                    }}
                    options={{
                        fullscreenControl: true,
                        keyboardShortcuts: false,
                        mapTypeControl: false,
                        streetViewControl: false,
                        zoomControlOptions: { position: 9 },
                    }}
                >
                    <MarkerF
                        position={{
                            lat: taskData.pickup_details.latitude,
                            lng: taskData.pickup_details.longitude,
                        }}
                        icon={icons.pickup}
                        label={{
                            text: `${taskData?.pickup_details.name}`,
                            color: 'white',
                            fontSize: '13px',
                            fontWeight: 'bold',
                        }}
                    />
                    <MarkerF
                        position={{
                            lat: taskData.drop_details.latitude,
                            lng: taskData.drop_details.longitude,
                        }}
                        icon={icons.drop}
                        label={{
                            text: `${taskData?.drop_details.name}`,
                            color: 'white',
                            fontSize: '13px',
                            fontWeight: 'bold',
                        }}
                    />
                    {taskData.runner_latitude && taskData.runner_longitude && (
                        <MarkerF
                            position={{
                                lat: taskData?.runner_latitude,
                                lng: taskData.runner_longitude,
                            }}
                            icon={icons.runner}
                            label={{
                                text: `${taskData?.runner_detail?.name}`,
                                color: 'white',
                                fontSize: '13px',
                                fontWeight: 'bold',
                            }}
                        />
                    )}

                    {direction && <DirectionsRenderer directions={direction} />}
                </GoogleMap>
            ) : (
                <p>Loading map...</p>
            )}
        </div>
    )
}

export default TaskTrackingMap
