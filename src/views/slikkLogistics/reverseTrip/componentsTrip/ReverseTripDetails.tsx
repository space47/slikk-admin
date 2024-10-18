import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { TRIPDETAIL } from './DetailsComponent/DetailsCommon'
import moment from 'moment'
import TripLogistic from './DetailsComponent/TripLogistic'
import TripActivity from './DetailsComponent/TripActivity'
import TripMap from './DetailsComponent/TripMap'

const ReverseTripDetails = () => {
    const [mainData, setMainData] = useState<TRIPDETAIL>()

    const { tripId } = useParams()
    const fetchMainData = async () => {
        try {
            const response = await axioisInstance.get(`/logistic/slikk/trip?trip_id=${tripId}`)
            const data = response.data?.data
            setMainData(data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchMainData()
    }, [])

    console.log('DATAMAP', mainData?.logistic_tasks)

    return (
        <div className="flex flex-col gap-8">
            <div className="bg-white p-4 rounded-lg shadow-md max-w-md font-bold flex flex-col gap-1 justify-center">
                <div className="flex justify-between mb-2">
                    <span className="font-semibold text-gray-700">Trip Id:</span>
                    <span className="text-gray-900">{mainData?.trip_id}</span>
                </div>
                <div className="flex justify-between mb-2">
                    <span className="font-semibold text-gray-700">Created:</span>
                    <span className="text-gray-900">{moment(mainData?.create_date).format('YYYY-MM-DD')}</span>
                </div>
                <div className="flex justify-between mb-2">
                    <span className="font-semibold text-gray-700">Assigned To:</span>
                    <span className="text-gray-900">{mainData?.assigned_to}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-semibold text-gray-700">Status:</span>
                    <span
                        className={`${
                            mainData?.status === 'Active'
                                ? 'text-green-500'
                                : mainData?.status === 'Pending'
                                  ? 'text-yellow-500'
                                  : 'text-red-500'
                        } font-bold`}
                    >
                        {mainData?.status}
                    </span>
                </div>
            </div>
            <div className="flex flex-col gap-5">
                <h4>Task Details</h4>
                <TripLogistic trip_id={tripId} />
            </div>
            <div>
                <TripActivity data={mainData?.event_logs} />
            </div>

            {/* <div>
                <TripMap logistic_tasks={mainData?.logistic_tasks} trip_id={tripId} />
            </div> */}
        </div>
    )
}

export default ReverseTripDetails
