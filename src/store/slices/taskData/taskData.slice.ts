import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { TASKDETAILS } from '@/store/types/tasks.type'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'

const initialState: TASKDETAILS = {
    taskData: {},
    loading: false,
    message: '',
}

export const fetchTaskData = createAsyncThunk('taskData/fetchTaskData', async (task_id: unknown) => {
    try {
        const response = await axioisInstance.get(`/logistic/slikk/task?task_id=${task_id}`)

        return {
            data: response.data?.data,
        }
    } catch (error: any) {
        return 'Failed'
    }
})

export const taskDataSlice = createSlice({
    name: 'taskData',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTaskData.pending, (state) => {
                state.loading = true
                state.message = ''
            })
            .addCase(fetchTaskData.fulfilled, (state, action) => {
                state.loading = false
                state.taskData = action.payload.data
            })
            .addCase(fetchTaskData.rejected, (state, action) => {
                state.loading = false
                state.message = (action.payload as string) || 'Failed to fetch data'
            })
    },
})

export default taskDataSlice.reducer
