/* eslint-disable @typescript-eslint/no-explicit-any */
import RtkQueryService from '@/services/RtkQueryService'
import { IndentDetailsResponseTypes, IndentParamsTypes, IndentResponseTypes } from '../types/indent.types'

export const indentService = RtkQueryService.injectEndpoints({
    endpoints: (builder) => ({
        indentData: builder.query<IndentResponseTypes, IndentParamsTypes>({
            query: (params) => {
                const parameters: Record<string, string | string[]> = {}
                if (params.from) parameters.from = params.from.toString()
                if (params.to) parameters.to = params.to.toString()
                if (params.mobile) parameters.mobile = params.mobile.toString()
                if (params.page) parameters.p = params.page.toString()
                if (params.pageSize) parameters.page_size = params.pageSize.toString()
                if (params.store_id) parameters.store_id = params.store_id.toString()
                if (params.source_type) parameters.store_type = params.source_type.toString()
                if (params.from) parameters.from = params.from
                if (params.to) parameters.to = params.to
                return {
                    url: `indent`,
                    method: 'GET',
                    params: parameters,
                }
            },
        }),
        indentDetails: builder.query<IndentDetailsResponseTypes, { id: string; is_picked: string }>({
            query: (params) => {
                const parameters: Record<string, string | string[]> = {}
                if (params.id) parameters.id = params.id.toString()
                if (params.is_picked) parameters.is_picked = params.is_picked.toString()
                return {
                    url: `/indent`,
                    method: 'GET',
                    params: parameters,
                }
            },
        }),
    }),
})
