/* eslint-disable @typescript-eslint/no-explicit-any */
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { getAllProductTypeRequest } from '../types/productType.types'

export const getAllProductTypeAPI =
    (storeCodes: string, searchName?: string | undefined, division?: string, category?: string, subCategory?: string) =>
    async (dispatch: any) => {
        let params: any = {}

        if (storeCodes) params.store_codes = storeCodes
        if (searchName) params.name = encodeURIComponent(searchName)
        if (division) params.division = division
        if (category) params.category = category
        if (subCategory) params.sub_category = subCategory

        try {
            dispatch({
                type: getAllProductTypeRequest,
            })

            const response = await axioisInstance.get('product-type?view=detail&dashboard=true', {
                params,
            })
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
