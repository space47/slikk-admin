/* eslint-disable @typescript-eslint/no-explicit-any */
import EasyTable from '@/common/EasyTable'
import UltimateDatePicker from '@/common/UltimateDateFilter'
import { useFetchSingleData } from '@/commonHooks/useFetchSingleData'
import { Spin } from 'antd'
import moment from 'moment'
import React, { useEffect, useMemo, useState } from 'react'

type UserPickupDetails = {
    name: string
    mobile: string
    items_count: number
    orders_count: number
    items_picked: number
    total_pickup_time: number
    average_pickup_time: number
    pending: number
    picked: number
}

const LeaderBoardTable = () => {
    const [leaderBoardData, setLeaderBoardData] = useState<UserPickupDetails[]>([])
    const [from, setFrom] = useState(moment().format('YYYY-MM-DD'))
    const [to, setTo] = useState(moment().format('YYYY-MM-DD'))

    const To_Date = useMemo(() => moment(to).add(1, 'days').format('YYYY-MM-DD'), [to])

    const query = useMemo(() => `/picker/orders?from=${from}&to=${To_Date}`, [from, To_Date])

    const { data, loading } = useFetchSingleData<UserPickupDetails[]>({ url: query, pollingInterval: 60000 })

    useEffect(() => {
        if (data) {
            const sortedData = [...data].sort((a, b) => b.picked - a.picked)
            setLeaderBoardData(sortedData)
        }
    }, [data])

    const columns = [
        {
            header: 'Name',
            accessorKey: 'name',
            cell: ({ getValue }: any) => <div className="font-medium text-gray-800 dark:text-white">{getValue()}</div>,
        },
        {
            header: 'Mobile',
            accessorKey: 'mobile',
            cell: ({ getValue }: any) => <div className="text-blue-600 font-semibold dark:text-blue-600">{getValue()}</div>,
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
    ]

    const handleDateChange = (dates: [Date | null, Date | null] | null) => {
        if (dates && dates[0]) {
            setFrom(moment(dates[0]).format('YYYY-MM-DD'))
            setTo(dates[1] ? moment(dates[1]).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'))
        }
    }

    return (
        <Spin spinning={loading}>
            <div className="bg-gray-50 min-h-screen p-2 sm:px-8 dark:bg-gray-800">
                <div className="flex xl:justify-end xl:mb-10 mb-7 justify-between">
                    <UltimateDatePicker from={from} setFrom={setFrom} to={to} setTo={setTo} handleDateChange={handleDateChange} />
                </div>
                <div className=" mx-auto bg-white rounded-2xl shadow-lg  p-6 border border-gray-200 dark:bg-gray-800 dark:text-white">
                    <div className="flex justify-center mb-8">
                        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 dark:text-yellow-400 via-pink-500 to-red-500 p-4 rounded-lg shadow-md dark:shadow-white tracking-wide">
                            Leader Board 🚀
                        </h1>
                    </div>
                    <div className="overflow-x-auto">
                        <EasyTable overflow mainData={leaderBoardData} columns={columns} />
                    </div>
                </div>
            </div>
        </Spin>
    )
}

export default LeaderBoardTable
