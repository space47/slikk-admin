import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import moment from 'moment'
import { OrderState, Order } from '@/store/types/orderList.types'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'

const SEARCHOPTIONS = [
    { label: 'INVOICE', value: 'invoice' },
    { label: 'MOBILE', value: 'mobile' },
]

const initialState: OrderState = {
    orders: [],
    loading: false,
    message: '',
    orderCount: 0,
    dropdownStatus: { value: 'ALL', name: 'ALL' },
    deliveryType: { value: '', label: '' },
    paymentType: { value: '', label: '' },
    searchInput: '',
    currentSelectedPage: {},
    pageSize: 10,
    page: 1,
    from: moment().format('YYYY-MM-DD'),
    to: moment().add(1, 'days').format('YYYY-MM-DD'),
}

export const fetchOrders = createAsyncThunk('orders/fetchOrders', async (_, { getState }) => {
    try {
        const state = getState() as { order: OrderState }
        const { page, pageSize, from, to, dropdownStatus, searchInput, currentSelectedPage, deliveryType, paymentType } = state.order

        const To_Date = moment(to).add(1, 'days').format('YYYY-MM-DD')
        const statusQuery = dropdownStatus.value === 'ALL' ? '' : `&status=${dropdownStatus.value}`

        let response

        let deliveryStatus = ''

        if (deliveryType?.value && deliveryType?.value !== 'undefined') {
            deliveryStatus = `&delivery_type=${deliveryType?.value}`
        }
        let paymentStatus = ''

        if (paymentType?.value && paymentType?.value !== 'undefined') {
            paymentStatus = `&payment_mode=${paymentType?.value}`
        }

        if (currentSelectedPage.value === 'invoice' && searchInput) {
            response = await axioisInstance.get(
                `/merchant/orders?invoice_id=${searchInput.toUpperCase()}${statusQuery}&p=${page}&page_size=${pageSize}${deliveryStatus}${paymentStatus}`,
            )
        } else if (currentSelectedPage.value === 'mobile' && searchInput) {
            response = await axioisInstance.get(
                `/merchant/orders?mobile=${searchInput.toUpperCase()}${statusQuery}&p=${page}&page_size=${pageSize}${deliveryStatus}${paymentStatus}`,
            )
        } else if (currentSelectedPage.value === 'awb' && searchInput) {
            response = await axioisInstance.get(
                `/merchant/orders?awb=${searchInput.toUpperCase()}${statusQuery}&p=${page}&page_size=${pageSize}${deliveryStatus}${paymentStatus}`,
            )
        } else if (!searchInput) {
            response = await axioisInstance.get(
                `/merchant/orders?p=${page}&page_size=${pageSize}&from=${from}&to=${To_Date}${statusQuery}${deliveryStatus}${paymentStatus}`,
            )
        } else {
            notification.error({
                message: 'NO DATA',
            })
        }

        return {
            orders: response?.data?.data.results,
            orderCount: response?.data?.data.count,
        }
    } catch (error) {
        console.log('error', error)
    }
})

export const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        setDropdownStatus(state, action) {
            state.dropdownStatus = action.payload
        },
        setDeliveryType(state, action) {
            state.deliveryType = action.payload
        },
        setPaymentType(state, action) {
            state.paymentType = action.payload
        },
        setCurrentSelectedPage(state, action) {
            state.currentSelectedPage = action.payload
        },
        setSearchInput(state, action) {
            state.searchInput = action.payload
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
                ;(state.loading = false), (state.orders = action.payload?.orders)
                state.orderCount = action.payload?.orderCount
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                ;(state.loading = false), (state.message = action.error.message || 'Failed to fetch Order Lists')
            })
    },
})

export const {
    setDropdownStatus,
    setCurrentSelectedPage,
    setSearchInput,
    setPageSize,
    setPage,
    setFrom,
    setTo,
    setDeliveryType,
    setPaymentType,
} = orderSlice.actions

export default orderSlice.reducer
