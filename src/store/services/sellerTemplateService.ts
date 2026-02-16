/* eslint-disable @typescript-eslint/no-explicit-any */
import RtkQueryService from '@/services/RtkQueryService'
import { SellerTemplateData, SellerTemplateResponse } from '../types/sellerTemplate.types'

export const vendorService = RtkQueryService.injectEndpoints({
    endpoints: (builder) => ({
        getTemplateList: builder.query<SellerTemplateResponse, { page: number; pageSize: number; name: string }>({
            query: (params) => {
                const parameters: Record<string, string | string[] | number> = {}
                if (params.page) parameters.p = params.page
                if (params.pageSize) parameters.page_size = params.pageSize
                if (params.name) parameters.name = params.name

                return {
                    url: `/notification/email/template`,
                    method: 'GET',
                    params: parameters,
                }
            },
        }),
        getSingleTemplateList: builder.query<{ status: string; messahe: SellerTemplateData }, { id: string | number }>({
            query: (params) => {
                const parameters: Record<string, string | string[] | number> = {}
                if (params.id) parameters.company_id = params.id
                return {
                    url: `/notification/email/template`,
                    method: 'GET',
                    params: parameters,
                }
            },
        }),
        addTemplate: builder.mutation<{ status: string; message: string }, { name: string; email_subject: string; email_body: string }>({
            query: (formData) => {
                return {
                    url: `/notification/email/template`,
                    method: 'POST',
                    body: formData,
                }
            },
        }),
        updateTemplate: builder.mutation<
            { status: string; message: string },
            { name: string; email_subject: string; email_body: string; id: string }
        >({
            query: ({ id, ...rest }) => {
                return {
                    url: `/notification/email/template/${id}`,
                    method: 'POST',
                    body: rest,
                }
            },
        }),
    }),
})
