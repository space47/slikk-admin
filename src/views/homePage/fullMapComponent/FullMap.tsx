/* eslint-disable @typescript-eslint/no-explicit-any */
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import React, { useEffect, useState } from 'react'
import MultipleMap from '@/common/multipleMap'
import { useLocation } from 'react-router-dom'

const FullMap = () => {
    const [orders, setOrders] = useState<any[]>([])
    const location = useLocation()

    const { var1, var2 } = location.state || ''

    console.log('from', var1, 'to', var2)

    const fetchOrderForLocation = async () => {
        try {
            const response = await axioisInstance.get(`/merchant/orders?location_data=true&from=${var1}&to=${var2}`)

            const ordersData = response.data?.data
            setOrders(ordersData)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchOrderForLocation()
    }, [])

    return (
        <div className="w-full h-full z-10">
            <MultipleMap
                latitudes={orders.map((item) => item.latitude || [])}
                longitudes={orders?.map((item) => item?.longitude || [])}
                amount={orders?.map((item) => item?.amount || [])}
            />
        </div>
    )
}

export default FullMap
