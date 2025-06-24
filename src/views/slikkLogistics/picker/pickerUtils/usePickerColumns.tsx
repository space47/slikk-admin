/* eslint-disable @typescript-eslint/no-explicit-any */
import moment from 'moment'
import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

export const usePickerColumns = () => {
    const navigate = useNavigate()
    return useMemo(
        () => [
            {
                header: 'Name',
                accessorKey: 'name',
                cell: ({ getValue }: any) => <div className="font-medium text-gray-800 dark:text-white">{getValue()}</div>,
            },
            {
                header: 'Mobile',
                accessorKey: 'mobile',
                cell: ({ getValue }: any) => (
                    <div
                        className="text-blue-600 font-semibold dark:text-blue-600 cursor-pointer"
                        onClick={() => navigate(`/app/pickerDetails/${getValue()}`)}
                    >
                        {getValue()}
                    </div>
                ),
            },
            {
                header: 'Orders Count',
                accessorKey: 'orders_count',
                cell: ({ getValue }: any) => <div className="text-gray-700 dark:text-white">{getValue()}</div>,
            },
            {
                header: 'Total Items',
                accessorKey: 'items_picked',
                cell: ({ getValue }: any) => <div className="text-purple-600 font-bold dark:text-white">{getValue()}</div>,
            },
            {
                header: 'Total Pickup Time',
                accessorKey: 'total_pickup_time',
                cell: ({ getValue }: any) => {
                    const totalPickupTime = getValue()
                    const minutes = totalPickupTime ? moment.duration(totalPickupTime, 'seconds').asMinutes().toFixed(2) : null
                    return <div className="text-gray-700 dark:text-white">{minutes ? `${minutes} mins` : '-'}</div>
                },
            },
            {
                header: 'Average Pickup Time',
                accessorKey: 'average_pickup_time',
                cell: ({ getValue }: any) => {
                    const averagePickupTime = getValue()
                    const minutes = averagePickupTime ? moment.duration(averagePickupTime, 'seconds').asMinutes().toFixed(2) : '0.00'
                    return <div className="text-orange-500 font-semibold">{`${minutes} mins`}</div>
                },
            },
            {
                header: 'Active',
                accessorKey: 'pending',
                cell: ({ getValue }: any) => {
                    return <div className="text-red-600 font-bold">{getValue()}</div>
                },
            },
            {
                header: 'Completed',
                accessorKey: 'picked',
                cell: ({ getValue }: any) => {
                    return <div className="text-green-600 font-bold">{getValue()}</div>
                },
            },
        ],
        [],
    )
}
