import { LiveZones } from '@/store/types/riderZone.type'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface ZONE_STATE {
    count: number
    page: number
    pageSize: number
    serviceData: LiveZones[]
}

const initialState: ZONE_STATE = {
    count: 0,
    page: 1,
    pageSize: 200,
    serviceData: [],
}

export const riderZoneSlice = createSlice({
    name: 'riderZone',
    initialState,
    reducers: {
        setServiceData: (state, action: PayloadAction<LiveZones[]>) => {
            state.serviceData = action.payload
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
export const { setServiceData, setCount, setPage, setPageSize } = riderZoneSlice.actions
export default riderZoneSlice.reducer
