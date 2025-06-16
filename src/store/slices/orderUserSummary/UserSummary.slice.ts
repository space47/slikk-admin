import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { OrderSummaryTYPE } from '@/store/types/orderUserSummary.types'
import { AxiosError } from 'axios'

const initialState: OrderSummaryTYPE = {
    customerData: {},
    loading: false,
    message: '',
    errorMessage: '',
}

export const fetchUserSummary = createAsyncThunk('userSummary/fetchUserSummary', async (mobile: any) => {
    try {
        const response = await axioisInstance.get(`/merchant/analytics/order?mobile=${mobile}&type=user_summary`)

        return {
            data: response.data?.data,
        }
    } catch (error) {
        if (error instanceof AxiosError) {
            console.log(error)
            return { err: error?.response?.status }
        }
    }
})

export const userSummarySlice = createSlice({
    name: 'userSummary',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserSummary.pending, (state) => {
                state.loading = true
                state.message = ''
            })
            .addCase(fetchUserSummary.fulfilled, (state, action) => {
                state.loading = false
                state.customerData = action.payload?.data
                state.errorMessage = action?.payload?.err?.toString()
            })
            .addCase(fetchUserSummary.rejected, (state, action) => {
                state.loading = false
                state.message = (action.payload as string) || 'Failed to fetch data'
                state.errorMessage = (action?.payload as string) || ''
            })
    },
})

export default userSummarySlice.reducer
