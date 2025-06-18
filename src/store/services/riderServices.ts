/* eslint-disable @typescript-eslint/no-explicit-any */
import RtkQueryService from '@/services/RtkQueryService'
import { RiderAddTypes, RiderAttendanceResponseType, RiderDetailResponseType, RiderProfileResponseType } from '../types/riderAddTypes'

export const ridersService = RtkQueryService.injectEndpoints({
    endpoints: (builder) => ({
        addRiders: builder.mutation<{ success: string }, RiderAddTypes>({
            query: (params) => {
                return {
                    url: `/rider/profile`,
                    method: 'POST',
                    body: {
                        mobile: params.mobile,
                        first_name: params.first_name,
                        last_name: params.last_name,
                        rider_type: params.rider_type,
                        service_latitude: params.service_latitude,
                        service_longitude: params.service_longitude,
                        shift_start_time: params.shift_start_time,
                        shift_end_time: params.shift_end_time,
                    },
                }
            },
        }),
        riderAttendance: builder.query<
            RiderAttendanceResponseType,
            { page?: number; pageSize?: number; from?: string; to?: string; mobile?: string | string[] }
        >({
            query: (params) => {
                const parameters: Record<string, string | string[]> = {}

                if (params.page) {
                    parameters.p = params.page?.toString()
                }

                if (params.pageSize) {
                    parameters.page_size = params.pageSize?.toString()
                }

                if (params.from) {
                    parameters.from = params.from
                }

                if (params.to) {
                    parameters.to = params.to
                }

                if (params.mobile) {
                    parameters.mobile = params.mobile
                }

                return {
                    url: `/rider/attendance`,
                    method: 'GET',
                    params: parameters,
                }
            },
        }),

        riderDetails: builder.query<
            RiderDetailResponseType,
            {
                page?: number
                pageSize?: number
                from?: string
                to?: string
                mobile?: string | string[]
                isActive?: string
                name?: string
                rider_type?: string
            }
        >({
            query: (params) => {
                const parameters: Record<string, string | string[] | boolean> = {}
                if (params.page) {
                    parameters.p = params.page?.toString()
                }
                if (params.pageSize) {
                    parameters.page_size = params.pageSize?.toString()
                }
                if (params.from) {
                    parameters.from = params.from
                }
                if (params.to) {
                    parameters.to = params.to
                }
                if (params.mobile) {
                    parameters.mobile = params.mobile
                }
                if (params.isActive) {
                    parameters.is_active = params.isActive
                }
                if (params.name) {
                    parameters.name = params.name
                }
                if (params.rider_type) {
                    parameters.rider_type = params.rider_type
                }
                return {
                    url: `/logistic/riders`,
                    method: 'GET',
                    params: parameters,
                }
            },
        }),
        riderProfile: builder.query<
            RiderProfileResponseType,
            { page?: number; pageSize?: number; from?: string; to?: string; mobile?: string | string[]; isActive?: string; name?: string }
        >({
            query: (params) => {
                const parameters: Record<string, string | string[] | boolean> = {}
                if (params.page) {
                    parameters.p = params.page?.toString()
                }
                if (params.pageSize) {
                    parameters.page_size = params.pageSize?.toString()
                }
                if (params.from) {
                    parameters.from = params.from
                }
                if (params.to) {
                    parameters.to = params.to
                }
                if (params.mobile) {
                    parameters.mobile = params.mobile
                }
                if (params.isActive) {
                    parameters.is_active = params.isActive
                }
                if (params.name) {
                    parameters.name = params.name
                }
                return {
                    url: `/rider/profile`,
                    method: 'GET',
                    params: parameters,
                }
            },
        }),

        riderAttendanceReport: builder.query<
            RiderAttendanceResponseType,
            { page?: number; pageSize?: number; from?: string; to?: string; mobile?: string | string[] }
        >({
            query: (params) => {
                const parameters: Record<string, string | string[]> = {}

                if (params.page) {
                    parameters.p = params.page?.toString()
                }

                if (params.pageSize) {
                    parameters.page_size = params.pageSize?.toString()
                }

                if (params.from) {
                    parameters.from = params.from
                }

                if (params.to) {
                    parameters.to = params.to
                }

                if (params.mobile) {
                    parameters.mobile = params.mobile
                }

                return {
                    url: `/rider/attendance/report`,
                    method: 'GET',
                    params: parameters,
                }
            },
        }),
    }),
})
