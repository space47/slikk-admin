/* eslint-disable @typescript-eslint/no-explicit-any */
import RtkQueryService from '@/services/RtkQueryService'

export const productTypeService = RtkQueryService.injectEndpoints({
    endpoints: (builder) => ({
        createProductType: builder.mutation<{ status: string; message: string }, Record<string, any>>({
            query: (body) => {
                return {
                    url: `product-type`,
                    method: 'POST',
                    body,
                }
            },
        }),
        updateProductType: builder.mutation<{ status: string; message: string }, Record<string, any>>({
            query: ({ body }) => {
                console.log('body is', body)
                return {
                    url: `product-type`,
                    method: 'PATCH',
                    body,
                }
            },
        }),
    }),
})
