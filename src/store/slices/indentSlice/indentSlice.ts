import { IndentResultType } from '@/store/types/indent.types'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import moment from 'moment'

export interface IndentStateType {
    indent: IndentResultType[]
    count: number
    page: number
    pageSize: number
    from: string
    to: string
    dateField: string
}

const initialState: IndentStateType = {
    indent: [],
    count: 0,
    page: 1,
    pageSize: 10,
    from: moment().format('YYYY-MM-DD'),
    to: moment().format('YYYY-MM-DD'),
    dateField: 'TODAY',
}

export const indentSlice = createSlice({
    name: 'indent',
    initialState,
    reducers: {
        setIndentData: (state, action: PayloadAction<IndentResultType[]>) => {
            state.indent = action.payload
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
        setFrom: (state, action: PayloadAction<string>) => {
            state.from = action.payload
        },
        setTo: (state, action: PayloadAction<string>) => {
            state.to = action.payload
        },
        setDateField: (state, action: PayloadAction<string>) => {
            state.dateField = action.payload
        },
    },
})
export const { setIndentData, setCount, setPage, setPageSize, setFrom, setTo, setDateField } = indentSlice.actions
export default indentSlice.reducer
