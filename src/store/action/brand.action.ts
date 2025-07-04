import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { getAllBrandsRequest, getAllBrandsSuccess } from '../types/brand.types'

export const getAllBrandsAPI = () => async (dispatch: any) => {
    try {
        dispatch({
            type: 'getAllBrandsRequest',
        })

        const response = await axioisInstance.get('brands?dashboard=true&page_size=2000')

        dispatch({
            type: 'getAllBrandsSuccess',
            payload: {
                brands: response.data?.data?.results,
            },
        })
    } catch (err: any) {
        dispatch({
            type: 'getAllBrandsFailure',
            payload: {
                message: err?.response?.data?.message,
            },
        })
    }
}
