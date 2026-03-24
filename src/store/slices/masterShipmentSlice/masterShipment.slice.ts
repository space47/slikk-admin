/* eslint-disable @typescript-eslint/no-explicit-any */

import { Shipment } from '@/store/types/masterShipment.types'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import moment from 'moment'

export type MasterShipmentDetailType = {
    masterShipmentDetails: Shipment[]
    count: number
    page: number
    pageSize: number
    from: string
    to: string
}

const initialState: MasterShipmentDetailType = {
    masterShipmentDetails: [],
    count: 0,
    page: 1,
    pageSize: 10,
    from: moment().format('YYYY-MM-DD'),
    to: moment().format('YYYY-MM-DD'),
}

const masterShipmentDetails = createSlice({
    name: 'masterShipmentDetails',
    initialState,
    reducers: {
        setMasterShipmentDetails: (state, action: PayloadAction<Shipment[]>) => {
            state.masterShipmentDetails = action.payload
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

export const { setMasterShipmentDetails, setCount, setPage, setPageSize, setFrom, setTo } = masterShipmentDetails.actions
export default masterShipmentDetails.reducer
