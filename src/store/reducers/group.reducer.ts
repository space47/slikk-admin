import { createReducer } from '@reduxjs/toolkit'
import { GroupData, getAllGroupRequest, getAllGroupSuccess, getAllGroupFailure } from '../types/groups.types'

const initialState: GroupData = {
    group: [],
    loading: false,
    message: '',
}

export const groupReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(getAllGroupRequest, (state) => {
            state.loading = true
        })
        .addCase(getAllGroupSuccess, (state, action) => {
            state.group = action.payload.group
            state.loading = false
        })
        .addCase(getAllGroupFailure, (state, action) => {
            state.message = action.payload.message
        })
})
