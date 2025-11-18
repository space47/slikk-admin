/* eslint-disable @typescript-eslint/no-explicit-any */
import RtkQueryService from '@/services/RtkQueryService'
import { LiveZoneResponseType, LiveZones } from '../types/riderZone.type'

export const riderZoneService = RtkQueryService.injectEndpoints({
    endpoints: (builder) => ({
        liveZones: builder.query<LiveZoneResponseType, { page: number; pageSize: number }>({
            query: (params) => {
                const parameters: Record<string, string | number> = {}
                if (params.page) parameters.p = params.page
                if (params.pageSize) parameters.page_size = params.pageSize
                return {
                    url: `/return-order-zones/`,
                    method: 'GET',
                    params: parameters,
                }
            },
        }),
        singleZones: builder.query<LiveZones, { id?: string | number }>({
            query: ({ id }) => {
                return {
                    url: `/return-order-zones/${id ?? ''}/`,
                    method: 'GET',
                }
            },
        }),
        createZone: builder.mutation<LiveZones, Record<string, any>>({
            query: (body) => {
                console.log('body is', body)
                return {
                    url: `/return-order-zones/`,
                    method: 'POST',
                    body,
                }
            },
        }),
        updateZone: builder.mutation<LiveZones, Record<string, any> & { id: number | string }>({
            query: ({ id, ...body }) => {
                console.log('body is', body)
                return {
                    url: `/return-order-zones/${id}/`,
                    method: 'PATCH',
                    body,
                }
            },
        }),
    }),
})
