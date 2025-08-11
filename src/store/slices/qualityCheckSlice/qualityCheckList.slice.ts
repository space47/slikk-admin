/* eslint-disable @typescript-eslint/no-explicit-any */
import { GetQualityCheckListResultTypes } from '@/store/types/qualityCheckList.types'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import moment from 'moment'

export type QcInitialStateTypes = {
    qcDetails: GetQualityCheckListResultTypes[]
    count: number
    page: number
    pageSize: number
    from: string
    to: string
    customChange?: string
}

const initialState: QcInitialStateTypes = {
    qcDetails: [],
    count: 0,
    page: 1,
    pageSize: 10,
    from: moment().format('YYYY-MM-DD'),
    to: moment().add(1, 'days').format('YYYY-MM-DD'),
    customChange: 'TODAY',
}

const qualityCheck = createSlice({
    name: 'qualityCheck',
    initialState,
    reducers: {
        setQcDetails: (state, action: PayloadAction<GetQualityCheckListResultTypes[]>) => {
            state.qcDetails = action.payload
        },
        setCount: (state, action: PayloadAction<number>) => {
            state.count = action.payload
        },
        setCustomChange: (state, action: PayloadAction<string>) => {
            state.customChange = action.payload
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

export const { setQcDetails, setCount, setPage, setPageSize, setFrom, setTo, setCustomChange } = qualityCheck.actions
export default qualityCheck.reducer
