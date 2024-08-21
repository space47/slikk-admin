import React, { useEffect } from 'react'
import { fetchReturnOrders } from '@/store/slices/returnOrderDetails/returnOrderDetails'
import { useAppDispatch, useAppSelector } from '@/store'
import { useParams } from 'react-router-dom'
import { ReturnOrderState } from '@/store/types/returnDetails.types'
import { HiOutlineCalendar } from 'react-icons/hi'
import moment from 'moment'
import ReturnProductsDetails from './components/ReturnProductsDetails'
import ReturnSummary from './components/ReturnSummary'

const ReturnOrderDetails = () => {
    const { return_order_id } = useParams()
    const dispatch = useAppDispatch()
    const returnOrder = useAppSelector<ReturnOrderState>(
        (state) => state.returnOrders,
    )
    const returnDetails = returnOrder?.returnOrders
    useEffect(() => {
        dispatch(fetchReturnOrders(return_order_id))
    }, [dispatch, return_order_id])

    console.log('ordersss', returnDetails?.create_date)

    return (
        <div>
            <div className="flex flex-col gap-1">
                <div className="flex gap-2 font-bold text-xl">
                    Return Order: #
                    <span className="font-normal">
                        {returnDetails?.return_order_id}
                    </span>
                </div>
                <div>
                    <span className="flex items-center">
                        <HiOutlineCalendar className="text-lg" />
                        <span className="ltr:ml-1 rtl:mr-1">
                            {moment(returnDetails?.create_date).format(
                                'MM/DD/YYYY hh:mm:ss a',
                            )}
                        </span>
                    </span>
                </div>
            </div>

            {/* Components */}
            <div className="flex gap-5 justify-around mt-10">
                <ReturnProductsDetails />
                <ReturnSummary />
            </div>
        </div>
    )
}

export default ReturnOrderDetails
