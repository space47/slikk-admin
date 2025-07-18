/* eslint-disable @typescript-eslint/no-explicit-any */
import { mainPageSettings } from '@/store/types/pageSettings.types'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface mainPageSettingsRequiredType {
    mainPageSettingsData: mainPageSettings[]
    page?: number
    pageSize?: number
    count?: number
    currentPageName?: { label: string; value: number | null }
    currentSubPageName?: {
        label: string
        value: number | null
    }
    storeCode?: { id: number; code: string; name: string }[]
    isActive?: string
}

const initialState: mainPageSettingsRequiredType = {
    mainPageSettingsData: [],
    page: 1,
    pageSize: 10,
    count: 0,
    currentPageName: { label: 'Home', value: 1 },
    currentSubPageName: { label: '', value: null },
    storeCode: [],
    isActive: 'true',
}

const pageSettingsSliceMain = createSlice({
    name: 'pageSettingsMain',
    initialState,
    reducers: {
        setMainPageSettingsData: (state, action: PayloadAction<mainPageSettings[]>) => {
            state.mainPageSettingsData = action.payload
        },
        setIsActive: (state, action: PayloadAction<string>) => {
            state.isActive = action.payload
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
        setCurrentPageName: (state, action: PayloadAction<{ label: string; value: number | null }>) => {
            state.currentPageName = action.payload
        },
        setCurrentSubPageName: (state, action: PayloadAction<{ label: string; value: number | null }>) => {
            state.currentSubPageName = action.payload
        },
        setStoreCode: (state, action: PayloadAction<{ id: number; code: string; name: string }[]>) => {
            state.storeCode = action.payload
        },
    },
})

export const {
    setMainPageSettingsData,
    setPage,
    setPageSize,
    setCount,
    setCurrentPageName,
    setCurrentSubPageName,
    setStoreCode,
    setIsActive,
} = pageSettingsSliceMain.actions
export default pageSettingsSliceMain.reducer
