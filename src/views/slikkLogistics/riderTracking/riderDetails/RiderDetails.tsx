import { useState, useEffect } from 'react'
import Loading from '@/components/shared/Loading'
import Container from '@/components/shared/Container'
import DoubleSidedImage from '@/components/shared/DoubleSidedImage'
import isEmpty from 'lodash/isEmpty'
import { TaskDetails } from '@/views/slikkLogistics/taskTracking/TaskCommonType'
import RiderInfo from './RiderInfo'
import RiderActivity from './RiderActivity'
import { useParams } from 'react-router-dom'
import MapComponent from '@/common/mapLocation'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'

const RiderDetails = () => {
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<TaskDetails[]>([])
    const [status, setStatus] = useState<string>('')
    const { task_id } = useParams()
    const [latitude, setLatitude] = useState()
    const [longitude, setLongitude] = useState()
    // const [location, setLocation] = useState({
    //     latitude: null,
    //     longitude: null,
    // })
    // const [error, setError] = useState(null)

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axioisInstance.get(`logistic/rider/task?task_id=${task_id}`)
                console.log('object', response?.data?.data)
                const riderData = response.data.data.results
                setData(riderData)
                setStatus(riderData?.[0]?.status || '')
                setLatitude(riderData?.[0]?.runner_latitude)
                setLongitude(riderData?.[0]?.runner_longitude)
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }

        fetchOrders()
    }, [task_id])

    console.log('LATITY & LONGI', latitude, longitude)

    // useEffect(() => {
    //     if (navigator.geolocation) {
    //         navigator.geolocation.getCurrentPosition(
    //             (position) => {
    //                 setLocation({
    //                     latitude: position?.coords?.latitude,
    //                     longitude: position?.coords?.longitude,
    //                 })
    //             },
    //             (error) => {
    //                 setError(error.message)
    //             },
    //         )
    //     } else {
    //         setError('Geolocation is not supported by this browser.')
    //     }
    // }, [])

    console.log('LONG', data?.map((item) => item?.pickup_details.latitude)?.join(','))

    return (
        <Container className="h-auto w-auto">
            <Loading loading={loading}>
                {!isEmpty(data) && (
                    <>
                        <div className="xl:flex gap-10 p-6 rounded-lg">
                            <div className="w-full flex flex-col xl:flex-row gap-10 justify-between">
                                <RiderInfo
                                    title="Profile"
                                    name={data?.map((item) => item?.pickup_details.name)}
                                    latitude={data?.map((item) => item?.pickup_details.latitude)}
                                    longitude={data?.map((item) => item?.pickup_details.longitude)}
                                    address={data?.map((item) => item?.pickup_details.address)}
                                    contact_number={data?.map((item) => item?.pickup_details.contact_number)}
                                    className="flex-1 bg-white p-6 rounded-lg min-w-[300px]"
                                />
                                <RiderInfo
                                    title="Drop"
                                    name={data?.map((item) => item?.drop_details.name)}
                                    latitude={data?.map((item) => item?.drop_details.latitude)}
                                    longitude={data?.map((item) => item?.drop_details.longitude)}
                                    address={data?.map((item) => item?.drop_details.address)}
                                    contact_number={data?.map((item) => item?.drop_details?.contact_number)}
                                    className="flex-1 bg-white p-6 rounded-lg min-w-[300px]"
                                />
                            </div>
                        </div>
                        {/* <div className="flex justify-center gap-4 mb-6">
                            LOCATIONS:: <p>{location.latitude}</p> &{' '}
                            <p>{location.longitude}</p> <br />
                        </div> */}
                        <div className="my-10 mx-12">
                            <MapComponent
                                latitude={data?.map((item) => item?.pickup_details?.latitude).join(',')}
                                longitude={data?.map((item) => item?.pickup_details?.longitude).join(',')}
                            />
                        </div>
                        <RiderActivity
                            data={data}
                            status={status}
                            task_id={task_id}
                            latitude={latitude}
                            longitude={longitude}
                            // onStatusChange={setStatus}
                        />
                    </>
                )}
            </Loading>
            {!loading && isEmpty(data) && (
                <div className="h-full flex flex-col items-center justify-center">
                    <DoubleSidedImage src="/img/others/img-2.png" darkModeSrc="/img/others/img-2-dark.png" alt="No order found!" />
                    <h3 className="mt-8">No order found!</h3>
                </div>
            )}
        </Container>
    )
}

export default RiderDetails
