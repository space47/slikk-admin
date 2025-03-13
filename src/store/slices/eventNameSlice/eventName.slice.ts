/* eslint-disable @typescript-eslint/no-explicit-any */
import { EventNamesData } from '@/store/types/eventNames.types'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type EventNamesSliceType = {
    eventNamesData?: EventNamesData[]
    count?: number
}

const initialState: EventNamesSliceType = {
    eventNamesData: [],
    count: 0,
}

const eventNamesSlice = createSlice({
    name: 'eventNames',
    initialState,
    reducers: {
        setEventNamesData: (state, action: PayloadAction<EventNamesData[]>) => {
            state.eventNamesData = action.payload
        },
        setCount: (state, action: PayloadAction<number>) => {
            state.count = action.payload
        },
    },
})

export const { setEventNamesData, setCount } = eventNamesSlice.actions
export default eventNamesSlice.reducer
