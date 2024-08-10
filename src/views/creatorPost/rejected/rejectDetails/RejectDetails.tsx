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
import VideoFrame from './RejectVideo'
import { Button } from '@/components/ui'
import RejectProduct from './RejectProduct'
import RejectCreatorDetails from './RejectCreatorDetails'
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

const RejectDetails = () => {
    const [loading, setLoading] = useState(true)
    const [rejectData, setRejectData] = useState<PostData>()

    const navigate = useNavigate()

    // const { post_id } = useParams()

    const { id } = useParams<{ id: any }>()
    const query = useQuery()
    const post_id = query.get('post_id')

    useEffect(() => {
        console.log('idddddddd', post_id)
        const fetchOrders = async () => {
            try {
                const response = await axioisInstance.get(
                    `userposts/approval?post_id=${post_id}`,
                )

                const PendingData = response.data?.data || []
                setLoading(false)

                setRejectData(PendingData)
            } catch (error) {
                console.log(error)
            }
        }

        fetchOrders()
    }, [id, post_id])

    const handleAccept = async () => {
        const body = {
            pk: `${post_id}`,
            status: 'APPROVED',
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
                {!isEmpty(rejectData) && (
                    <>
                        <div className="mb-3 ">
                            <div className="flex justify-between ">
                                <span className="text-xl font-bold">
                                    POST ID :#{rejectData.post_id}
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
                                        onClick={() => handleAccept()}
                                    >
                                        Accept
                                    </Button>
                                </div>
                            </div>

                            {/* Contents.................................................................................................. */}

                            <div className="flex gap-5  items-center justify-around ">
                                <div className="info">
                                    <RejectCreatorDetails
                                        name={rejectData.creator.name}
                                        dp={rejectData.creator.dp}
                                        followers_count={
                                            rejectData.creator.followers_count
                                        }
                                        likes_count={rejectData.likes_count}
                                        views_count={rejectData.views_count}
                                        comments_count={
                                            rejectData.comments_count
                                        }
                                    />
                                </div>

                                {/*  */}
                                <div className="flex justify-center items-center gap-6 mt-10">
                                    {rejectData.type === 'Video' ? (
                                        <VideoFrame url={rejectData.url} />
                                    ) : (
                                        <>
                                            {' '}
                                            <img
                                                src={rejectData.url}
                                                alt=""
                                                className=" w-[400px] h-[500px]"
                                            />
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className="product mt-10">
                                <RejectProduct data={rejectData.products} />
                            </div>
                        </div>
                    </>
                )}
            </Loading>
            {!loading && isEmpty(rejectData) && (
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

export default RejectDetails
