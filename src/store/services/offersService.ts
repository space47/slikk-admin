import RtkQueryService from '@/services/RtkQueryService'
import { CouponResponseTypes } from '../types/couponMain.types'

export const offersService = RtkQueryService.injectEndpoints({
    endpoints: (builder) => ({
        offers: builder.query<
            CouponResponseTypes, // yet to set types
            { id?: string | number }
        >({
            query: (params) => {
                const parameters: Record<string, string | string[]> = {}

                if (params.id) {
                    parameters.id = params.id?.toString()
                }

                return {
                    url: `/v1/offers`,
                    method: 'GET',
                    params: parameters,
                }
            },
        }),
    }),
})
