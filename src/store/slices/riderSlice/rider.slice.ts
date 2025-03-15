/* eslint-disable @typescript-eslint/no-explicit-any */
import { RiderAttendanceResults } from '@/store/types/riderAddTypes'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import moment from 'moment'

const initialState: { riderAttendance: RiderAttendanceResults[]; count: number; page: number; pageSize: number; from: string; to: string } =
    {
        riderAttendance: [],
        count: 0,
        page: 1,
        pageSize: 100,
        from: moment().startOf('month').format('YYYY-MM-DD'),
        to: moment().endOf('month').format('YYYY-MM-DD'),
    }

const riderDataSlice = createSlice({
    name: 'riderData',
    initialState,
    reducers: {
        setRidersAttendanceData: (state, action: PayloadAction<RiderAttendanceResults[]>) => {
            state.riderAttendance = action.payload
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

export const { setRidersAttendanceData, setCount, setPage, setPageSize, setFrom, setTo } = riderDataSlice.actions
export default riderDataSlice.reducer
