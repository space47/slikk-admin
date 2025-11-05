/* eslint-disable @typescript-eslint/no-explicit-any */
import RtkQueryService from '@/services/RtkQueryService'
import { VendorResponseData } from '../types/vendor.type'

export const vendorService = RtkQueryService.injectEndpoints({
    endpoints: (builder) => ({
        getVendorList: builder.query<VendorResponseData, { page: number; pageSize: number; name: string }>({
            query: (params) => {
                const parameters: Record<string, string | string[] | number> = {}
                if (params.page) parameters.p = params.page
                if (params.pageSize) parameters.page_size = params.pageSize
                if (params.name) parameters.name = params.name

                return {
                    url: `merchant/company`,
                    method: 'GET',
                    params: parameters,
                }
            },
        }),
        addVendors: builder.mutation<{ status: string; message: string }, Record<string, any>>({
            query: (body) => {
                console.log('body is', body)
                return {
                    url: `/merchant/company`,
                    method: 'POST',
                    body,
                }
            },
        }),
        updateVendors: builder.mutation<{ status: string; message: string }, Record<string, any> & { id: number }>({
            query: ({ id, ...body }) => {
                console.log('body is', body)
                return {
                    url: `/merchant/company/${id}`,
                    method: 'POST',
                    body,
                }
            },
        }),
    }),
})
