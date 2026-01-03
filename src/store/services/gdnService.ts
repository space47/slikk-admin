/* eslint-disable @typescript-eslint/no-explicit-any */
import RtkQueryService from '@/services/RtkQueryService'
import {
    CreateShipmentDetails,
    GDNDetails,
    GdnParamType,
    GdnProductsResponseType,
    GdnResponseType,
    UpdateGdnArgs,
} from '../types/gdn.types'

export const gdnService = RtkQueryService.injectEndpoints({
    endpoints: (builder) => ({
        gdnDataGet: builder.query<GdnResponseType, GdnParamType>({
            query: (params) => {
                const parameters: Record<string, string | string[] | number> = {}

                if (params.company) parameters.company_code = params.company
                if (params.page) parameters.p = params.page.toString()
                if (params.pageSize) parameters.page_size = params.pageSize.toString()
                if (params.store_id) parameters.store_id = params.store_id

                return {
                    url: `goods/dispatch`,
                    method: 'GET',
                    params: parameters,
                }
            },
        }),
        gdnSingleDetails: builder.query<{ data: GDNDetails }, { id?: string; gdn_number?: string }>({
            query: (params) => {
                const parameters: Record<string, string | string[]> = {}
                if (params.gdn_number) parameters.gdn_number = params.gdn_number.toString()
                return {
                    url: `/goods/dispatch/${params.id}/detail`,
                    method: 'GET',
                    params: parameters,
                }
            },
        }),
        gdnItemsDetails: builder.query<GdnProductsResponseType, { gdn_number?: string; page: number; pageSize: number; sku?: string }>({
            query: (params) => {
                const parameters: Record<string, string | string[] | number> = {}
                if (params.gdn_number) parameters.gdn_number = params.gdn_number
                if (params.page) parameters.p = params.page
                if (params.pageSize) parameters.page_size = params.pageSize
                if (params.sku) parameters.sku = params.sku

                return {
                    url: `/goods/dispatchproduct`,
                    method: 'GET',
                    params: parameters,
                }
            },
        }),
        createShipment: builder.query<{ status: string; data: CreateShipmentDetails }, { id: string | number }>({
            query: (params) => {
                return {
                    url: `/goods/dispatch/shipment/create/${params?.id}`,
                    method: 'GET',
                }
            },
        }),
        regenerateGdn: builder.query<
            any,
            {
                id: string
                document_number: string
                download_type?: 'csv'
            }
        >({
            query: ({ id, document_number, download_type }) => {
                const params: Record<string, string | boolean> = {
                    download: true,
                    regenerate: true,
                    document_number,
                }

                if (download_type) {
                    params.download_type = download_type
                }

                return {
                    url: `/goods/dispatch/${id}/detail`,
                    method: 'GET',
                    params,
                }
            },
        }),

        syncGdn: builder.mutation<{ status: string }, Record<string, any>>({
            query: (body) => {
                return {
                    url: `/goods/dispatch-synctoinventory`,
                    method: 'POST',
                    body,
                }
            },
        }),
        updateGdn: builder.mutation<{ status: string; message: string }, UpdateGdnArgs>({
            query: ({ id, data }) => {
                return {
                    url: `/goods/dispatch/${id}`,
                    method: 'PATCH',
                    body: data,
                }
            },
        }),
        addNewGdn: builder.mutation<{ status: string; message: string }, Record<string, string | number>>({
            query: (body) => {
                return {
                    url: `/goods/dispatch/`,
                    method: 'POST',
                    body,
                }
            },
        }),
        deleteGdn: builder.mutation<{ status: string; message: string }, { id: string | number }>({
            query: (body) => {
                return {
                    url: `/goods/dispatch/${body.id}`,
                    method: 'DELETE',
                }
            },
        }),
    }),
})
