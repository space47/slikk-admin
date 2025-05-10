/* eslint-disable @typescript-eslint/no-explicit-any */
import { EventNamesData } from '@/store/types/eventNames.types'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import moment from 'moment'

export type EventSeriesSliceType = {
    eventSeriesData?: EventNamesData[]
    count?: number
    from?: string
    to?: string
    page?: number
    pageSize?: number
}

const initialState: EventSeriesSliceType = {
    eventSeriesData: [],
    count: 0,
    from: moment().format('YYYY-MM-DD'),
    to: moment().format('YYYY-MM-DD'),
    page: 1,
    pageSize: 10,
}

const eventSeriesSlice = createSlice({
    name: 'eventSeries',
    initialState,
    reducers: {
        setEventSeriesData: (state, action: PayloadAction<EventNamesData[]>) => {
            state.eventSeriesData = action.payload
        },
        setCount: (state, action: PayloadAction<number>) => {
            state.count = action.payload
        },
        setFrom: (state, action: PayloadAction<string>) => {
            state.from = action.payload
        },
        setTo: (state, action: PayloadAction<string>) => {
            state.to = action.payload
        },
        setPage: (state, action: PayloadAction<number>) => {
            state.page = action.payload
        },
        setPageSize: (state, action: PayloadAction<number>) => {
            state.pageSize = action.payload
        },
    },
})

export const { setEventSeriesData, setCount, setFrom, setTo, setPage, setPageSize } = eventSeriesSlice.actions
export default eventSeriesSlice.reducer
