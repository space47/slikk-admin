/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import moment from 'moment'
import EasyTable from '@/common/EasyTable'
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
        { name: riderProfile?.device_id || '', label: 'Device Id' },
    ]

    const columns = [
        { header: 'Assigned', accessorKey: 'ASSIGNED', cell: ({ getValue }: any) => <span>{getValue() || 0}</span> },
        { header: 'Total', accessorKey: 'TOTAL', cell: ({ getValue }: any) => <span>{getValue() || 0}</span> },
        { header: 'Delivered', accessorKey: 'DELIVERED', cell: ({ getValue }: any) => <span>{getValue() || 0}</span> },
        { header: 'Out for Pickup', accessorKey: 'OUT_FOR_PICKUP', cell: ({ getValue }: any) => <span>{getValue() || 0}</span> },
        { header: 'Out for Delivery', accessorKey: 'OUT_FOR_DELIVERY', cell: ({ getValue }: any) => <span>{getValue() || 0}</span> },
        { header: 'Picked Up', accessorKey: 'PICKED_UP', cell: ({ getValue }: any) => <span>{getValue() || 0}</span> },
        { header: 'Pickup Failed', accessorKey: 'PICKUP_FAILED', cell: ({ getValue }: any) => <span>{getValue() || 0}</span> },
        { header: 'Completed', accessorKey: 'COMPLETED', cell: ({ getValue }: any) => <span>{getValue() || 0}</span> },
        { header: 'Distance Covered', accessorKey: 'distance_covered', cell: ({ getValue }: any) => <span>{getValue() || ''}</span> },
    ]

    console.log('Data for task', riderTask)

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
                <EasyTable mainData={[riderTask]} noPage columns={columns} overflow />
            </div>
        </div>
    )
}

export default RiderProfile
