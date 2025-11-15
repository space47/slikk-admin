/* eslint-disable @typescript-eslint/no-explicit-any */
import RtkQueryService from '@/services/RtkQueryService'
import { particularPickerType, pickerResponseType } from '../types/picker.types'

interface PickerBoardTypes {
    from?: string
    to?: string
    mobile?: string
    name?: string
    checkin_status?: boolean | string
    store_id?: number
}

export const pickerService = RtkQueryService.injectEndpoints({
    endpoints: (builder) => ({
        pickerBoardData: builder.query<pickerResponseType, PickerBoardTypes>({
            query: (params) => {
                const parameters: Record<string, string | string[] | boolean | number> = {}
                if (params.from) parameters.from = params.from.toString()
                if (params.to) parameters.to = params.to.toString()
                if (params.checkin_status) parameters.checkin_status = params.checkin_status
                if (params.name) parameters.name = params.name
                if (params.mobile) parameters.mobile = params.mobile
                if (params.store_id) parameters.store_id = params.store_id
                return {
                    url: `/picker/profile`,
                    method: 'GET',
                    params: parameters,
                }
            },
        }),
        pickerDetailsData: builder.query<particularPickerType, { mobile: string; status: string }>({
            query: (params) => {
                const parameters: Record<string, string | string[]> = {}
                if (params.mobile) parameters.mobile = params.mobile
                if (params.status) parameters.status = params.status
                console.log('picker data', parameters)
                return {
                    url: `/picker/orders`,
                    method: 'GET',
                    params: parameters,
                }
            },
        }),
        pickerDelete: builder.mutation<{ success: string }, { mobile: string }>({
            query: (params) => {
                return {
                    url: `/picker/profile/${params.mobile}`,
                    method: 'DELETE',
                }
            },
        }),
    }),
})
