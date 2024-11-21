/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react'
// import classNames from 'classnames'
// import Tag from '@/components/ui/Tag'
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
import { SalesOrderDetailsResponse } from './orderList.common'
// import { string } from 'yup'

const scheduleSlots = {
    '1': { start: '10:00 AM', end: '01:00 PM' },
    '2': { start: '01:00 PM', end: '04:00 PM' },
    '3': { start: '04:00 PM', end: '07:00 PM' },
    '4': { start: '07:00 PM', end: '10:00 PM' },
}

const OrderDetails = () => {
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<SalesOrderDetailsResponse>()
    const [returnOrderDrawer, setReturnOrderDrawer] = useState(false)
    const [showCancelModal, setShowCancelModal] = useState(false)
    const navigate = useNavigate()

    const { invoice_id } = useParams()

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axioisInstance.get(`merchant/order/${invoice_id}`)

                const ordersData = response.data?.data || []
                setLoading(false)

                setData(ordersData)
            } catch (error) {
                console.log(error)
            }
        }

        fetchOrders()
    }, [invoice_id])

    const handleReturnOrder = () => {
        setReturnOrderDrawer(true)
    }
    const handleCancelOrder = () => {
        setShowCancelModal(true)
    }
    const handleCloseModal = () => {
        setShowCancelModal(false)
    }

    const handlemarkAsPaid = async () => {
        console.log('MARK CLICKED')
        try {
            const response = await axioisInstance.post(`/user/order/${invoice_id}/payment/status`)

            notification.success({
                message: response.data.message || 'Successfully markded as Paid',
            })
            navigate(0)
        } catch (error) {
            console.log(error)
        }
    }

    const handlePODAction = async () => {
        try {
            const body = {
                action: 'MARK_POD_COMPLETE',
            }
            const response = await axioisInstance.patch(`/merchant/order/${invoice_id}`, body)

            notification.success({
                message: response.data.message || 'POD COMPLETED SUCCESSFULLY',
            })
            navigate(0)
        } catch (error) {
            console.log(error)
        }
    }

    const handleDownload = async () => {
        try {
            const response = await axioisInstance.get(`/user/order/invoice/${invoice_id}`)

            const downloadablePDF = response.data?.data

            const link = document.createElement('a')
            link.href = downloadablePDF
            link.download = `invoice-${invoice_id}.pdf`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Container className="p-4 xl:px-10">
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
                                                onClick={handleReturnOrder}
                                            >
                                                RETURN ORDER
                                            </button>
                                        )}{' '}
                                    {data.status !== 'DECLINED' && data.status !== 'CANCELLED' && (
                                        <button
                                            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg shadow-lg transition duration-300 transform hover:scale-105 w-1/2 md:w-auto"
                                            onClick={handleCancelOrder}
                                        >
                                            CANCEL ORDER
                                        </button>
                                    )}
                                    {/* {data.status === 'COMPLETED' &&
                                    (data?.payment?.status === 'PAID' || data?.payment?.status === 'POD_PAID') ? (
                                        <button
                                            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg shadow-lg transition duration-300 transform hover:scale-105 w-1/2 md:w-auto"
                                            onClick={handleReturnOrder}
                                        >
                                            RETURN ORDER
                                        </button>
                                    ) : (
                                        data.status !== 'DECLINED' &&
                                        data.status !== 'CANCELLED' &&
                                        (data.status === 'COMPLETED' || data.payment?.status !== 'PAID') &&
                                        (data.status !== 'COMPLETED' || data.payment?.status === 'PAID') && (
                                            <button
                                                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg shadow-lg transition duration-300 transform hover:scale-105 w-1/2 md:w-auto"
                                                onClick={handleCancelOrder}
                                            >
                                                CANCEL ORDER
                                            </button>
                                        )
                                    )} */}
                                </div>
                                {data.return_order.length > 0 && (
                                    <div className="flex flex-col xl:flex-row gap-2 items-center">
                                        <span className="text-gray-700">Return Orders:</span>
                                        <div className="flex flex-wrap gap-2">
                                            {data.return_order.map((item, key) => (
                                                <a
                                                    href={`/app/returnOrders/${item.return_order_id}`}
                                                    key={key}
                                                    className="text-blue-600 hover:underline hover:text-blue-800 transition duration-200"
                                                >
                                                    {item.return_order_id}
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="xl:flex gap-6">
                            <div className="xl:flex-1">
                                <div className="bg-white shadow-lg p-4 rounded-lg mb-6 dark:bg-gray-900">
                                    <OrderProducts data={data.order_items} invoice_id={data.invoice_id} status={data.status} />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-white shadow-lg p-6 rounded-lg  dark:bg-gray-900">
                                        <CustomerInfo
                                            user={data.user}
                                            billing_address={data.billing_address}
                                            store={data.store}
                                            location_url={data.location_url}
                                        />
                                    </div>
                                    <div className="bg-white shadow-lg p-6 rounded-lg dark:bg-gray-900">
                                        <ShippingInfo
                                            data={data.logistic}
                                            logistic_partner={data.logistic?.partner}
                                            delivery_type={data.delivery_type}
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
                                            handlePODAction={handlePODAction}
                                        />
                                    </div>
                                </div>
                                <div className="mt-6">
                                    <Activity
                                        data={data.log}
                                        status={data.status}
                                        product={data.order_items}
                                        payment={data.payment}
                                        invoice_id={data.invoice_id}
                                    />
                                </div>
                            </div>
                            <div className="mt-6 xl:mt-0 xl:max-w-xs xl:w-full"></div>

                            {returnOrderDrawer && (
                                <ReturnOrderDrawer
                                    isOpen={returnOrderDrawer}
                                    setIsOpen={setReturnOrderDrawer}
                                    product={data.order_items}
                                    invoice_id={invoice_id}
                                />
                            )}

                            {showCancelModal && (
                                <CancelModal
                                    product={data.order_items}
                                    isModalOpen={showCancelModal}
                                    handleClose={handleCloseModal}
                                    invoice_id={invoice_id}
                                    setIsModalOpen={setShowCancelModal}
                                />
                            )}
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
