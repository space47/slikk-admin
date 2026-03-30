/* eslint-disable @typescript-eslint/no-explicit-any */
import RtkQueryService from '@/services/RtkQueryService'
import { GetQualityCheckListResponse } from '../types/qualityCheckList.types'

interface GetQualityCheckListTypes {
    from?: string
    to?: string
    grn_id?: any
    page?: number
    pageSize?: number
    company_id?: string
    brand_id?: number | string
    qc_passed?: boolean
    qc_failed?: boolean
}

export const qualityCheckService = RtkQueryService.injectEndpoints({
    endpoints: (builder) => ({
        qualityCheckData: builder.query<GetQualityCheckListResponse, GetQualityCheckListTypes>({
            query: (params) => {
                const parameters: Record<string, string | string[] | number | boolean> = {}
                if (params.from) parameters.from = params.from.toString()
                if (params.to) parameters.to = params.to.toString()
                if (params.grn_id) parameters.grn_id = params.grn_id.toString()
                if (params.page) parameters.p = params.page.toString()
                if (params.pageSize) parameters.page_size = params.pageSize.toString()
                if (params.company_id) parameters.company_id = params.company_id.toString()
                if (params.brand_id) parameters.brand_id = params.brand_id
                if (params.qc_failed) parameters.qc_failed = params.qc_failed
                if (params.qc_passed) parameters.qc_passed = params.qc_passed
                return {
                    url: `goods/qualitycheck`,
                    method: 'GET',
                    params: parameters,
                }
            },
        }),
        qcCheckDownload: builder.query<Blob, GetQualityCheckListTypes>({
            query: (params) => {
                const parameters: Record<string, string | number | boolean> = {
                    download: 'true',
                }

                if (params.from) parameters.from = params.from.toString()
                if (params.to) parameters.to = params.to.toString()
                if (params.grn_id) parameters.grn_id = params.grn_id.toString()
                if (params.page) parameters.p = params.page.toString()
                if (params.pageSize) parameters.page_size = params.pageSize.toString()
                if (params.company_id) parameters.company_id = params.company_id.toString()
                if (params.brand_id) parameters.brand_id = params.brand_id
                if (params.qc_failed) parameters.qc_failed = params.qc_failed
                if (params.qc_passed) parameters.qc_passed = params.qc_passed

                return {
                    url: `/goods/qualitycheck`,
                    method: 'GET',
                    params: parameters,
                    responseHandler: (response) => response.blob(), // ✅ for file
                }
            },
        }),
    }),
})
