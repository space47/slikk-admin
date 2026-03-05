/* eslint-disable @typescript-eslint/no-explicit-any */
import RtkQueryService from '@/services/RtkQueryService'
import { IndentDetailsResponseTypes, IndentItemsResponseType, IndentParamsTypes, IndentResponseTypes } from '../types/indent.types'

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
                if (params.status) parameters.status = params.status
                if (params.document_id) parameters.document_id = params.document_id
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
        indentItems: builder.query<
            IndentItemsResponseType,
            { id: string; is_picked: string; paramKey: string; paramValue?: string; page: number; pageSize: number }
        >({
            query: (params) => {
                const parameters: Record<string, string | string[] | number> = {}
                if (params.id) parameters.id = params.id.toString()
                if (params.is_picked) parameters.is_picked = params.is_picked.toString()
                if (params.paramValue) parameters[params.paramKey] = params.paramValue
                if (params.page) parameters.p = params.page
                if (params.pageSize) parameters.page_size = params.pageSize

                return {
                    url: `/indent-note-item`,
                    method: 'GET',
                    params: parameters,
                }
            },
        }),
        indentItemsDownload: builder.query<Blob, { id: string; is_picked: string; paramKey: string; paramValue?: string }>({
            query: (params) => {
                const parameters: Record<string, string | number> = {
                    download: 'true',
                }

                if (params.id) parameters.id = params.id.toString()
                if (params.is_picked) parameters.is_picked = params.is_picked.toString()
                if (params.paramValue) parameters[params.paramKey] = params.paramValue

                return {
                    url: `return/inward/picker`,
                    method: 'GET',
                    params: parameters,
                    responseHandler: (response) => response.blob(), // ✅ for file
                }
            },
        }),
    }),
})
