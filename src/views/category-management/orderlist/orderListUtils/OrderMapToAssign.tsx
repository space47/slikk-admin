/* eslint-disable @typescript-eslint/no-explicit-any */
import { OrderMapType } from '@/views/homePage/homes/homes.common'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import MapForOrder from './MapForOrder'
import { newOrderService } from '@/store/services/newOrderaService'
import { getApiErrorMessage } from '@/constants/generateErrorMessage'
import { notification } from 'antd'

interface props {
    from: string
    to: string
    tabSelect: string
    refetch?: any
}

const OrderMapToAssign = ({ from, to, tabSelect, refetch }: props) => {
    const [orders, setOrders] = useState<OrderMapType[]>([])
    const To_Date = moment(to).add(1, 'days').format('YYYY-MM-DD')

    const locationCall = newOrderService.useGetOrderLocationsQuery({
        from,
        to: To_Date,
        status: tabSelect ? tabSelect?.toUpperCase() : '',
    })

    useEffect(() => {
        if (locationCall?.isSuccess && locationCall?.data?.data) {
            setOrders(locationCall?.data?.data)
        }
        if (locationCall.isError) {
            const errorData = getApiErrorMessage(locationCall.error)
            notification.error({ message: errorData })
        }
    }, [locationCall.isSuccess, locationCall.isError, locationCall.data?.data, locationCall.error])

    return (
        <div>
            <div className="bg-white p-6 rounded-xl shadow-md">
                <MapForOrder
                    refetch={refetch}
                    mapRefetch={locationCall.refetch}
                    latitudes={orders?.map((item) => item.latitude || []) as number[]}
                    longitudes={orders.map((item) => item.longitude || []) as number[]}
                    amount={orders.map((item) => item.amount || [])}
                    currentStatus={orders.map((item) => item.status || []) as string[]}
                    currentInvoice={orders.map((item) => item.invoice_id || []) as string[]}
                    currentDistance={orders.map((item) => item?.distance || 0)}
                    createTime={orders.map((item) => item?.create_date || []) as string[]}
                    logisticPartner={orders.map((item) => item.logistic_partner || '') as string[]}
                    logisticDetails={orders.map((item) => item.logistic_details || {}) as any}
                />
            </div>
        </div>
    )
}

export default React.memo(OrderMapToAssign)
