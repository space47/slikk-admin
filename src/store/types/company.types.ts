import { createAction } from '@reduxjs/toolkit'

export type BUSINESS_NATURE = {
    bill_to: string
    code: string
    company_legal_name: string
    company_name: string
    gstin: string
    registered_address: string
    ship_to: string
}
export type WAREHOUSE_DETAILS = {
    company: number
    create_date: string
    gst_certificate: string
    gstin: string
    id: number
    is_active: boolean
    poc_contact_number: string
    poc_email: string
    poc_name: string
    update_date: string
    warehouse_address: string
    warehouse_name: string
}

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
    commercial_approval_doc?: string
    business_nature_company: BUSINESS_NATURE[]
    gst_details: WAREHOUSE_DETAILS[]
    approved_payment_term: string
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
    store: {
        code: string
        id: number
        is_fulfillment_center: boolean
        name: string
    }[]
}

export const companyRequest = 'companyRequest'
export const companyRequestSuccess = createAction<any>('companyRequestSuccess')
export const companyRequestFailure = createAction<any>('companyRequestFailure')
export const defaultCompanyRequest = createAction<any>('defaultCompanyRequest')
