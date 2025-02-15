import moment from 'moment'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface props {
    orders: any
    handleNumberClick: any
}

const OrderlistMobile = ({ orders, handleNumberClick }: props) => {
    const [isPending, setIsPending] = useState(false)
    const navigate = useNavigate()

    const handleOrderCall = (id: any) => {
        navigate(`/app/orders/${id}`)
    }

    return (
        <div>
            <div className="space-y-6 xl:mx-20">
                {orders.map((item: any) => {
                    const createDate = moment(item.create_date)
                    const currentDate = moment()
                    const differenceInSeconds = currentDate.diff(createDate, 'seconds')
                    const orderCount = item?.user_order_count

                    return (
                        <div
                            key={item.invoice_id}
                            className={
                                item?.status === 'PENDING' && differenceInSeconds > 60
                                    ? 'bg-red-300 dark:bg-gray-800 rounded-lg shadow-md p-2 cursor-pointer hover:shadow-lg'
                                    : 'bg-white dark:bg-gray-800 rounded-lg shadow-md p-2 cursor-pointer hover:shadow-lg'
                            }
                        >
                            <h3
                                className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4"
                                onClick={() => handleOrderCall(item.invoice_id)}
                            >
                                Invoice ID:{' '}
                                <span className="px-2 py-1 bg-red-500 text-white dark:bg-red-700 dark:text-gray-200 rounded-lg">
                                    {item.invoice_id}
                                </span>
                            </h3>
                            <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
                                <div className="grid grid-cols-1 gap-6 text-sm sm:text-base">
                                    {[
                                        { label: 'Status', value: item.status },
                                        { label: 'Date', value: moment(item?.create_date).format('YYYY-MM-DD hh:mm:ss a') },
                                        {
                                            label: 'Mobile',
                                            value: (
                                                <span
                                                    className={`font-bold transition-colors cursor-pointer ${
                                                        orderCount > 1 ? 'text-green-500 hover:text-green-400' : 'text-gray-500'
                                                    }`}
                                                    onClick={() => handleNumberClick(item.user?.mobile)}
                                                >
                                                    {item.user?.mobile} ({item?.user_order_count})
                                                </span>
                                            ),
                                        },
                                        { label: 'Customer', value: item.user.name },
                                        { label: 'Delivery Type', value: item.delivery_type },
                                        { label: 'Payment Mode', value: item?.payment?.mode },
                                        { label: 'Payment Status', value: item?.payment?.status },
                                        { label: 'Picker:', value: item?.picker.name },
                                        { label: 'Total Items', value: item?.order_items.length },
                                        { label: 'Order Total', value: `₹${item.amount}` },
                                        { label: 'Area/pin', value: `${item.area}/${item.pincode}` },
                                    ].map(({ label, value }, index) => (
                                        <div key={index} className="flex justify-between items-center">
                                            <span className="font-medium text-gray-600 dark:text-gray-400">{label}:</span>
                                            <span className="font-bold text-gray-900 dark:text-white bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text ">
                                                {value}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default OrderlistMobile
