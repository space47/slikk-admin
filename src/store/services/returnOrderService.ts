/* eslint-disable @typescript-eslint/no-explicit-any */
import RtkQueryService from '@/services/RtkQueryService'
import {
    LocationReturnType,
    ReturnData,
    ReturnItemConfigurationResponse,
    ReturnManagementResponse,
    ReturnOrderListResponseType,
    ReturnOrderQueryParams,
    ReturnOrderResponse,
} from '../types/returnOrderData.types'

export const returnOrderDataService = RtkQueryService.injectEndpoints({
    endpoints: (builder) => ({
        getNewReturnOrders: builder.query<ReturnOrderListResponseType, ReturnOrderQueryParams>({
            query: (params) => ({
                url: '/merchant/return_orders',
                method: 'GET',
                params,
            }),
            keepUnusedDataFor: 0,
        }),
        returnOrderLocation: builder.query<{ success: string; data: LocationReturnType[] }, { from?: string; to?: string }>({
            query: (params) => {
                const parameters: Record<string, string | string[]> = {}
                if (params.from) {
                    parameters.from = params.from?.toString()
                }
                if (params.to) {
                    parameters.to = params.to?.toString()
                }
                return {
                    url: `/merchant/return_orders?location_data=true`,
                    method: 'GET',
                    params: parameters,
                }
            },
        }),
        returnDetails: builder.query<ReturnOrderResponse, { return_id: string }>({
            query: ({ return_id }) => ({
                url: `/merchant/return_order/${return_id}`,
                method: 'GET',
            }),
            keepUnusedDataFor: 0,
        }),
        returnManagement: builder.query<
            ReturnManagementResponse,
            {
                id?: number | string
                page: number
                pageSize: number
                status?: string
                scanValue?: string
                scanType?: string
                brand?: string
                company_code?: string
            }
        >({
            query: (params) => {
                const parameters: Record<string, string | number> = {}
                if (params.page) parameters.p = params.page
                if (params.pageSize) parameters.page_size = params.pageSize
                if (params.status) parameters.status = params.status
                if (params.brand) parameters.brand = params.brand
                if (params.company_code) parameters.company_code = params.company_code
                if (params.scanValue && params.scanType) {
                    parameters[params.scanType] = params.scanValue
                }
                return {
                    url: `return/inward/picker`,
                    method: 'GET',
                    params: parameters,
                }
            },
        }),
        returnManagementDownload: builder.query<
            Blob,
            {
                id?: number | string
                status?: string
                scanValue?: string
                scanType?: string
                brand?: string
                company_code?: string
            }
        >({
            query: (params) => {
                const parameters: Record<string, string | number> = {
                    download: 'true',
                }

                if (params.status) parameters.status = params.status
                if (params.brand) parameters.brand = params.brand
                if (params.company_code) parameters.company_code = params.company_code

                if (params.scanValue && params.scanType) {
                    parameters[params.scanType] = params.scanValue
                }

                return {
                    url: `return/inward/picker`,
                    method: 'GET',
                    params: parameters,
                    responseHandler: (response) => response.blob(), // ✅ for file
                }
            },
        }),
        returnItemDetails: builder.query<{ data: ReturnData; status?: string }, { id?: number | string; return_item_id?: string | number }>(
            {
                query: (params) => {
                    const parameters: Record<string, string | number> = {}
                    if (params.return_item_id) parameters.return_item_id = params.return_item_id
                    if (params.id) parameters.id = params.id
                    return {
                        url: `return/inward/picker`,
                        method: 'GET',
                        params,
                    }
                },
            },
        ),
        returnItemReasons: builder.query<ReturnItemConfigurationResponse, { name?: string }>({
            query: () => {
                return {
                    url: `/app/configuration?config_name=returnItemConfiguration`,
                    method: 'GET',
                }
            },
        }),
    }),
})
