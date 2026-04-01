/* eslint-disable @typescript-eslint/no-explicit-any */
import RtkQueryService from '@/services/RtkQueryService'
import { Rtv_Data_Response, Rtv_Get_Params, Rtv_Product_Params, Rtv_Products_Response, Rtv_status_request } from '../types/rtv.types'

export const rtvService = RtkQueryService.injectEndpoints({
    endpoints: (builder) => ({
        rtvData: builder.query<Rtv_Data_Response, Rtv_Get_Params>({
            query: (params) => {
                const parameters: Record<string, string | number> = {}
                if (params.page) parameters.p = params.page
                if (params.pageSize) parameters.page_size = params.pageSize
                if (params.from) parameters.from = params.from
                if (params.to) parameters.to = params.to
                if (params.rtv_number) parameters.rtv_number = params.rtv_number
                if (params.rtv_id) parameters.rtv_id = params.rtv_id
                if (params.store_id) parameters.store_id = params.store_id

                return {
                    url: `/rtv`,
                    method: 'GET',
                    params: parameters,
                    cache: 'no-cache',
                }
            },
        }),
        rtvProducts: builder.query<Rtv_Products_Response, Rtv_Product_Params>({
            query: (params) => {
                const parameters: Record<string, string | number | boolean> = {}
                if (params.page) parameters.p = params.page
                if (params.pageSize) parameters.page_size = params.pageSize
                if (params.is_picked) parameters.is_picked = params.is_picked
                if (params.rtv_number) parameters.rtv_number = params.rtv_number
                if (params.rtv_id) parameters.rtv_id = params.rtv_id
                if (params.sku) parameters.sku = params.sku
                if (params.force_picked) parameters.force_picked = params.force_picked

                console.log('parameters', parameters)
                return {
                    url: `/rtv-products`,
                    method: 'GET',
                    params: parameters,
                }
            },
        }),
        rtvProductsDownload: builder.query<Blob, Rtv_Product_Params>({
            query: (params) => {
                const parameters: Record<string, string | number> = { download: 'true' }
                if (params.page) parameters.p = params.page
                if (params.pageSize) parameters.page_size = params.pageSize
                if (params.is_picked) parameters.is_picked = params.is_picked
                if (params.rtv_number) parameters.rtv_number = params.rtv_number
                if (params.rtv_id) parameters.rtv_id = params.rtv_id
                if (params.sku) parameters.sku = params.sku

                return {
                    url: `/rtv-products`,
                    method: 'GET',
                    params: parameters,
                    responseHandler: (response) => response.blob(),
                }
            },
        }),
        packRtv: builder.mutation<{ status: string; message: string }, Record<string, any>>({
            query: (body) => {
                console.log('body is', body)
                return {
                    url: `/rtv`,
                    method: 'POST',
                    body,
                }
            },
        }),
        updateRtv: builder.mutation<{ status: string; message: string }, Record<string, any> & { id: number | string }>({
            query: ({ id, ...body }) => {
                return {
                    url: `/rtv/${id}`,
                    method: 'PATCH',
                    body,
                }
            },
        }),
        updateRtvItems: builder.mutation<{ status: string; message: string }, Record<string, any>>({
            query: ({ ...body }) => {
                return {
                    url: `/rtv-products`,
                    method: 'PATCH',
                    body,
                }
            },
        }),
        assignRtvPicker: builder.mutation<{ status: string; message: string }, Record<string, any> & { id: number | string }>({
            query: ({ id, ...body }) => {
                console.log('body is', body)
                return {
                    url: `/rtv/${id}`,
                    method: 'PATCH',
                    body,
                }
            },
        }),
        createGdnFromRtv: builder.mutation<{ status: string; message: string }, { id: number }>({
            query: ({ id }) => {
                return {
                    url: `/rtv/${id}`,
                    method: 'PATCH',
                    body: {
                        action: 'create_gdn',
                    },
                }
            },
        }),
        updateRtvProducts: builder.mutation<{ status: string; message: string }, Record<string, any>>({
            query: (body) => {
                return {
                    url: `/rtv`,
                    method: 'PATCH',
                    body,
                }
            },
        }),
        updateRtvStatus: builder.mutation<{ status: string; message: string }, Rtv_status_request>({
            query: ({ rtv_id, data }) => {
                return {
                    url: `/rtv/${rtv_id}`,
                    method: 'PATCH',
                    body: data,
                }
            },
        }),
    }),
})
