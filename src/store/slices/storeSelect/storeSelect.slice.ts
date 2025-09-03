/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type StoreSelectType = {
    store_ids: number[]
}

const initialState: StoreSelectType = {
    store_ids: [],
}

const storeSelectSlice = createSlice({
    name: 'storeSelect',
    initialState,
    reducers: {
        setStoreIds: (state, action: PayloadAction<number[]>) => {
            state.store_ids = action.payload
        },
    },
})

export const { setStoreIds } = storeSelectSlice.actions
export default storeSelectSlice.reducer
