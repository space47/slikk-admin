/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import {
    ReturnOrderState,
    getAllReturnOrdersSuccess,
    getAllReturnOrdersRequest,
    getAllReturnOrdersFailure,
} from '@/store/types/returnDetails.types'

const initialState: ReturnOrderState = {
    returnOrders: null,
    loading: false,
    message: '',
}

export const fetchReturnOrders = createAsyncThunk('returnOrders/fetchReturnOrders', async (id: any, { dispatch }) => {
    dispatch({ type: 'getAllReturnOrdersRequest' })

    try {
        const response = await axioisInstance.get(`merchant/return_order/${id}`)
        dispatch(
            getAllReturnOrdersSuccess({
                returnOrders: response.data.data,
                loading: false,
                message: 'Success',
            }),
        )
    } catch (error: any) {
        dispatch(
            getAllReturnOrdersFailure({
                returnOrders: null,
                loading: false,
                message: error.message || 'Failure',
            }),
        )
    }
})

const returnOrdersSlice = createSlice({
    name: 'returnOrder',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllReturnOrdersRequest, (state) => {
                state.loading = true
            })
            .addCase(getAllReturnOrdersSuccess, (state, action) => {
                ;((state.loading = false), (state.returnOrders = action.payload.returnOrders), (state.message = action.payload.message))
            })
            .addCase(getAllReturnOrdersFailure, (state, action) => {
                ;((state.loading = false), (state.returnOrders = action.payload.returnOrders))
                state.message = action.payload.message
            })
    },
})

export default returnOrdersSlice.reducer
