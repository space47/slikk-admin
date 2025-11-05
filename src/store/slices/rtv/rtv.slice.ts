import { Rtv_Data, Rtv_Products } from '@/store/types/rtv.types'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import moment from 'moment'

export interface rtvStateType {
    rtv: Rtv_Data[]
    count: number
    page: number
    pageSize: number
    rtvProducts: Rtv_Products[]
    productCount: number
    productPage: number
    productPageSize: number
    from: string
    to: string
    dateField: string
}

const initialState: rtvStateType = {
    rtv: [],
    count: 0,
    page: 1,
    pageSize: 10,
    rtvProducts: [],
    from: moment().format('YYYY-MM-DD'),
    to: moment().format('YYYY-MM-DD'),
    dateField: 'TODAY',
    productCount: 0,
    productPage: 1,
    productPageSize: 10,
}

export const rtvSlice = createSlice({
    name: 'rtv',
    initialState,
    reducers: {
        setRtvData: (state, action: PayloadAction<Rtv_Data[]>) => {
            state.rtv = action.payload
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
// export const { setrtvData, setCount, setPage, setPageSize,  } = rtvSlice.actions
// export default rtvSlice.reducer

export const rtvActions = rtvSlice.actions
export default rtvSlice
