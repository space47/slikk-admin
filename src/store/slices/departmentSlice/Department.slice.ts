import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import moment from 'moment'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { departmentTypes } from '@/store/types/departments.types'

const initialState: departmentTypes = {
    departmentsData: [],
    loading: false,
    message: '',
    accessDenied: false,
}

export const fetchDepartments = createAsyncThunk('coupons/fetchDepartments', async (_, { rejectWithValue }) => {
    try {
        const response = await axioisInstance.get(`/departments`)

        return {
            departmentsData: response.data.data,
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

export const departmentsSlice = createSlice({
    name: 'departmentsData',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDepartments.pending, (state) => {
                state.loading = true
                state.accessDenied = false
            })
            .addCase(fetchDepartments.fulfilled, (state, action) => {
                ;((state.loading = false), (state.departmentsData = action.payload?.departmentsData))
            })
            .addCase(fetchDepartments.rejected, (state, action) => {
                ;((state.loading = false),
                    (state.message = action.error.message || 'Failed to fetch Departments Lists'),
                    (state.accessDenied = action?.payload?.accessDenied))
            })
    },
})

export default departmentsSlice.reducer
