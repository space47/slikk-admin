/* eslint-disable @typescript-eslint/no-explicit-any */
import RtkQueryService from '@/services/RtkQueryService'
import { RiderAddTypes, RiderAttendanceResponseType } from '../types/riderAddTypes'

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
                console.log('1st')
                const parameters: Record<string, string | string[]> = {}

                if (params.page) {
                    parameters.p = params.page?.toString()
                }
                console.log('2st')
                if (params.pageSize) {
                    parameters.page_size = params.pageSize?.toString()
                }
                console.log('3st')
                if (params.from) {
                    parameters.from = params.from
                }

                console.log('4st')
                if (params.to) {
                    parameters.to = params.to
                }
                console.log('5st')
                if (params.mobile) {
                    parameters.mobile = params.mobile
                }
                console.log('6st')

                return {
                    url: `/rider/attendance`,
                    method: 'GET',
                    params: parameters,
                }
            },
        }),
    }),
})
