/* eslint-disable @typescript-eslint/no-explicit-any */
import moment from 'moment'
import { useMemo } from 'react'
import { FaMapMarkedAlt } from 'react-icons/fa'
import { scheduleSlots_exchange } from '../ExchangeCommon'

export const Exchange_Columns = (handleNumberClick: (number: any) => Promise<void>) => {
    return useMemo(
        () => [
            {
                header: 'Invoice Id',
                accessorKey: 'invoice_id',
                cell: ({ getValue }: any) => {
                    return (
                        <div className="flex items-center gap-3">
                            <a
                                href={`/app/orders/${getValue()}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-white bg-red-600 flex items-center justify-center px-2 py-1 rounded-[7px] font-semibold cursor-pointer"
                            >
                                {getValue()}
                            </a>
                        </div>
                    )
                },
            },

            {
                header: 'Original Order',
                accessorKey: 'original_order',
                cell: ({ getValue }: any) => {
                    return (
                        <div className="flex items-center gap-3">
                            <a
                                href={`/app/orders/${getValue()}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-white bg-red-600 flex items-center justify-center px-2 py-1 rounded-[7px] font-semibold cursor-pointer"
                            >
                                {getValue()}
                            </a>
                        </div>
                    )
                },
            },
            {
                header: 'Return Order',
                accessorKey: 'reference_return',
                cell: ({ getValue }: any) => {
                    return (
                        <div className="flex items-center gap-3">
                            <a
                                href={`/app/returnOrders/${getValue()}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-white bg-red-600 flex items-center justify-center px-2 py-1 rounded-[7px] font-semibold cursor-pointer"
                            >
                                {getValue()}
                            </a>
                        </div>
                    )
                },
            },

            {
                header: 'Order Date',
                accessorKey: 'create_date',
                cell: ({ getValue }) => <span className="">{moment(getValue()).format('YYYY-MM-DD hh:mm:ss a')}</span>,
            },
            {
                header: 'Mobile Number',
                accessorKey: 'user.mobile',
                cell: ({ getValue, row }) => {
                    const orderCount = row.original.user_order_count
                    return (
                        <>
                            {orderCount > 1 ? (
                                <div className="text-green-500 cursor-pointer" onClick={() => handleNumberClick(getValue())}>
                                    {getValue()}
                                </div>
                            ) : (
                                <>
                                    <div>{getValue()}</div>
                                </>
                            )}
                        </>
                    )
                },
            },
            { header: 'Order Count', accessorKey: 'user_order_count' },
            { header: 'Device Type', accessorKey: 'device_type' },
            { header: 'Customer Name', accessorKey: 'user.name' },
            {
                header: 'Delivery Type',
                accessorKey: 'delivery_type',
            },
            {
                header: 'Customer Address',
                accessorKey: 'location_url',
                cell: ({ getValue }) => (
                    <a href={getValue()} target="_blank" rel="noreferrer">
                        <div className="flex justify-center">
                            <FaMapMarkedAlt className="text-xl" />
                        </div>
                    </a>
                ),
            },

            {
                header: 'Status',
                accessorKey: 'status',
                cell: ({ row }) => {
                    const statuses = row?.original?.status
                    return (
                        <div>
                            {statuses === 'PENDING' || statuses === 'CANCELLED' ? (
                                <span className="text-red-700 font-semibold bg-red-100 p-2 rounded-md">{statuses}</span>
                            ) : statuses === 'COMPLETED' ? (
                                <span className="font-semibold text-green-700 bg-green-100 p-2 rounded-lg">{statuses}</span>
                            ) : (
                                <span className="text-yellow-700 bg-yellow-100 p-2 rounded-lg font-semibold">{statuses}</span>
                            )}
                        </div>
                    )
                },
            },

            { header: 'Distance', accessorKey: 'distance', cell: ({ getValue }) => <span>{getValue()} km</span> },
            { header: 'Schedule Date', accessorKey: 'delivery_schedule_date' },
            {
                header: 'Slot',
                accessorKey: 'delivery_schedule_slot',
                cell: ({ row }) => {
                    return (
                        <span className="flex items-center justify-center md:justify-start text-gray-600 text-sm">
                            <span className="ml-2 ">
                                {scheduleSlots_exchange[row?.original.delivery_schedule_slot]
                                    ? `${scheduleSlots_exchange[row?.original.delivery_schedule_slot].start} - ${scheduleSlots_exchange[row?.original.delivery_schedule_slot].end}`
                                    : '-'}
                            </span>
                        </span>
                    )
                },
            },
            { header: 'Total Items', accessorKey: 'order_items.length' },

            {
                header: 'Last Update',
                accessorKey: 'update_date',
                cell: ({ getValue }) => <span>{moment(getValue()).format('YYYY-MM-DD hh:mm:ss a')}</span>,
            },
        ],
        [],
    )
}
