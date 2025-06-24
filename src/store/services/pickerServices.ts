/* eslint-disable @typescript-eslint/no-explicit-any */
import RtkQueryService from '@/services/RtkQueryService'
import { particularPickerType, pickerResponseType } from '../types/picker.types'

interface PickerBoardTypes {
    from?: string
    to?: string
    mobile?: string
}

export const pickerService = RtkQueryService.injectEndpoints({
    endpoints: (builder) => ({
        pickerBoardData: builder.query<pickerResponseType, PickerBoardTypes>({
            query: (params) => {
                const parameters: Record<string, string | string[]> = {}
                if (params.from) parameters.from = params.from.toString()
                if (params.to) parameters.to = params.to.toString()
                return {
                    url: `/picker/orders`,
                    method: 'GET',
                    params: parameters,
                }
            },
        }),
        pickerDetailsData: builder.query<particularPickerType, PickerBoardTypes>({
            query: (params) => {
                const parameters: Record<string, string | string[]> = {}
                if (params.mobile) parameters.mobile = params.mobile.toString()
                return {
                    url: `/picker/orders`,
                    method: 'GET',
                    params: parameters,
                }
            },
        }),
    }),
})
