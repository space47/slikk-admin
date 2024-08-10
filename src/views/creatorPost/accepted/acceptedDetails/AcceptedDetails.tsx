/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react'
// import classNames from 'classnames'
// import Tag from '@/components/ui/Tag'
import Loading from '@/components/shared/Loading'
import Container from '@/components/shared/Container'
import DoubleSidedImage from '@/components/shared/DoubleSidedImage'
// import OrderProducts from './components/OrderProducts'
// import PaymentSummary from './components/PaymentSummary'
// import ShippingInfo from './components/ShippingInfo'
// import Activity from './components/Activity'
// import CustomerInfo from './components/CustomerInfo'
// import { HiOutlineCalendar } from 'react-icons/hi'
// import { apiGetSalesOrderDetails } from '@/services/SalesService'
// import { useLocation } from 'react-router-dom'
import isEmpty from 'lodash/isEmpty'

import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
// import { ordercommon } from '@/views/category-management/orderlist/commontypes'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import VideoFrame from './AcceptedVideo'
import { Button } from '@/components/ui'
import AcceptedProduct from './AcceptedProduct'
import AcceptCreatorDetails from './AcceptCreatorDetails'
import { notification } from 'antd'

// import moment from 'moment'
// import { string } from 'yup'

type Product = {
    barcode: string
    mrp: string
    sp: string
    name: string
    brand: string
    product_feedback: string | null
    is_wish_listed: boolean
    is_try_and_buy: boolean
    trends: string | null
    styles: string | null
    inventory_count: number
    image: string
    division: string
    category: string
    sub_category: string
    product_type: string
    variants: any[]
}

type Creator = {
    name: string
    dp: string
    followers_count: number
}

type PostData = {
    id: number
    post_id: string
    caption: string
    url: string
    products: Product[]
    type: string
    likes_count: number
    comments_count: number
    views_count: number
    creator: Creator
    thumbnail_url: string
}
const useQuery = () => {
    return new URLSearchParams(useLocation().search)
}

const AcceptedDetails = () => {
    const [loading, setLoading] = useState(true)
    const [acceptedData, setAcceptedData] = useState<PostData>()
    const navigate = useNavigate()

    // const { post_id } = useParams()

    const { id } = useParams<{ id: any }>()
    const query = useQuery()
    const post_id = query.get('post_id')

    useEffect(() => {
        console.log('idddddddd', post_id)
        console.log('iddddddd', id)
        const fetchOrders = async () => {
            try {
                const response = await axioisInstance.get(
                    `userposts/approval?post_id=${id}`,
                )

                const PendingData = response.data?.data || []
                setLoading(false)

                setAcceptedData(PendingData)
            } catch (error) {
                console.log(error)
            }
        }

        fetchOrders()
    }, [id, post_id])

    const handleReject = async () => {
        const body = {
            pk: `${post_id}`,
            status: 'REJECTED',
        }
        try {
            const response = await axioisInstance.patch(
                '/userposts/approval',
                body,
            )
            const data = response.data.data
            notification.success({
                message: 'Success',
                description:
                    response?.data?.message || 'Status Updated Successfully',
            })
            navigate('/app/userposts/approval')
            return data
        } catch (error) {
            console.log(error)
            notification.error({
                message: 'Failure',
                description: 'Status Update Failed',
            })
        }
    }
    const handlePending = async () => {
        const body = {
            pk: `${post_id}`,
            status: 'PENDING',
        }
        try {
            const response = await axioisInstance.patch(
                '/userposts/approval',
                body,
            )
            const data = response.data.data
            notification.success({
                message: 'Success',
                description:
                    response?.data?.message || 'Status Updated Successfully',
            })
            navigate('/app/userposts/approval')
            return data
        } catch (error) {
            console.log(error)
            notification.error({
                message: 'Failure',
                description: 'Status Update Failed',
            })
        }
    }

    return (
        <Container className="">
            <Loading loading={loading} className="">
                {!isEmpty(acceptedData) && (
                    <>
                        <div className="mb-3 ">
                            <div className="flex justify-between ">
                                <span className="text-xl font-bold">
                                    POST ID :#{acceptedData.post_id}
                                </span>
                                <span className="text-xl"></span>

                                <div className="flex gap-4 ">
                                    <Button
                                        variant="pending"
                                        onClick={() => handlePending()}
                                    >
                                        Pending
                                    </Button>
                                    <Button
                                        variant="reject"
                                        onClick={() => handleReject()}
                                    >
                                        Reject
                                    </Button>
                                </div>
                            </div>

                            {/* Contents.................................................................................................. */}

                            <div className="flex gap-5  items-center justify-around ">
                                <div className="info">
                                    <AcceptCreatorDetails
                                        name={acceptedData.creator.name}
                                        dp={acceptedData.creator.dp}
                                        followers_count={
                                            acceptedData.creator.followers_count
                                        }
                                        likes_count={acceptedData.likes_count}
                                        views_count={acceptedData.views_count}
                                        comments_count={
                                            acceptedData.comments_count
                                        }
                                    />
                                </div>

                                {/*  */}
                                <div className="flex justify-center items-center gap-6 mt-10">
                                    {acceptedData.type === 'Video' ? (
                                        <VideoFrame url={acceptedData.url} />
                                    ) : (
                                        <>
                                            {' '}
                                            <img
                                                src={acceptedData.url}
                                                alt=""
                                                className=" w-[400px] h-[500px]"
                                            />
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className="product mt-10">
                                <AcceptedProduct data={acceptedData.products} />
                            </div>
                        </div>
                    </>
                )}
            </Loading>
            {!loading && isEmpty(acceptedData) && (
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

export default AcceptedDetails
