/* eslint-disable @typescript-eslint/no-explicit-any */
import { EventSeriesDetailsType, eventSeriesResponseTypes } from '@/store/types/eventSeries.types'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import moment from 'moment'

export type EventSeriesSliceType = {
    eventSeriesData?: eventSeriesResponseTypes[]
    eventSeriesDetails?: EventSeriesDetailsType
    count?: number
    from?: string
    to?: string
    page?: number
    pageSize?: number
}

const initialState: EventSeriesSliceType = {
    eventSeriesData: [],
    count: 0,
    from: moment().startOf('isoWeek').format('YYYY-MM-DD'),
    to: moment().endOf('isoWeek').format('YYYY-MM-DD'),
    page: 1,
    pageSize: 10,
}

const eventSeriesSlice = createSlice({
    name: 'eventSeries',
    initialState,
    reducers: {
        setEventSeriesData: (state, action: PayloadAction<eventSeriesResponseTypes[]>) => {
            state.eventSeriesData = action.payload
        },
        setEventSeriesDetails: (state, action: PayloadAction<EventSeriesDetailsType>) => {
            state.eventSeriesDetails = action.payload
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
