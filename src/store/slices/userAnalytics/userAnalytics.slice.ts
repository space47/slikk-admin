import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import moment from 'moment'
import { USERANALYTICS_TYPE } from '@/store/types/userAnalytics.types'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'

const initialState: USERANALYTICS_TYPE = {
    status: '',
    total_logged_in: 0,
    total_otp_verified: 0,
    data: {},
    from: '',
    to: '',
    loading: false,
    message: '',
}

export const fetchUserAnalytics = createAsyncThunk(
    'userAnalytics/fetchUserAnalytics',
    async (_, { getState }) => {
        try {
            const state = getState() as { userData: USERANALYTICS_TYPE }
            const { from, to } = state.userData

            const To_Date = moment(to).add(1, 'days').format('YYYY-MM-DD')

            const response = await axioisInstance.get(
                `merchant/analytic/user?type=login&from=2024-08-2&to=2024-8-30&is_verified=True`,
            )

            return {
                userResponse: response?.data,
                userData: response?.data?.data?.results,
            }
        } catch (error) {
            console.log('error', error)
        }
    },
)

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
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserAnalytics.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchUserAnalytics.fulfilled, (state, action) => {
                ;(state.loading = false),
                    (state.data = action.payload?.userData)
            })
            .addCase(fetchUserAnalytics.rejected, (state, action) => {
                ;(state.loading = false),
                    (state.message =
                        action.error.message || 'Failed to fetch Order Lists')
            })
    },
})

export const { setFrom, setTo } = userAnalyticsSlice.actions

export default userAnalyticsSlice.reducer
