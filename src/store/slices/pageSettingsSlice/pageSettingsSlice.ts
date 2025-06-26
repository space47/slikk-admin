/* eslint-disable @typescript-eslint/no-explicit-any */
import { pageSettingsType } from '@/store/types/pageSettings.types'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface pageSettingsRequiredType {
    pageSettingsData?: pageSettingsType[]
    page?: number
    pageSize?: number
    count?: number
}

const initialState: pageSettingsRequiredType = {
    pageSettingsData: [],
    page: 1,
    pageSize: 10,
    count: 0,
}

const pageSettingsSlice = createSlice({
    name: 'pageSettings',
    initialState,
    reducers: {
        setPageSettingsData: (state, action: PayloadAction<pageSettingsType[]>) => {
            state.pageSettingsData = action.payload
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

export const { setPageSettingsData, setPage, setPageSize, setCount } = pageSettingsSlice.actions
export default pageSettingsSlice.reducer
