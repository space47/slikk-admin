/* eslint-disable @typescript-eslint/no-explicit-any */
import { CouponResults } from '@/store/types/couponSeries.types'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface CouponSeriesInitialTypes {
    couponSeries: CouponResults[]
    couponSeriesActive?: CouponResults
    count: number
    page: number
    pageSize: number
}

const initialState: CouponSeriesInitialTypes = {
    couponSeries: [],
    couponSeriesActive: undefined,
    count: 0,
    page: 1,
    pageSize: 10,
}

const couponSeriesSlice = createSlice({
    name: 'couponSeries',
    initialState,
    reducers: {
        setCouponSeriesData: (state, action: PayloadAction<CouponResults[]>) => {
            state.couponSeries = action.payload
        },
        setCouponSeriesActive: (state, action: PayloadAction<CouponResults>) => {
            state.couponSeriesActive = action.payload
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

export const { setCouponSeriesData, setCount, setPage, setPageSize, setCouponSeriesActive } = couponSeriesSlice.actions
export default couponSeriesSlice.reducer
