/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, Tooltip } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { FaMapMarkerAlt } from 'react-icons/fa'
import { BsFullscreenExit } from 'react-icons/bs'
import { MdFullscreen } from 'react-icons/md'
import axios, { AxiosError } from 'axios'
import polyline from '@mapbox/polyline'
import dayjs from 'dayjs'
import { ridersService } from '@/store/services/riderServices'
import DialogConfirm from '@/common/DialogConfirm'
import { errorMessage, successMessage } from '@/utils/responseMessages'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'

const MAP_KEY = import.meta.env.VITE_OLA_API_KEY
const DEFAULT_CENTER: [number, number] = [12.9014, 77.65122]
const DEFAULT_ZOOM = 16

interface Props {
    task_id: string
    taskData: any
    refetchAllData: () => void
}

interface Rider {
    lat: number
    long: number
    mobile: string
    name: string
}

const createCustomIcon = (iconUrl: string) =>
    new L.Icon({
        iconUrl,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.4/images/marker-shadow.png',
    })

const ICONS = {
    pickup: createCustomIcon('http://maps.google.com/mapfiles/ms/icons/blue-dot.png'),
    drop: createCustomIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png'),
    office: L.icon({
        iconUrl: '/img/logo/slikkWare.png',
        iconSize: [30, 45],
        iconAnchor: [12, 41],
    }),
    runner: L.icon({
        iconUrl: '/img/logo/riderOnline-logo.png',
        iconSize: [20, 40],
        iconAnchor: [12, 41],
    }),
}

const CurrentLocationButton: React.FC = () => {
    const map = useMap()
    return (
        <button
            onClick={() => map.setView(DEFAULT_CENTER, DEFAULT_ZOOM)}
            style={{
                position: 'absolute',
                bottom: '3px',
                right: '10px',
                zIndex: 1000,
            }}
        >
            <FaMapMarkerAlt size={24} />
        </button>
    )
}

const FullScreenButton: React.FC<{ onClick: () => void; isFullScreen?: boolean }> = ({ onClick, isFullScreen = false }) => (
    <button
        onClick={onClick}
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
)

const FullScreenMap: React.FC<{ mapCenter: [number, number]; taskData: any; decodedPolyline: any[] }> = ({
    mapCenter,
    taskData,
    decodedPolyline,
}) => {
    const [isFullScreen, setIsFullScreen] = useState(false)

    if (!isFullScreen) {
        return <FullScreenButton onClick={() => setIsFullScreen(true)} />
    }

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: '#fff' }}>
            <FullScreenButton onClick={() => setIsFullScreen(false)} isFullScreen />
            <MapContainer center={mapCenter} zoom={DEFAULT_ZOOM} style={{ width: '100%', height: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <MapMarkers taskData={taskData} />
                <Polyline positions={decodedPolyline} color="blue" />
            </MapContainer>
        </div>
    )
}

const MapMarkers: React.FC<{ taskData: any; riders?: Rider[]; onRiderClick?: (mobile: string) => void }> = ({
    taskData,
    riders = [],
    onRiderClick,
}) => {
    return (
        <>
            {taskData?.pickup_details && (
                <Marker position={[taskData.pickup_details.latitude, taskData.pickup_details.longitude]} icon={ICONS.office}>
                    <Popup>{taskData.pickup_details.name}</Popup>
                </Marker>
            )}

            {taskData?.drop_details && (
                <Marker position={[taskData.drop_details.latitude, taskData.drop_details.longitude]} icon={ICONS.drop}>
                    <Popup>{taskData.drop_details.name}</Popup>
                </Marker>
            )}

            {taskData?.runner_latitude && taskData?.runner_longitude && (
                <Marker position={[taskData.runner_latitude, taskData.runner_longitude]} icon={ICONS.runner}>
                    <Popup>{taskData?.runner_detail?.name}</Popup>
                </Marker>
            )}

            {riders.map(
                (rider, index) =>
                    rider.lat &&
                    rider.long && (
                        <Marker
                            key={index}
                            position={[rider.lat, rider.long]}
                            icon={ICONS.runner}
                            eventHandlers={onRiderClick ? { click: () => onRiderClick(rider.mobile) } : undefined}
                        >
                            <Tooltip>
                                {rider.name} ({rider.mobile})
                            </Tooltip>
                        </Marker>
                    ),
            )}
        </>
    )
}

const ReturnMap: React.FC<Props> = ({ taskData, task_id, refetchAllData }) => {
    const [mapCenter, setMapCenter] = useState<[number, number] | null>(null)
    const [polyLine, setPolyLine] = useState('')
    const [sourceLatLong, setSourceLatLong] = useState<[number, number]>([0, 0])
    const [destinationLatLong, setDestinationLatLong] = useState<[number, number]>([0, 0])
    const [ridersDataStore, setRidersDataStore] = useState<Rider[]>([])
    const [isAssignRider, setIsAssignRider] = useState(false)
    const [currentRiderMobile, setCurrentRiderMobile] = useState('')
    const [taskLoader, setTaskLoader] = useState(false)

    const ridersCall = ridersService.useRiderDetailsQuery(
        {
            from: dayjs().format('YYYY-MM-DD'),
            to: dayjs().add(1, 'days').format('YYYY-MM-DD'),
            page: 1,
            pageSize: 1000,
            isActive: 'true',
            rider_type: 'RETURN',
            user_type: 'rider',
        },
        { refetchOnMountOrArgChange: true, pollingInterval: 60000 },
    )

    const isValidCoordinates = useMemo(() => sourceLatLong[0] > 0 && sourceLatLong[1] > 0, [sourceLatLong])
    const decodedPolyline = useMemo(() => polyline.decode(polyLine), [polyLine])

    const fetchRouteDetails = useCallback(async () => {
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
            setPolyLine(response.data.routes[0]?.overview_polyline || '')
        } catch (error) {
            console.error('Error fetching route details:', error)
        }
    }, [sourceLatLong, destinationLatLong])

    const handleAssignRider = useCallback(
        async (mobile: string) => {
            setTaskLoader(true)
            try {
                const res = await axioisInstance.patch(`/logistic/slikk/task/${task_id}`, {
                    action: 'assign_rider',
                    rider_mobile: mobile,
                })
                successMessage(res)
                setIsAssignRider(false)
                refetchAllData()
            } catch (error) {
                if (error instanceof AxiosError) errorMessage(error)
            } finally {
                setTaskLoader(false)
            }
        },
        [task_id, refetchAllData],
    )

    const handleRiderClick = useCallback((mobile: string) => {
        setIsAssignRider(true)
        setCurrentRiderMobile(mobile)
    }, [])

    useEffect(() => {
        if (ridersCall?.isSuccess && ridersCall?.data?.data?.results) {
            const riders = ridersCall.data.data.results.map((item: any) => ({
                lat: item?.profile?.current_location?.latitude,
                long: item?.profile?.current_location?.longitude,
                mobile: item?.profile?.mobile,
                name: `${item?.profile?.first_name} ${item?.profile?.last_name}`,
            }))
            setRidersDataStore(riders)
        }
    }, [ridersCall?.isSuccess, ridersCall?.data])

    useEffect(() => {
        if (taskData?.pickup_details && taskData?.drop_details) {
            const origin: [number, number] = [taskData.pickup_details.latitude, taskData.pickup_details.longitude]
            const destination: [number, number] = [taskData.drop_details.latitude, taskData.drop_details.longitude]
            setMapCenter(origin)
            setSourceLatLong(origin)
            setDestinationLatLong(destination)
        }
    }, [taskData])

    useEffect(() => {
        if (isValidCoordinates) {
            fetchRouteDetails()
        }
    }, [isValidCoordinates, fetchRouteDetails])

    if (!mapCenter) return null

    return (
        <div className="relative flex flex-col gap-10">
            <div className="relative w-full" style={{ height: '500px' }}>
                <MapContainer center={mapCenter} zoom={DEFAULT_ZOOM} style={{ width: '100%', height: '100%' }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <MapMarkers taskData={taskData} riders={ridersDataStore} onRiderClick={handleRiderClick} />
                    <Polyline positions={decodedPolyline} color="blue" />
                    <CurrentLocationButton />
                </MapContainer>
                <FullScreenMap mapCenter={mapCenter} taskData={taskData} decodedPolyline={decodedPolyline} />
            </div>

            <DialogConfirm
                IsOpen={isAssignRider}
                setIsOpen={setIsAssignRider}
                onDialogOk={() => handleAssignRider(currentRiderMobile)}
                headingName="Assign Rider"
                label={`Assign rider with mobile - ${currentRiderMobile}?`}
                isProceed
                spinner={taskLoader}
            />
        </div>
    )
}

export default ReturnMap
