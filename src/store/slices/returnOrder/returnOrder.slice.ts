/* eslint-disable @typescript-eslint/no-explicit-any */
import { LocationReturnType } from '@/store/types/returnOrderData.types'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface ReturnLocationTypec {
    returnLocation: LocationReturnType[]
}

const initialState: ReturnLocationTypec = {
    returnLocation: [],
}

const returnOrderDataSlice = createSlice({
    name: 'returnOrderData',
    initialState,
    reducers: {
        setReturnLocationData: (state, action: PayloadAction<LocationReturnType[]>) => {
            state.returnLocation = action.payload
        },
    },
})

export const { setReturnLocationData } = returnOrderDataSlice.actions
export default returnOrderDataSlice.reducer
