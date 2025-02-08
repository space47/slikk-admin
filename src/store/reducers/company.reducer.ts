import { PayloadAction, createReducer } from '@reduxjs/toolkit'
import {
    USER_PROFILE_DATA,
    companyRequest,
    companyRequestFailure,
    companyRequestSuccess,
    defaultCompanyRequest,
} from '../types/company.types'

const initialState: USER_PROFILE_DATA = {
    first_name: '',
    last_name: '',
    email: '',
    mobile: '',
    company: [],
    loading: false,
    message: '',
    currCompany: {},
    roles: [],
    permissions: [],
}

export const companyReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(companyRequest, (state) => {
            state.loading = true
        })
        .addCase(companyRequestSuccess, (state, action: PayloadAction<USER_PROFILE_DATA>) => {
            state.loading = false
            state.first_name = action.payload.first_name
            state.last_name = action.payload.last_name
            state.email = action.payload.email
            state.mobile = action.payload.mobile
            state.company = action.payload.company
            state.roles = action.payload.roles
            state.permissions = action.payload.permissions
        })
        .addCase(companyRequestFailure, (state, action: PayloadAction<USER_PROFILE_DATA>) => {
            state.loading = false
            state.message = action.payload.message
        })
        .addCase(defaultCompanyRequest, (state, action: PayloadAction<USER_PROFILE_DATA>) => {
            state.currCompany = action.payload.currCompany
        })
})
