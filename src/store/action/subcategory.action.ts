import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { getAllSubCategoryRequest } from '../types/subcategory.types'

export const getAllSubCategoryAPI =
    (storeCodes?: string | string[], searchName?: string, division?: string, category?: string) => async (dispatch: any) => {
        let params: any = {}

        if (storeCodes) params.store_codes = storeCodes
        if (searchName) params.name = encodeURIComponent(searchName)
        if (division) params.division = division
        if (category) params.category = category

        try {
            dispatch({
                type: getAllSubCategoryRequest,
            })

            const response = await axioisInstance.get('sub-category?view=short&dashboard=true', {
                params: params,
            })
            dispatch({
                type: 'getAllSubCategorySuccess',
                payload: {
                    subcategories: response.data.data,
                },
            })
        } catch (err: any) {
            dispatch({
                type: 'getAllSubCategoryFailure',
                payload: {
                    message: err?.response.data.data,
                },
            })
        }
    }
