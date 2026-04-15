/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { HiOutlineCalendar } from 'react-icons/hi'
import moment from 'moment'
import ReturnProductsDetails from './components/ReturnProductsDetails'
import ReturnSummary from './components/ReturnSummary'
import ReturnUserInfo from './components/ReturnUserInfo'
import ReturnRunnerDetails from './components/ReturnRunnerDetails'
import RefundActivity from './components/RefundActivity'
import { useFetchSingleData } from '@/commonHooks/useFetchSingleData'
import OrdersRiderActivity from '../../OrderDetails/components/OrdersRiderActivity'
import { Card } from '@/components/ui'
import { returnOrderDataService } from '@/store/services/returnOrderService'
import { ReturnOrder } from '@/store/types/returnOrderData.types'
import LoadingSpinner from '@/common/LoadingSpinner'
import AccessDenied from '@/views/pages/AccessDenied'
import NotFoundData from '@/views/pages/NotFound/Notfound'
import ReturnMap from './components/ReturnMap'

const ReturnOrderDetails = () => {
    const { return_order_id } = useParams()
    const [returnDetails, setReturnDetails] = useState<ReturnOrder>()
    const returnApi = returnOrderDataService.useReturnDetailsQuery({ return_id: return_order_id as string }, { skip: !return_order_id })

    useEffect(() => {
        if (returnApi.isSuccess) {
            setReturnDetails(returnApi?.data?.data)
        }
    }, [returnApi.isSuccess, returnApi?.data?.data])

    const query = useMemo(() => {
        return `/logistic/slikk/task?task_id=${returnDetails?.return_order_delivery[0]?.task_id}`
    }, [returnDetails?.return_order_delivery])

    const { data: taskData, refetch: refetchTask } = useFetchSingleData<any>({
        url: query || '',
        pollingInterval: query ? 60000 : undefined,
        skip: !returnDetails?.return_order_delivery[0]?.task_id,
    })

    useEffect(() => {
        if (returnApi.currentData) {
            refetchTask()
        }
    }, [returnApi.currentData])

    const refetchAllData = () => {
        returnApi.refetch()
        refetchTask()
    }
    if (returnApi.isLoading) {
        return <LoadingSpinner />
    }

    if (returnApi.isError) {
        if (returnApi.error && 'status' in returnApi.error && returnApi.error.status === 403) {
            return <AccessDenied />
        } else {
            return <NotFoundData />
        }
    }

    return (
        <div>
            <div className="flex flex-col gap-4 ">
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
                    {returnDetails?.exchange_order && (
                        <div className="">
                            Exchange Order:
                            <a href={`/app/orders/${returnDetails?.exchange_order}`} className="text-blue-500 hover:underline">
                                {returnDetails?.exchange_order}
                            </a>
                        </div>
                    )}
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
                                <span className="ml-2 text-xl">{returnDetails?.pickup_schedule_slot}:00:00</span>
                            </span>
                        </>
                    ) : (
                        ''
                    )}
                </div>
                {returnDetails?.order?.store && (
                    <>
                        <div className="w-full xl:w-1/2 md:w-1/2">
                            <Card className="shadow-md">
                                <div>
                                    <span className="font-semibold">Store Name</span>: {returnDetails?.order?.store?.name}
                                </div>
                                <div>
                                    {' '}
                                    <span className="font-semibold">Store code:</span> {returnDetails?.order?.store?.code}
                                </div>
                                <div>
                                    {' '}
                                    <span className="font-semibold">FulFillment Center:</span>{' '}
                                    {returnDetails?.order?.store?.is_fulfillment_center ? 'Yes' : 'No'}
                                </div>
                            </Card>
                        </div>
                    </>
                )}
            </div>

            <div className="flex flex-col xl:flex-row gap-8 mt-10 ">
                <div className="w-full bg-gray-100 p-4 rounded-lg shadow-md dark:bg-gray-900">
                    <ReturnProductsDetails
                        task_id={returnDetails?.return_order_delivery[0]?.task_id}
                        returnDetails={returnDetails as ReturnOrder}
                        returnOrderId={return_order_id as any}
                    />
                    <div className="flex xl:flex-row xl:gap-10 flex-col gap-5">
                        <RefundActivity
                            returnDetails={returnDetails as ReturnOrder}
                            returnOrderItems={returnDetails?.return_order_items || []}
                            refetch={returnApi.refetch}
                            deliveryOtp={returnDetails?.delivery_otp}
                        />

                        <div>
                            {returnDetails?.return_order_delivery.length !== 0 && (
                                <div className=" mt-10">
                                    {returnDetails?.return_order_delivery === null && (
                                        <>
                                            <div className="flex font-bold mt-24 justify-center xl:h-screen items-center text-red-700">
                                                No Logistic Data Created
                                            </div>
                                        </>
                                    )}
                                    {returnDetails?.return_order_delivery[0]?.partner === 'Slikk' && (
                                        <div className="xl:w-[800px]">
                                            <ReturnMap
                                                task_id={returnDetails?.return_order_delivery[0]?.task_id as string}
                                                taskData={taskData}
                                                refetchAllData={refetchAllData}
                                            />
                                        </div>
                                    )}
                                    {returnDetails?.return_order_delivery[0]?.partner !== 'Slikk' && (
                                        <div className="h-[300px] xl:w-[600px]">
                                            <iframe
                                                src={returnDetails?.return_order_delivery[0]?.tracking_url}
                                                style={{ width: '100%', height: '100%', border: 'none' }}
                                                title="Live Order Tracking"
                                            />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                    {taskData?.event_logs?.length > 0 && (
                        <div className="mt-6">
                            <OrdersRiderActivity taskData={taskData} />
                        </div>
                    )}
                </div>
                <div className="flex flex-col bg-gray-100 p-4 rounded-lg shadow-md gap-5 w-full xl:w-1/3 dark:bg-gray-900">
                    <ReturnUserInfo returnOrder={returnDetails as ReturnOrder} />
                    <ReturnRunnerDetails returnOrder={returnDetails as ReturnOrder} />
                    <ReturnSummary returnOrder={returnDetails as ReturnOrder} />
                </div>
            </div>
        </div>
    )
}

export default ReturnOrderDetails
