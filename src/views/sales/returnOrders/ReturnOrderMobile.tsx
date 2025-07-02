/* eslint-disable @typescript-eslint/no-explicit-any */
import moment from 'moment'

interface props {
    orders: any
}

const scheduleSlots: any = {
    '1': { start: '10:00 AM', end: '01:00 PM' },
    '2': { start: '01:00 PM', end: '04:00 PM' },
    '3': { start: '04:00 PM', end: '07:00 PM' },
    '4': { start: '07:00 PM', end: '10:00 PM' },
}

const ReturnOrderlistMobile = ({ orders }: props) => {
    return (
        <div>
            <div className="space-y-6 xl:mx-20">
                {orders.map((item: any) => {
                    const log = item?.pickup_schedule_slot

                    const schedule = scheduleSlots[log]

                    return (
                        <div
                            key={item.return_order_id}
                            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg"
                        >
                            <div className="flex flex-col">
                                <h3 className="text-xl flex gap-2 items-center font-semibold text-gray-800 dark:text-gray-200 mb-4">
                                    Return:{' '}
                                    <a
                                        href={`/app/returnOrders/${item?.return_order_id}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-white bg-red-600 flex items-center justify-center px-2 py-1 rounded-[7px] font-semibold cursor-pointer"
                                    >
                                        {item?.return_order_id}
                                    </a>
                                </h3>
                                <h3 className="text-xl flex gap-2 items-center font-semibold text-gray-800 dark:text-gray-200 mb-4">
                                    Invoice ID:{' '}
                                    <a
                                        href={`/app/orders/${item?.order}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-white bg-red-600 flex items-center justify-center px-2 py-1 rounded-[7px] font-semibold cursor-pointer"
                                    >
                                        {item?.order}
                                    </a>
                                </h3>
                            </div>
                            <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Order Details</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-sm">
                                    <div className="flex gap-3 xl:justify-normal xl:gap-6 sm:items-center">
                                        <span className="font-medium text-gray-700 dark:text-gray-400">Status:</span>
                                        <span className="text-blue-600 dark:text-blue-400 font-bold">{item?.status}</span>
                                    </div>
                                    <div className="flex gap-3 xl:justify-normal xl:gap-6 sm:items-center">
                                        <span className="font-medium text-gray-700 dark:text-gray-400">Return Type:</span>
                                        <span className="text-purple-600 dark:text-purple-400 font-bold">{item?.return_type}</span>
                                    </div>
                                    <div className="flex gap-3 xl:justify-normal xl:gap-6 sm:items-center">
                                        <span className="font-medium text-gray-700 dark:text-gray-400">Slot:</span>
                                        <span className="text-green-600 dark:text-green-400 font-bold">
                                            {schedule ? `${schedule.start} - ${schedule.end}` : 'Not Scheduled'}
                                        </span>
                                    </div>
                                    <div className="flex gap-3 xl:justify-normal xl:gap-6 sm:items-center">
                                        <span className="font-medium text-gray-700 dark:text-gray-400">Date:</span>
                                        <span className="text-teal-600 dark:text-teal-400 font-bold">
                                            {moment(item?.create_date).format('YYYY-MM-DD hh:mm:ss a')}
                                        </span>
                                    </div>
                                    <div className="flex gap-3 xl:justify-normal xl:gap-6 sm:items-center">
                                        <span className="font-medium text-gray-700 dark:text-gray-400">Runner Name:</span>
                                        <span className="text-purple-600 dark:text-purple-400 font-bold">
                                            {item?.return_order_delivery?.map((item: any) => item?.runner_name)}
                                        </span>
                                    </div>
                                    <div className="flex gap-3 xl:justify-normal xl:gap-6 sm:items-center">
                                        <span className="font-medium text-gray-700 dark:text-gray-400">Return Mobile:</span>
                                        <span className="text-purple-600 dark:text-purple-400 font-bold">
                                            {item?.return_order_delivery?.map((item: any) => item?.runner_phone_number)}
                                        </span>
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

export default ReturnOrderlistMobile
