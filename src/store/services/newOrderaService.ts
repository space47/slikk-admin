/* eslint-disable @typescript-eslint/no-explicit-any */
import RtkQueryService from '@/services/RtkQueryService'
import { NewOrderResponseType, Order } from '../types/newOrderTypes'

type QueryParams = Record<string, string | number | boolean | undefined | any>

export const newOrderService = RtkQueryService.injectEndpoints({
    endpoints: (builder) => ({
        getNewOrders: builder.query<NewOrderResponseType, QueryParams>({
            query: (params) => ({
                url: '/merchant/orders',
                method: 'GET',
                params,
            }),
            keepUnusedDataFor: 0,
        }),
        getOrderDetails: builder.query<{ data: Order; status: string }, { order_id?: string }>({
            query: ({ order_id }) => ({
                url: `/merchant/order/${order_id}`,
                method: 'GET',
            }),
            keepUnusedDataFor: 0,
        }),
    }),
})
