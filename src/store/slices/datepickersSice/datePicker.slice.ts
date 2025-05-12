// store/datePickerSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface DatePickerState {
    selectedOption: string
}

const initialState: DatePickerState = {
    selectedOption: 'CURRENT WEEK',
}

const datePickerSlice = createSlice({
    name: 'datePicker',
    initialState,
    reducers: {
        setSelectedOption(state, action: PayloadAction<string>) {
            state.selectedOption = action.payload
        },
    },
})

export const { setSelectedOption } = datePickerSlice.actions
export default datePickerSlice.reducer
