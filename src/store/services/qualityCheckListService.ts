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
}

export const qualityCheckService = RtkQueryService.injectEndpoints({
    endpoints: (builder) => ({
        qualityCheckData: builder.query<GetQualityCheckListResponse, GetQualityCheckListTypes>({
            query: (params) => {
                const parameters: Record<string, string | string[]> = {}
                if (params.from) parameters.from = params.from.toString()
                if (params.to) parameters.to = params.to.toString()
                if (params.grn_id) parameters.grn_id = params.grn_id.toString()
                if (params.page) parameters.p = params.page.toString()
                if (params.pageSize) parameters.page_size = params.pageSize.toString()
                if (params.company_id) parameters.company_id = params.company_id.toString()
                return {
                    url: `goods/qualitycheck`,
                    method: 'GET',
                    params: parameters,
                }
            },
        }),
    }),
})
