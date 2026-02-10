import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import moment from 'moment'
import { REMITANCE } from '@/store/types/remitance.types'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'

const initialState: REMITANCE = {
    remitance: [],
    loading: false,
    total_amount: 0,
    count: 0,
    brandValue: 'ok',
    pageSize: 10,
    page: 1,
    from: moment().format('YYYY-MM-DD'),
    to: moment().format('YYYY-MM-DD'),
}

export const fetchRemitanceOrders = createAsyncThunk('remitance/fetchRemitance', async (_, { getState }) => {
    try {
        const state = getState() as { order: REMITANCE }
        const { page, pageSize, from, to, brandValue } = state.order

        const response = await axioisInstance.get(`/merchant/product/sales?brand=${brandValue?.name}&from=${from}&to=${to}`)

        return {
            remitance: response?.data?.data,
            count: response?.data?.data?.count,
            total_amount: response?.data?.data?.total_amount,
        }
    } catch (error) {
        console.error(error)
        throw error
    }
})

export const remitanceSlice = createSlice({
    name: 'remitance',
    initialState,
    reducers: {
        setPageSize(state, action) {
            state.pageSize = action.payload
        },
        setPage(state, action) {
            state.page = action.payload
        },
        setFrom(state, action) {
            state.from = action.payload
        },
        setTo(state, action) {
            state.to = action.payload
        },
        setBrandValue(state, action) {
            state.brandValue = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRemitanceOrders.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchRemitanceOrders.fulfilled, (state, action) => {
                ;((state.loading = false), (state.remitance = action.payload?.remitance))
                state.count = action.payload?.count
                state.total_amount = action.payload?.total_amount
            })
            .addCase(fetchRemitanceOrders.rejected, (state) => {
                state.loading = false
            })
    },
})

export const { setPageSize, setPage, setFrom, setTo, setBrandValue } = remitanceSlice.actions
export default remitanceSlice.reducer
