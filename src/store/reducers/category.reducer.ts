import { createReducer, PayloadAction } from '@reduxjs/toolkit'
import { CATEGORY_STATE, getAllCategoryFailure, getAllCategoryRequest, getAllCategorySuccess } from '../types/category.types'

const initialState: CATEGORY_STATE = {
    categories: [],
    message: '',
    loading: false,
}

export const categoryReducer = createReducer(initialState, (builder) => {
    builder.addCase(getAllCategoryRequest, (state) => {
        state.loading = true
    })
    builder.addCase(getAllCategorySuccess, (state, action: PayloadAction<CATEGORY_STATE>) => {
        state.categories = action.payload.categories
        state.loading = false
    })
    builder.addCase(getAllCategoryFailure, (state, action: PayloadAction<CATEGORY_STATE>) => {
        state.loading = false
        state.message = action.payload.message
    })
})
