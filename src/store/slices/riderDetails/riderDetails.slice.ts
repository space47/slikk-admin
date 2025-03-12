/* eslint-disable @typescript-eslint/no-explicit-any */
import { RiderDetails } from '@/store/types/riderAddTypes'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import moment from 'moment'

export type RiderDetailType = {
    riderDetails: RiderDetails[]
    count: number
    page: number
    pageSize: number
    from: string
    to: string
}

const initialState: RiderDetailType = {
    riderDetails: [],
    count: 0,
    page: 1,
    pageSize: 10,
    from: moment().format('YYYY-MM-DD'),
    to: moment().format('YYYY-MM-DD'),
}

const riderDetails = createSlice({
    name: 'riderDetails',
    initialState,
    reducers: {
        setRiderDetails: (state, action: PayloadAction<RiderDetails[]>) => {
            state.riderDetails = action.payload
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
        setFrom: (state, action: PayloadAction<string>) => {
            state.from = action.payload
        },
        setTo: (state, action: PayloadAction<string>) => {
            state.to = action.payload
        },
    },
})

export const { setRiderDetails, setCount, setPage, setPageSize, setFrom, setTo } = riderDetails.actions
export default riderDetails.reducer
