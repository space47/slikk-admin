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
import { useParams } from 'react-router-dom'
import moment from 'moment'
import ReturnOrderDrawer from './components/ReturnOrderDrawer'
import CancelModal from './components/CancelModal'
import { FaMapMarkedAlt } from 'react-icons/fa'
// import { string } from 'yup'

type RETURNORDER = {
    amount: string
    create_date: string
    order: string
    return_order_delivery: any
    return_order_id: string
    return_order_items: any
    return_type: string
    status: string
    uuid: string
}

type SalesOrderDetailsResponse = {
    amount: string
    invoice_id?: string
    progressStatus?: number
    payementStatus?: number
    create_date?: string
    dateTime?: number
    payment?: {
        amount: number
        mode: string
        transaction_time: string
    }
    coupon_discount: string
    delivery: string
    delivery_discount: number
    delivery_type: string
    tax: string | number
    address_name: string
    logistic?: {
        partner: number
        price: number
        create_date: number
        drop_time: number
        shippingLogo: string
        runner_name: string
        runner_phone_number: string
        runner_profile_pic_url: string
        state: string
    }

    logistic_partner: any
    order_items?: {
        barcode: string
        brand: string
        name: string
        color: string
        size: string
        product_type: string
        image: string
        sp: number
        quantity: string
        location: string
        sub_category: string
        mrp: number
        fulfilled_quantity: string
        final_price: number
        sku: string
        id: number
        returnable_quantity: number
    }[]

    log: {
        timestamp: string
        status: string
    }[]
    user: {
        name: string
        mobile: string
    }
    store: {
        address: string
        latitude: number
        longitude: number
    }
    billing_address: string
    status: string
    loyalty_discount: string
    points_discount: string
    location_url: string
    return_order: RETURNORDER[]
}

const OrderDetails = () => {
    // const location = useLocation()

    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<SalesOrderDetailsResponse>()
    const [returnOrderDrawer, setReturnOrderDrawer] = useState(false)
    const [showCancelModal, setShowCancelModal] = useState(false)

    const { invoice_id } = useParams()

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axioisInstance.get(
                    `merchant/order/${invoice_id}`,
                )

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

    console.log(
        'RETRUNORDER',
        data?.return_order.map((item) => item.return_order_id).join(','),
    )

    return (
        <Container className="p-4 xl:px-10">
            <Loading loading={loading}>
                {!isEmpty(data) && (
                    <>
                        <div className="mb-8 flex flex-col justify-center xl:flex-row xl:justify-between">
                            <div className="w-full xl:w-1/2">
                                <div className="flex flex-col md:flex-row items-center mb-4 xl:justify-between justify-center w-full">
                                    <h3 className="text-3xl font-bold text-gray-800 text-center md:text-left">
                                        <span>Order</span>
                                        <span className="ml-2 text-gray-600">
                                            #{data.invoice_id}
                                        </span>
                                    </h3>
                                </div>
                                <span className="flex items-center justify-center md:justify-start text-gray-600 text-sm">
                                    <HiOutlineCalendar className="text-2xl" />
                                    <span className="ml-2">
                                        {moment(data.create_date).format(
                                            'MM/DD/YYYY hh:mm:ss a',
                                        )}
                                    </span>
                                </span>
                            </div>
                            <div className="mt-4 md:mt-0 flex flex-col items-center xl:items-end gap-5 justify-center w-full xl:w-1/2">
                                {data.status === 'COMPLETED' ? (
                                    <button
                                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg shadow-lg transition duration-300 transform hover:scale-105 w-1/2 md:w-auto"
                                        onClick={handleReturnOrder}
                                    >
                                        RETURN ORDER
                                    </button>
                                ) : data.status !== 'DECLINED' &&
                                  data.status !== 'CANCELLED' ? (
                                    <button
                                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg shadow-lg transition duration-300 transform hover:scale-105 w-1/2 md:w-auto"
                                        onClick={handleCancelOrder}
                                    >
                                        CANCEL ORDER
                                    </button>
                                ) : null}

                                {data.return_order.length > 0 && (
                                    <div className="flex flex-col xl:flex-row gap-2 items-center">
                                        <span className="text-gray-700">
                                            Return Orders:
                                        </span>
                                        <div className="flex flex-wrap gap-2">
                                            {data.return_order.map(
                                                (item, key) => (
                                                    <a
                                                        href={`/app/returnOrders/${item.return_order_id}`}
                                                        key={key}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="text-blue-600 hover:underline hover:text-blue-800 transition duration-200"
                                                    >
                                                        {item.return_order_id}
                                                    </a>
                                                ),
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="xl:flex gap-6">
                            <div className="xl:flex-1">
                                <div className="bg-white shadow-lg p-4 rounded-lg mb-6">
                                    <OrderProducts data={data.order_items} />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-white shadow-lg p-6 rounded-lg">
                                        <CustomerInfo
                                            user={data.user}
                                            billing_address={
                                                data.billing_address
                                            }
                                            store={data.store}
                                            location_url={data.location_url}
                                        />
                                    </div>
                                    <div className="bg-white shadow-lg p-6 rounded-lg">
                                        <ShippingInfo
                                            data={data.logistic}
                                            logistic_partner={
                                                data.logistic?.partner
                                            }
                                            delivery_type={data.delivery_type}
                                        />
                                    </div>
                                    <div className="bg-white shadow-lg p-6 rounded-lg">
                                        <PaymentSummary
                                            data={data.payment}
                                            tax={data.tax}
                                            delivery={data.delivery}
                                            amount={data.amount}
                                            coupon_discount={
                                                data.coupon_discount
                                            }
                                            loyalty_discount={
                                                data.loyalty_discount
                                            }
                                            points_discount={
                                                data.points_discount
                                            }
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
                    <h3 className="mt-8 text-center text-xl font-medium text-gray-700">
                        No order found!
                    </h3>
                </div>
            )}
        </Container>
    )
}

export default OrderDetails
