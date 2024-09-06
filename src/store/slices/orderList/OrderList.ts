import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import moment from 'moment'
import { OrderState, Order } from '@/store/types/orderList.types'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'

const initialState: OrderState = {
    orders: [],
    loading: false,
    message: '',
    orderCount: 0,
    dropdownStatus: { value: 'ALL', name: 'ALL' },
    globalFilter: '',
    mobileFilter: '',
    pageSize: 10,
    page: 1,
    from: moment().format('YYYY-MM-DD'),
    to: moment().add(1, 'days').format('YYYY-MM-DD'),
}

export const fetchOrders = createAsyncThunk(
    'orders/fetchOrders',
    async (_, { getState }) => {
        try {
            const state = getState() as { order: OrderState }
            const {
                page,
                pageSize,
                from,
                to,
                dropdownStatus,
                globalFilter,
                mobileFilter,
            } = state.order
            const To_Date = moment(to).add(1, 'days').format('YYYY-MM-DD')
            const statusQuery =
                dropdownStatus.value === 'ALL'
                    ? ''
                    : `&status=${dropdownStatus.value}`
            let response

            if (globalFilter) {
                response = await axioisInstance.get(
                    `/merchant/orders?invoice_id=${globalFilter}${statusQuery}`,
                )
            } else if (mobileFilter) {
                response = await axioisInstance.get(
                    `/merchant/orders?mobile=${mobileFilter}${statusQuery}&p=${page}&page_size=${pageSize}`,
                )
            } else {
                response = await axioisInstance.get(
                    `/merchant/orders?p=${page}&page_size=${pageSize}&from=${from}&to=${To_Date}${statusQuery}`,
                )
            }

            return {
                orders: response.data?.data.results,
                orderCount: response.data?.data.count,
            }
        } catch (error) {
            console.log('error')
        }
    },
)

export const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        setDropdownStatus(state, action) {
            state.dropdownStatus = action.payload
        },
        setGlobalFilter(state, action) {
            state.globalFilter = action.payload
        },
        setMobileFilter(state, action) {
            state.mobileFilter = action.payload
        },
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
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchOrders.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                ;(state.loading = false),
                    (state.orders = action.payload?.orders)
                state.orderCount = action.payload?.orderCount
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                ;(state.loading = false),
                    (state.message =
                        action.error.message || 'Failed to fetch Order Lists')
            })
    },
})

export const {
    setDropdownStatus,
    setGlobalFilter,
    setMobileFilter,
    setPageSize,
    setPage,
    setFrom,
    setTo,
} = orderSlice.actions

export default orderSlice.reducer
