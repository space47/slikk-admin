import { createAction } from '@reduxjs/toolkit'

export type AuthState = {
    loading: boolean
    phoneNumberValidated: boolean
    message: string
    show_profile_page: boolean
    mobile: string
    signup_done: boolean
    name: string
}

export type ProfileState = {
    first_name: string
    last_name: string
    email: string
    dob: string
    mobile: string
    photo: string
    date_joined: Date | null
    gender: string
    loading: boolean
}

const loginRequest = 'loginRequest'
const loginSuccess = createAction<AuthState>('loginSuccess')
const loginFailure = createAction<AuthState>('loginFailure')

const otpRequest = 'otpRequest'
const otpSuccess = createAction<AuthState>('otpSuccess')
const otpFailure = createAction<AuthState>('otpFailure')

const getProfileRequest = 'getProfileRequest'
const getProfileSuccess = createAction<ProfileState>('getProfileSuccess')
const getProfileFailure = createAction<string>('getProfileFailure')

const saveProfileRequest = 'saveProfileRequest'
const saveProfileSuccess = createAction<string>('saveProfileSuccess')
const saveProfileFailure = createAction<string>('saveProfileFailure')

//Address
export type AddressState = {
    latitude: number
    longitude: number
    area: string
    pincode: string
    message: string
    city: string
    name: ''
    state: string
    mobile: string
    flat: string
    id: number
    is_default: true
}

export type AddreesStateList = {
    addresses: AddressState[]
    loading: boolean
    message: string
}
const setAdress = createAction<AddressState>('setAdress')

const logoutRequest = 'logoutRequest'
const logoutSuccess = createAction<string>('logoutSuccess')
const logoutFailure = createAction<string>('logoutFailure')

const getAddressListRequest = 'getAddressListRequest'
const getAddressListSuccess = createAction<AddreesStateList>(
    'getAddressListSuccess'
)
const getAddressListFailure = createAction<AddreesStateList>(
    'getAddressListFailure'
)

const deleteAddressRequest = 'deleteAddressRequest'
const deleteAddressSuccess = createAction<AddreesStateList>(
    'deleteAddressSuccess'
)
const deleteAddressFailure = createAction<AddreesStateList>(
    'deleteAddressFailure'
)

const saveWishlistRequest = 'saveWishlistRequest'
const saveWishlistSuccess = createAction<string>('saveWishlistSuccess')
const saveWishlistFailure = createAction<string>('saveWishlistFailure')
export type WishListState = {
    message: string
    loading: boolean
}
export {
    loginSuccess,
    loginRequest,
    loginFailure,
    otpRequest,
    otpSuccess,
    otpFailure,
    setAdress,
    logoutRequest,
    logoutSuccess,
    logoutFailure,
    getAddressListRequest,
    getAddressListSuccess,
    getAddressListFailure,
    deleteAddressRequest,
    deleteAddressSuccess,
    deleteAddressFailure,
    getProfileRequest,
    getProfileSuccess,
    getProfileFailure,
    saveProfileRequest,
    saveProfileSuccess,
    saveProfileFailure,
    saveWishlistRequest,
    saveWishlistSuccess,
    saveWishlistFailure
}
