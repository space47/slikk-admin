import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import moment from 'moment'
import { ReturnOrderOverallState, ReturnOrderOverall } from '@/store/types/returnOverallDetails.types'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'

const initialState: ReturnOrderOverallState = {
    returnOrders: [],
    loading: false,
    message: '',
    orderCount: 0,
    dropdownStatus: { value: 'ALL', name: 'ALL' },
    globalFilter: '',
    mobileFilter: '',
    pageSize: 10,
    currentSelectedPage: null,
    deliveryType: null,
    searchInput: '',
    page: 1,
    from: moment().format('YYYY-MM-DD'),
    to: moment().add(1, 'days').format('YYYY-MM-DD'),
}

export const fetchReturnOverallOrders = createAsyncThunk('returnOverallOrders/fetchOrders', async (_, { getState, rejectWithValue }) => {
    try {
        const state = getState() as { returnOrders: ReturnOrderOverallState }
        const { page, pageSize, from, to, dropdownStatus, searchInput, currentSelectedPage, deliveryType } = state.returnOrders
        const To_Date = moment(to).add(1, 'days').format('YYYY-MM-DD')
        const status = dropdownStatus?.value.length === 0 ? '' : `&status=${dropdownStatus.value}`
        const deliveryStatus = deliveryType?.value.length ? `&return_type=${deliveryType.value}` : ''
        let response

        if (currentSelectedPage.value === 'return_order_id' && searchInput) {
            response = await axioisInstance.get(
                `/merchant/return_orders?return_order_id=${searchInput.toUpperCase()}${status}${deliveryStatus}`,
            )
        } else if (currentSelectedPage.value === 'invoice_id' && searchInput) {
            response = await axioisInstance.get(`/merchant/return_orders?invoice_id=${searchInput.toUpperCase()}${status}${deliveryStatus}`)
        } else if (currentSelectedPage.value === 'awb' && searchInput) {
            response = await axioisInstance.get(`/merchant/return_orders?awb=${searchInput.toUpperCase()}${status}${deliveryStatus}`)
        } else {
            response = await axioisInstance.get(
                `/merchant/return_orders?p=${page}&page_size=${pageSize}&from=${from}&to=${To_Date}${status}${deliveryStatus}`,
            )
        }

        return {
            returnOrders: response.data?.data.results,
            orderCount: response.data?.data.count,
        }
    } catch (error: any) {
        notification.error({ message: 'API Error', description: error.message })
        return rejectWithValue('Failed to fetch orders')
    }
})

export const returnOrderOverallSlice = createSlice({
    name: 'returnOrderOverall',
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
            .addCase(fetchReturnOverallOrders.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchReturnOverallOrders.fulfilled, (state, action) => {
                ;(state.loading = false), (state.returnOrders = action.payload?.returnOrders)
                state.orderCount = action.payload?.orderCount
            })
            .addCase(fetchReturnOverallOrders.rejected, (state, action) => {
                ;(state.loading = false), (state.message = action.error.message || 'Failed to fetch Order Lists')
            })
    },
})

export const { setDropdownStatus, setGlobalFilter, setMobileFilter, setPageSize, setPage, setFrom, setTo } = returnOrderOverallSlice.actions

export default returnOrderOverallSlice.reducer
