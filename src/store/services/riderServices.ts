/* eslint-disable @typescript-eslint/no-explicit-any */
import RtkQueryService from '@/services/RtkQueryService'
import {
    RiderAddTypes,
    RiderAttendanceResponseType,
    RiderDetailResponseType,
    RiderDownloadResponse,
    RiderProfileResponseType,
} from '../types/riderAddTypes'

export const ridersService = RtkQueryService.injectEndpoints({
    endpoints: (builder) => ({
        addRiders: builder.mutation<{ success: string }, RiderAddTypes>({
            query: (params) => {
                return {
                    url: `/rider/profile`,
                    method: 'POST',
                    body: {
                        ...params,
                    },
                }
            },
        }),
        editRiders: builder.mutation<{ success: string }, RiderAddTypes>({
            query: (params) => {
                return {
                    url: `/rider/profile/${params.mobile}`,
                    method: 'PATCH',
                    body: {
                        ...params,
                    },
                }
            },
        }),
        riderAttendance: builder.query<
            RiderAttendanceResponseType,
            { page?: number; pageSize?: number; from?: string; to?: string; mobile?: string | string[]; user_type?: string }
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
                if (params.user_type) {
                    parameters.user_type = params.user_type
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
                user_type?: string
                rider_status?: string
                store_id?: number | null
                rider_agency?: string
                shift_start_time?: string
                shift_end_time?: string
            }
        >({
            query: (params) => {
                const parameters: Record<string, string | string[] | boolean | number> = {}
                if (params.page) parameters.p = params.page
                if (params.pageSize) parameters.page_size = params.pageSize
                if (params.from) parameters.from = params.from
                if (params.to) parameters.to = params.to
                if (params.mobile) parameters.mobile = params.mobile
                if (params.isActive) parameters.is_active = params.isActive
                if (params.name) parameters.name = params.name
                if (params.rider_type) parameters.rider_type = params.rider_type
                if (params.user_type) parameters.user_type = params.user_type
                if (params.rider_status) parameters.rider_status = params.rider_status
                if (params.store_id) parameters.store_id = params.store_id
                if (params.rider_agency) parameters.rider_agency = params.rider_agency
                if (params.shift_end_time) parameters.shift_end_time = params.shift_end_time
                if (params.shift_start_time) parameters.shift_start_time = params.shift_start_time

                return {
                    url: `/logistic/riders`,
                    method: 'GET',
                    params: parameters,
                }
            },
        }),
        riderDetailsDownload: builder.query<
            RiderDownloadResponse,
            {
                page?: number
                pageSize?: number
                from?: string
                to?: string
                mobile?: string | string[]
                isActive?: string
                name?: string
                rider_type?: string
                user_type?: string
                rider_status?: string
                store_id?: number | null
                rider_agency?: string
                shift_start_time?: string
                shift_end_time?: string
                download?: string
            }
        >({
            query: (params) => {
                const parameters: Record<string, string | string[] | boolean | number> = {}
                if (params.from) parameters.from = params.from
                if (params.to) parameters.to = params.to
                if (params.mobile) parameters.mobile = params.mobile
                if (params.isActive) parameters.is_active = params.isActive
                if (params.name) parameters.name = params.name
                if (params.rider_type) parameters.rider_type = params.rider_type
                if (params.user_type) parameters.user_type = params.user_type
                if (params.rider_status) parameters.rider_status = params.rider_status
                if (params.store_id) parameters.store_id = params.store_id
                if (params.rider_agency) parameters.rider_agency = params.rider_agency
                if (params.shift_end_time) parameters.shift_end_time = params.shift_end_time
                if (params.shift_start_time) parameters.shift_start_time = params.shift_start_time
                if (params.download) parameters.download = params.download

                return {
                    url: `/logistic/riders`,
                    method: 'GET',
                    params: parameters,
                }
            },
        }),
        riderProfile: builder.query<
            RiderProfileResponseType,
            {
                page?: number
                pageSize?: number
                from?: string
                to?: string
                mobile?: string | string[]
                isActive?: string
                name?: string
                user_type?: string
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
                if (params.user_type) {
                    parameters.user_type = params.user_type
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
