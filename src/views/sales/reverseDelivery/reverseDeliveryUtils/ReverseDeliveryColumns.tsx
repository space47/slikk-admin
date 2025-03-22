/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dropdown } from '@/components/ui'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import { ReturnOrder } from '@/store/types/returnDetails.types'
import moment from 'moment'
import React, { useMemo } from 'react'
import { LOGISTIC_PARTNER } from '../../DeliveryOrders/DeliveryCommon'
import { MdAssignmentTurnedIn, MdCancel } from 'react-icons/md'
import { RiEBike2Fill } from 'react-icons/ri'

export const ReverseDeliveryColumns = (
    handleInvoiceClick: (invoiceId: string) => void,
    partner: {
        [key: string]: {
            value: string
            label: string
        }
    },
    handlePartnerSelect: (selectedValue: any, row: any) => void,
    handleCreateTask: (partner: any, logistic_partner: any, return_order_id: any) => Promise<void>,
    handleCancelTask: (return_order_id: any) => Promise<void>,
) => {
    return useMemo(
        () => [
            {
                header: 'Return Order Id',
                accessorKey: 'return_order_id',
                cell: ({ row }: { row: { original: ReturnOrder } }) => {
                    const referenceId = row.original.return_order_id

                    return referenceId ? (
                        <div
                            className="text-white bg-red-600 flex items-center justify-center py-1 rounded-[7px] font-semibold cursor-pointer"
                            onClick={() => handleInvoiceClick(referenceId)}
                        >
                            {referenceId}
                        </div>
                    ) : (
                        ''
                    )
                },
            },
            { header: 'Mobile Number', accessorKey: 'user.mobile' },
            {
                header: 'Tracking Url',
                accessorKey: 'return_order_delivery[0].tracking_url', // Adjust if you need to access tracking_url from an array
                cell: ({ getValue }: { getValue: () => string }) => {
                    const url = getValue()
                    return url ? (
                        <a href={url} target="_blank" rel="noreferrer">
                            <div className="flex justify-center">
                                <RiEBike2Fill className="text-xl" />
                            </div>
                        </a>
                    ) : null
                },
            },
            { header: 'Return Type', accessorKey: 'return_type' },
            { header: 'STATUS', accessorKey: 'status' },
            {
                header: 'Runner Name',
                accessorKey: 'return_order_delivery',
                cell: ({ row }: { row: { original: ReturnOrder } }) => (
                    <span>{row.original.return_order_delivery[0]?.runner_name || ''}</span>
                ),
            },
            {
                header: 'Runner Number',
                accessorKey: 'return_order_delivery',
                cell: ({ row }: { row: { original: ReturnOrder } }) => (
                    <span>{row.original.return_order_delivery[0]?.runner_phone_number || ''}</span>
                ),
            },
            {
                header: 'Pickup Time',
                accessorKey: 'return_order_delivery',
                cell: ({ row }: { row: { original: ReturnOrder } }) => {
                    const deliveryCreatedLog = row.original.return_order_delivery[0]?.log?.find(
                        (logEntry: any) => logEntry.status === 'DELIVERY_CREATED',
                    )

                    return deliveryCreatedLog ? <div>{moment(deliveryCreatedLog.timestamp).format('YYYY-MM-DD hh:mm:ss a')}</div> : null
                },
            },
            {
                header: 'Drop Time',
                accessorKey: 'return_order_delivery',
                cell: ({ row }: { row: { original: ReturnOrder } }) => {
                    const deliveryCreatedLog = row.original.return_order_delivery[0]?.log?.find(
                        (logEntry: any) => logEntry.status === 'DELIVERED',
                    )

                    return deliveryCreatedLog ? <div>{moment(deliveryCreatedLog.timestamp).format('YYYY-MM-DD hh:mm:ss a')}</div> : null
                },
            },
            {
                header: 'AWB Code',
                accessorKey: 'return_order_delivery',
                cell: ({ row }: { row: { original: ReturnOrder } }) => <span>{row.original.return_order_delivery[0]?.awb_code || ''}</span>,
            },
            {
                header: 'Partner',
                accessorKey: 'return_order_delivery[0].partner',
                cell: ({ row }: { row: { original: ReturnOrder } }) => {
                    const selectedPartner = partner[row.id]?.label || row.original.return_order_delivery[0]?.partner

                    return (
                        <Dropdown
                            className="w-full px-4 py-2 text-xl text-black bg-gray-100 border border-gray-300 rounded-md shadow-sm"
                            title={selectedPartner || 'SELECT'}
                            onSelect={(value) => handlePartnerSelect(value, row)}
                        >
                            <div className="max-h-60 overflow-y-auto">
                                {LOGISTIC_PARTNER.map((item, key) => (
                                    <DropdownItem
                                        key={key}
                                        eventKey={item.value}
                                        className="px-2 py-2 text-black hover:bg-gray-100 cursor-pointer z-50"
                                    >
                                        <span>{item.label}</span>
                                    </DropdownItem>
                                ))}
                            </div>
                        </Dropdown>
                    )
                },
            },
            {
                header: 'CREATE TASK',
                accessorKey: 'return_order_delivery',
                cell: ({ row }: { row: { original: ReturnOrder }; getValue: () => string }) => (
                    <button
                        onClick={() =>
                            handleCreateTask(
                                partner[row.id],
                                row.original.return_order_delivery.map((item) => item.partner).join(','),
                                row.original.return_order_id,
                            )
                        }
                    >
                        <MdAssignmentTurnedIn className="border-none bg-none text-2xl flex justify-center items-center text-green-600" />
                    </button>
                ),
            },
            {
                header: 'Cancel Task',
                accessorKey: 'order',
                cell: ({ row }: { row: { original: ReturnOrder } }) => (
                    <button onClick={() => handleCancelTask(row.original.return_order_id)}>
                        <MdCancel className="border-none bg-none text-2xl flex justify-center items-center text-red-600" />
                    </button>
                ),
            },
        ],
        [],
    )
}
