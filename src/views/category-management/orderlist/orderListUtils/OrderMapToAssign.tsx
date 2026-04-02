/* eslint-disable @typescript-eslint/no-explicit-any */
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { OrderMapType } from '@/views/homePage/homes/homes.common'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import MapForOrder from './MapForOrder'

interface props {
    from: string
    to: string
    tabSelect: string
}

const OrderMapToAssign = ({ from, to, tabSelect }: props) => {
    const [orders, setOrders] = useState<OrderMapType[]>([])
    const To_Date = moment(to).add(1, 'days').format('YYYY-MM-DD')

    useEffect(() => {
        const fetchOrderForLocation = async () => {
            let statusData = ''
            if (tabSelect) {
                statusData = `&status=${tabSelect?.toUpperCase()}`
            }
            try {
                const response = await axioisInstance.get(`/merchant/orders?location_data=true&from=${from}&to=${To_Date}${statusData}`)
                const ordersData = response.data?.data
                setOrders(ordersData)
            } catch (error: any) {
                console.log(error)
            }
        }
        fetchOrderForLocation()
    }, [from, to, tabSelect])

    return (
        <div>
            <div className="bg-white p-6 rounded-xl shadow-md">
                <MapForOrder
                    latitudes={orders?.map((item) => item.latitude || []) as number[]}
                    longitudes={orders.map((item) => item.longitude || []) as number[]}
                    amount={orders.map((item) => item.amount || [])}
                    currentStatus={orders.map((item) => item.status || []) as string[]}
                    currentInvoice={orders.map((item) => item.invoice_id || []) as string[]}
                    currentDistance={orders.map((item) => item?.distance || 0)}
                    createTime={orders.map((item) => item?.create_date || []) as string[]}
                />
            </div>
        </div>
    )
}

export default React.memo(OrderMapToAssign)
