import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Avatar from '@/components/ui/Avatar'
import moment from 'moment'
import { OrderSummaryTYPE } from '@/store/types/orderUserSummary.types'
import { useAppDispatch, useAppSelector } from '@/store'
import { fetchUserSummary } from '@/store/slices/orderUserSummary/UserSummary.slice'
import CartHome from './componentsHomes/CartHome'
import { Button } from '@/components/ui'
import BlockUserModal from './componentsHomes/BlockUserModal'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'

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

    const CustomerArray = [
        {
            name: 'Name',
            value: `${customerData?.profile?.first_name || ''} ${customerData?.profile?.last_name || ''}`.trim(),
        },
        {
            name: 'Email',
            value: customerData?.profile?.email || '',
        },
        {
            name: 'Mobile',
            value: `${customerData?.profile?.country_code || ''} ${customerData?.profile?.mobile || ''}`.trim(),
        },

        {
            name: 'Date of Birth',
            value: moment(customerData?.profile?.dob).format('YYYY-MM-DD') || '',
        },
        {
            name: 'Gender',
            value: customerData?.profile?.gender || 'N/A',
        },
        {
            name: 'Device ID',
            value: customerData?.profile?.device_id || 'N/A',
        },
    ]

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
            {customerData ? (
                <div className="flex flex-wrap gap-6">
                    {/* Profile Section */}
                    <div className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 flex-1 dark:bg-gray-800 dark:text-white">
                        <h2 className="text-xl font-semibold mb-4 text-gray-700">Profile</h2>
                        <div className="flex items-center gap-4">
                            <Avatar
                                shape="circle"
                                src={customerData?.profile?.image}
                                className="w-[80px] h-[80px] border border-gray-300"
                            />
                            <div className="space-y-1 dark:text-white">
                                {CustomerArray.map((item, key) => (
                                    <p className="text-sm text-gray-600 dark:text-white" key={key}>
                                        <span className="font-medium text-gray-700">{item?.name}:</span> {item?.value}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Orders Section */}
                    <div className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 flex-1">
                        <h2 className="text-xl font-semibold mb-4 text-gray-700">Orders</h2>
                        <p className="text-sm text-gray-600 mb-1">
                            <span className="font-medium text-gray-700">Order Count:</span> {customerData.orders?.count}
                        </p>
                        <p className="text-sm text-gray-600">
                            <span className="font-medium text-gray-700">Total Amount:</span> Rs.
                            {customerData.orders?.total_amount.toFixed(2)}
                        </p>
                    </div>
                </div>
            ) : (
                <p className="text-gray-500">Loading data...</p>
            )}
            <br />
            <div className="font-bold text-xl">Cart Details:</div>
            {/* Cart Section */}
            {customerData?.cart !== null ? (
                <>
                    <div className="bg-white p-5 mt-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                        <CartHome />
                    </div>
                </>
            ) : (
                <>
                    <div className="text-xl font-bold flex items-center justify-center ">No Cart Available 😔</div>
                </>
            )}
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
