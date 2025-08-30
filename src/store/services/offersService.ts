import OfferQueryService from '@/services/OfferQueryService'
import { OfferResponse } from '../types/offerEngine.types'

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
    }),
})
