import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { TASKDETAILS } from '@/store/types/tasks.type'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { QUERYNAMETYPE } from '@/store/types/queryName.types'

const initialState: QUERYNAMETYPE = {
    data: [],
    total: 0,
    loading: false,
    message: '',
}

export const fetchQueryName = createAsyncThunk('queryName/fetchQueryName', async (name: string) => {
    try {
        const response = await axioisInstance.get(`/query/execute/${name}`)

        return {
            data: response.data?.data,
        }
    } catch (error: any) {
        return 'Failed'
    }
})

export const queryNameSlice = createSlice({
    name: 'queryName',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchQueryName.pending, (state) => {
                state.loading = true
                state.message = ''
            })
            .addCase(fetchQueryName.fulfilled, (state, action) => {
                state.loading = false
                state.data = action.payload.data?.data
                state.total = action.payload?.data.data
            })
            .addCase(fetchQueryName.rejected, (state, action) => {
                state.loading = false
                state.message = (action.payload as string) || 'Failed to fetch data'
            })
    },
})

export default queryNameSlice.reducer
