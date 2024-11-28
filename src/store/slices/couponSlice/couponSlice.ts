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
    page: 1,
    accessDenied: false,
}

export const fetchCoupons = createAsyncThunk('coupons/fetchCoupons', async (_, { rejectWithValue }) => {
    try {
        const response = await axioisInstance.get(`merchant/coupon?coupon_type=COUPON`)

        return {
            coupons: response.data.data,
        }
    } catch (error: any) {
        console.log('error')
        if (error.response && error.response.status === 403) {
            return {
                accessDenied: true,
            }
        }
        return {
            accessDenied: false,
        }
    }
})
export const fetchCouponsEdit = createAsyncThunk('coupons/fetchCoupons/Edit', async (code: string, { rejectWithValue }) => {
    try {
        const response = await axioisInstance.get(`merchant/coupon?coupon_code=${code}`)
        return {
            couponsEdit: response.data.data,
        }
    } catch (error: any) {
        if (error.response && error.response.status === 403) {
            return {
                accessDenied: true,
            }
        }
        return {
            accessDenied: false,
        }
    }
})
export const couponSlice = createSlice({
    name: 'Coupons',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCoupons.pending, (state) => {
                state.loading = true
                state.accessDenied = false
            })
            .addCase(fetchCoupons.fulfilled, (state, action) => {
                ;(state.loading = false), (state.coupons = action.payload?.coupons)
            })
            .addCase(fetchCoupons.rejected, (state, action) => {
                ;(state.loading = false),
                    (state.message = action.error.message || 'Failed to fetch Coupons Lists'),
                    (state.accessDenied = action?.payload?.accessDenied)
            })
            .addCase(fetchCouponsEdit.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchCouponsEdit.fulfilled, (state, action) => {
                ;(state.loading = false), (state.couponsEdit = action.payload?.couponsEdit)
            })
            .addCase(fetchCouponsEdit.rejected, (state, action) => {
                ;(state.loading = false), (state.message = action.error.message || 'Failed to fetch coupons Lists')
                state.accessDenied = action?.payload?.accessDenied
            })
    },
})

export default couponSlice.reducer
