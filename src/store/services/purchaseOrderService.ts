/* eslint-disable @typescript-eslint/no-explicit-any */
import RtkQueryService from '@/services/RtkQueryService'
import {
    PurchaseOrderItemResponse,
    PurchaseOrderItemSingleResponse,
    PurchaseOrderResponseType,
    PurchaseSingleData,
} from '../types/po.types'

export const purchaseOrderService = RtkQueryService.injectEndpoints({
    endpoints: (builder) => ({
        purchaseOrdersList: builder.query<
            PurchaseOrderResponseType,
            { company_id?: string | number; page: number; pageSize: number; status?: string; brand?: string }
        >({
            query: (params) => {
                const parameters: Record<string, string | string[]> = {}
                if (params.company_id) parameters.company_id = params.company_id?.toString()
                if (params.page) parameters.p = params.page?.toString()
                if (params.pageSize) parameters.page_size = params.pageSize?.toString()
                if (params.status) parameters.status = params.status?.toString()
                if (params.brand) parameters.brand = params.brand?.toString()

                return {
                    url: `/merchant/purchase/order`,
                    method: 'GET',
                    params: parameters,
                }
            },
        }),
        purchaseSingleOrdersList: builder.query<PurchaseSingleData, { order_id?: string | number }>({
            query: (params) => {
                const parameters: Record<string, string | string[]> = {}
                if (params.order_id) parameters.order_id = params.order_id?.toString()

                return {
                    url: `/merchant/purchase/order`,
                    method: 'GET',
                    params: parameters,
                }
            },
        }),
        orderItems: builder.query<PurchaseOrderItemResponse, { purchase_order_id: number | string; page?: number; pageSize?: number }>({
            query: (params) => {
                const parameters: Record<string, string | string[]> = {}
                if (params.purchase_order_id) parameters.purchase_order_id = params.purchase_order_id?.toString()
                if (params.page) parameters.p = params.page?.toString()
                if (params.pageSize) parameters.page_size = params.pageSize?.toString()

                return {
                    url: `/merchant/purchase/bulkupload/orderitem`,
                    method: 'GET',
                    params: parameters,
                }
            },
        }),
        orderItemSingleData: builder.query<PurchaseOrderItemSingleResponse, { item_id: number | string }>({
            query: (params) => {
                const parameters: Record<string, string | string[]> = {}
                if (params.item_id) parameters.item_id = params.item_id?.toString()

                return {
                    url: `/merchant/purchase/orderitem`,
                    method: 'GET',
                    params: parameters,
                }
            },
        }),
        createOrderItems: builder.mutation<{ success: string; message: string }, any>({
            query: (params) => {
                return {
                    url: `/merchant/purchase/orderitem`,
                    method: 'POST',
                    body: {
                        ...params,
                    },
                }
            },
        }),
        updateOrderItems: builder.mutation<{ success: string; message: string }, any>({
            query: (params) => {
                return {
                    url: `/merchant/purchase/orderitem`,
                    method: 'PATCH',
                    body: {
                        ...params,
                    },
                }
            },
        }),
        verifyPo: builder.mutation<{ success: string; message: string }, { id: number; status: string }>({
            query: (params) => {
                return {
                    url: `/merchant/purchase/order/status/${params?.id}`,
                    method: 'PATCH',
                    body: {
                        status: params?.status,
                    },
                }
            },
        }),
    }),
})
