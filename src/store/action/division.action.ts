import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { getAllDivisionRequest } from '../types/division.types'

export const getAllDivisionAPI = () => async (dispatch: any) => {
    try {
        dispatch({
            type: getAllDivisionRequest,
        })

        const response = await axioisInstance.get('division?view=detail&dashboard=true')
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
                message: err?.response.data.data,
            },
        })
    }
}
