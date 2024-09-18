import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import moment from 'moment'
import { USERANALYTICS_TYPE } from '@/store/types/userAnalytics.types'
import axiosInstance from '@/utils/intercepter/globalInterceptorSetup'

const initialState: USERANALYTICS_TYPE = {
    status: '',
    total_logged_in: 0,
    total_otp_verified: 0,
    data: {},
    from: moment().format('YYYY-MM-DD'),
    to: moment().format('YYYY-MM-DD'),
    loading: false,
    message: '',
    page: 1,
    page_size: 10,
}

export const fetchUserAnalytics = createAsyncThunk('userAnalytics/fetchUserAnalytics', async (_, { getState, rejectWithValue }) => {
    try {
        const state = getState() as { userAnalytics: USERANALYTICS_TYPE }
        const { from, to, page, page_size } = state.userAnalytics

        const To_Date = moment(to).add(1, 'days').format('YYYY-MM-DD')

        const response = await axiosInstance.get(
            `merchant/analytic/user?type=login&from=${from}&to=${To_Date}&is_verified=True&p=${page}&page_size=${page_size}`,
        )

        return {
            userData: response.data,
        }
    } catch (error: any) {
        return rejectWithValue(error.response?.data || 'Failed to fetch data')
    }
})

export const userAnalyticsSlice = createSlice({
    name: 'userAnalytics',
    initialState,
    reducers: {
        setFrom(state, action) {
            state.from = action.payload
        },
        setTo(state, action) {
            state.to = action.payload
        },
        setPage(state, action) {
            state.page = action.payload
        },
        setPage_size(state, action) {
            state.page_size = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserAnalytics.pending, (state) => {
                state.loading = true
                state.message = ''
            })
            .addCase(fetchUserAnalytics.fulfilled, (state, action) => {
                state.loading = false
                state.data = action.payload.userData.data
                state.total_logged_in = action.payload.userData.total_logged_in || 0
                state.total_otp_verified = action.payload.userData.total_otp_verified || 0
            })
            .addCase(fetchUserAnalytics.rejected, (state, action) => {
                state.loading = false
                state.message = (action.payload as string) || 'Failed to fetch data'
            })
    },
})

export const { setFrom, setTo, setPage, setPage_size } = userAnalyticsSlice.actions

export default userAnalyticsSlice.reducer
