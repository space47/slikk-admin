/* eslint-disable @typescript-eslint/no-explicit-any */
import { ProductLockType } from '@/store/types/products.types'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface productLockInterfaceType {
    count: number
    page: number
    pageSize: number
    productLockData: ProductLockType[]
    globalFilter?: string
}

const initialState: productLockInterfaceType = {
    count: 0,
    page: 1,
    pageSize: 10,
    productLockData: [],
}

const productLockSlice = createSlice({
    name: 'productLock',
    initialState,
    reducers: {
        setProductLockLockData: (state, action: PayloadAction<ProductLockType[]>) => {
            state.productLockData = action.payload
        },
        setGlobalFilter: (state, action: PayloadAction<string>) => {
            state.globalFilter = action.payload
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

export const { setPage, setPageSize, setProductLockLockData, setGlobalFilter, setCount } = productLockSlice.actions
export default productLockSlice.reducer
