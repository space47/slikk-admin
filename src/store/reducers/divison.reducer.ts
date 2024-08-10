import { createReducer, PayloadAction } from "@reduxjs/toolkit"
import { DIVISION_STATE, getAllDivisionFailure, getAllDivisionRequest, getAllDivisionSuccess, SINGLE_DIVISION_DATA } from "../types/division.types"

const initialState : DIVISION_STATE = {
    divisions : [],
    message : "",
    loading : false
}

export const divisionReducer = createReducer(initialState, (builder) => {
    builder.addCase(getAllDivisionRequest, (state) => {
        state.loading = true;
    });
    builder.addCase(getAllDivisionSuccess, (state, action : PayloadAction<DIVISION_STATE>) => {
        console.log(action.payload.divisions);
        state.divisions = [...action.payload.divisions];
        state.loading = false;
    });
    builder.addCase(getAllDivisionFailure, (state, action : PayloadAction<DIVISION_STATE>) => {
        state.loading = false;
        state.message = action.payload.message
    })
})