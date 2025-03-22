/* eslint-disable @typescript-eslint/no-explicit-any */
import RtkQueryService from '@/services/RtkQueryService'
import { CouponSeriesBodyType, CouponSeriesTypes } from '../types/couponSeries.types'

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
        addCouponSeries: builder.mutation<{ success: string }, CouponSeriesBodyType>({
            query: (params) => {
                return {
                    url: `/couponseries`,
                    method: 'POST',
                    body: {
                        discount_type: params.discount_type,
                        value: params.value,
                        image: params.image,
                        min_cart_value: params.min_cart_value,
                        max_count: params.max_count,
                        maximum_discount: params.maximum_discount,
                        valid_from: params.valid_from,
                        valid_to: params.valid_to,
                        description: params.description,
                        max_count_per_user: params.max_count_per_user,
                        campaign: params.campaign,
                        coupon_type: params.coupon_type,
                        is_public: params.is_public,
                        extra_attributes: params.extra_attributes,
                    },
                }
            },
        }),
        editCouponSeries: builder.mutation<{ success: string }, CouponSeriesBodyType & { id: string | number }>({
            query: (params) => {
                return {
                    url: `/couponseries/${params.id}`,
                    method: 'PATCH',
                    body: {
                        ...params,
                    },
                }
            },
        }),
        // addCouponFromSeries: builder.mutation<{ success: string }, any>({
        //     query: (params) => {
        //         return {
        //             url: `/merchant/coupon/generate`,
        //             method: 'POST',
        //             body: {
        //                 ...params,
        //             },
        //         }
        //     },
        // }),
    }),
})
