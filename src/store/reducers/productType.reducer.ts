import { createReducer, PayloadAction } from '@reduxjs/toolkit'
import { getAllProductTypeFailure, getAllProductTypeRequest, getAllProductTypeSuccess, PRODUCTTYPE_STATE } from '../types/productType.types'

const initialState: PRODUCTTYPE_STATE = {
    product_types: [],
    message: '',
    loading: false,
}

export const productTypeReducer = createReducer(initialState, (builder) => {
    builder.addCase(getAllProductTypeRequest, (state) => {
        state.loading = true
    })
    builder.addCase(getAllProductTypeSuccess, (state, action: PayloadAction<PRODUCTTYPE_STATE>) => {
        state.product_types = action.payload.product_types
        state.loading = false
    })
    builder.addCase(getAllProductTypeFailure, (state, action: PayloadAction<PRODUCTTYPE_STATE>) => {
        state.loading = false
        state.message = action.payload.message
    })
})
