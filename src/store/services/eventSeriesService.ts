/* eslint-disable @typescript-eslint/no-explicit-any */
import RtkQueryService from '@/services/RtkQueryService'

export const eventSeriesService = RtkQueryService.injectEndpoints({
    endpoints: (builder) => ({
        // ResponseType
        eventSeriesData: builder.query<any, { from?: string; to?: string; event_type?: string; event_id?: number; mobile?: string }>({
            query: (params) => {
                const parameters: Record<string, string | string[]> = {}
                if (params.from) {
                    parameters.from = params.from?.toString()
                }
                if (params.to) {
                    parameters.to = params.to?.toString()
                }
                if (params.event_type) {
                    parameters.event_type = params.event_type?.toString()
                }
                if (params.event_id) {
                    parameters.event_id = params.event_id?.toString()
                }
                if (params.mobile) {
                    parameters.mobile = params.mobile?.toString()
                }
                return {
                    url: `api`,
                    method: 'GET',
                    params: parameters,
                }
            },
        }),
        editEventSeries: builder.mutation<{ success: string }, { id?: number; name: string }>({
            query: (params) => {
                return {
                    url: `api/${params.id}`,
                    method: 'PATCH',
                    body: {
                        name: params.name,
                    },
                }
            },
        }),
        addEventSeries: builder.mutation<{ success: string }, { name: string }>({
            query: (params) => {
                return {
                    url: `api`,
                    method: 'POST',
                    body: {
                        name: params.name,
                    },
                }
            },
        }),
    }),
})
