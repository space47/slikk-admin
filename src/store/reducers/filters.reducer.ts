import { createReducer } from '@reduxjs/toolkit'
import { FILTER_STATE, getAllFiltersFailure, getAllFiltersRequest, getAllFiltersSuccess } from '../types/filters.types'

const initialState: FILTER_STATE = {
    filters: [],
    loading: false,
    message: '',
}

export const filtersReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(getAllFiltersRequest, (state) => {
            state.loading = true
        })
        .addCase(getAllFiltersSuccess, (state, action) => {
            state.filters = action.payload.filters
            state.loading = false
        })
        .addCase(getAllFiltersFailure, (state, action) => {
            state.message = action.payload.message
        })
})
