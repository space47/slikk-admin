/* eslint-disable @typescript-eslint/no-explicit-any */
import moment from 'moment'

const getDaysInMonth = (year: string, month: string) => {
    return moment(`${year}-${month}`, 'YYYY-MM').daysInMonth()
}

export const generateColumns = (year: string, month: string, handleUserData: any, isWeek?: boolean, from?: string, to?: string) => {
    const columns = [
        {
            header: 'User', // For display
            csvHeader: 'User', // For CSV download
            accessorKey: 'user',
            cell: ({ row }: any) => {
                return (
                    <div className="hover:text-green-500 cursor-pointer" onClick={() => handleUserData(row?.original?.user)}>
                        {row.original.user}
                    </div>
                )
            },
        },
    ]

    let startDay = 1
    let endDay = getDaysInMonth(year, month)

    if (isWeek && from && to) {
        startDay = moment(from, 'YYYY-MM-DD').date()
        endDay = moment(to, 'YYYY-MM-DD').date()
    }

    for (let day = startDay; day <= endDay; day++) {
        const date = moment(`${year}-${month}-${day}`, 'YYYY-MM-DD').format('YYYY-MM-DD')
        const dayName = moment(date).format('dddd')

        columns.push({
            header: (
                <div className="flex flex-col items-center">
                    {day.toString()} <span>{dayName}</span>
                </div>
            ),
            csvHeader: day.toString(),
            accessorKey: date,
            cell: ({ row }: any) => {
                const userAttendance = row.original.attendanceData
                const hasAttendanceOnDate = userAttendance.some(
                    (attendance: any) => moment(attendance.checkin_date).format('YYYY-MM-DD') === date,
                )
                return <div>{hasAttendanceOnDate ? '✅' : '❌'}</div>
            },
        })
    }

    return columns
}
export const particularRiderColumns = [
    {
        header: 'User',
        accessorKey: 'user',
        cell: ({ row }: any) => {
            return <div>{row.original.user}</div>
        },
    },
    {
        header: 'Checkin Date',
        accessorKey: 'checkin_date',
        cell: ({ row }: any) => {
            return <div>{row.original.attendanceData[0].checkin_date}</div>
        },
    },
    {
        header: 'Order Count',
        accessorKey: 'totalOrdersCount',
        cell: ({ row }: any) => {
            return <div>{row.original.totalOrdersCount ?? 0}</div>
        },
    },
    {
        header: 'Cash Collected',
        accessorKey: 'totalCashCollected',
        cell: ({ row }: any) => {
            return <div>{row.original.totalCashCollected ?? 0} Rs</div>
        },
    },
    {
        header: 'Actual Distance',
        accessorKey: 'totalActualDistance',
        cell: ({ row }: any) => {
            return <div>{row.original.totalActualDistance ?? 0} Km</div>
        },
    },
    {
        header: 'Estimated Distance',
        accessorKey: 'totalEstimatedDistance',
        cell: ({ row }: any) => {
            return <div>{row.original.totalEstimatedDistance} Km</div>
        },
    },
    {
        header: 'Distance Covered',
        accessorKey: 'totalDistanceCovered',
        cell: ({ row }: any) => {
            return <div>{row.original.totalDistanceCovered} Km</div>
        },
    },
]
