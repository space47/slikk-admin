import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { getAllProductTypeRequest } from '../types/productType.types'

export const getAllProductTypeAPI = () => async (dispatch: any) => {
    try {
        dispatch({
            type: getAllProductTypeRequest,
        })

        const response = await axioisInstance.get('product-type?view=short&dashboard=true')
        dispatch({
            type: 'getAllProductTypeSuccess',
            payload: {
                product_types: response.data.data,
            },
        })
    } catch (err: any) {
        dispatch({
            type: 'getAllProductTypeFailure',
            payload: {
                message: err?.response.data.data,
            },
        })
    }
}
