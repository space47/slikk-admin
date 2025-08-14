/* eslint-disable @typescript-eslint/no-explicit-any */
import MultipleMap from '@/common/multipleMap'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import UserMap from '@/views/analytics/userAnalytics/UserMap'
import moment from 'moment'
import React, { useEffect, useState } from 'react'

interface props {
    from: string
    to: string
    activeTab: string
    setAccessDenied: (value: boolean) => void
}

const HomepageMaps = ({ from, to, activeTab, setAccessDenied }: props) => {
    const [orders, setOrders] = useState<any[]>([])
    const To_Date = moment(to).add(1, 'days').format('YYYY-MM-DD')
    const [selectedStatus, setSelectedStatus] = useState<string[]>([])

    console.log('selectedStatus', selectedStatus)

    useEffect(() => {
        const fetchOrderForLocation = async () => {
            let statusData = ''
            if (selectedStatus && selectedStatus.length > 0) {
                statusData = `&status=${selectedStatus.join(',')}`
            }
            try {
                const response = await axioisInstance.get(`/merchant/orders?location_data=true&from=${from}&to=${To_Date}${statusData}`)
                const ordersData = response.data?.data
                setOrders(ordersData)
            } catch (error: any) {
                if (error.response && error.response.status === 403) {
                    setAccessDenied(true)
                }
                console.log(error)
            }
        }
        fetchOrderForLocation()
    }, [from, to, selectedStatus])
    return (
        <div>
            {activeTab === 'orders' && (
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <MultipleMap
                        latitudes={orders.map((item) => item.latitude || [])}
                        longitudes={orders.map((item) => item.longitude || [])}
                        amount={orders.map((item) => item.amount || [])}
                        currentStatus={orders.map((item) => item.status || [])}
                        currentInvoice={orders.map((item) => item.invoice_id || [])}
                        setSelectedStatus={setSelectedStatus}
                    />
                </div>
            )}
            {activeTab === 'users' && (
                <div className="bg-white p-6 rounded-xl shadow-md mt-10">
                    <UserMap from={from} to={To_Date} />
                </div>
            )}
        </div>
    )
}

export default HomepageMaps
