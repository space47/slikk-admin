// store/slices/dateRange.slice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface DateRange {
    from: string
    to: string
    label: string
    id?: string
}

export interface DateRangeState {
    [key: string]: DateRange
}

const initialState: DateRangeState = {}

const dateRangeSlice = createSlice({
    name: 'dateRange',
    initialState,
    reducers: {
        setDateRange: (state, action: PayloadAction<{ id: string; from: string; to: string; label: string }>) => {
            const { id, from, to, label } = action.payload
            state[id] = { from, to, label }
        },
        resetDateRange: (state, action: PayloadAction<string>) => {
            delete state[action.payload]
        },
    },
})

export const { setDateRange, resetDateRange } = dateRangeSlice.actions
export default dateRangeSlice.reducer
