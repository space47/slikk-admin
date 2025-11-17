/* eslint-disable @typescript-eslint/no-explicit-any */
import RtkQueryService from '@/services/RtkQueryService'
import { PurchaseOrderResponseType } from '../types/po.types'

export const offersService = RtkQueryService.injectEndpoints({
    endpoints: (builder) => ({
        purchaseOrdersList: builder.query<PurchaseOrderResponseType, { company_id?: string | number; page: number; pageSize: number }>({
            query: (params) => {
                const parameters: Record<string, string | string[]> = {}
                if (params.company_id) parameters.company_id = params.company_id?.toString()
                if (params.page) parameters.p = params.page?.toString()
                if (params.pageSize) parameters.page_size = params.pageSize?.toString()
                return {
                    url: `/merchant/purchase/order`,
                    method: 'GET',
                    params: parameters,
                }
            },
        }),
        // createPurchaseOrder: builder.mutation<{ success: string; message: string }, any>({
        //     query: (params) => {
        //         return {
        //             url: `/merchant/purchase/order`,
        //             method: 'POST',
        //             body: {
        //                 ...params,
        //             },
        //         }
        //     },
        // }),
        // updatePurchaseOrder: builder.mutation<{ success: string; message: string }, any>({
        //     query: (params) => {
        //         return {
        //             url: `/v1/offers`,
        //             method: 'PATCH',
        //             body: {
        //                 ...params,
        //             },
        //         }
        //     },
        // }),
    }),
})
