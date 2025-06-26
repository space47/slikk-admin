import RtkQueryService from '@/services/RtkQueryService'
import { pageSettingsResponseType } from '../types/pageSettings.types'

interface PageSettingsDataTypes {
    page?: number
    pageSize?: number
    sub_page?: number
    pageId?: number
}

export const pageSettingsService = RtkQueryService.injectEndpoints({
    endpoints: (builder) => ({
        pageSettingsData: builder.query<pageSettingsResponseType, PageSettingsDataTypes>({
            query: (params) => {
                const parameters: Record<string, number | string[]> = {}
                if (params.page) parameters.p = params.page
                if (params.pageSize) parameters.page_size = params.pageSize
                if (params.pageId) parameters.page = params.pageId
                if (params.sub_page) parameters.sub_page = params.sub_page
                return {
                    url: `/section`,
                    method: 'GET',
                    params: parameters,
                }
            },
        }),
    }),
})
