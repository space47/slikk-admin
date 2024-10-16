import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { MONTHLYREPORTTYPES } from '@/store/types/monthlyReport.types'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import moment from 'moment'

const initialState: MONTHLYREPORTTYPES = {
    monthlyReport: null,
    loading: false,
    message: '',
    from: moment().startOf('month').format('YYYY-MM-DD'),
    to: moment().endOf('month').format('YYYY-MM-DD'),
}

export const fetchMonthlyReport = createAsyncThunk('monthlyReport/fetchMonthlyReport', async (_, { getState, rejectWithValue }) => {
    try {
        const state = getState() as { monthlyReport: MONTHLYREPORTTYPES }
        const { from, to } = state.monthlyReport

        const response = await axioisInstance.get(`/merchant/analytics/order?from=${from}&to=${to}&type=monthly_report`)

        return {
            data: response.data?.data,
        }
    } catch (error: any) {
        return rejectWithValue(error.response?.data || 'Failed to fetch data')
    }
})

export const monthlyReportSlice = createSlice({
    name: 'monthlyReport',
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
            .addCase(fetchMonthlyReport.pending, (state) => {
                state.loading = true
                state.message = ''
            })
            .addCase(fetchMonthlyReport.fulfilled, (state, action) => {
                state.loading = false
                state.monthlyReport = action.payload.data
            })
            .addCase(fetchMonthlyReport.rejected, (state, action) => {
                state.loading = false
                state.message = (action.payload as string) || 'Failed to fetch data'
            })
    },
})

export const { setFrom, setTo } = monthlyReportSlice.actions

export default monthlyReportSlice.reducer
