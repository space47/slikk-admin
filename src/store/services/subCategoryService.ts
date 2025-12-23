/* eslint-disable @typescript-eslint/no-explicit-any */
import RtkQueryService from '@/services/RtkQueryService'

export const subCategoryService = RtkQueryService.injectEndpoints({
    endpoints: (builder) => ({
        createSubCategory: builder.mutation<{ status: string; message: string }, Record<string, any>>({
            query: (body) => {
                return {
                    url: `sub-category`,
                    method: 'POST',
                    body,
                }
            },
        }),
        updateSubCategory: builder.mutation<{ status: string; message: string }, Record<string, any>>({
            query: ({ body }) => {
                console.log('body is', body)
                return {
                    url: `sub-category`,
                    method: 'PATCH',
                    body,
                }
            },
        }),
    }),
})
