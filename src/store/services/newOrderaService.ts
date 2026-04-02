/* eslint-disable @typescript-eslint/no-explicit-any */
import RtkQueryService from '@/services/RtkQueryService'
import { NewOrderResponseType, Order, OrderPatchRequest, QueryParams } from '../types/newOrderTypes'
import { OrderMapType } from '@/views/homePage/homes/homes.common'

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
        getOrderLocations: builder.query<{ status: string; data: OrderMapType[] }, { from: string; to: string; status?: string }>({
            query: (params) => {
                const parameters: Record<string, string | string[]> = {}

                if (params.from) {
                    parameters.from = params.from
                }
                if (params.to) {
                    parameters.to = params.to
                }
                if (params.status) {
                    parameters.status = params.status?.toString()
                }

                return {
                    url: '/merchant/orders?location_data=true',
                    method: 'GET',
                    params: parameters,
                }
            },
            keepUnusedDataFor: 0,
        }),
        getOrderDetails: builder.query<{ data: Order; status: string }, { order_id?: string }>({
            query: ({ order_id }) => ({
                url: `/merchant/order/${order_id}`,
                method: 'GET',
            }),
            keepUnusedDataFor: 0,
        }),
        updateOrder: builder.mutation<{ status: string; message: string }, OrderPatchRequest>({
            query: ({ id, data }) => {
                return {
                    url: `/merchant/order/${id}`,
                    method: 'PATCH',
                    body: data,
                }
            },
        }),
    }),
})
