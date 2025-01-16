import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { companyStore } from '@/store/types/companyStore.types'

const initialState: companyStore = {
    storeResults: [],
    loading: false,
    message: '',
}

export const fetchCompanyStore = createAsyncThunk('companyStore/fetchCompanyStore', async (_, { getState, rejectWithValue }) => {
    try {
        const response = await axioisInstance.get(`/merchant/store`)

        return {
            data: response.data?.data,
        }
    } catch (error: any) {
        return rejectWithValue(error.response?.data || 'Failed to fetch data')
    }
})

export const CompanyStoreSlice = createSlice({
    name: 'companyStore',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCompanyStore.pending, (state) => {
                state.loading = true
                state.message = ''
            })
            .addCase(fetchCompanyStore.fulfilled, (state, action) => {
                state.loading = false
                state.storeResults = action.payload.data.results
            })
            .addCase(fetchCompanyStore.rejected, (state, action) => {
                state.loading = false
                state.message = (action.payload as string) || 'Failed to fetch data'
            })
    },
})

export default CompanyStoreSlice.reducer
