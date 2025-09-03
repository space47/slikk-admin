/* eslint-disable @typescript-eslint/no-explicit-any */
import OfferQueryService from '@/services/OfferQueryService'
import { OfferDetailResponse, OfferResponse } from '../types/offerEngine.types'

export const offersService = OfferQueryService.injectEndpoints({
    endpoints: (builder) => ({
        offers: builder.query<OfferResponse, { id?: string | number; page: number; pageSize: number }>({
            query: (params) => {
                const parameters: Record<string, string | string[]> = {}

                if (params.id) {
                    parameters.id = params.id?.toString()
                }
                if (params.page) {
                    parameters.p = params.page?.toString()
                }
                if (params.pageSize) {
                    parameters.page_size = params.pageSize?.toString()
                }

                return {
                    url: `/v1/offers${parameters.id ? `/${parameters.id}` : ''}`,
                    method: 'GET',
                    params: parameters,
                }
            },
        }),
        offersDetail: builder.query<OfferDetailResponse, { id: string }>({
            query: (params) => {
                const parameters: Record<string, string | string[]> = {}

                if (params.id) {
                    parameters.id = params.id?.toString()
                }

                return {
                    url: `/v1/offers${parameters.id ? `/${parameters.id}` : ''}`,
                    method: 'GET',
                    params: parameters,
                }
            },
        }),
        offersAdd: builder.mutation<{ success: string; message: string }, any>({
            query: (params) => {
                return {
                    url: `/v1/offers`,
                    method: 'POST',
                    body: {
                        ...params,
                    },
                }
            },
        }),
        offersEdit: builder.mutation<{ success: string; message: string }, any>({
            query: (params) => {
                return {
                    url: `/v1/offers`,
                    method: 'PATCH',
                    body: {
                        ...params,
                    },
                }
            },
        }),
    }),
})
