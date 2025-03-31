import RtkQueryService from '@/services/RtkQueryService'
import { CouponResponseTypes } from '../types/couponMain.types'

export const couponService = RtkQueryService.injectEndpoints({
    endpoints: (builder) => ({
        coupon: builder.query<
            CouponResponseTypes,
            {
                mobile?: string
                coupon_code?: string
                coupon_series?: string
                page?: number
                pageSize?: number
                discount_type?: string
                coupon_type?: string
                id?: string | number
            }
        >({
            query: (params) => {
                const parameters: Record<string, string | string[]> = {}

                if (params.mobile) {
                    parameters.mobile = params.mobile?.toString()
                }
                if (params.coupon_code) {
                    parameters.coupon_code = params.coupon_code?.toString()
                }
                if (params.coupon_series) {
                    parameters.coupon_series = params.coupon_series?.toString()
                }
                if (params.page) {
                    parameters.p = params.page?.toString()
                }
                if (params.pageSize) {
                    parameters.page_size = params.pageSize?.toString()
                }
                if (params.discount_type) {
                    parameters.discount_type = params.discount_type?.toString()
                }
                if (params.coupon_type) {
                    parameters.coupon_type = params.coupon_type?.toString()
                }
                if (params.id) {
                    parameters.id = params.id?.toString()
                }

                return {
                    url: `/merchant/coupon`,
                    method: 'GET',
                    params: parameters,
                }
            },
        }),
    }),
})
