/* eslint-disable @typescript-eslint/no-explicit-any */
import RtkQueryService from '@/services/RtkQueryService'
import { particularPickerType, pickerResponseType } from '../types/picker.types'

interface PickerBoardTypes {
    from?: string
    to?: string
    mobile?: string
    checkin_status?: boolean | string
}

export const pickerService = RtkQueryService.injectEndpoints({
    endpoints: (builder) => ({
        pickerBoardData: builder.query<pickerResponseType, PickerBoardTypes>({
            query: (params) => {
                const parameters: Record<string, string | string[] | boolean> = {}
                if (params.from) parameters.from = params.from.toString()
                if (params.to) parameters.to = params.to.toString()
                if (params.checkin_status) parameters.checkin_status = params.checkin_status
                return {
                    url: `/picker/orders`,
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
    }),
})
