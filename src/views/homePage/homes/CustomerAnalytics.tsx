/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { OrderSummaryTYPE } from '@/store/types/orderUserSummary.types'
import { useAppDispatch, useAppSelector } from '@/store'
import { fetchUserSummary } from '@/store/slices/orderUserSummary/UserSummary.slice'
import { Button } from '@/components/ui'
import BlockUserModal from './componentsHomes/BlockUserModal'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'
import CustomerData from './componentsHomes/CustomerData'
import CartPaymentSummary from './componentsHomes/CartPaymentSummary'
import CartShipping from './componentsHomes/CartShipping'
import CartTabs from './componentsHomes/CartTabs'
import NotFoundData from '@/views/pages/NotFound/Notfound'
import CartItems from './componentsHomes/CartItems'

const CustomerAnalytics = () => {
    const [blockUser, setBlockUser] = useState(false)
    const dispatch = useAppDispatch()
    const { mobile } = useParams<{ mobile: string }>()

    const { customerData } = useAppSelector<OrderSummaryTYPE>((state) => state.userSummary)

    useEffect(() => {
        if (mobile) {
            dispatch(fetchUserSummary(mobile))
        }
    }, [dispatch])

    const handleBlockUser = async () => {
        const body = { mobile: mobile }
        try {
            const response = await axioisInstance.post(`/merchant/user/block`, body)
            notification.success({ message: response?.data?.message || 'Successfully blacklisted user' })
        } catch (error: any) {
            notification.error({ message: error?.response?.data?.message || error?.response?.data?.data.message || 'Failed to block User' })
            console.log(error)
        } finally {
            setBlockUser(false)
        }
    }
    if (mobile == 'null') {
        return <NotFoundData />
    }

    return (
        <div className="p-4 sm:p-6 bg-gray-50 min-h-screen dark:bg-gray-800 dark:text-white">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 dark:text-white">Customer Analytics</h1>
                <Button variant="new" size="sm" onClick={() => setBlockUser(true)}>
                    Block User
                </Button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 mb-6">
                <div className="h-full">
                    <CustomerData data={customerData} />
                </div>

                <div className="h-full flex flex-col gap-4">
                    <CartPaymentSummary />
                    <CartShipping />
                </div>
            </div>

            <div className="flex-1 mt-1 overflow-y-auto pr-2">
                {(customerData?.cart?.cartItems ?? []).length > 0 ? (
                    <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                        <h4 className="mt-2 mb-2">Cart Details</h4>
                        <CartItems />
                    </div>
                ) : (
                    <div className="text-lg sm:text-xl font-bold flex items-center justify-center mt-5">No Cart Available 😔</div>
                )}
            </div>
            <div className="mt-10">
                <h2 className="font-bold text-2xl mb-4">Activities</h2>
                <CartTabs customerData={customerData} />
            </div>
            {blockUser && (
                <BlockUserModal
                    dialogIsOpen={blockUser}
                    setIsOpen={setBlockUser}
                    handleDialogOk={handleBlockUser}
                    name={customerData?.profile?.first_name}
                />
            )}
        </div>
    )
}

export default CustomerAnalytics
