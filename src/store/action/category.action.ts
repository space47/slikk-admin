/* eslint-disable @typescript-eslint/no-explicit-any */
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { getAllCategoryRequest } from '../types/category.types'

export const getAllCategoryAPI = (storeCodes?: string | string[], searchName?: string, division?: string) => async (dispatch: any) => {
    let params: any = {}

    if (storeCodes) params.store_codes = storeCodes
    if (searchName) params.name = encodeURIComponent(searchName)
    if (division) params.division = division

    try {
        dispatch({
            type: getAllCategoryRequest,
        })

        const response = await axioisInstance.get('category?view=short&dashboard=true', {
            params: params,
        })
        dispatch({
            type: 'getAllCategorySuccess',
            payload: {
                categories: response.data.data,
            },
        })
    } catch (err: any) {
        dispatch({
            type: 'getAllCategoryFailure',
            payload: {
                message: err?.response.data.data,
            },
        })
    }
}
