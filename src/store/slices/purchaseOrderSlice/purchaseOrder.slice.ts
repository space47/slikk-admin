import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { PurchaseOrderTable } from '@/store/types/po.types'
import moment from 'moment'

interface Summary {
    total_amount: number
    total_approved: number
    total_waiting: number
}
export interface PURCHASE_STATE {
    poList: PurchaseOrderTable[]
    poSummary: Summary | null
    poStatus: string
    count: number
    page: number
    pageSize: number
    poFilter: string
    companyId: number | string | null
    from: string
    to: string
}

const initialState: PURCHASE_STATE = {
    poList: [],
    poSummary: null,
    poStatus: '',
    count: 0,
    page: 1,
    pageSize: 10,
    poFilter: '',
    companyId: null,
    from: moment().format('YYYY-MM-DD'),
    to: moment().format('YYYY-MM-DD'),
}

export const purchaseOrderSlice = createSlice({
    name: 'purchaseOrder',
    initialState,
    reducers: {
        setPoList: (state, action: PayloadAction<PurchaseOrderTable[]>) => {
            state.poList = action.payload
        },
        setPoSummary: (state, action: PayloadAction<Summary | null>) => {
            state.poSummary = action.payload
        },
        setPoStatus: (state, action: PayloadAction<string>) => {
            state.poStatus = action.payload
        },
        setPoFilter: (state, action: PayloadAction<string>) => {
            state.poFilter = action.payload
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
        setCompanyId: (state, action: PayloadAction<string | number | null>) => {
            state.companyId = action.payload
        },
        setFrom: (state, action: PayloadAction<string>) => {
            state.from = action.payload
        },
        setTo: (state, action: PayloadAction<string>) => {
            state.to = action.payload
        },
    },
})
export const { setPoList, setCount, setPage, setPageSize, setPoStatus, setPoSummary, setPoFilter, setCompanyId, setFrom, setTo } =
    purchaseOrderSlice.actions
export default purchaseOrderSlice.reducer
