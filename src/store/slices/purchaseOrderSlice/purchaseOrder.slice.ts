import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { PurchaseOrderTable } from '@/store/types/po.types'

export interface PURCHASE_STATE {
    poList: PurchaseOrderTable[]
    poStatus: string
    count: number
    page: number
    pageSize: number
}

const initialState: PURCHASE_STATE = {
    poList: [],
    poStatus: 'All Status',
    count: 0,
    page: 1,
    pageSize: 10,
}

export const purchaseOrderSlice = createSlice({
    name: 'purchaseOrder',
    initialState,
    reducers: {
        setPoList: (state, action: PayloadAction<PurchaseOrderTable[]>) => {
            state.poList = action.payload
        },
        setPoStatus: (state, action: PayloadAction<string>) => {
            state.poStatus = action.payload
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
export const { setPoList, setCount, setPage, setPageSize, setPoStatus } = purchaseOrderSlice.actions
export default purchaseOrderSlice.reducer
