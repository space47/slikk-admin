/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from 'react'
import moment from 'moment'
import { BsFillPrinterFill } from 'react-icons/bs'
import { FaExclamationCircle, FaMapMarkedAlt } from 'react-icons/fa'
import { Dropdown, Tooltip } from '@/components/ui'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import { IoMdRefresh } from 'react-icons/io'
import { OrderColumns } from './OrderListUtils'

interface columnProps {
    generatePrintingData: any
    setPendingSound: any
    handleNumberClick: any
    handleDeliveryChange: any
    deliveryChangeType: any
    CHANGE_DELIVERY_OPTIONS: any
    handleSyncDistance: any
    currentSelectedTable: string[]
}

export const useOrderListColumns = ({
    generatePrintingData,
    setPendingSound,
    handleNumberClick,
    handleDeliveryChange,
    deliveryChangeType,
    CHANGE_DELIVERY_OPTIONS,
    handleSyncDistance,
    currentSelectedTable,
}: columnProps) => {
    return useMemo(() => {
        const baseColumns = [
            {
                header: 'Invoice Id',
                accessorKey: 'invoice_id',
                cell: ({ getValue, row }: any) => {
                    const createDate = moment(row.original.create_date)
                    const currentDate = moment()
                    const differenceInSeconds = currentDate.diff(createDate, 'seconds')

                    if (row.original.status === 'PENDING' && differenceInSeconds > 120) {
                        setPendingSound(true)
                        setTimeout(() => setPendingSound(false), 5000)
                    }

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
                            {row.original.status === 'PENDING' && differenceInSeconds > 60 && (
                                <div className="flex items-center justify-center mt-2">
                                    <FaExclamationCircle className="text-red-600 text-xl" />
                                </div>
                            )}
                        </div>
                    )
                },
            },
            {
                header: 'Split Order',
                accessorKey: 'split_order_id',
                cell: ({ getValue }: any) => {
                    return getValue() ? (
                        <>
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
                        </>
                    ) : (
                        'N/A'
                    )
                },
            },
            {
                header: 'Order Date',
                accessorKey: 'create_date',
                cell: ({ getValue }: any) => <span>{moment(getValue()).format('YYYY-MM-DD hh:mm:ss a')}</span>,
            },
            {
                header: 'Mobile Number',
                accessorKey: 'user.mobile',
                cell: ({ getValue, row }: any) => {
                    const orderCount = row.original.user_order_count
                    return orderCount > 1 ? (
                        <div className="text-green-500 cursor-pointer" onClick={() => handleNumberClick(getValue())}>
                            {getValue()}
                        </div>
                    ) : (
                        <div>{getValue()}</div>
                    )
                },
            },
            {
                header: 'Status',
                accessorKey: 'status',
                cell: ({ row }: any) => {
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
            { header: 'Payment Mode', accessorKey: 'payment.mode' },
            {
                header: 'Distance',
                accessorKey: 'distance',
                cell: ({ row }: any) => {
                    return (
                        <div>
                            {row?.original?.distance > 0 ? (
                                <span>{row?.original?.distance} km</span>
                            ) : (
                                <>
                                    <Tooltip title="Refresh distance per user">
                                        <button
                                            className="flex items-center justify-center bg-green-500 py-2 px-2 rounded-xl cursor-pointer"
                                            onClick={() => handleSyncDistance(row?.original?.invoice_id)}
                                        >
                                            <IoMdRefresh className="text-2xl text-white font-bold" />
                                        </button>
                                    </Tooltip>
                                </>
                            )}
                        </div>
                    )
                },
            },

            { header: 'Total Items', accessorKey: 'order_items_count' },
            { header: 'Order Count', accessorKey: 'user_order_count' },
            // { header: 'Device Type', accessorKey: 'device_type' },
            // { header: 'Customer Name', accessorKey: 'user.name' },
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
                                {CHANGE_DELIVERY_OPTIONS.map((item: any, key: number) => (
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
                header: 'Customer Address',
                accessorKey: 'location_url',
                cell: ({ getValue }: any) => (
                    <a href={getValue()} target="_blank" rel="noreferrer">
                        <div className="flex justify-center">
                            <FaMapMarkedAlt className="text-xl" />
                        </div>
                    </a>
                ),
            },

            // { header: 'Picker Name', accessorKey: 'picker.name' },

            {
                header: 'Order Total',
                accessorKey: 'payment.amount',
                cell: ({ row }: any) => {
                    return <>{`Rs.${row?.original?.payment.amount}`}</>
                },
            },
        ]

        const resolveNestedValue = (obj: any, path: string) => path.split('.').reduce((acc, key) => acc?.[key], obj)

        const dynamicColumns =
            currentSelectedTable?.map((tableVal) => {
                if (tableVal === OrderColumns.DELAY_STATUS) {
                    return {
                        header: 'Delay Status',
                        accessorKey: 'logistic.is_delayed',
                        cell: ({ row }: any) => {
                            return <>{row?.original?.logistic?.is_delayed ? 'delayed' : 'On Time'}</>
                        },
                    }
                }
                if (tableVal === OrderColumns.TOTAL_TIME_TAKEN) {
                    return {
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
                    }
                }
                if (tableVal === OrderColumns.DELAY_TIME) {
                    return {
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

                            return <>{difference >= 0 ? `${difference?.toFixed(2)} mins` : '0 mins'}</>
                        },
                    }
                }
                if (tableVal === OrderColumns.ETA_DROP_OFF) {
                    return {
                        header: 'ETA DropOff Time',
                        accessorKey: 'logistic.eta_dropoff_time',
                        cell: ({ row }: any) => (
                            <div>
                                {row?.original?.logistic?.eta_dropoff_time
                                    ? moment(row?.original?.logistic?.eta_dropoff_time).format('YYYY-MM-DD hh:mm:ss a')
                                    : 'N/A'}
                            </div>
                        ),
                    }
                }
                if (tableVal === OrderColumns.ESTIMATE_DELIVERY) {
                    return {
                        header: 'Estimate Delivery Time',
                        accessorKey: 'eta_duration',
                        cell: ({ row }: any) => {
                            const val =
                                typeof row?.original?.eta_duration === 'number'
                                    ? row?.original?.eta_duration?.toFixed(2)
                                    : Number(row?.original?.eta_duration).toFixed(2)
                            return <div>{row?.original?.eta_duration ? `${val} mins` : 'N/A'}</div>
                        },
                    }
                }
                if (tableVal === OrderColumns.AREA) {
                    return {
                        header: 'Area/Pincode',
                        accessorKey: 'area',
                        cell: ({ row }: any) => (
                            <div>
                                {row?.original?.area}/{row?.original?.pincode}
                            </div>
                        ),
                    }
                }
                if (tableVal === OrderColumns.UPDATE_DATE) {
                    return {
                        header: 'Last Update',
                        accessorKey: 'update_date',
                        cell: ({ getValue }: any) => <span>{moment(getValue()).format('YYYY-MM-DD hh:mm:ss a')}</span>,
                    }
                }

                if (tableVal === OrderColumns.PRINTER) {
                    return {
                        header: 'Printer',
                        accessorKey: 'invoice_id',
                        cell: ({ row }: any) => (
                            <div className="flex items-center justify-center">
                                <BsFillPrinterFill
                                    className="text-xl text-blue-500 cursor-pointer"
                                    onClick={() =>
                                        generatePrintingData(
                                            row?.original?.invoice_id,
                                            row?.original?.payment?.mode,
                                            row?.original?.payment?.status,
                                            row?.original?.order_items_count,
                                            row?.original?.payment?.amount,
                                        )
                                    }
                                />
                            </div>
                        ),
                    }
                }

                return {
                    header: tableVal.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()),

                    accessorKey: tableVal,

                    cell: ({ row }: any) => {
                        const value = resolveNestedValue(row.original, tableVal)

                        if (value === null || value === undefined) return 'N/A'

                        if (Array.isArray(value)) {
                            return value.length ? value.join(', ') : 'N/A'
                        }

                        return value
                    },
                }
            }) ?? []

        return [...baseColumns, ...dynamicColumns]
    }, [currentSelectedTable])
}
