import React, { useEffect, useState } from 'react'
import { fetchReturnOrders } from '@/store/slices/returnOrderDetails/returnOrderDetails'
import { useAppDispatch, useAppSelector } from '@/store'
import { useParams } from 'react-router-dom'
import { ReturnOrderState } from '@/store/types/returnDetails.types'
import { HiOutlineCalendar } from 'react-icons/hi'
import moment from 'moment'
import ReturnProductsDetails from './components/ReturnProductsDetails'
import ReturnSummary from './components/ReturnSummary'
import ReturnUserInfo from './components/ReturnUserInfo'
import ReturnRunnerDetails from './components/ReturnRunnerDetails'
import RefundActivity from './components/RefundActivity'

const scheduleSlots: any = {
    '1': { start: '10:00 AM', end: '01:00 PM' },
    '2': { start: '01:00 PM', end: '04:00 PM' },
    '3': { start: '04:00 PM', end: '07:00 PM' },
    '4': { start: '07:00 PM', end: '10:00 PM' },
}

const ReturnOrderDetails = () => {
    const { return_order_id } = useParams()
    const dispatch = useAppDispatch()
    const returnOrder = useAppSelector<ReturnOrderState>((state) => state.returnOrders)
    const returnDetails = returnOrder?.returnOrders

    useEffect(() => {
        dispatch(fetchReturnOrders(return_order_id))
    }, [return_order_id])

    return (
        <div>
            <div className="flex flex-col justify-between xl:flex-row xl:justify-between">
                <div className="flex flex-col gap-1">
                    <div className="flex gap-2 font-bold text-xl">
                        Return Order: #<span className="font-normal">{returnDetails?.return_order_id}</span>
                    </div>
                    <div className="">
                        Original Order:
                        <a href={`/app/orders/${returnDetails?.order.invoice_id}`} className="text-blue-500 hover:underline">
                            {returnDetails?.order.invoice_id}
                        </a>
                    </div>
                    <div>
                        <span className="flex items-center">
                            <HiOutlineCalendar className="text-lg" />
                            <span className="ltr:ml-1 rtl:mr-1">{moment(returnDetails?.create_date).format('MM/DD/YYYY hh:mm:ss a')}</span>
                        </span>
                    </div>
                    {returnDetails?.pickup_schedule_date ? (
                        <>
                            <span className="flex items-center justify-center md:justify-start text-gray-600 text-sm">
                                <span className="font-bold ">Pickup Date:</span>
                                <span className="ml-2 ">{returnDetails?.pickup_schedule_date}</span>
                            </span>
                        </>
                    ) : (
                        ''
                    )}
                    {returnDetails?.pickup_schedule_slot ? (
                        <>
                            <span className="flex items-center justify-center md:justify-start text-gray-600 text-sm">
                                <span className="font-bold text-xl">Schedule Slot:</span>
                                <span className="ml-2 text-xl">
                                    {scheduleSlots[returnDetails?.pickup_schedule_slot]
                                        ? `${scheduleSlots[returnDetails?.pickup_schedule_slot].start} - ${scheduleSlots[returnDetails?.pickup_schedule_slot].end}`
                                        : 'Invalid slot'}
                                </span>
                            </span>
                        </>
                    ) : (
                        ''
                    )}
                </div>
            </div>

            {/* Components */}
            <div className="flex flex-col xl:flex-row gap-8 mt-10 ">
                <div className="w-full bg-gray-100 p-4 rounded-lg shadow-md dark:bg-gray-900">
                    <ReturnProductsDetails />
                    <RefundActivity data={returnDetails?.log} status="completed" task_id={returnDetails?.id} latitude="11" longitude="22" />
                </div>
                <div className="flex flex-col bg-gray-100 p-4 rounded-lg shadow-md gap-5 w-full xl:w-1/3 dark:bg-gray-900">
                    <ReturnUserInfo />
                    <ReturnRunnerDetails />
                    <ReturnSummary />
                </div>
            </div>
        </div>
    )
}

export default ReturnOrderDetails
