/* eslint-disable @typescript-eslint/no-explicit-any */
import RtkQueryService from '@/services/RtkQueryService'
import {
    PayoutCommercialGetResponse,
    PayoutCommercialRequestType,
    PayoutCommercialResponse,
    RiderPayoutResponse,
} from '../types/riderPayout.types'

export const riderPayoutService = RtkQueryService.injectEndpoints({
    endpoints: (builder) => ({
        payoutList: builder.query<RiderPayoutResponse, { page: number; pageSize: number; name?: string }>({
            query: (params) => {
                const parameters: Record<string, string | number> = {}
                if (params.page) parameters.p = params.page
                if (params.pageSize) parameters.page_size = params.pageSize
                if (params.name) parameters.name = params.name
                return {
                    url: `/logistic/payout`,
                    method: 'GET',
                    params: parameters,
                }
            },
        }),
        singlePayoutList: builder.query<RiderPayoutResponse, { id?: string | number }>({
            query: ({ id }) => {
                return {
                    url: `/logistic/payout`,
                    method: 'GET',
                    params: {
                        payout_id: id,
                    },
                }
            },
        }),
        createPayout: builder.mutation<PayoutCommercialResponse, PayoutCommercialRequestType>({
            query: (body) => {
                return {
                    url: `/logistic/payout`,
                    method: 'POST',
                    body,
                }
            },
        }),
        addPayoutCommercials: builder.mutation<{ status: string; message: string }, Record<string, any>>({
            query: (body) => {
                return {
                    url: `/logistic/agency/commercials`,
                    method: 'POST',
                    body,
                }
            },
        }),
        getPayoutCommercial: builder.query<PayoutCommercialGetResponse, { page: number; pageSize: number; name?: string }>({
            query: (params) => {
                const parameters: Record<string, string | number> = {}
                if (params.page) parameters.p = params.page
                if (params.pageSize) parameters.page_size = params.pageSize
                if (params.name) parameters.name = params.name
                return {
                    url: `/logistic/agency/commercials`,
                    method: 'GET',
                    params: parameters,
                }
            },
        }),
    }),
})
