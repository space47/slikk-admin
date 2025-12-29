/* eslint-disable @typescript-eslint/no-explicit-any */
import RtkQueryService from '@/services/RtkQueryService'
import { NewOrderResponseType } from '../types/newOrderTypes'

type QueryParams = Record<string, string | number | boolean | undefined | any>

export const newOrderService = RtkQueryService.injectEndpoints({
    endpoints: (builder) => ({
        getNewOrders: builder.query<NewOrderResponseType, QueryParams>({
            query: (params) => ({
                url: '/merchant/orders',
                method: 'GET',
                params,
            }),
        }),
    }),
})
