import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { getAllSubCategoryRequest } from '../types/subcategory.types'

export const getAllSubCategoryAPI = () => async (dispatch: any) => {
    try {
        dispatch({
            type: getAllSubCategoryRequest,
        })

        const response = await axioisInstance.get('sub-category?view=short&dashboard=true')
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
