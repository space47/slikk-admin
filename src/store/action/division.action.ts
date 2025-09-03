/* eslint-disable @typescript-eslint/no-explicit-any */
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { getAllDivisionRequest } from '../types/division.types'

export const getAllDivisionAPI = (storeCodes?: string | string[], searchName?: string) => async (dispatch: any) => {
    let params: any = {}

    if (storeCodes) params.store_codes = storeCodes
    if (searchName) params.name = encodeURIComponent(searchName)

    try {
        dispatch({
            type: getAllDivisionRequest,
        })

        const response = await axioisInstance.get('division?view=detail&dashboard=true', {
            params: params,
        })

        dispatch({
            type: 'getAllDivisionSuccess',
            payload: {
                divisions: response.data.data,
            },
        })
    } catch (err: any) {
        dispatch({
            type: 'getAllDivisionFailure',
            payload: {
                message: err?.response?.data?.data ?? 'Something went wrong',
            },
        })
    }
}
