import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { OfferDataTypes } from '@/store/types/offerEngine.types'

export interface OffersInitialStateType {
    offers: OfferDataTypes[]
    count: number
    page: number
    pageSize: number
}

const initialState: OffersInitialStateType = {
    offers: [],
    count: 0,
    page: 1,
    pageSize: 10,
}

export const offersSlice = createSlice({
    name: 'offers',
    initialState,
    reducers: {
        setOffersData: (state, action: PayloadAction<OfferDataTypes[]>) => {
            state.offers = action.payload
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
export const { setOffersData, setCount, setPage, setPageSize } = offersSlice.actions
export default offersSlice.reducer
