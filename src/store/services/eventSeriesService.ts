/* eslint-disable @typescript-eslint/no-explicit-any */
import RtkQueryService from '@/services/RtkQueryService'
import { EventData } from '../types/eventSeries.types'

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
        editEventSeries: builder.mutation<{ success: string }, { id?: number; name: string }>({
            query: (params) => {
                return {
                    url: `/dashboard/promotion/events/${params.id}`,
                    method: 'PATCH',
                    body: {
                        name: params.name, // body for event series
                    },
                }
            },
        }),
        addEventSeries: builder.mutation<{ success: string }, EventData>({
            query: (params) => {
                return {
                    url: `/dashboard/promotion/events`,
                    method: 'POST',
                    body: {
                        name: params.name,
                        event_type: params.event_type,
                        description: params.description,
                        image_web: params.image_web,
                        image_mobile: params.image_mobile,
                        total_slots: params.total_slots,
                        registration_start_date: params.registration_start_date,
                        registration_end_date: params.registration_end_date,
                        event_start_time: params.event_start_time,
                        event_end_time: params.event_end_time,
                        code_prefix: params.code_prefix,
                        is_active: params.is_active,
                        is_public: params.is_public,
                        latitude: params.latitude,
                        longitude: params.longitude,
                        extra_attributes: params.extra_attributes,
                    },
                }
            },
        }),
    }),
})
