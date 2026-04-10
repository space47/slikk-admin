import { DayWiseData } from '@/store/types/riderAddTypes'
import { ColumnDef } from '@tanstack/react-table'
import moment from 'moment'

export const RiderPerformanceColumns: ColumnDef<DayWiseData>[] = [
    {
        header: 'Date',
        accessorKey: 'report_date',
        cell: ({ row }) => {
            const date = row.original?.report_date
            return <span>{date ? moment(date).format('YYYY-MM-DD') : '-'}</span>
        },
    },
    {
        header: 'Total Orders',
        accessorKey: 'total_orders',
        cell: ({ row }) => <span>{row.original?.total_orders ?? '-'}</span>,
    },
    {
        header: 'Completed Orders',
        accessorKey: 'completed_orders',
        cell: ({ row }) => <span>{row.original?.completed_orders ?? '-'}</span>,
    },
    {
        header: 'Cancelled Orders',
        accessorKey: 'cancelled_orders',
        cell: ({ row }) => <span className="text-red-500">{row.original?.cancelled_orders ?? '-'}</span>,
    },
    {
        header: 'On-Time Delivery',
        accessorKey: 'on_time_delivery',
        cell: ({ row }) => <span className="text-blue-600">{row.original?.on_time_delivery ?? '-'}</span>,
    },
    {
        header: 'Checked-In Time (min)',
        accessorKey: 'total_checked_in_time',
        cell: ({ row }) => {
            const value = row.original?.total_checked_in_time
            return <span>{value ? `${value} min` : '-'}</span>
        },
    },
    {
        header: 'Time on Orders (min)',
        accessorKey: 'time_spent_on_orders',
        cell: ({ row }) => {
            const value = row.original?.time_spent_on_orders
            return <span>{value ? `${value} min` : '-'}</span>
        },
    },
    {
        header: 'Distance (km)',
        accessorKey: 'expected_total_distance',
        cell: ({ row }) => {
            const value = row.original?.expected_total_distance
            return <span>{value != null ? `${value.toFixed(2)} km` : '-'}</span>
        },
    },
    {
        header: 'Earnings (₹)',
        accessorKey: 'earnings',
        cell: ({ row }) => {
            const value = row.original?.earnings
            return <span className="font-semibold text-green-600">{value != null ? `₹${value.toFixed(2)}` : '-'}</span>
        },
    },
]
