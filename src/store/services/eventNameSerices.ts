/* eslint-disable @typescript-eslint/no-explicit-any */
import RtkQueryService from '@/services/RtkQueryService'
import { EventNamesResponseType } from '../types/eventNames.types'

export const eventNameService = RtkQueryService.injectEndpoints({
    endpoints: (builder) => ({
        eventNamesData: builder.query<EventNamesResponseType, { event_name?: string; id?: number }>({
            query: (params) => {
                const parameters: Record<string, string | string[]> = {}

                if (params.event_name) {
                    parameters.event_name = params.event_name?.toString()
                }

                return {
                    url: `/notification/event${params.id ? `/${params.id}` : ''}`,
                    method: 'GET',
                    params: parameters,
                }
            },
        }),
        editEventnames: builder.mutation<{ success: string }, { id?: number; name: string }>({
            query: (params) => {
                return {
                    url: `/notification/event/${params.id}`,
                    method: 'PATCH',
                    body: {
                        name: params.name,
                    },
                }
            },
        }),
        addEventnames: builder.mutation<{ success: string }, { name: string }>({
            query: (params) => {
                return {
                    url: `/notification/event`,
                    method: 'POST',
                    body: {
                        name: params.name,
                    },
                }
            },
        }),
        deleteEventnames: builder.mutation<{ success: string }, { id: string | number }>({
            query: (params) => {
                return {
                    url: `/notification/event/${params.id}`,
                    method: 'DELETE',
                }
            },
        }),
    }),
})
