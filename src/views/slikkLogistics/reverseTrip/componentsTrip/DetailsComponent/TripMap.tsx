import React, { useEffect, useState } from 'react'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'

interface LogisticsMapProps {
    logistic_tasks: any[]
    trip_id: any
}

const TripMap: React.FC<LogisticsMapProps> = ({ logistic_tasks, trip_id }) => {
    const [logData, setLogData] = useState([])

    const fetchMainData = async () => {
        try {
            const response = await axioisInstance.get(`/logistic/slikk/trip?trip_id=${trip_id}`)
            const data = response.data?.data.logistic_tasks
            setLogData(data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchMainData()
    }, [])

    console.log('LOGISTICS', logistic_tasks)

    const task = logData[0]

    const center = {
        lat: 10,
        lng: 9.7,
    }

    const zoom = 1000

    const mapContainerStyle = {
        width: '100%',
        height: '500px',
    }
    const key1 = import.meta.env.MAP_API_KEY
    console.log('key', key1)

    return (
        <LoadScript googleMapsApiKey={key1}>
            <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={zoom}>
                <Marker
                    position={{
                        lat: 10,
                        lng: 9.7,
                    }}
                    label="Pickup"
                />

                {/* Drop Marker */}
                <Marker
                    position={{
                        lat: 8.1,
                        lng: 8.2,
                    }}
                    label="Drop"
                />

                {/* Runner Marker */}
                <Marker
                    position={{
                        lat: 8.7,
                        lng: 9.0,
                    }}
                    label="Runner"
                />
            </GoogleMap>
        </LoadScript>
    )
}

export default TripMap
