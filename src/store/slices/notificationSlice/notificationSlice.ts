import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { NotificationData } from '@/store/types/notification.types'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'

const initialState: NotificationData = {
    notification: [],
    loading: false,
    message: '',
    page: 1,
    pageSize: 10,
    count: 0,
}

export const fetchNotification = createAsyncThunk('notification/fetchNotification', async (_, { getState, rejectWithValue }) => {
    try {
        const state = getState() as { userAnalytics: NotificationData }
        const { page, pageSize } = state.userAnalytics

        const response = await axioisInstance.get(`/notifications/config?p=${page}&page_size=${pageSize}`)

        return {
            data: response.data.data,
        }
    } catch (error: any) {
        return rejectWithValue(error.response?.data || 'Failed to fetch data')
    }
})

export const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        setPage(state, action) {
            state.page = action.payload
        },
        setPageSize(state, action) {
            state.pageSize = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotification.pending, (state) => {
                state.loading = true
                state.message = ''
            })
            .addCase(fetchNotification.fulfilled, (state, action) => {
                state.loading = false
                state.notification = action.payload.data.results
                state.count = action.payload.data.count
            })
            .addCase(fetchNotification.rejected, (state, action) => {
                state.loading = false
                state.message = (action.payload as string) || 'Failed to fetch data'
            })
    },
})

export const { setPage, setPageSize } = notificationSlice.actions

export default notificationSlice.reducer
