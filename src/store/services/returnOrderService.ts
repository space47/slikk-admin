/* eslint-disable @typescript-eslint/no-explicit-any */
import RtkQueryService from '@/services/RtkQueryService'
import { LocationReturnType } from '../types/returnOrderData.types'

export const returnOrderDataService = RtkQueryService.injectEndpoints({
    endpoints: (builder) => ({
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
    }),
})
