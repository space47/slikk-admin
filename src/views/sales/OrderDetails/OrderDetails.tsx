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
// import { apiGetSalesOrderDetails } from '@/services/SalesService'
// import { useLocation } from 'react-router-dom'
import isEmpty from 'lodash/isEmpty'

import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
// import { ordercommon } from '@/views/category-management/orderlist/commontypes'
import { useParams } from 'react-router-dom'
import moment from 'moment'
// import { string } from 'yup'

type SalesOrderDetailsResponse = {
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
        sub_category: string
        mrp: number
        fulfilled_quantity: string
        final_price: number
        sku: string
        id: number
    }[]

    log: {
        timestamp: string
        status: string
    }[]
    user: string
    store: {
        address: string
        latitude: number
        longitude: number
    }
    billing_address: string
    status: string
}

// type PayementStatus = {
//     label: string
//     class: string
// }

// const paymentStatus: Record<number, PayementStatus> = {
//     0: {
//         label: 'Paid',
//         class: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-100',
//     },
//     1: {
//         label: 'Unpaid',
//         class: 'text-red-500 bg-red-100 dark:text-red-100 dark:bg-red-500/20',
//     },
// }

// const progressStatus: Record<number, PayementStatus> = {
//     0: {
//         label: 'Fulfilled',
//         class: 'bg-cyan-100 text-cyan-600 dark:bg-cyan-500/20 dark:text-cyan-100',
//     },
//     1: {
//         label: 'Unfulfilled',
//         class: 'text-amber-600 bg-amber-100 dark:text-amber-100 dark:bg-amber-500/20',
//     },
// }

const OrderDetails = () => {
    // const location = useLocation()

    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<SalesOrderDetailsResponse>()

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

    return (
        <Container className="h-full">
            <Loading loading={loading}>
                {!isEmpty(data) && (
                    <>
                        <div className="mb-6">
                            <div className="flex items-center mb-2">
                                <h3>
                                    <span>Order</span>
                                    <span className="ltr:ml-2 rtl:mr-2">
                                        #{data.invoice_id}
                                    </span>
                                </h3>
                                {/* <Tag
                                    className={classNames(
                                        'border-0 rounded-md ltr:ml-2 rtl:mr-2',
                                        paymentStatus[data.payementStatus || 0]
                                            .class,
                                    )}
                                >
                                    {
                                        paymentStatus[data.payementStatus || 0]
                                            .label
                                    }
                                </Tag>
                                <Tag
                                    className={classNames(
                                        'border-0 rounded-md ltr:ml-2 rtl:mr-2',
                                        progressStatus[data.progressStatus || 0]
                                            .class,
                                    )}
                                >
                                    {
                                        progressStatus[data.progressStatus || 0]
                                            .label
                                    }
                                </Tag> */}
                            </div>
                            <span className="flex items-center">
                                <HiOutlineCalendar className="text-lg" />
                                <span className="ltr:ml-1 rtl:mr-1">
                                    {moment(data.create_date).format(
                                        'MM/DD/YYYY hh:mm:ss a',
                                    )}
                                </span>
                            </span>
                        </div>
                        <div className="xl:flex gap-4">
                            <div className="w-full">
                                <OrderProducts data={data.order_items} />
                                <div className="xl:grid grid-cols-2 gap-4">
                                    <ShippingInfo data={data.logistic} />
                                    <PaymentSummary
                                        data={data.payment}
                                        tax={data.tax}
                                    />
                                </div>
                                <Activity
                                    data={data.log}
                                    status={data.status}
                                    product={data.order_items}
                                    payment={data.payment}
                                    invoice_id={data.invoice_id}
                                />
                            </div>
                            <div className="xl:max-w-[360px] w-full">
                                <CustomerInfo
                                    user={data.user}
                                    billing_address={data.billing_address}
                                    store={data.store}
                                />
                            </div>
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
                    />
                    <h3 className="mt-8">No order found!</h3>
                </div>
            )}
        </Container>
    )
}

export default OrderDetails
