/* eslint-disable @typescript-eslint/no-explicit-any */
import RtkQueryService from '@/services/RtkQueryService'
import { EventNamesResponseType } from '../types/eventNames.types'

export const eventNameService = RtkQueryService.injectEndpoints({
    endpoints: (builder) => ({
        eventNamesData: builder.query<EventNamesResponseType, { name?: string }>({
            query: (params) => {
                const parameters: Record<string, string | string[]> = {}

                if (params.name) {
                    parameters.name = params.name?.toString()
                }
                return {
                    url: `/notification/event`,
                    method: 'GET',
                    params: parameters,
                }
            },
        }),
    }),
})
