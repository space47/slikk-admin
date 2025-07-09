/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useMemo } from 'react'
import Loading from '@/components/shared/Loading'
import Container from '@/components/shared/Container'
import DoubleSidedImage from '@/components/shared/DoubleSidedImage'
import OrderProducts from './components/OrderProducts'
import PaymentSummary from './components/PaymentSummary'
import ShippingInfo from './components/ShippingInfo'
import Activity from './components/Activity'
import CustomerInfo from './components/CustomerInfo'
import { HiOutlineCalendar } from 'react-icons/hi'
import isEmpty from 'lodash/isEmpty'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { useParams, useNavigate } from 'react-router-dom'
import moment from 'moment'
import ReturnOrderDrawer from './components/ReturnOrderDrawer'
import CancelModal from './components/CancelModal'
import { FaDownload } from 'react-icons/fa'
import { notification } from 'antd'
import { SalesOrderDetailsResponse, scheduleSlots } from './orderList.common'
import { Button, Dialog } from '@/components/ui'
import TrackModal from '@/views/slikkLogistics/taskTracking/TrackModal'
import OrderPickerSummary from './components/OrderPickersummary'
import OrderMap from './OrderMap'
import UtmModal from './components/UtmModal'
import TwoPointMap from './components/TwoPointMap'
import OrdersRiderActivity from './components/OrdersRiderActivity'
import { useFetchSingleData } from '@/commonHooks/useFetchSingleData'
import { commonDownload } from '@/common/commonDownload'
// import { string } from 'yup'

const OrderDetails = () => {
    const navigate = useNavigate()
    const { invoice_id } = useParams()
    const [returnOrderDrawer, setReturnOrderDrawer] = useState(false)
    const [showCancelModal, setShowCancelModal] = useState(false)
    const [showUTMModal, setShowUTMModal] = useState(false)
    const [showCancelExchangeModal, setShowCancelExchangeModal] = useState(false)
    const [showRiderData, setShowRiderData] = useState(false)

    const queryOrders = useMemo(() => {
        return `merchant/order/${invoice_id}`
    }, [invoice_id])
    const { data: data, loading } = useFetchSingleData<SalesOrderDetailsResponse>({ url: queryOrders })

    const query = useMemo(() => {
        if (!data?.logistic?.task_id) return null
        return `/logistic/slikk/task?task_id=${data.logistic.task_id}`
    }, [data?.logistic?.task_id])

    const { data: taskData } = useFetchSingleData<any>({
        url: query!,
        pollingInterval: query ? 60000 : undefined,
    })
    const handlemarkAsPaid = async () => {
        try {
            const response = await axioisInstance.post(`/user/order/${invoice_id}/payment/status`)
            notification.success({ message: response.data.message || 'Successfully markded as Paid' })
            navigate(0)
        } catch (error) {
            console.log(error)
        }
    }

    const handlePODAction = async () => {
        try {
            const body = { action: 'MARK_POD_COMPLETE' }
            const response = await axioisInstance.patch(`/merchant/order/${invoice_id}`, body)
            notification.success({ message: response.data.message || 'POD COMPLETED SUCCESSFULLY' })
            navigate(0)
        } catch (error) {
            console.log(error)
        }
    }

    const handleDownload = async () => {
        try {
            const response = await axioisInstance.get(`/user/order/invoice/${invoice_id}`)
            commonDownload(response, `invoice-${invoice_id}.pdf`)
        } catch (error) {
            console.log(error)
        }
    }

    const handleConvert = async () => {
        const body = { action: 'EXCHANGE_TO_RETURN' }
        try {
            const response = await axioisInstance.patch(`/merchant/order/${invoice_id}`, body)
            notification.success({ message: response?.data?.message || 'Successfully converted' })
        } catch (error) {
            console.log(error)
            notification.error({ message: 'Failed to Convert' })
        } finally {
            setShowCancelExchangeModal(false)
        }
    }

    useEffect(() => {
        if (data?.status === 'DELIVERY_CREATED' && data?.logistic?.partner === 'Slikk' && data?.logistic?.runner_phone_number === '') {
            setShowRiderData(true)
        } else {
            setShowRiderData(false)
        }
    }, [data?.logistic, data?.status])

    const handleCloseTrackModal = () => {
        setShowRiderData(false)
    }

    const ReturnOrderList = ({ title, items }: { title: string; items: any[] }) => {
        if (!items || items.length === 0) return null

        return (
            <div className="flex flex-col xl:flex-row gap-2 items-center">
                <span className="text-gray-700">{title}:</span>
                <div className="flex flex-wrap gap-2">
                    {items.map((item, key) => (
                        <a
                            key={key}
                            href={`/app/returnOrders/${item.return_order_id}`}
                            className="text-blue-600 hover:underline hover:text-blue-800 transition duration-200"
                        >
                            {item.return_order_id}
                        </a>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <Container className="p-4 xl:px-10 overflow-scroll scrollbar-hide ">
            <Loading loading={loading}>
                {!isEmpty(data) && (
                    <>
                        <div className="mb-8 flex flex-col justify-center xl:flex-row xl:justify-between">
                            <div className="w-full xl:w-1/2">
                                <div className="flex flex-col md:flex-row items-center mb-4 xl:justify-between justify-center w-full">
                                    <div className="text-3xl font-bold text-gray-800 text-center md:text-left flex gap-2">
                                        <span>Order</span>
                                        <span className="ml-2 text-red-600 flex gap-3">
                                            #{data.invoice_id}{' '}
                                            <div>
                                                <button className="bg-none border-none text-md mt-1" onClick={handleDownload}>
                                                    <FaDownload className="bg-none text-gray-700" />
                                                </button>
                                            </div>
                                            {data?.log?.some((item) => item?.status?.includes('PACKED')) &&
                                            data?.utm_params?.ticket === true ? (
                                                <>
                                                    <div>
                                                        <Button variant="reject" size="sm" onClick={() => setShowUTMModal(true)}>
                                                            REMOVE TICKET
                                                        </Button>
                                                    </div>
                                                </>
                                            ) : (
                                                <></>
                                            )}
                                        </span>
                                    </div>
                                </div>
                                <span className="flex items-center justify-center md:justify-start text-gray-600 text-sm">
                                    <HiOutlineCalendar className="text-2xl" />
                                    <span className="ml-2">{moment(data.create_date).format('MM/DD/YYYY hh:mm:ss a')}</span>
                                </span>
                                <br />
                                {data?.delivery_schedule_date ? (
                                    <>
                                        <span className="flex items-center justify-center md:justify-start text-gray-600 text-sm">
                                            <span className="font-bold text-xl">Schedule Date:</span>
                                            <span className="ml-2 text-xl">{data?.delivery_schedule_date}</span>
                                        </span>
                                    </>
                                ) : (
                                    ''
                                )}
                                {data?.delivery_schedule_slot ? (
                                    <>
                                        <span className="flex items-center justify-center md:justify-start text-gray-600 text-sm">
                                            <span className="font-bold text-xl">Schedule Slot:</span>
                                            <span className="ml-2 text-xl">
                                                {scheduleSlots[data.delivery_schedule_slot]
                                                    ? `${scheduleSlots[data.delivery_schedule_slot].start} - ${scheduleSlots[data.delivery_schedule_slot].end}`
                                                    : 'Invalid slot'}
                                            </span>
                                        </span>
                                    </>
                                ) : (
                                    ''
                                )}
                            </div>
                            <div className="mt-4 md:mt-0 flex flex-col items-center xl:items-end gap-5 justify-center w-full xl:w-1/2">
                                <div className="flex gap-4">
                                    {data.status === 'COMPLETED' &&
                                        (data?.payment?.status === 'PAID' || data?.payment?.status === 'POD_PAID') && (
                                            <button
                                                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg shadow-lg transition duration-300 transform hover:scale-105 w-1/2 md:w-auto"
                                                onClick={() => setReturnOrderDrawer(true)}
                                            >
                                                RETURN ORDER
                                            </button>
                                        )}{' '}
                                    {data.status !== 'DECLINED' && data.status !== 'CANCELLED' && (
                                        <button
                                            className="bg-red-600 hover:bg-red-700 text-white px-2 py-3 rounded-lg shadow-lg transition duration-300 transform hover:scale-105 w-full md:w-auto"
                                            onClick={() => setShowCancelModal(true)}
                                        >
                                            CANCEL ORDER
                                        </button>
                                    )}
                                    {data?.delivery_type === 'EXCHANGE' && (
                                        <button
                                            className="bg-red-600 hover:bg-red-700 text-white px-6  py-3 rounded-lg shadow-lg transition duration-300 transform hover:scale-105 w-1/2 md:w-auto"
                                            onClick={() => setShowCancelExchangeModal(true)}
                                        >
                                            CONVERT
                                        </button>
                                    )}
                                </div>
                                {data.return_order.length > 0 && (
                                    <>
                                        <ReturnOrderList
                                            title="Return Orders"
                                            items={data.return_order.filter((item) => item?.status !== 'ACCEPTED')}
                                        />
                                        <ReturnOrderList
                                            title="UnFullfilled Orders"
                                            items={data.return_order.filter((item) => item?.status === 'ACCEPTED')}
                                        />
                                    </>
                                )}
                                {data?.reference_return && (
                                    <div>
                                        <a
                                            href={`/app/returnOrders/${data?.reference_return}`}
                                            className="text-blue-600 hover:underline hover:text-blue-800 transition duration-200"
                                        >
                                            <span className="text-gray-700">Return Order:</span> {data?.reference_return}
                                        </a>
                                    </div>
                                )}
                                {data?.exchange_order_id?.length > 0 && (
                                    <div className="flex flex-col xl:flex-row gap-2 items-center">
                                        <span className="text-gray-700">Exchange Orders:</span>
                                        <div className="flex flex-wrap gap-2">
                                            {data?.exchange_order_id?.map((item, key) => (
                                                <a
                                                    key={key}
                                                    href={`/app/orders/${item}`}
                                                    className="text-blue-600 hover:underline hover:text-blue-800 transition duration-200"
                                                >
                                                    {item}
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {data?.delivery_type === 'EXCHANGE' && (
                                    <div>
                                        <a
                                            href={`/app/orders/${data?.original_order}`}
                                            className="text-blue-600 hover:underline hover:text-blue-800 transition duration-200"
                                        >
                                            <span className="text-gray-700">Original Order:</span> {data?.original_order}
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="xl:flex gap-6">
                            <div className="xl:flex-1">
                                <div className="bg-white shadow-lg p-4 rounded-lg mb-6 dark:bg-gray-900">
                                    <OrderProducts data={data.order_items || []} invoice_id={data.invoice_id} status={data.status} />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-white shadow-lg p-6 rounded-lg  dark:bg-gray-900">
                                        <CustomerInfo
                                            user={data.user}
                                            billing_address={data.billing_address}
                                            store={data.store}
                                            location_url={data.location_url}
                                            delivery_type={data.delivery_type}
                                            distance={data?.distance}
                                        />
                                    </div>
                                    <div className="bg-white shadow-lg p-6 rounded-lg dark:bg-gray-900">
                                        <ShippingInfo
                                            data={data.logistic}
                                            logistic_partner={data.logistic?.partner}
                                            delivery_type={data.delivery_type}
                                            setShowRiderModal={setShowRiderData}
                                        />
                                    </div>
                                    <div className="bg-white shadow-lg p-6 rounded-lg dark:bg-gray-900">
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
                                        />
                                    </div>

                                    <div className="bg-white shadow-lg p-6 rounded-lg dark:bg-gray-900">
                                        <OrderPickerSummary data={data} />
                                    </div>
                                </div>
                                {/* "" */}
                                <div className={'flex xl:justify-between gap-3 flex-col xl:flex-row '}>
                                    <div className="mt-6">
                                        <Activity
                                            mainData={data}
                                            data={data.log}
                                            status={data.status}
                                            product={data.order_items}
                                            payment={data.payment}
                                            invoice_id={data.invoice_id}
                                            delivery_type={data.delivery_type}
                                        />
                                    </div>
                                    {data?.logistic && (
                                        <div className="mt-6">
                                            <OrdersRiderActivity eventLogs={taskData} />
                                        </div>
                                    )}

                                    <div className="xl:w-[1000px] mt-10">
                                        {data?.logistic === null && (
                                            <>
                                                <TwoPointMap
                                                    lat={data?.latitude}
                                                    long={data?.longitude}
                                                    storeLat={data?.store.latitude}
                                                    storeLong={data?.store.longitude}
                                                />
                                            </>
                                        )}
                                        {data?.logistic?.partner === 'Slikk' && (
                                            <OrderMap task_id={data?.logistic?.task_id} taskData={taskData} />
                                        )}
                                        {data?.logistic?.partner !== 'Slikk' && (
                                            <div style={{ width: '100%', height: '600px' }}>
                                                <iframe
                                                    allowFullScreen
                                                    src={data?.logistic?.tracking_url}
                                                    style={{ width: '100%', height: '100%', border: 'none' }}
                                                    title="Live Order Tracking"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 xl:mt-0 xl:max-w-xs xl:w-full"></div>

                            {returnOrderDrawer && (
                                <ReturnOrderDrawer
                                    isOpen={returnOrderDrawer}
                                    setIsOpen={setReturnOrderDrawer}
                                    product={data.order_items || []}
                                    invoice_id={invoice_id}
                                    delivery_type={data?.delivery_type}
                                />
                            )}

                            {showCancelModal && (
                                <CancelModal
                                    isModalOpen={showCancelModal}
                                    handleClose={() => setShowCancelModal(false)}
                                    invoice_id={invoice_id || ''}
                                    setIsModalOpen={setShowCancelModal}
                                />
                            )}
                            {showCancelExchangeModal && (
                                <>
                                    <div>
                                        <Dialog
                                            width="100%"
                                            className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/2 mx-auto p-4 sm:p-6 md:p-8  "
                                            isOpen={showCancelExchangeModal}
                                            onClose={() => setShowCancelExchangeModal(true)}
                                        >
                                            <div>Are you sure You want to Exchange the Order</div>
                                            <div>
                                                <div className="flex justify-end mt-6 gap-3">
                                                    <button
                                                        className="bg-green-600 text-white hover:bg-green-500 transition-colors duration-300 px-4 py-2 rounded-lg"
                                                        onClick={() => setShowCancelExchangeModal(false)}
                                                    >
                                                        Reject
                                                    </button>
                                                    <button
                                                        className="bg-red-600 text-white hover:bg-red-500 transition-colors duration-300 px-4 py-2 rounded-lg"
                                                        onClick={handleConvert}
                                                    >
                                                        Convert
                                                    </button>
                                                </div>
                                            </div>
                                        </Dialog>
                                    </div>
                                </>
                            )}
                            {showRiderData && (
                                <TrackModal
                                    isOrder
                                    showTaskModal={showRiderData}
                                    setShowAssignModal={setShowRiderData}
                                    taskId={data?.logistic?.task_id}
                                    handleCloseModal={handleCloseTrackModal}
                                    storeLat={data?.latitude}
                                    storeLong={data?.longitude}
                                />
                            )}
                            {showUTMModal && <UtmModal isOpen={showUTMModal} setIsOpen={setShowUTMModal} orderData={data} />}
                        </div>
                    </>
                )}
            </Loading>
            {!loading && isEmpty(data) && (
                <div className="h-full flex flex-col items-center justify-center">
                    <DoubleSidedImage
                        src="/img/others/img-2.png"
                        darkModeSrc="/img/others/img-2-dark.png"
                        alt="No order found!"
                        className="w-64"
                    />
                    <h3 className="mt-8 text-center text-xl font-medium text-gray-700">No order found!</h3>
                </div>
            )}
        </Container>
    )
}

export default OrderDetails
