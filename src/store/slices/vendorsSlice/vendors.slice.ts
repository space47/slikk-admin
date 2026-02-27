import { ConfigValues, VendorDetails } from '@/store/types/vendor.type'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface VendorStateType {
    vendorList: VendorDetails[]
    count: number
    page: number
    pageSize: number
    configValues: ConfigValues | null
    filterValue: string
}

const initialState: VendorStateType = {
    vendorList: [],
    count: 0,
    page: 1,
    pageSize: 10,
    configValues: null,
    filterValue: '',
}

export const vendorSlice = createSlice({
    name: 'vendor',
    initialState,
    reducers: {
        setVendorList: (state, action: PayloadAction<VendorDetails[]>) => {
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
        setConfigValues: (state, action: PayloadAction<ConfigValues>) => {
            state.configValues = action.payload
        },
        setFilterValue: (state, action: PayloadAction<string>) => {
            state.filterValue = action.payload
        },
    },
})
export const { setVendorList, setCount, setPage, setPageSize, setConfigValues, setFilterValue } = vendorSlice.actions
export default vendorSlice.reducer

// export const rtvActions = vendorSlice.actions
// export default vendorSlice
