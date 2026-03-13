/* eslint-disable @typescript-eslint/no-explicit-any */
import RtkQueryService from '@/services/RtkQueryService'
import { ConfigValues, VendorDetails, VendorResponseData } from '../types/vendor.type'

export const vendorService = RtkQueryService.injectEndpoints({
    endpoints: (builder) => ({
        getVendorList: builder.query<VendorResponseData, { page: number; pageSize: number; name: string; code: string }>({
            query: (params) => {
                const parameters: Record<string, string | string[] | number> = {}
                if (params.page) parameters.p = params.page
                if (params.pageSize) parameters.page_size = params.pageSize
                if (params.name) parameters.name = params.name
                if (params.code) parameters.code = params.code

                return {
                    url: `merchant/company`,
                    method: 'GET',
                    params: parameters,
                }
            },
        }),
        getSingleVendorList: builder.query<{ status: string; data: VendorDetails }, { id: string | number }>({
            query: (params) => {
                const parameters: Record<string, string | string[] | number> = {}
                if (params.id) parameters.company_id = params.id
                return {
                    url: `merchant/company`,
                    method: 'GET',
                    params: parameters,
                }
            },
        }),
        addVendors: builder.mutation<{ status: string; message: string }, FormData>({
            query: (formData) => {
                console.log('formData is', formData)
                return {
                    url: `/merchant/company`,
                    method: 'POST',
                    body: formData,
                    // ⛔ Do NOT set Content-Type manually — the browser will handle it automatically for FormData
                }
            },
        }),

        updateVendors: builder.mutation<{ status: string; message: string }, FormData & { id: number }>({
            query: ({ id, ...rest }) => {
                const formData = new FormData()

                Object.entries(rest).forEach(([key, value]) => {
                    if (value !== undefined && value !== null) {
                        formData.append(key, value as any)
                    }
                })
                console.log('formData for update', formData)

                return {
                    url: `/merchant/company/${id}`,
                    method: 'POST',
                    body: formData,
                }
            },
        }),
        vendorApproval: builder.mutation<{ status: string; message: string }, Record<string, string | number | Record<string, string>>>({
            query: (body) => {
                return {
                    url: `/merchant/company/status`,
                    method: 'PATCH',
                    body,
                }
            },
        }),
        vendorOnboardingConfiguration: builder.query<{ config: ConfigValues }, { name?: string }>({
            query: (params) => {
                const parameters: Record<string, string | string[] | number> = {}
                if (params.name) parameters.name = params.name
                return {
                    url: `/app/configuration?config_name=vendorOnboardingConfiguration`,
                    method: 'GET',
                    params: parameters,
                }
            },
        }),
    }),
})
