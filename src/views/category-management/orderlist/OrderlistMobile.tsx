import moment from 'moment'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface props {
    orders: any
}

const OrderlistMobile = ({ orders }: props) => {
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

                    return (
                        <div
                            key={item.invoice_id}
                            className={
                                item?.status === 'PENDING' && differenceInSeconds > 60
                                    ? 'bg-red-400 dark:bg-gray-800 rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg'
                                    : 'bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg'
                            }
                            onClick={() => handleOrderCall(item.invoice_id)}
                        >
                            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                                Invoice ID:{' '}
                                <span className="px-2 py-1 bg-red-500 text-white dark:bg-red-700 dark:text-gray-200 rounded-lg">
                                    {item.invoice_id}
                                </span>
                            </h3>
                            <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Order Details</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 text-sm">
                                    <div className="flex justify-between xl:justify-normal xl:gap-6 sm:items-center">
                                        <span className="font-medium text-gray-700 dark:text-gray-400">Status:</span>
                                        <span className="text-blue-600 dark:text-blue-400 font-bold">{item.status}</span>
                                    </div>
                                    <div className="flex justify-between xl:justify-normal xl:gap-6 sm:items-center">
                                        <span className="font-medium text-gray-700 dark:text-gray-400">Mobile:</span>
                                        <span className="text-purple-600 dark:text-purple-400 font-bold">{item.user?.mobile}</span>
                                    </div>
                                    <div className="flex justify-between xl:justify-normal xl:gap-6 sm:items-center">
                                        <span className="font-medium text-gray-700 dark:text-gray-400">Customer:</span>
                                        <span className="text-green-600 dark:text-green-400 font-bold">{item.user.name}</span>
                                    </div>
                                    <div className="flex justify-between xl:justify-normal xl:gap-6 sm:items-center">
                                        <span className="font-medium text-gray-700 dark:text-gray-400">Delivery Type</span>
                                        <span className="text-teal-600 dark:text-teal-400 font-bold">{item.delivery_type}</span>
                                    </div>
                                    <div className="flex justify-between xl:justify-normal xl:gap-6 sm:items-center">
                                        <span className="font-medium text-gray-700 dark:text-gray-400">Order Total:</span>
                                        <span className="text-red-600 dark:text-red-400 font-bold">₹{item.amount}</span>
                                    </div>
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
