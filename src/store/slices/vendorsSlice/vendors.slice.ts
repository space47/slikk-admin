import { VendorList } from '@/store/types/vendor.type'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface VendorStateType {
    vendorList: VendorList[]
    count: number
    page: number
    pageSize: number
}

const initialState: VendorStateType = {
    vendorList: [],
    count: 0,
    page: 1,
    pageSize: 10,
}

export const vendorSlice = createSlice({
    name: 'vendor',
    initialState,
    reducers: {
        setVendorList: (state, action: PayloadAction<VendorList[]>) => {
            state.vendorList = action.payload
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
export const { setVendorList, setCount, setPage, setPageSize } = vendorSlice.actions
export default vendorSlice.reducer

// export const rtvActions = vendorSlice.actions
// export default vendorSlice
