import { createAction } from '@reduxjs/toolkit'

export type SINGLE_COMPANY_DATA = {
    id: number
    registered_name?: string
    name: string
    gstin?: string
    segment?: string
    cin?: string
    address?: string
    contact_number?: string
    alternate_contact_number?: string
    poc?: string
    poc_email?: string
    account_number?: string
    account_holder_name?: string
    ifsc?: string
    bank_name?: string
    is_active?: boolean
    create_date?: string
    update_date?: string
    code?: string
}

export type USER_PROFILE_DATA = {
    first_name?: string
    last_name?: string
    email?: string
    mobile: string
    company: SINGLE_COMPANY_DATA[]
    loading: boolean
    message: string
    currCompany: SINGLE_COMPANY_DATA
    permissions: []
    roles: []
}

export const companyRequest = 'companyRequest'
export const companyRequestSuccess = createAction<any>('companyRequestSuccess')
export const companyRequestFailure = createAction<any>('companyRequestFailure')
export const defaultCompanyRequest = createAction<any>('defaultCompanyRequest')
