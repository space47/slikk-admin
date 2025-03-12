/* eslint-disable @typescript-eslint/no-explicit-any */
export const RiderAttendanceColumns = [
    {
        header: 'User',
        accessorKey: 'user',
        cell: ({ row }: any) => <div>{row.original.user}</div>,
    },
    {
        header: 'Checkin Date',
        accessorKey: 'checkin_date',
        cell: ({ row }: any) => <div>{row.original.checkin_date}</div>,
    },
    {
        header: 'Checkin Time',
        accessorKey: 'checkin_time',
        cell: ({ row }: any) => <div>{row.original.checkin_time}</div>,
    },
    {
        header: 'Checkout Time',
        accessorKey: 'checkout_time',
        cell: ({ row }: any) => <div>{row.original.checkout_time}</div>,
    },
    {
        header: 'Order Count',
        accessorKey: 'other_data.orders_count',
        cell: ({ row }: any) => <div>{row.original.other_data?.orders_count ?? 0}</div>,
    },
    {
        header: 'Cash Collected',
        accessorKey: 'other_data.cash_collected',
        cell: ({ row }: any) => <div>{row.original.other_data?.cash_collected ?? 0}</div>,
    },
    {
        header: 'Actual Distance',
        accessorKey: 'other_data.actual_distance',
        cell: ({ row }: any) => <div>{row.original.other_data?.actual_distance ?? 0}</div>,
    },
    {
        header: 'Estimated Distance',
        accessorKey: 'other_data.estimated_distance',
        cell: ({ row }: any) => <div>{row.original.other_data?.estimated_distance ?? 0}</div>,
    },
    {
        header: 'Distance Covered',
        accessorKey: 'distance_covered',
        cell: ({ row }: any) => <div>{row.original.distance_covered}</div>,
    },
]
