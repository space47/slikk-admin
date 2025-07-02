/* eslint-disable @typescript-eslint/no-explicit-any */
import { Tooltip } from '@/components/ui'
import moment from 'moment'

const getDaysInMonth = (year: string, month: string) => {
    return moment(`${year}-${month}`, 'YYYY-MM').daysInMonth()
}

export const generateColumns = (year: string, month: string, handleUserData: any, isWeek?: boolean, from?: string, to?: string) => {
    const columns = [
        {
            header: 'Name',
            csvHeader: 'Name',
            accessorKey: 'user_name',
            cell: ({ row }: any) => {
                return <div className="hover:text-green-500 cursor-pointer">{row.original.user_name}</div>
            },
        },
        {
            header: 'User',
            csvHeader: 'User',
            accessorKey: 'user',
            cell: ({ row }: any) => {
                console.log('user data in attendance', row?.original?.user)
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
                const attendanceEntry = userAttendance.find(
                    (attendance: any) => moment(attendance.checkin_date).format('YYYY-MM-DD') === date,
                )

                console.log('attendance entry is', attendanceEntry)

                return (
                    <div>
                        {attendanceEntry ? (
                            <Tooltip
                                title={
                                    <div className="text-left">
                                        <div>
                                            <strong>Check-in Date:</strong> {attendanceEntry.checkin_date}
                                        </div>
                                        <div>
                                            <strong>Check-in Time:</strong> {attendanceEntry.checkin_time}
                                        </div>
                                        <div>
                                            <strong>Check-out Time:</strong> {attendanceEntry.checkout_time}
                                        </div>
                                        <div>
                                            <strong>Distance:</strong> {attendanceEntry.distance_covered} km
                                        </div>
                                    </div>
                                }
                            >
                                <div className="cursor-pointer">✅</div>
                            </Tooltip>
                        ) : (
                            '❌'
                        )}
                    </div>
                )
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
            const { first_name, last_name } = row.original.user || {}
            return (
                <div>
                    <div>
                        <strong>
                            {first_name} {last_name}
                        </strong>
                    </div>
                </div>
            )
        },
    },
    {
        header: 'Mobile',
        accessorKey: 'user',
        cell: ({ row }: any) => {
            const { mobile } = row.original.user || {}
            return (
                <div>
                    <div>
                        <strong>{mobile} </strong>
                    </div>
                </div>
            )
        },
    },
    {
        header: 'Checked-in Status',
        accessorKey: 'checked_in_status',
        cell: ({ row }: any) => <div>{row.original.checked_in_status ? 'Active' : 'InActive'}</div>,
    },
    {
        header: 'Check-in Date',
        accessorKey: 'checkin_date',
        cell: ({ row }: any) => <div>{row.original.checkin_date}</div>,
    },
    {
        header: 'Active Time',
        accessorKey: 'active_time',
        cell: ({ row }: any) => <div>{row.original.active_time}mins</div>,
    },
    {
        header: 'Bonus Earnings',
        accessorKey: 'bonus_earnings',
        cell: ({ row }: any) => <div>{row.original.bonus_earnings}</div>,
    },
    {
        header: 'Check-in Count',
        accessorKey: 'checkin_count',
        cell: ({ row }: any) => <div>{row.original.checkin_count}</div>,
    },

    {
        header: 'Check-in Time',
        accessorKey: 'checkin_time',
        cell: ({ row }: any) => <div>{row.original.checkin_time}</div>,
    },
    {
        header: 'Checkout Time',
        accessorKey: 'checkout_time',
        cell: ({ row }: any) => <div>{row.original.checkout_time}</div>,
    },
    {
        header: 'Created At',
        accessorKey: 'create_date',
        cell: ({ row }: any) => <div>{row.original.create_date}</div>,
    },
    {
        header: 'Distance Covered',
        accessorKey: 'distance_covered',
        cell: ({ row }: any) => <div>{row.original.distance_covered}</div>,
    },
    {
        header: 'Earnings',
        accessorKey: 'earnings',
        cell: ({ row }: any) => <div>{row.original.earnings}</div>,
    },
    {
        header: 'Orders Processed',
        accessorKey: 'order_processed',
        cell: ({ row }: any) => <div>{row.original.order_processed}</div>,
    },
    {
        header: 'Other Order Data',
        accessorKey: 'other_order_data',
        cell: ({ row }: any) => (
            <pre className="whitespace-pre-wrap break-words text-xs">{JSON.stringify(row.original.other_order_data, null, 2)}</pre>
        ),
    },
    {
        header: 'Updated At',
        accessorKey: 'update_date',
        cell: ({ row }: any) => <div>{row.original.update_date}</div>,
    },

    {
        header: 'User Type',
        accessorKey: 'user_type',
        cell: ({ row }: any) => <div>{row.original.user_type}</div>,
    },
]
