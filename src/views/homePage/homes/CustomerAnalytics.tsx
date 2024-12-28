/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { OrderSummaryTYPE } from '@/store/types/orderUserSummary.types'
import { useAppDispatch, useAppSelector } from '@/store'
import { fetchUserSummary } from '@/store/slices/orderUserSummary/UserSummary.slice'
import CartHome from './componentsHomes/CartHome'
import { Button } from '@/components/ui'
import BlockUserModal from './componentsHomes/BlockUserModal'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'
import CustomerData from './componentsHomes/CustomerData'
import CartPaymentSummary from './componentsHomes/CartPaymentSummary'
import CartShipping from './componentsHomes/CartShipping'
import CartTabs from './componentsHomes/CartTabs'

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

    console.log('DATA', customerData)

    const handleBlockUser = async () => {
        const body = {
            mobile: mobile,
        }
        try {
            const response = await axioisInstance.post(`/merchant/user/block`, body)
            notification.success({
                message: response?.data?.message || 'Successfully blacklisted user',
            })
        } catch (error: any) {
            notification.error({
                message: error?.response?.data?.message || error?.response?.data?.data.message || 'Failed to block User',
            })
            console.log(error)
        } finally {
            setBlockUser(false)
        }
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen dark:bg-gray-800 dark:text-white">
            <div className="flex justify-between">
                <h1 className="text-3xl font-extrabold text-gray-800 mb-8">Customer Analytics</h1>
                <div>
                    <Button variant="new" size="sm" onClick={() => setBlockUser(true)}>
                        Block User
                    </Button>
                </div>
            </div>
            <div className="flex justify-between w-full gap-4">
                <div className="w-1/2">
                    {customerData ? <CustomerData data={customerData} /> : <p className="text-gray-500">Loading data...</p>}
                </div>
                <div className="flex flex-col gap-2 w-full">
                    <CartPaymentSummary />
                    <CartShipping />
                </div>
            </div>

            <br />
            <div className="font-bold text-xl">Cart Details:</div>
            {customerData?.cart !== null ? (
                <>
                    <div className="bg-white p-5 mt-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                        <CartHome />
                    </div>
                </>
            ) : (
                <>
                    <div className="text-xl font-bold flex items-center justify-center mt-5 ">No Cart Available 😔</div>
                </>
            )}
            <br />
            <div className="mt-10">
                <div className="flex flex-col gap-4">
                    <h2 className="font-bold text-2xl">Transaction History</h2>
                    <CartTabs />
                </div>
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
