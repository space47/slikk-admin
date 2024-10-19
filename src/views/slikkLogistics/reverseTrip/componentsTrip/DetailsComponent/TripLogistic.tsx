/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useState } from 'react'
import axiosInstance from '@/utils/intercepter/globalInterceptorSetup'
import moment from 'moment'
import EasyTable from '@/common/EasyTable'

interface TRIPPROPS {
    trip_id: number | string | undefined
    listOfTaskIds?: string[]
    setListOfTaskIds?: (ids: string[]) => void
    setMobileNumber?: (value: any) => void
}

const TripLogistic = ({ trip_id, listOfTaskIds = [], setListOfTaskIds, setMobileNumber }: TRIPPROPS) => {
    const [tripDetail, setTripDetail] = useState<any[]>([])

    const fetchTripDetails = async () => {
        try {
            const response = await axiosInstance.get(`/logistic/slikk/trip?trip_id=${trip_id}`) // task_id=trip_id jayega from props...currently 500
            const data = response.data.data.logistic_tasks
            setTripDetail(data)

            const initialTaskIds = data.map((task: any) => task.task_id)
            setListOfTaskIds?.(initialTaskIds)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchTripDetails()
    }, [])

    const columns = useMemo(
        () => [
            {
                header: 'Task Id',
                accessorKey: 'task_id',
                cell: ({ getValue }: any) => {
                    const taskId = getValue() as string
                    // const isChecked = listOfTaskIds.includes(taskId)

                    return (
                        <div className="flex items-center gap-2">
                            {/* <input type="checkbox" checked={isChecked} onChange={(e) => handleCheckboxChange(taskId, e.target.checked)} /> */}
                            <span>{taskId}</span>
                        </div>
                    )
                },
            },
            {
                header: 'Return_Order Id',
                accessorKey: 'client_order_id',
                cell: ({ getValue }: { getValue: () => string }) => (
                    <a
                        href={`/app/returnOrders/${getValue()}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white bg-red-600 flex items-center justify-center py-1 rounded-[7px] font-semibold cursor-pointer"
                    >
                        {getValue()}
                    </a>
                ),
            },
            { header: 'Status', accessorKey: 'status' },
            { header: 'Runner Name', accessorKey: 'runner_detail.name' },
            { header: 'Runner Mobile', accessorKey: 'runner_detail.mobile' },
            { header: 'Pickup Name', accessorKey: 'pickup_details.name' },
            { header: 'Pickup Address', accessorKey: 'pickup_details.address' },
            { header: 'Drop Name', accessorKey: 'drop_details.name' },
            { header: 'Drop Address', accessorKey: 'drop_details.address' },
            {
                header: 'User Number',
                accessorKey: 'user_details.contact_number',
                cell: ({ getValue }) => {
                    return <div>{getValue()}</div>
                },
            },
            {
                header: 'Create Date',
                accessorKey: 'create_date',
                cell: ({ getValue }) => <span>{moment(getValue()).format('YYYY-MM-DD hh:mm:ss a')}</span>,
            },
            {
                header: 'Last Update',
                accessorKey: 'update_date',
                cell: ({ getValue }) => <span>{moment(getValue()).format('YYYY-MM-DD hh:mm:ss a')}</span>,
            },
        ],
        [listOfTaskIds],
    )

    return (
        <div>
            <EasyTable noPage mainData={tripDetail} columns={columns} />
        </div>
    )
}

export default TripLogistic
