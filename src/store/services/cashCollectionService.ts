/* eslint-disable @typescript-eslint/no-explicit-any */
import RtkQueryService from '@/services/RtkQueryService'
import { CashResponseType } from '../types/cashCollection.types'

export const cashCollectionService = RtkQueryService.injectEndpoints({
    endpoints: (builder) => ({
        cashCollection: builder.query<
            CashResponseType,
            { page?: number; pageSize?: number; from?: string; to?: string; mobile?: string; download?: string }
        >({
            query: (params) => {
                const parameters: Record<string, string | string[]> = {}
                if (params.page) {
                    parameters.p = params.page?.toString()
                }
                if (params.pageSize) {
                    parameters.page_size = params.pageSize?.toString()
                }
                if (params.from) {
                    parameters.from = params.from
                }
                if (params.to) {
                    parameters.to = params.to
                }
                if (params.mobile) parameters.mobile = params.mobile

                return {
                    url: `/rider/cash/collection`,
                    method: 'GET',
                    params: parameters,
                }
            },
        }),
        createCashCollection: builder.mutation<{ status: string; message: string }, { task_date: string[] }>({
            query: ({ task_date }) => {
                return {
                    url: `rider/cash/daily/create`,
                    method: 'POST',
                    body: {
                        task_date,
                    },
                }
            },
        }),
        updateCashCollection: builder.mutation<
            { status: string; message: string },
            { mobile: string; collection_date: string; amount: number }
        >({
            query: ({ amount, collection_date, mobile }) => {
                return {
                    url: `rider/cash/daily/create`,
                    method: 'POST',
                    body: {
                        amount,
                        collection_date,
                        mobile,
                    },
                }
            },
        }),
    }),
})
