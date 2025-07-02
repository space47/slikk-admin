/* eslint-disable @typescript-eslint/no-explicit-any */

import { pageNameTypes } from '@/store/types/pageSettings.types'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface pageNamesRequiredType {
    pageNamesData?: pageNameTypes[]
    subPageNamesData?: pageNameTypes[]
    pageForName?: number
    pageSizeForName?: number
    countForName?: number
}

const initialState: pageNamesRequiredType = {
    pageNamesData: [],
    subPageNamesData: [],
    pageForName: 1,
    pageSizeForName: 500,
    countForName: 0,
}

const pageNamesSlice = createSlice({
    name: 'pageNames',
    initialState,
    reducers: {
        setPageNamesData: (state, action: PayloadAction<pageNameTypes[]>) => {
            state.pageNamesData = action.payload
        },
        setSubPageNamesData: (state, action: PayloadAction<pageNameTypes[]>) => {
            state.subPageNamesData = action.payload
        },
        setCount: (state, action: PayloadAction<number>) => {
            state.countForName = action.payload
        },
        setPage: (state, action: PayloadAction<number>) => {
            state.pageForName = action.payload
        },
        setPageSize: (state, action: PayloadAction<number>) => {
            state.pageSizeForName = action.payload
        },
    },
})

export const { setPageNamesData, setSubPageNamesData, setPage, setPageSize, setCount } = pageNamesSlice.actions
export default pageNamesSlice.reducer
