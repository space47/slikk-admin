/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from 'react'
import moment from 'moment'
import { ReturnOrder } from '../returnOrderCommon'
import { EReturnOrderStatus } from './ReturnOrderUtils'
import { ColumnDef } from '@tanstack/react-table'

export const useReturnOrderColumns = () => {
    const STATUS_FLAGS: {
        status: EReturnOrderStatus
        label: string
    }[] = [
        {
            status: EReturnOrderStatus.qc_failed,
            label: 'QC_Failed',
        },
        {
            status: EReturnOrderStatus.attempt_failed,
            label: 'Attempt_Failed',
        },
    ]

    return useMemo<ColumnDef<ReturnOrder>[]>(
        () => [
            {
                header: 'Order Id',
                accessorKey: 'order',
                cell: ({ row }) => (
                    <a
                        href={`/app/orders/${row?.original?.order}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white bg-red-600 flex items-center justify-center py-1 px-4 rounded-[7px] font-semibold cursor-pointer"
                    >
                        {row?.original?.order}
                    </a>
                ),
            },
            {
                header: 'Return_Order Id',
                accessorKey: 'return_order_id',
                cell: ({ row }) => (
                    <a
                        href={`/app/returnOrders/${row?.original?.return_order_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white w-[70%] bg-red-600 flex items-center justify-center py-1 rounded-[7px] font-semibold cursor-pointer"
                    >
                        {row?.original?.return_order_id}
                    </a>
                ),
            },
            {
                header: 'Exchange Order',
                accessorKey: 'exchange_order',
                cell: ({ row }) => {
                    const value = row?.original?.exchange_order
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
                cell: ({ row }) => <span>{moment(row?.original?.create_date).format('YYYY-MM-DD hh:mm:ss a')}</span>,
            },
            {
                header: 'Return Type',
                accessorKey: 'return_type',
                cell: ({ row }) => <span>{row?.original?.return_type}</span>,
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
                cell: ({ row }) => {
                    const { status, log = [] } = row.original

                    const failedStatuses = STATUS_FLAGS.filter(({ status }) => log.some((item) => item?.status === status))

                    return (
                        <div className="flex gap-1 flex-col items-center">
                            <span>{status}</span>

                            {failedStatuses.map(({ label }) => (
                                <span key={label} className="text-red-500 font-semibold">
                                    ({label})
                                </span>
                            ))}
                        </div>
                    )
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
