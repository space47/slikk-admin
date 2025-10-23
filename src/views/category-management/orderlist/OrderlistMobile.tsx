/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import moment from 'moment'
import { IoMdRefresh } from 'react-icons/io'
import { useNavigate } from 'react-router-dom'
import { Tooltip } from '@/components/ui'
import { Order } from './commontypes'

interface Props {
    orders: Order[]
    handleNumberClick: (number: number) => Promise<void>
    handleSyncDistance: (invoice_id: string | number) => Promise<void>
}

const OrderlistMobile: React.FC<Props> = ({ orders, handleNumberClick, handleSyncDistance }) => {
    const navigate = useNavigate()

    const handleOrderNavigation = (id: string) => navigate(`/app/orders/${id}`)

    return (
        <div className="space-y-6 xl:mx-20">
            {orders?.map((item) => {
                const createDate = moment(item.create_date)
                const timeDiffSeconds = moment().diff(createDate, 'seconds')
                const isDelayedPending = item.status === 'PENDING' && timeDiffSeconds > 60

                const cardBase = 'rounded-lg shadow-md p-3 cursor-pointer transition-transform transform hover:scale-[1.01] hover:shadow-lg'
                const cardColor = isDelayedPending
                    ? 'bg-red-50 border border-red-300 dark:bg-red-900/30'
                    : 'bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700'

                const infoList = [
                    { label: 'Status', value: item.status },
                    {
                        label: 'Date',
                        value: moment(item.create_date).format('YYYY-MM-DD hh:mm:ss a'),
                    },
                    {
                        label: 'Mobile',
                        value: (
                            <span
                                className={`font-semibold cursor-pointer ${
                                    item.user_order_count > 1 ? 'text-green-600 hover:text-green-500' : 'text-gray-600'
                                }`}
                                onClick={() => handleNumberClick(item.user.mobile as number)}
                            >
                                {item.user.mobile} ({item.user_order_count})
                            </span>
                        ),
                    },
                    { label: 'Customer', value: item.user.name },
                    {
                        label: 'Delivery Type',
                        value: (
                            <div className="flex items-center gap-2">
                                <span>{item.delivery_type}</span>
                                {item.distance > 0 ? (
                                    <span className="text-sm text-gray-700 dark:text-gray-300">({item.distance} km)</span>
                                ) : (
                                    <Tooltip title="Refresh distance">
                                        <button
                                            className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white p-1 rounded-lg"
                                            onClick={() => handleSyncDistance(item.invoice_id)}
                                        >
                                            <IoMdRefresh size={16} />
                                        </button>
                                    </Tooltip>
                                )}
                            </div>
                        ),
                    },
                    { label: 'Payment Mode', value: item.payment?.mode || 'N/A' },
                    { label: 'Payment Status', value: item.payment?.status || 'N/A' },
                    { label: 'Picker', value: item.picker?.name || 'Unassigned' },
                    { label: 'Total Items', value: item.order_items_count },
                    { label: 'Order Total', value: `₹${item.amount}` },
                    { label: 'Area / PIN', value: `${item.area} / ${item.pincode}` },
                ]

                return (
                    <div
                        key={item.invoice_id}
                        className={`${cardBase} ${cardColor}`}
                        onClick={() => handleOrderNavigation(item.invoice_id)}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">Invoice ID:</h3>
                            <a
                                href={`/app/orders/${item.invoice_id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-gradient-to-r from-red-600 to-red-700 text-white text-sm font-semibold px-3 py-1.5 rounded-md shadow-sm hover:opacity-90"
                            >
                                {item.invoice_id}
                            </a>
                        </div>

                        {/* Details */}
                        <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 grid grid-cols-1 gap-3">
                            {infoList.map(({ label, value }, i) => (
                                <div
                                    key={i}
                                    className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 last:border-0 pb-2"
                                >
                                    <span className="text-gray-600 dark:text-gray-400 font-medium">{label}:</span>
                                    <span className="text-gray-900 dark:text-white font-semibold text-sm text-right">{value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default OrderlistMobile
