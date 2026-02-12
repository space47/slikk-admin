// search/product?page_size=1

import { createAction } from '@reduxjs/toolkit'

export interface FILTER_STATE {
    filters: Record<any, any>[]
    loading: boolean
    message: string
}

export const getAllFiltersRequest = 'getAllFiltersRequest'
export const getAllFiltersSuccess = createAction<FILTER_STATE>('getAllFiltersSuccess')
export const getAllFiltersFailure = createAction<FILTER_STATE>('getAllFiltersFailure')
