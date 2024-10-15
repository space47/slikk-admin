import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { URLSHORTNERTYPE } from '@/store/types/shortUrl.types'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'

const initialState: URLSHORTNERTYPE = {
    result: [],
    loading: false,
    message: '',
    page: 1,
    pageSize: 10,
    count: 0,
}

export const fetchUrlShortner = createAsyncThunk('urlShortner/fetchUrlShortner', async (_, { getState, rejectWithValue }) => {
    try {
        const state = getState() as { urlShortner: URLSHORTNERTYPE }
        const { page, pageSize } = state.urlShortner

        const response = await axioisInstance.get(`/short_urls?p=${page}&page_size=${pageSize}`)

        return {
            data: response.data.message,
        }
    } catch (error: any) {
        return rejectWithValue(error.response?.data || 'Failed to fetch data')
    }
})

export const urlShortnerSlice = createSlice({
    name: 'urlShortner',
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
            .addCase(fetchUrlShortner.pending, (state) => {
                state.loading = true
                state.message = ''
            })
            .addCase(fetchUrlShortner.fulfilled, (state, action) => {
                state.loading = false
                state.result = action.payload.data.results
                state.count = action.payload.data.count
            })
            .addCase(fetchUrlShortner.rejected, (state, action) => {
                state.loading = false
                state.message = (action.payload as string) || 'Failed to fetch data'
            })
    },
})

export const { setPage, setPageSize } = urlShortnerSlice.actions

export default urlShortnerSlice.reducer
