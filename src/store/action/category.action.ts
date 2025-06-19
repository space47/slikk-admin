import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { getAllCategoryRequest } from '../types/category.types'

export const getAllCategoryAPI = () => async (dispatch: any) => {
    try {
        dispatch({
            type: getAllCategoryRequest,
        })

        const response = await axioisInstance.get('category?view=short&dashboard=true')
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
