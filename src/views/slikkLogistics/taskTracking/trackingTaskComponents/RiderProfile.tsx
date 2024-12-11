/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import moment from 'moment'
import { Card } from '@/components/ui'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'

const RiderProfile = () => {
    const [riderProfile, setRiderProfile] = useState<Record<string, string>>()
    const [riderTask, setRiderTask] = useState<any>({})
    const { mobile } = useParams()

    const fetchRunnerProfile = async () => {
        try {
            const response = await axioisInstance.get(`/logistic/rider/profile/${mobile}`)
            const data = response?.data?.data
            setRiderProfile(data?.profile || {})
            setRiderTask(data?.task_data || {})
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchRunnerProfile()
    }, [])

    const riderProfileDisplay = [
        { name: `${riderProfile?.first_name || ''} ${riderProfile?.last_name || ''}`, label: 'Name' },
        { name: `${riderProfile?.country_code || ''} ${riderProfile?.mobile || ''}`, label: 'Mobile' },
        { name: moment(riderProfile?.dob).isValid() ? moment(riderProfile?.dob).format('YYYY-MM-DD') : '', label: 'DOB' },
        { name: riderProfile?.email || '', label: 'Email' },
        { name: riderProfile?.gender || '', label: 'Gender' },
    ]

    const taskCards = [
        { label: 'Assigned', value: riderTask?.ASSIGNED || 0 },
        { label: 'Total', value: riderTask?.TOTAL || 0 },
        { label: 'Delivered', value: riderTask?.DELIVERED || 0 },
        { label: 'Out for Pickup', value: riderTask?.OUT_FOR_PICKUP || 0 },
        { label: 'Out for Delivery', value: riderTask?.OUT_FOR_DELIVERY || 0 },
        { label: 'Picked Up', value: riderTask?.PICKED_UP || 0 },
        { label: 'Pickup Failed', value: riderTask?.PICKUP_FAILED || 0 },
        { label: 'Completed', value: riderTask?.COMPLETED || 0 },
        { label: 'Distance Covered', value: riderTask?.distance_covered || 'N/A' },
    ]

    return (
        <div className="flex flex-col gap-10">
            <div className="flex justify-start">
                <Card className="flex flex-col gap-4 shadow-lg w-1/2 overflow-hidden">
                    {riderProfileDisplay
                        .filter((item) => item.name !== '')
                        .map((item, key) => (
                            <div key={key} className="flex flex-col gap-2">
                                <div className="flex justify-between items-start text-xl flex-wrap">
                                    <span className="flex gap-2 font-semibold text-blue-700 break-words max-w-[40%]">{item.label}:</span>
                                    <div className="break-words max-w-[55%]">{item.name}</div>
                                </div>
                            </div>
                        ))}
                </Card>
            </div>
            <div>
                <div className="text-xl text-red-700 font-bold mb-8">Rider Task Details</div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {taskCards.map((task, index) => (
                        <Card key={index} className="p-4 shadow-md flex flex-col items-center justify-center text-center">
                            <div className="flex gap-2">
                                <span className="text-xl font-semibold text-gray-700">{task.label}:</span>
                                <span className="text-xl font-bold text-blue-600">{task.value}</span>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default RiderProfile
