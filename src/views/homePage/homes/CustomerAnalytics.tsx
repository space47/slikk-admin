import React, { useEffect, useState } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { CUSTOMERANALYTICS } from './homes.common'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import Avatar from '@/components/ui/Avatar'

const CustomerAnalytics = () => {
    const [customerData, setCustomerData] = useState<CUSTOMERANALYTICS>()
    const useQuery = () => {
        return new URLSearchParams(useLocation().search)
    }

    const { mobile } = useParams<{ mobile: any }>()
    const query = useQuery()
    const from = query.get('from')

    const fetchCustomerData = async () => {
        try {
            const response = await axioisInstance.get(
                `/merchant/analytics/order?from=${from}&${mobile}&type=user_summary`,
            )
            const data = response.data.data
            setCustomerData(data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchCustomerData()
    }, [])

    console.log('DAAATA', customerData)

    return (
        <div className="p-4 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold mb-6">Customer Analytics</h1>
            {customerData ? (
                <ul className="space-y-6">
                    <li className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                        <h2 className="text-lg font-semibold mb-2">Profile</h2>
                        <div className="flex gap-10 items-center justify-around mb-4">
                            <Avatar
                                shape="circle"
                                src={customerData.profile.image}
                                className="w-[100px] h-[100px]"
                            />
                            <div>
                                <p className="text-sm">
                                    <span className="font-semibold">Name:</span>{' '}
                                    {customerData.profile.first_name}{' '}
                                    {customerData.profile.last_name}
                                </p>
                                <p className="text-sm">
                                    <span className="font-semibold">
                                        Email:
                                    </span>{' '}
                                    {customerData.profile.email}
                                </p>
                                <p className="text-sm">
                                    <span className="font-semibold">
                                        Mobile:
                                    </span>{' '}
                                    {customerData.profile.mobile}
                                </p>
                                <p className="text-sm">
                                    <span className="font-semibold">
                                        Country Code:
                                    </span>{' '}
                                    {customerData.profile.country_code}
                                </p>
                                <p className="text-sm">
                                    <span className="font-semibold">
                                        Date of Birth:
                                    </span>{' '}
                                    {customerData.profile.dob}
                                </p>
                                <p className="text-sm">
                                    <span className="font-semibold">
                                        Gender:
                                    </span>{' '}
                                    {customerData.profile.gender || 'N/A'}
                                </p>
                                <p className="text-sm">
                                    <span className="font-semibold">
                                        Device ID:
                                    </span>{' '}
                                    {customerData.profile.device_id}
                                </p>
                            </div>
                        </div>
                    </li>
                    <li className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                        <h2 className="text-lg font-semibold mb-2">Orders</h2>
                        <p className="text-sm">
                            <span className="font-semibold">Order Count:</span>{' '}
                            {customerData.orders.count}
                        </p>
                        <p className="text-sm">
                            <span className="font-semibold">Total Amount:</span>{' '}
                            ${customerData.orders.total_amount.toFixed(2)}
                        </p>
                    </li>
                    <li className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                        <h2 className="text-lg font-semibold mb-2">Cart</h2>
                    </li>
                </ul>
            ) : (
                <p className="text-gray-600">Loading data...</p>
            )}
        </div>
    )
}

export default CustomerAnalytics
