/* eslint-disable @typescript-eslint/no-explicit-any */

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import moment from 'moment'

export type ShipmentDetailType = {
    shipmentDetails: any[]
    count: number
    page: number
    pageSize: number
    from: string
    to: string
}

const initialState: ShipmentDetailType = {
    shipmentDetails: [],
    count: 0,
    page: 1,
    pageSize: 10,
    from: moment().format('YYYY-MM-DD'),
    to: moment().format('YYYY-MM-DD'),
}

const shipmentDetails = createSlice({
    name: 'shipmentDetails',
    initialState,
    reducers: {
        setShipmentDetails: (state, action: PayloadAction<any[]>) => {
            state.shipmentDetails = action.payload
        },
        setCount: (state, action: PayloadAction<number>) => {
            state.count = action.payload
        },
        setPage: (state, action: PayloadAction<number>) => {
            state.page = action.payload
        },
        setPageSize: (state, action: PayloadAction<number>) => {
            state.pageSize = action.payload
        },
        setFrom: (state, action: PayloadAction<string>) => {
            state.from = action.payload
        },
        setTo: (state, action: PayloadAction<string>) => {
            state.to = action.payload
        },
    },
})

export const { setShipmentDetails, setCount, setPage, setPageSize, setFrom, setTo } = shipmentDetails.actions
export default shipmentDetails.reducer
