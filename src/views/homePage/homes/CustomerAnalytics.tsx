import React, { useEffect, useState } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { CUSTOMERANALYTICS } from './homes.common'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import Avatar from '@/components/ui/Avatar'
import moment from 'moment'

const CustomerAnalytics = () => {
    const [customerData, setCustomerData] = useState<CUSTOMERANALYTICS>()
    // const useQuery = () => {
    //     return new URLSearchParams(useLocation().search)
    // }

    const { mobile } = useParams<{ mobile: any }>()
    // const query = useQuery()

    const fetchCustomerData = async () => {
        try {
            const response = await axioisInstance.get(`/merchant/analytics/order?mobile=${mobile}&type=user_summary`)
            const data = response.data.data
            setCustomerData(data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchCustomerData()
    }, [])

    console.log('DAAATA', customerData?.profile.image)

    const CustomerArray = [
        {
            name: 'Name',
            value: `${customerData?.profile?.first_name || ''} ${customerData?.profile?.last_name || ''}`.trim(),
        },
        {
            name: 'Email',
            value: customerData?.profile?.email,
        },
        {
            name: 'Mobile',
            value: customerData?.profile?.mobile,
        },
        {
            name: 'Country Code',
            value: customerData?.profile?.country_code,
        },
        {
            name: 'Date of Birth',
            value: moment(customerData?.profile?.dob).format('YYYY-MM-DD'),
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

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-extrabold text-gray-800 mb-8">Customer Analytics</h1>
            {customerData ? (
                <div className="flex flex-wrap gap-6">
                    {/* Profile Section */}
                    <div className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 flex-1">
                        <h2 className="text-xl font-semibold mb-4 text-gray-700">Profile</h2>
                        <div className="flex items-center gap-4">
                            <Avatar shape="circle" src={customerData.profile.image} className="w-[80px] h-[80px] border border-gray-300" />
                            <div className="space-y-1">
                                {CustomerArray.map((item, key) => (
                                    <p className="text-sm text-gray-600" key={key}>
                                        <span className="font-medium text-gray-700">{item.name}:</span> {item.value}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Orders Section */}
                    <div className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 flex-1">
                        <h2 className="text-xl font-semibold mb-4 text-gray-700">Orders</h2>
                        <p className="text-sm text-gray-600 mb-1">
                            <span className="font-medium text-gray-700">Order Count:</span> {customerData.orders.count}
                        </p>
                        <p className="text-sm text-gray-600">
                            <span className="font-medium text-gray-700">Total Amount:</span> Rs.
                            {customerData.orders.total_amount.toFixed(2)}
                        </p>
                    </div>
                </div>
            ) : (
                <p className="text-gray-500">Loading data...</p>
            )}

            {/* Cart Section */}
            <div className="bg-white p-5 mt-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                <h2 className="text-xl font-semibold mb-4 text-gray-700">Cart</h2>
                <p className="text-sm text-gray-500">No items in the cart.</p>
            </div>
        </div>
    )
}

export default CustomerAnalytics
