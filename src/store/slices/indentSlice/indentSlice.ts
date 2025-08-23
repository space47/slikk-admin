import { IndentResultType } from '@/store/types/indent.types'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface IndentStateType {
    indent: IndentResultType[]
    count: number
    page: number
    pageSize: number
}

const initialState: IndentStateType = {
    indent: [],
    count: 0,
    page: 1,
    pageSize: 10,
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
    },
})
export const { setIndentData, setCount, setPage, setPageSize } = indentSlice.actions
export default indentSlice.reducer
