/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dropdown } from '@/components/ui'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import { useMemo } from 'react'
import { RiEBike2Fill } from 'react-icons/ri'
import { DELIVERY_OPTIONS, LOGISTIC_PARTNER } from '../DeliveryCommon'
import { MdAssignmentTurnedIn, MdCancel } from 'react-icons/md'
import moment from 'moment'

type changeValues = {
    [key: string]: {
        value: string
        label: string
    }
}

export const ForwardDeliveryColumns = (
    handleCreateTask: (partner: any, logistic_partner: any, order_id: any) => Promise<void>,
    handleCancelTask: (invoce_id: any) => Promise<void>,
    partner: changeValues,
    deliveryChangeType: changeValues,
    handleDeliveryChange: (selectedValue: any, row: any) => void,
    handlePartnerSelect: (selectedValue: any, row: any) => void,
) => {
    return useMemo(
        () => [
            {
                header: 'Order Invoice Id',
                accessorKey: 'invoice_id',
                cell: ({ row }: any) => {
                    const referenceId = row.original?.invoice_id

                    return referenceId ? (
                        <a
                            href={`/app/orders/${referenceId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white bg-red-600 flex items-center justify-center px-2 py-1 rounded-[7px] font-semibold cursor-pointer"
                        >
                            {referenceId}
                        </a>
                    ) : (
                        ''
                    )
                },
            },
            { header: 'Mobile Number', accessorKey: 'user.mobile' },
            {
                header: 'Tracking Url',
                accessorKey: 'logistic.tracking_url',
                cell: ({ getValue, row }: any) => {
                    const { partner } = row.original?.logistic || {}
                    const { awb_code } = row.original || {}
                    const { delivery_type } = row.original || {}

                    console.log('SSSDSDSDD', delivery_type)

                    let trackingUrl

                    if ((partner === 'Shadowfax' || partner === 'shadowfax') && delivery_type === 'STANDARD') {
                        trackingUrl = `https://tracker.shadowfax.in/#/awb/${awb_code}`
                    } else if ((partner === 'Shiprocket' || partner === 'shiprocket') && delivery_type === 'EXPRESS') {
                        trackingUrl = `https://shiprocket.co/tracking/${awb_code}`
                    } else {
                        trackingUrl = getValue()
                    }

                    return (
                        <a href={trackingUrl} target="_blank" rel="noreferrer">
                            <div className="flex justify-center">
                                <RiEBike2Fill className="text-xl" />
                            </div>
                        </a>
                    )
                },
            },
            { header: 'Device Type', accessorKey: 'device_type' },

            {
                header: 'Delivery Type',
                accessorKey: 'delivery_type',
                cell: ({ row }: any) => {
                    const Rowid = row?.original.invoice_id
                    const selectedDeliveryType = deliveryChangeType[Rowid]?.label || row.original?.delivery_type || 'SELECT'

                    return (
                        <Dropdown
                            className="w-full px-4 py-2 text-xl text-black bg-gray-100 border border-gray-300 rounded-md shadow-sm"
                            title={selectedDeliveryType}
                            onSelect={(value) => handleDeliveryChange(value, Rowid)}
                        >
                            <div className="max-h-60 overflow-y-auto">
                                {DELIVERY_OPTIONS.map((item, key) => (
                                    <DropdownItem
                                        key={key}
                                        eventKey={item.value}
                                        className="px-2 py-2 text-black hover:bg-gray-100 cursor-pointer"
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
                header: 'Status',
                accessorKey: 'status',
                cell: ({ row }) => {
                    const statuses = row?.original?.status
                    return (
                        <div>
                            {statuses === 'PENDING' ? (
                                <span className="text-red-700 font-semibold bg-red-200 p-2 rounded-md">{statuses}</span>
                            ) : statuses === 'COMPLETED' ? (
                                <span className="font-semibold text-green-700 bg-green-200 p-2 rounded-lg">{statuses}</span>
                            ) : (
                                <span className="text-yellow-700 bg-yellow-200 p-2 rounded-lg font-semibold">{statuses}</span>
                            )}
                        </div>
                    )
                },
            },
            { header: 'Runner Name', accessorKey: 'logistic.runner_name' },
            {
                header: 'Runner Number',
                accessorKey: 'logistic.runner_phone_number',
            },
            {
                header: 'ETA DropOff Time',
                accessorKey: 'logistic.eta_dropoff_time',
                cell: ({ row }: any) => (
                    <div>
                        {row?.original?.logistic?.eta_dropoff_time
                            ? moment(row?.original?.logistic?.eta_dropoff_time).format('YYYY-MM-DD hh:mm:ss a')
                            : 'N/A'}
                    </div>
                ),
            },

            {
                header: 'Total Time Taken',
                accessorKey: 'logistic.total_time',
                cell: ({ row }: any) => {
                    return (
                        <>
                            {row?.original?.logistic?.total_time
                                ? `${Number(row?.original?.logistic?.total_time)?.toFixed(2)} mins`
                                : 'N/A'}
                        </>
                    )
                },
            },
            {
                header: 'Delay Time',
                accessorKey: 'logistic.is_delayed',
                cell: ({ row }: any) => {
                    const timeTaken =
                        typeof row?.original?.logistic?.total_time === 'string'
                            ? Number(row?.original?.logistic?.total_time)
                            : row?.original?.logistic?.total_time || 0
                    const timeEstimate =
                        typeof row?.original?.eta_duration === 'string'
                            ? Number(row?.original?.eta_duration)
                            : row?.original?.eta_duration || 0

                    const difference = timeTaken - timeEstimate

                    return <>{difference >= 0 ? `${difference.toFixed(2)} mins` : '0 mins'}</>
                },
            },

            {
                header: 'Estimate Delivery Time',
                accessorKey: 'eta_duration',
                cell: ({ row }: any) => {
                    const etaData =
                        typeof row?.original?.eta_duration === 'string'
                            ? Number(row?.original?.eta_duration)
                            : row?.original?.eta_duration || 0
                    return <div>{row?.original?.eta_duration ? `${etaData?.toFixed(2)} mins` : 'N/A'}</div>
                },
            },
            {
                header: 'Delay Status',
                accessorKey: 'logistic.is_delayed',
                cell: ({ row }: any) => {
                    return <>{row?.original?.logistic?.is_delayed ? 'delayed' : 'On Time'}</>
                },
            },
            {
                header: 'Payment Mode',
                accessorKey: 'payment.mode',
            },

            {
                header: 'Pickup Time',
                accessorKey: 'log',
                cell: ({ row }: any) => {
                    const deliveryCreatedLog = row.original.log.find(
                        (logEntry: any) => logEntry.status === 'SHIPPED' || logEntry.status === 'OUT_FOR_DELIVERY',
                    )

                    return deliveryCreatedLog ? <div>{moment(deliveryCreatedLog.timestamp).format('YYYY-MM-DD hh:mm:ss a')}</div> : null
                },
            },

            {
                header: 'Drop Time',
                accessorKey: 'log',
                cell: ({ row }: any) => {
                    const deliveryCreatedLog = row.original.log.find(
                        (logEntry: any) => logEntry.status === 'DELIVERED' || logEntry.status === 'COMPLETED',
                    )

                    return deliveryCreatedLog ? <div>{moment(deliveryCreatedLog.timestamp).format('YYYY-MM-DD hh:mm:ss a')}</div> : null
                },
            },
            { header: 'AWB Code', accessorKey: 'logistic.awb_code' },
            {
                header: 'Partner',
                accessorKey: 'logistic.partner',
                cell: ({ row }: any) => {
                    const selectedPartner = partner[row.id]?.label || row.original?.logistic?.partner

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
                                        className="px-2 py-2 text-black hover:bg-gray-100 cursor-pointer"
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
                header: 'CREATE TASk',
                accessorKey: 'logistic.partner',
                cell: ({ row, getValue }: any) => (
                    <button onClick={() => handleCreateTask(partner[row.id], getValue(), row.original.invoice_id)}>
                        <MdAssignmentTurnedIn className="border-none bg-none text-2xl flex justify-center items-center text-green-600" />
                    </button>
                ),
            },
            {
                header: 'Cancel Task',
                accessorKey: 'id',
                cell: ({ row }: any) => (
                    <button onClick={() => handleCancelTask(row.original.invoice_id)}>
                        <MdCancel className="border-none bg-none text-2xl flex justify-center items-center text-red-600" />
                    </button>
                ),
            },
        ],
        [partner],
    )
}
