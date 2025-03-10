/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import moment from 'moment'

export type NewOrderType = {
    count?: number
    page?: number
    pageSize?: number
    from?: string
    to?: string
    selectedOption?: string
}

const initialState: NewOrderType = {
    count: 0,
    page: 1,
    pageSize: 10,
    from: moment().format('YYYY-MM-DD'),
    to: moment().add(1, 'days').format('YYYY-MM-DD'),
    selectedOption: 'TODAY',
}

const newOrderListSlice = createSlice({
    name: 'newOrderList',
    initialState,
    reducers: {
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
        setSelectedOption: (state, action: PayloadAction<string>) => {
            state.to = action.payload
        },
    },
})

export const { setCount, setPage, setPageSize, setFrom, setTo, setSelectedOption } = newOrderListSlice.actions
export default newOrderListSlice.reducer
