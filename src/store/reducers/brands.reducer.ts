import { createReducer } from "@reduxjs/toolkit"
import { BRAND_STATE, getAllBrandsFailure, getAllBrandsRequest, getAllBrandsSuccess } from "../types/brand.types"

const initialState : BRAND_STATE = {
    brands : [],
    loading : false,
    message : ""
}

export const brandsReducer = createReducer(initialState, (builder) => {
    builder.addCase(getAllBrandsRequest, (state) => {
        state.loading = true;
    }).addCase(getAllBrandsSuccess, (state, action) => {
        state.brands = action.payload.brands;
        state.loading = false;
    }).addCase(getAllBrandsFailure, (state, action) => {
        state.message = action.payload.message;
    })
});