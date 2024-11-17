import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import moment from 'moment'
import { LoyaltyType } from '@/store/types/slikkLoyalty'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'

const initialState: LoyaltyType = {
    loyalty: [],
    loading: false,
    pageSize: 10,
    page: 1,
    message: '',
    // from: moment().format('YYYY-MM-DD'),
    // to: moment().format('YYYY-MM-DD'),
}

export const fetchLoyalty = createAsyncThunk('loyalty/fetchLoyalty', async (_, { getState }) => {
    try {
        const state = getState() as { loyalty: LoyaltyType }
        const { page, pageSize } = state.loyalty

        const response = await axioisInstance.get(`/loyalty?p=${page}&page_size=${pageSize}`)

        return {
            data: response?.data?.data,
        }
    } catch (error) {
        console.error(error)
        throw error
    }
})

export const loyaltySlice = createSlice({
    name: 'loyalty',
    initialState,
    reducers: {
        setPageSize(state, action) {
            state.pageSize = action.payload
        },
        setPage(state, action) {
            state.page = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchLoyalty.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchLoyalty.fulfilled, (state, action) => {
                ;(state.loading = false), (state.loyalty = action.payload?.data)
            })
            .addCase(fetchLoyalty.rejected, (state) => {
                state.loading = false
            })
    },
})

export const { setPageSize, setPage } = loyaltySlice.actions
export default loyaltySlice.reducer
