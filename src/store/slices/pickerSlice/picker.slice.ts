/* eslint-disable @typescript-eslint/no-explicit-any */
import { particularPickerType, pickerBoardData } from '@/store/types/picker.types'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import moment from 'moment'

export interface PickerRequiredType {
    pickerBoardData?: pickerBoardData[]
    pickerDetailsData?: particularPickerType
    from?: string
    to?: string
}

const initialState: PickerRequiredType = {
    pickerBoardData: [],
    pickerDetailsData: {},
    from: moment().format('YYYY-MM-DD'),
    to: moment().format('YYYY-MM-DD'),
}

const pickerSlice = createSlice({
    name: 'picker',
    initialState,
    reducers: {
        setPickerBoardData: (state, action: PayloadAction<pickerBoardData[]>) => {
            state.pickerBoardData = action.payload
        },
        setPickerDetailsData: (state, action: PayloadAction<particularPickerType>) => {
            state.pickerDetailsData = action.payload
        },

        setFrom: (state, action: PayloadAction<string>) => {
            state.from = action.payload
        },
        setTo: (state, action: PayloadAction<string>) => {
            state.to = action.payload
        },
    },
})

export const { setPickerBoardData, setPickerDetailsData, setFrom, setTo } = pickerSlice.actions
export default pickerSlice.reducer
