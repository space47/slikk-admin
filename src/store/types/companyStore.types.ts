import { createAction } from '@reduxjs/toolkit'

export type StoreDetails = {
    alternate_contact_number: string
    area: string
    city: string
    code: string
    company: number
    contactNumber: string
    create_date: string
    description: string
    gstin: string
    id: number
    image: string
    instruction: string
    is_active: boolean
    is_fulfillment_center: boolean
    latitude: number
    location_url: string
    longitude: number
    name: string
    openingHours: string[]
    pincode: string
    poc: string
    poc_designation: string
    rating: number
    return_area: string
    return_city: string
    return_pincode: string
    return_state: string
    state: string
    type: string
    update_date: string | null
    users: { email: string; mobile: string; name: string }[]
}

export type companyStore = {
    storeResults: StoreDetails[]
    loading: boolean
    message: string
}

export const getCompanyStoreRequest = 'getCompanyStoreRequest'
export const getCompanyStoreSuccess = createAction<companyStore>('getCompanyStoreSuccess')
export const getCompanyStoreFailure = createAction<companyStore>('getCompanyStoreFailure')
