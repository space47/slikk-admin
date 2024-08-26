import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import moment from 'moment'
import { COUPONDATA, COUPON_STATE } from '@/store/types/coupons.types'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'

const initialState: COUPON_STATE = {
    coupons: [],
    couponsEdit: null,
    loading: false,
    message: '',
    globalFilter: '',
    pageSize: 10,
    page: 1
}

export const fetchCoupons = createAsyncThunk(
    'coupons/fetchCoupons',
    async () => {
        try {
            const response = await axioisInstance.get(`merchant/coupon`)

            return {
                coupons: response.data.data
            }
        } catch (error) {
            console.log('error')
        }
    }
)

export const fetchCouponsEdit = createAsyncThunk(
    'coupons/fetchCoupons/Edit',
    async () => {
        try {
            const response = await axioisInstance.get(`merchant/coupon`)

            return {
                couponsEdit: response.data.data
            }
        } catch (error) {
            console.log('error')
        }
    }
)

export const couponSlice = createSlice({
    name: 'Coupons',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCoupons.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchCoupons.fulfilled, (state, action) => {
                ;(state.loading = false),
                    (state.coupons = action.payload?.coupons)
            })
            .addCase(fetchCoupons.rejected, (state, action) => {
                ;(state.loading = false),
                    (state.message =
                        action.error.message || 'Failed to fetch Coupons Lists')
            })
            .addCase(fetchCouponsEdit.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchCouponsEdit.fulfilled, (state, action) => {
                ;(state.loading = false),
                    (state.coupons = action.payload?.couponsEdit)
            })
            .addCase(fetchCouponsEdit.rejected, (state, action) => {
                ;(state.loading = false),
                    (state.message =
                        action.error.message || 'Failed to fetch coupons Lists')
            })
    }
})

export default couponSlice.reducer
