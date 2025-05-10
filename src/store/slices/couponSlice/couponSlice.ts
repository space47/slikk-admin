import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { CouponMainTypes } from '@/store/types/couponMain.types'

export interface CoupunInitialStateType {
    coupon: CouponMainTypes[]
    count: number
    page: number
    pageSize: number
}

const initialState: CoupunInitialStateType = {
    coupon: [],
    count: 0,
    page: 1,
    pageSize: 10,
}

export const couponSlice = createSlice({
    name: 'Coupons',
    initialState,
    reducers: {
        setCouponData: (state, action: PayloadAction<CouponMainTypes[]>) => {
            state.coupon = action.payload
        },
        setCount: (state, action: PayloadAction<number>) => {
            state.count = action.payload
        },
        setPage: (state, action: PayloadAction<number>) => {
            state.page = action.payload
        },
        setPageSize: (state, action: PayloadAction<number>) => {
            state.pageSize = action.payload
        },
    },
})
export const { setCouponData, setCount, setPage, setPageSize } = couponSlice.actions
export default couponSlice.reducer
