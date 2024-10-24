import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { OrderSummaryTYPE } from '@/store/types/orderUserSummary.types'

const initialState: OrderSummaryTYPE = {
    customerData: {},
    loading: false,
    message: '',
}

export const fetchUserSummary = createAsyncThunk('userSummary/fetchUserSummary', async (mobile: any) => {
    try {
        const response = await axioisInstance.get(`/merchant/analytics/order?mobile=${mobile}&type=user_summary`)

        return {
            data: response.data?.data,
        }
    } catch (error: any) {
        return
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
            })
            .addCase(fetchUserSummary.rejected, (state, action) => {
                state.loading = false
                state.message = (action.payload as string) || 'Failed to fetch data'
            })
    },
})

export default userSummarySlice.reducer
