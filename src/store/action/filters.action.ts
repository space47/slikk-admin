/* eslint-disable prefer-const */
import axiosInstance from '@/utils/intercepter/globalInterceptorSetup'
import { getAllFiltersRequest, getAllFiltersSuccess, getAllFiltersFailure } from '../types/filters.types'

export const getAllFiltersAPI = () => async (dispatch: any) => {
    try {
        dispatch({
            type: 'getAllFiltersRequest',
        })

        const response = await axiosInstance.get('search/product/filters')

        console.log('FFFFFFFFFFFFFFi', response.data?.filters)

        dispatch({
            type: 'getAllFiltersSuccess',
            payload: {
                filters: transformFiltersFromAPItoFrontendField(response.data?.filters),
            },
        })
    } catch (err: any) {
        dispatch({
            type: 'getAllFiltersFailure',
            payload: {
                message: err?.response?.data?.message || 'An error occurred',
            },
        })
    }
}

interface SINGLE_OPTION {
    label: string
    value: string
    name: string
}

interface SINGLE_FILTER {
    label: string
    options: SINGLE_OPTION[]
}

export const transformFiltersFromAPItoFrontendField = (filters: Record<string, string[]>) => {
    if (!filters) return []
    let data: SINGLE_FILTER[] = []
    Object.keys(filters).map((filter) => {
        data.push({
            label: filter,
            options: filters[filter]?.map((option) => {
                return {
                    label: option,
                    name: option,
                    value: filter + '_' + option,
                }
            }),
        })
    })

    return data
}
