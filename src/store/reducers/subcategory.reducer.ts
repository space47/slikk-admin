import { createReducer, PayloadAction } from "@reduxjs/toolkit";
import { getAllSubCategoryFailure, getAllSubCategoryRequest, getAllSubCategorySuccess, SUBCATEGORY_STATE } from "../types/subcategory.types";

const initialState : SUBCATEGORY_STATE = {
    subcategories : [],
    message : "",
    loading : false
}

export const subCategoryReducer = createReducer(initialState, (builder) => {
    builder.addCase(getAllSubCategoryRequest, (state) => {
        state.loading = true;
    });
    builder.addCase(getAllSubCategorySuccess, (state, action : PayloadAction<SUBCATEGORY_STATE>) => {
        state.subcategories = action.payload.subcategories;
        state.loading = false;
    });
    builder.addCase(getAllSubCategoryFailure, (state, action : PayloadAction<SUBCATEGORY_STATE>) => {
        state.loading = false;
        state.message = action.payload.message
    })
})