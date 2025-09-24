import RtkQueryService from '@/services/RtkQueryService'
import { CustomQueryResponseTypes } from '../types/customQuery.types'

export const customQueryService = RtkQueryService.injectEndpoints({
    endpoints: (builder) => ({
        executeQuery: builder.query<
            CustomQueryResponseTypes,
            {
                page?: number
                pageSize?: number
                query_name?: string
            }
        >({
            query: (params) => {
                const parameters: Record<string, string | string[]> = {}
                if (params.page) {
                    parameters.p = params.page?.toString()
                }
                if (params.pageSize) {
                    parameters.page_size = params.pageSize?.toString()
                }

                if (params.query_name) {
                    parameters.table_name = params.query_name?.toUpperCase()
                }

                return {
                    url: `/query/execute/List of tables`,
                    method: 'GET',
                    params: parameters,
                }
            },
        }),
    }),
})
