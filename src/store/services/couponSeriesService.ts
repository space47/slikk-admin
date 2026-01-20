/* eslint-disable @typescript-eslint/no-explicit-any */
import RtkQueryService from '@/services/RtkQueryService'
import { CouponGenerateBodyType, CouponSeriesTypes } from '../types/couponSeries.types'

type updateBody = {
    id: string | number
    data: Record<string, number | any | string>
}

export const couponSeriesService = RtkQueryService.injectEndpoints({
    endpoints: (builder) => ({
        couponSeries: builder.query<
            CouponSeriesTypes,
            { campaign?: string; page?: number; pageSize?: number; discount_type?: string; coupon_type?: string; id?: string | number }
        >({
            query: (params) => {
                const parameters: Record<string, string | string[]> = {}

                if (params.campaign) {
                    parameters.campaign = params.campaign?.toString()
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
                    url: `/couponseries`,
                    method: 'GET',
                    params: parameters,
                }
            },
        }),
        addCouponSeries: builder.mutation<{ success: string }, Record<string, string | number | any>>({
            query: (params) => {
                return {
                    url: `/couponseries`,
                    method: 'POST',
                    body: params,
                }
            },
        }),
        editCouponSeries: builder.mutation<{ success: string }, updateBody>({
            query: ({ id, data }) => {
                return {
                    url: `/couponseries/${id}`,
                    method: 'PATCH',
                    body: data,
                }
            },
        }),
        generateCouponFromSeries: builder.mutation<{ success: string }, CouponGenerateBodyType>({
            query: (params) => {
                const formData = new FormData()

                Object.entries(params).forEach(([key, value]) => {
                    if (value !== undefined && value !== null && value !== '') {
                        formData.append(key, value as any)
                    }
                })
                return {
                    url: `/merchant/coupon/generate`,
                    method: 'POST',
                    body: formData,
                }
            },
        }),
    }),
})
