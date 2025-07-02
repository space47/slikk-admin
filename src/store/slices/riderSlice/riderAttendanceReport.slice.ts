/* eslint-disable @typescript-eslint/no-explicit-any */
import { RiderAttendanceReportSliceType, RiderAttendanceResults } from '@/store/types/riderAddTypes'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import moment from 'moment'

const initialState: RiderAttendanceReportSliceType = {
    riderAttendanceReport: [],
    count: 0,
    page: 1,
    pageSize: 3000,
    from: moment().startOf('month').format('YYYY-MM-DD'),
    to: moment().endOf('month').format('YYYY-MM-DD'),
}

const riderAttendanceReportSlice = createSlice({
    name: 'riderAttendanceReport',
    initialState,
    reducers: {
        setRidersAttendanceReportData: (state, action: PayloadAction<RiderAttendanceResults[]>) => {
            state.riderAttendanceReport = action.payload
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

export const { setRidersAttendanceReportData, setCount, setPage, setPageSize, setFrom, setTo } = riderAttendanceReportSlice.actions
export default riderAttendanceReportSlice.reducer
