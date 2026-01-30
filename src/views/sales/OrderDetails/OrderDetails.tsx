/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useMemo } from 'react'
import Loading from '@/components/shared/Loading'
import OrderProducts from './components/OrderProducts'
import PaymentSummary from './components/PaymentSummary'
import ShippingInfo from './components/ShippingInfo'
import Activity from './components/Activity'
import CustomerInfo from './components/CustomerInfo'
import { HiOutlineCalendar } from 'react-icons/hi'
import isEmpty from 'lodash/isEmpty'
import { useParams } from 'react-router-dom'
import moment from 'moment'
import ReturnOrderDrawer from './components/ReturnOrderDrawer'
import { FaDownload } from 'react-icons/fa'
import { EOrderStatus, scheduleSlots } from './orderList.common'
import { Button } from '@/components/ui'
import TrackModal from '@/views/slikkLogistics/taskTracking/TrackModal'
import OrderPickerSummary from './components/OrderPickersummary'
import OrderMap from './OrderMap'
import UtmModal from './components/UtmModal'
import TwoPointMap from './components/TwoPointMap'
import OrdersRiderActivity from './components/OrdersRiderActivity'
import { useFetchSingleData } from '@/commonHooks/useFetchSingleData'
import { useOrderDetailFunctions } from './orderDetailsUtils/useOrderDetailFunctions'
import RtoCancelModal from './orderDetailsUtils/RtoCancelModal'
import { TaskData } from '@/store/types/tasks.type'
import ItemConvertModal from './components/ItemConvertModal'
import { Order } from '@/store/types/newOrderTypes'
import { newOrderService } from '@/store/services/newOrderaService'
import DialogConfirm from '@/common/DialogConfirm'

const OrderDetails = () => {
    const { invoice_id } = useParams()
    const [data, setData] = useState<Order>()
    const [returnOrderDrawer, setReturnOrderDrawer] = useState(false)
    const [showCancelModal, setShowCancelModal] = useState(false)
    const [showUTMModal, setShowUTMModal] = useState(false)
    const [showCancelExchangeModal, setShowCancelExchangeModal] = useState(false)
    const [showRiderData, setShowRiderData] = useState(false)
    const [isMarketing, setIsMarketing] = useState(false)
    const orderDetailsApi = newOrderService.useGetOrderDetailsQuery({ order_id: invoice_id }, { skip: !invoice_id })

    const showRider = useMemo(() => {
        return (
            data?.status === EOrderStatus.delivery_created &&
            data?.logistic?.partner?.toLowerCase() === 'slikk' &&
            data?.logistic?.runner_phone_number === ''
        )
    }, [data?.logistic, data?.status])

    const showTicket = useMemo(() => {
        return data?.log?.some((item) => item?.status?.includes(EOrderStatus.packed)) && data?.utm_params?.ticket === true
    }, [data?.log, data?.utm_params])

    const showReturnOrder = useMemo(() => {
        return (
            data?.status === EOrderStatus.completed &&
            (data?.payment?.status === EOrderStatus.paid || data?.payment?.status === EOrderStatus.pod_paid)
        )
    }, [data?.status, data?.payment?.status])

    useEffect(() => {
        if (orderDetailsApi.isSuccess) {
            setData(orderDetailsApi.data.data)
        }
        if (showRider) {
            setShowRiderData(true)
        } else {
            setShowRiderData(false)
        }
    }, [orderDetailsApi.isSuccess, orderDetailsApi?.data?.data, showRider])

    const query = useMemo(() => {
        if (!data?.logistic?.task_id) return null
        return `/logistic/slikk/task?task_id=${data.logistic.task_id}`
    }, [data?.logistic?.task_id])

    const { data: taskData, refetch: refetchTask } = useFetchSingleData<TaskData>({
        url: query || '',
        pollingInterval: query ? 60000 : undefined,
    })

    const { handlemarkAsPaid, handlePODAction, handleDownload, handleConvert, handleMarketingOrder, OrderLink, OrderList } =
        useOrderDetailFunctions({ data, setShowCancelExchangeModal, setIsMarketing })

    useEffect(() => {
        if (orderDetailsApi.currentData) {
            refetchTask()
        }
    }, [orderDetailsApi.currentData])

    const OrderDetailUI = (data: Order) => {
        return (
            <div className="mb-8 flex flex-col justify-center xl:flex-row xl:justify-between">
                <div className="w-full xl:w-1/2">
                    <div className="flex flex-col md:flex-row items-center mb-4 xl:justify-between justify-center w-full">
                        <div className="text-3xl xl:flex-row font-bold text-gray-800 text-center md:text-left flex flex-col gap-2">
                            <span>Order</span>
                            <span className="ml-2 text-red-600 flex gap-3">
                                #{data.invoice_id}
                                <div>
                                    <button className="bg-none border-none text-md mt-1" onClick={handleDownload}>
                                        <FaDownload className="bg-none text-gray-700" />
                                    </button>
                                </div>
                                {showTicket ? (
                                    <div>
                                        <Button variant="reject" size="sm" onClick={() => setShowUTMModal(true)}>
                                            REMOVE TICKET
                                        </Button>
                                    </div>
                                ) : null}
                                <div>
                                    <Button
                                        variant={data?.is_internal_order ? 'yellow' : 'blue'}
                                        size="sm"
                                        onClick={() => setIsMarketing(true)}
                                    >
                                        {data?.is_internal_order ? 'Make Customer Level' : 'Mark as Marketing'}
                                    </Button>
                                </div>
                            </span>
                        </div>
                    </div>
                    <span className="flex items-center justify-center md:justify-start text-gray-600 text-sm">
                        <HiOutlineCalendar className="text-2xl" />
                        <span className="ml-2">{moment(data.create_date).format('MM/DD/YYYY hh:mm:ss a')}</span>
                    </span>
                    <br />
                    {data?.delivery_schedule_date && (
                        <span className="flex items-center justify-center md:justify-start text-gray-600 text-sm">
                            <span className="font-bold text-xl">Schedule Date:</span>
                            <span className="ml-2 text-xl">{data?.delivery_schedule_date}</span>
                        </span>
                    )}
                    {data?.delivery_schedule_slot ? (
                        <span className="flex items-center justify-center md:justify-start text-gray-600 text-sm">
                            <span className="font-bold text-xl">Schedule Slot:</span>

                            <span className="ml-2 text-xl">
                                {(() => {
                                    const slot = scheduleSlots[data.delivery_schedule_slot]
                                    return slot?.start && slot?.end ? `${slot.start} - ${slot.end}` : 'Invalid slot'
                                })()}
                            </span>
                        </span>
                    ) : (
                        <></>
                    )}
                </div>
                <div className="mt-4 md:mt-0 flex flex-col items-center xl:items-end gap-5 justify-center w-full xl:w-1/2">
                    <div className="flex gap-4">
                        {showReturnOrder && (
                            <Button variant="reject" size="sm" onClick={() => setReturnOrderDrawer(true)}>
                                Return/Exchange ORDER
                            </Button>
                        )}
                        {data.status !== EOrderStatus.declined && data.status !== EOrderStatus.cancelled && (
                            <Button variant="reject" size="sm" onClick={() => setShowCancelModal(true)}>
                                Cancel Order
                            </Button>
                        )}
                        {data?.delivery_type === EOrderStatus.exchange && (
                            <Button variant="reject" size="sm" onClick={() => setShowCancelExchangeModal(true)}>
                                CONVERT
                            </Button>
                        )}
                    </div>

                    {!!data?.return_order?.length && (
                        <>
                            <OrderList
                                title="Return Orders"
                                items={data.return_order.filter((item) => item?.status !== EOrderStatus.accepted)}
                                itemKey="return_order_id"
                                itemDisplayKey="return_order_id"
                                baseUrl="/app/returnOrders"
                                badgeVariant="red"
                            />
                            <OrderList
                                title="Unfulfilled Orders"
                                items={data.return_order.filter((item) => item?.status === EOrderStatus.accepted)}
                                itemKey="return_order_id"
                                itemDisplayKey="return_order_id"
                                baseUrl="/app/returnOrders"
                                badgeVariant="blue"
                            />
                        </>
                    )}

                    <OrderLink
                        label="Return Order"
                        value={data?.reference_return as string}
                        href={`/app/returnOrders/${data?.reference_return}`}
                    />

                    <OrderLink label="Split Order" value={data?.split_order_id as string} href={`/app/orders/${data?.split_order_id}`} />

                    {!!data?.exchange_order_id?.length && (
                        <OrderList
                            title="Exchange Orders"
                            items={data.exchange_order_id.map((id) => ({ id, exchange_order_id: id }))}
                            itemKey="id"
                            itemDisplayKey="exchange_order_id"
                            baseUrl="/app/orders"
                            badgeVariant="green"
                        />
                    )}

                    {data?.delivery_type === 'EXCHANGE' && (
                        <OrderLink
                            label="Original Order"
                            value={data?.original_order as string}
                            href={`/app/orders/${data?.original_order}`}
                        />
                    )}
                </div>
            </div>
        )
    }

    return (
        <div className="w-full bg-gray-50 dark:bg-gray-950 px-4 xl:px-6 py-6 scrollbar-hide">
            <Loading loading={orderDetailsApi.isLoading}>
                {!isEmpty(data) && (
                    <>
                        <div className="mb-6">{OrderDetailUI(data)}</div>
                        <div className="flex gap-6 overflow-x-auto scrollbar-hide">
                            <div className="flex-1 space-y-6 min-w-[900px]">
                                <div className="bg-white dark:bg-gray-900 shadow-sm border border-gray-100 dark:border-gray-800 rounded-2xl">
                                    <div className="p-5">
                                        <OrderProducts data={data.order_items || []} invoice_id={data.invoice_id} status={data.status} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-white dark:bg-gray-900 shadow-sm border border-gray-100 dark:border-gray-800 rounded-2xl">
                                        <div className="p-6">
                                            <CustomerInfo
                                                user={data.user}
                                                billing_address={data.billing_address}
                                                store={data.store}
                                                location_url={data.location_url}
                                                delivery_type={data.delivery_type}
                                                distance={data?.distance as number}
                                                alternate_number={taskData?.drop_details?.contact_number}
                                            />
                                        </div>
                                    </div>
                                    <div className="bg-white dark:bg-gray-900 shadow-sm border border-gray-100 dark:border-gray-800 rounded-2xl">
                                        <div className="p-6">
                                            <ShippingInfo
                                                data={data.logistic}
                                                logistic_partner={data.logistic?.partner}
                                                delivery_type={data.delivery_type}
                                                tnb_return_otp={data?.tnb_return_otp}
                                                setShowRiderModal={setShowRiderData}
                                                rider={data.rider}
                                            />
                                        </div>
                                    </div>
                                    <div className="bg-white dark:bg-gray-900 shadow-sm border border-gray-100 dark:border-gray-800 rounded-2xl">
                                        <div className="p-6">
                                            <PaymentSummary
                                                data={data.payment}
                                                tax={data.tax}
                                                delivery={data.delivery}
                                                amount={data.amount}
                                                coupon_discount={data.coupon_discount}
                                                loyalty_discount={data.loyalty_discount}
                                                points_discount={data.points_discount}
                                                handleMarkAsPaid={handlemarkAsPaid}
                                                status={data.status}
                                                mainData={data}
                                                handlePODAction={handlePODAction}
                                                order_id={data.order_id}
                                                gateway_transaction_id={data?.payment?.gateway_transaction_id || 'N/A'}
                                            />
                                        </div>
                                    </div>
                                    <div className="bg-white dark:bg-gray-900 shadow-sm border border-gray-100 dark:border-gray-800 rounded-2xl">
                                        <div className="p-6">
                                            <OrderPickerSummary data={data} />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col xl:flex-row gap-6">
                                    <div className="flex gap-4">
                                        <div className="bg-white dark:bg-gray-900 shadow-sm border border-gray-100 dark:border-gray-800 rounded-2xl p-4">
                                            <Activity
                                                mainData={data}
                                                data={data.log}
                                                status={data.status}
                                                invoice_id={data.invoice_id}
                                                delivery_type={data.delivery_type}
                                                refetch={orderDetailsApi.refetch}
                                            />
                                        </div>

                                        {data?.logistic && (
                                            <div className="bg-white dark:bg-gray-900 shadow-sm border border-gray-100 dark:border-gray-800 rounded-2xl p-4 w-[240px]">
                                                <OrdersRiderActivity eventLogs={taskData} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 bg-white dark:bg-gray-900 shadow-sm border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden">
                                        <div className="h-[600px]">
                                            {data?.logistic === null && (
                                                <TwoPointMap
                                                    lat={data?.latitude}
                                                    long={data?.longitude}
                                                    storeLat={data?.store.latitude}
                                                    storeLong={data?.store.longitude}
                                                />
                                            )}

                                            {data?.logistic?.partner === 'Slikk' && (
                                                <OrderMap task_id={data?.logistic?.task_id} taskData={taskData} />
                                            )}

                                            {data?.logistic?.partner !== 'Slikk' && (
                                                <iframe
                                                    allowFullScreen
                                                    src={data?.logistic?.tracking_url}
                                                    className="w-full h-full border-none"
                                                    title="Live Order Tracking"
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <ReturnOrderDrawer
                                isOpen={returnOrderDrawer}
                                setIsOpen={setReturnOrderDrawer}
                                product={data.order_items || []}
                                invoice_id={invoice_id}
                                delivery_type={data?.delivery_type}
                            />

                            <RtoCancelModal
                                isCancel
                                isOpen={showCancelModal}
                                invoice_id={invoice_id || ''}
                                orderItems={data?.order_items}
                                setIsOpen={setShowCancelModal}
                                status={data?.status}
                            />

                            <ItemConvertModal
                                isOpen={showCancelExchangeModal}
                                setIsOpen={setShowCancelExchangeModal}
                                handleConvert={handleConvert}
                            />

                            <TrackModal
                                isOrder
                                showTaskModal={showRiderData}
                                setShowAssignModal={setShowRiderData}
                                taskId={data?.logistic?.task_id}
                                handleCloseModal={() => setShowRiderData(false)}
                                storeLat={data?.latitude}
                                storeLong={data?.longitude}
                            />

                            <UtmModal isOpen={showUTMModal} setIsOpen={setShowUTMModal} orderData={data} />
                            {isMarketing && (
                                <DialogConfirm
                                    IsOpen={isMarketing}
                                    setIsOpen={setIsMarketing}
                                    isProceed
                                    headingName={
                                        data?.is_internal_order ? 'Make this order Customer level' : 'Change this order to marketing level'
                                    }
                                    label={`Are you sure you want to change this order to ${data?.is_internal_order ? 'Customer level' : 'marketing level'}`}
                                    onDialogOk={handleMarketingOrder}
                                />
                            )}
                        </div>
                    </>
                )}
            </Loading>
        </div>
    )
}

export default OrderDetails
