/* eslint-disable @typescript-eslint/no-explicit-any */
import RtkQueryService from '@/services/RtkQueryService'
import { GRNDetails, GrnItemsResponseType, GrnResponseType, InwardParamType } from '../types/inward.types'
import { UpdateGdnArgs } from '../types/gdn.types'

export const inwardService = RtkQueryService.injectEndpoints({
    endpoints: (builder) => ({
        inwardDataGet: builder.query<GrnResponseType, InwardParamType>({
            query: (params) => {
                const parameters: Record<string, string | string[] | number> = {}
                if (params.document_number) parameters.document_number = params.document_number
                if (params.company) parameters.company_code = params.company
                if (params.page) parameters.p = params.page.toString()
                if (params.pageSize) parameters.page_size = params.pageSize.toString()
                if (params.store_id) parameters.store_id = params.store_id

                return {
                    url: `goods/received/${params.id}`,
                    method: 'GET',
                    params: parameters,
                }
            },
        }),
        inwardSingleDetails: builder.query<{ data: GRNDetails }, { id?: string; grn_number?: string; grn_id?: number | string }>({
            query: (params) => {
                const parameters: Record<string, string | string[] | number> = {}
                if (params.grn_number) parameters.grn_number = params.grn_number.toString()
                if (params.grn_id) parameters.grn_id = params.grn_id
                return {
                    url: `goods/received`,
                    method: 'GET',
                    params: parameters,
                }
            },
        }),
        gdnItemsDetails: builder.query<
            GrnItemsResponseType,
            { grn_number?: string; page: number; pageSize: number; sku?: string; grn_id?: number | string }
        >({
            query: (params) => {
                const parameters: Record<string, string | string[] | number> = {}
                if (params.grn_number) parameters.grn_number = params.grn_number
                if (params.page) parameters.p = params.page
                if (params.pageSize) parameters.page_size = params.pageSize
                if (params.sku) parameters.sku = params.sku
                if (params.grn_id) parameters.grn_id = params.grn_id

                return {
                    url: `/goods/qualitycheck`,
                    method: 'GET',
                    params: parameters,
                }
            },
        }),
        // createShipment: builder.query<{ status: string; data: CreateShipmentDetails }, { id: string | number }>({
        //     query: (params) => {
        //         return {
        //             url: `/goods/dispatch/shipment/create/${params?.id}`,
        //             method: 'GET',
        //         }
        //     },
        // }),
        preSignUrl: builder.query<{ status: string; data: string }, { file_url: string }>({
            query: (params) => {
                return {
                    url: `/file/presign`,
                    method: 'GET',
                    params,
                }
            },
        }),
        regenerateGrn: builder.query<
            any,
            {
                companyId: number
                document_number: string
                download_type?: 'csv'
            }
        >({
            query: ({ companyId, document_number, download_type }) => {
                const params: Record<string, string | boolean> = {
                    download: true,
                    regenerate: true,
                    document_number,
                }

                if (download_type) {
                    params.download_type = download_type
                }

                return {
                    url: `/goods/received/${companyId}/detail`,
                    method: 'GET',
                    params,
                }
            },
        }),

        syncGrn: builder.mutation<{ status: string }, Record<string, any>>({
            query: (body) => {
                return {
                    url: `/goods/synctoinventory`,
                    method: 'POST',
                    body,
                }
            },
        }),
        updateGrn: builder.mutation<{ status: string; message: string }, UpdateGdnArgs>({
            query: ({ id, data }) => {
                return {
                    url: `/goods/received/${id}`,
                    method: 'PATCH',
                    body: data,
                }
            },
        }),
        addNewGrn: builder.mutation<
            { status: string; message: string },
            Record<string, string | number | Date | null | boolean | undefined>
        >({
            query: (body) => {
                return {
                    url: `/goods/received`,
                    method: 'POST',
                    body,
                }
            },
        }),
    }),
})
