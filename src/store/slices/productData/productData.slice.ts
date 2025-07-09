/* eslint-disable @typescript-eslint/no-explicit-any */
import { ProductTypes, ProductFilterArray } from '@/store/types/products.types'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface productRequiredType {
    count: number
    page: number
    pageSize: number
    productData: ProductTypes[]
    typeFetch: string
    currentSelectedPage: {
        label: string
        value: string
    }
    globalFilter?: string
}

const initialState: productRequiredType = {
    count: 0,
    page: 1,
    pageSize: 10,
    productData: [],
    typeFetch: '',
    currentSelectedPage: ProductFilterArray[0],
}

const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        setProductData: (state, action: PayloadAction<ProductTypes[]>) => {
            state.productData = action.payload
        },
        setCurrentSelectedPage: (
            state,
            action: PayloadAction<{
                label: string
                value: string
            }>,
        ) => {
            state.currentSelectedPage = action.payload
        },
        setTypeFetch: (state, action: PayloadAction<string>) => {
            state.typeFetch = action.payload
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

export const { setPage, setPageSize, setProductData, setTypeFetch, setCurrentSelectedPage, setGlobalFilter, setCount } =
    productSlice.actions
export default productSlice.reducer
