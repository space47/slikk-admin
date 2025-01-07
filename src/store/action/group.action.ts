import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { getAllBrandsRequest, getAllBrandsSuccess } from '../types/brand.types'

export const getAllGroupAPI = () => async (dispatch: any) => {
    try {
        dispatch({
            type: 'getAllGroupRequest',
        })

        const response = await axioisInstance.get('notification/groups')

        dispatch({
            type: 'getAllGroupSuccess',
            payload: {
                group: response.data?.data?.results,
            },
        })
    } catch (err: any) {
        dispatch({
            type: 'getAllGroupFailure',
            payload: {
                message: err?.response?.data?.message,
            },
        })
    }
}
