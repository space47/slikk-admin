/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from 'react'
import moment from 'moment'
import { ReturnOrder } from '../returnOrderCommon'

const scheduleSlots: any = {
    '1': { start: '10:00 AM', end: '01:00 PM' },
    '2': { start: '01:00 PM', end: '04:00 PM' },
    '3': { start: '04:00 PM', end: '07:00 PM' },
    '4': { start: '07:00 PM', end: '10:00 PM' },
}

export const useReturnOrderColumns = () => {
    return useMemo(
        () => [
            {
                header: 'Order Id',
                accessorKey: 'order',
                cell: ({ getValue }: { getValue: () => string }) => (
                    <a
                        href={`/app/orders/${getValue()}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white bg-red-600 flex items-center justify-center py-1 px-4 rounded-[7px] font-semibold cursor-pointer"
                    >
                        {getValue()}
                    </a>
                ),
            },
            {
                header: 'Return_Order Id',
                accessorKey: 'return_order_id',
                cell: ({ getValue }: { getValue: () => string }) => (
                    <a
                        href={`/app/returnOrders/${getValue()}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white w-[70%] bg-red-600 flex items-center justify-center py-1 rounded-[7px] font-semibold cursor-pointer"
                    >
                        {getValue()}
                    </a>
                ),
            },
            {
                header: 'Exchange Order',
                accessorKey: 'exchange_order',
                cell: ({ getValue }: { getValue: () => string }) => {
                    const value = getValue()
                    return value ? (
                        <a
                            href={`/app/orders/${value}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white w-[70%] bg-red-600 flex items-center justify-center py-1 rounded-[7px] font-semibold cursor-pointer"
                        >
                            <div>{value}</div>
                        </a>
                    ) : (
                        'N/A'
                    )
                },
            },
            {
                header: 'Order Date',
                accessorKey: 'create_date',
                cell: ({ getValue }: { getValue: () => string }) => <span>{moment(getValue()).format('YYYY-MM-DD hh:mm:ss a')}</span>,
            },
            {
                header: 'Return Type',
                accessorKey: 'return_type',
                cell: ({ getValue }: { getValue: () => string }) => <span>{getValue()}</span>,
            },
            {
                header: 'Runner Name',
                accessorKey: 'return_order_delivery',
                cell: ({ row }) => <div>{row?.original?.return_order_delivery?.map((item) => item?.runner_name)}</div>,
            },
            {
                header: 'Runner Mobile',
                accessorKey: 'return_order_delivery',
                cell: ({ row }) => <div>{row?.original?.return_order_delivery?.map((item) => item?.runner_phone_number)}</div>,
            },

            {
                header: 'Status',
                accessorKey: 'status',
                cell: ({ getValue }: { getValue: () => string }) => <span>{getValue()}</span>,
            },
            {
                header: 'Scheduled Date',
                accessorKey: 'pickup_schedule_date',
                cell: ({ row }: { row: { original: ReturnOrder } }) => {
                    const log = row?.original?.pickup_schedule_date

                    return <div>{log}</div>
                },
            },
            {
                header: 'Scheduled Slot',
                accessorKey: 'pickup_schedule_slot',
                cell: ({ row }: { row: { original: ReturnOrder } }) => {
                    const log = row?.original?.pickup_schedule_slot

                    const schedule = scheduleSlots[log] ?? {
                        start: '',
                        end: '',
                    }

                    return <div>{schedule ? `${schedule.start} - ${schedule.end}` : 'Not Scheduled'}</div>
                },
            },

            {
                header: 'Last Update',
                accessorKey: 'return_order_items',
                cell: ({ row }: { row: { original: ReturnOrder } }) => {
                    const log = row?.original?.log
                    const updatedLog = log && log.length > 0 ? log.at(-1) : undefined

                    return (
                        <div>
                            {updatedLog
                                ? moment(updatedLog.timestamp).format('YYYY-MM-DD hh:mm:ss a')
                                : moment(row?.original?.create_date).format('YYYY-MM-DD hh:mm:ss a')}
                        </div>
                    )
                },
            },
        ],
        [],
    )
}
