/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState: any = {}

const riderDataSlice = createSlice({
    name: 'riderData',
    initialState,
    reducers: {
        setRidersData: (
            state,
            action: PayloadAction<{
                data: number
            }>,
        ) => {
            state.picked = action.payload.data
        },
    },
})

export const { setRidersData } = riderDataSlice.actions
export default riderDataSlice?.reducer
