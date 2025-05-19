/* eslint-disable @typescript-eslint/no-explicit-any */
import RtkQueryService from '@/services/RtkQueryService'
import { EventData, EventSeriesActionTypes } from '../types/eventSeries.types'

interface GetEventSeriesTypes {
    from?: string
    to?: string
    event_type?: string
    event_id?: any
    mobile?: string
    page?: number
    pageSize?: number
    event_name?: string
}

export const eventSeriesService = RtkQueryService.injectEndpoints({
    endpoints: (builder) => ({
        // ResponseType
        eventSeriesData: builder.query<any, GetEventSeriesTypes>({
            query: (params) => {
                const parameters: Record<string, string | string[]> = {}
                if (params.from) parameters.from = params.from.toString()
                if (params.to) parameters.to = params.to.toString()
                if (params.event_type) parameters.event_type = params.event_type.toString()
                if (params.event_id) parameters.event_id = params.event_id.toString()
                if (params.mobile) parameters.mobile = params.mobile.toString()
                if (params.page) parameters.p = params.page.toString()
                if (params.event_name) parameters.event_name = params.event_name.toString()
                if (params.pageSize) parameters.page_size = params.pageSize.toString()
                return {
                    url: `/dashboard/promotion/events`,
                    method: 'GET',
                    params: parameters,
                }
            },
        }),
        eventSeriesDetails: builder.query<any, GetEventSeriesTypes>({
            query: (params) => {
                const parameters: Record<string, string | string[]> = {}
                if (params.event_id) parameters.event_id = params.event_id.toString()
                return {
                    url: `/dashboard/promotion/events`,
                    method: 'GET',
                    params: parameters,
                }
            },
        }),
        editEventSeries: builder.mutation<{ success: string }, { id: any; body: any }>({
            query: ({ id, body }) => {
                console.log('iniside', body)
                return {
                    url: `/dashboard/promotion/events/${id}`,
                    method: 'PATCH',
                    body: body,
                }
            },
        }),
        addEventSeries: builder.mutation<{ success: string }, EventData>({
            query: (params) => {
                return {
                    url: `/dashboard/promotion/events`,
                    method: 'POST',
                    body: params,
                }
            },
        }),
        actionEventSeries: builder.mutation<{ success: string }, EventSeriesActionTypes>({
            query: (params) => {
                return {
                    url: `/dashboard/user/events`,
                    method: 'POST',
                    body: params,
                }
            },
        }),
    }),
})
