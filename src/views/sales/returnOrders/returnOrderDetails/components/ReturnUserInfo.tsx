import Card from '@/components/ui/Card'
// import Avatar from '@/components/ui/Avatar'
import IconText from '@/components/shared/IconText'
import { HiPhone, HiExternalLink, HiMail } from 'react-icons/hi'
import { Link } from 'react-router-dom'
import { useAppSelector } from '@/store'
import { ReturnOrderState } from '@/store/types/returnDetails.types'
import { useState } from 'react'
import ReturnCancelOrder from './ReturnCancelOrder'
import { notification } from 'antd'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'

const ReturnUserInfo = () => {
    const returnOrder = useAppSelector<ReturnOrderState>((state) => state.returnOrders)
    const returnProducts = returnOrder?.returnOrders?.user
    const [showCancelModal, setShowCancelModal] = useState(false)
    const returnOrderId = returnOrder?.returnOrders?.return_order_id

    const handleCancelOrder = () => {
        setShowCancelModal(true)
    }
    const handleCloseModal = () => {
        setShowCancelModal(false)
    }

    const handleCancelReturn = async () => {
        const body = {
            action: 'cancel_return_order',
        }
        try {
            const response = await axioisInstance.patch(`/merchant/return_order/${returnOrderId}`, body)
            notification.success({
                message: response?.data?.data?.message || 'Successfully Cancelled',
            })
        } catch (error) {
            console.log(error)
            notification.error({
                message: 'Failed to cancel Return Order',
            })
        } finally {
            setShowCancelModal(false)
        }
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-center">
                <button
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg shadow-lg transition duration-300 transform hover:scale-105 w-1/2 md:w-auto"
                    onClick={handleCancelOrder}
                >
                    CANCEL
                </button>
            </div>
            <Card>
                <br />
                <br />
                <h5 className="mb-4">Customer Details</h5>
                <Link className="group flex items-center justify-between" to="/app/crm/customer-details?id=11">
                    <div className="flex items-center">
                        {/* <Avatar shape="circle" src={data?.img} /> */}
                        <div className="ltr:ml-2 rtl:mr-2">
                            {/* <div className="font-semibold group-hover:text-gray-900 group-hover:dark:text-gray-100">
                            {data?.name}
                        </div> */}
                            <span className="text-xl font-bold flex gap-1">
                                {returnProducts?.first_name}
                                {returnProducts?.last_name}
                            </span>
                        </div>
                    </div>
                    <HiExternalLink className="text-xl hidden group-hover:block" />
                </Link>
                <hr className="my-5" />

                <IconText icon={<HiPhone className="text-xl opacity-70" />}>
                    <span className="font-semibold">{returnProducts?.mobile}</span>
                </IconText>
                <IconText icon={<HiMail className="text-xl opacity-70" />}>
                    <span className="font-semibold">{returnProducts?.email}</span>
                </IconText>
                {showCancelModal && (
                    <>
                        <ReturnCancelOrder
                            showCancelModal={showCancelModal}
                            handleCancelReturn={handleCancelReturn}
                            handleCloseModal={handleCloseModal}
                        />
                    </>
                )}
            </Card>
        </div>
    )
}

export default ReturnUserInfo
