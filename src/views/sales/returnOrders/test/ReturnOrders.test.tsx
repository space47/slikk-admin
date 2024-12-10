/* eslint-disable @typescript-eslint/no-explicit-any */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import * as React from 'react'

export async function handleDeliverySelect(selectedValue: any, state: any, setDeliveryType: any) {
    if (state.value.includes(selectedValue)) {
        setDeliveryType((prevState: any) => ({
            ...prevState,
            value: prevState.value.filter((item: any) => item !== selectedValue),
        }))
    } else {
        setDeliveryType((prevState: any) => ({
            ...prevState,
            value: [...prevState.value, selectedValue],
        }))
    }
}

vi.mock('react', () => {
    const useState = vi.fn()
    return { useState }
})

describe('handleDeliverySelect function', () => {
    let setStateMock: any
    let state: any

    beforeEach(() => {
        setStateMock = vi.fn()
        state = { value: [] }
        vi.spyOn(React, 'useState').mockImplementationOnce(() => [state, setStateMock])
    })

    afterEach(() => {
        vi.clearAllMocks()
    })

    it('add new value', async () => {
        const selectedValue = 'PENDING'

        await handleDeliverySelect(selectedValue, state, setStateMock)

        expect(setStateMock).toHaveBeenCalledWith(expect.any(Function))
        const updaterFunction = setStateMock.mock.calls[0][0]
        const updatedState = updaterFunction(state)
        expect(updatedState).toEqual({ value: ['PENDING'] })
    })

    it('add multiple values', async () => {
        const value1 = 'PENDING'
        const value2 = 'PICKUP_CREATED'

        await handleDeliverySelect(value1, state, setStateMock)
        const updaterFunction1 = setStateMock.mock.calls[0][0]
        const updatedState1 = updaterFunction1(state)

        await handleDeliverySelect(value2, updatedState1, setStateMock)
        const updaterFunction2 = setStateMock.mock.calls[1][0]
        const updatedState2 = updaterFunction2(updatedState1)

        expect(updatedState2).toEqual({ value: ['PENDING', 'PICKUP_CREATED'] })
    })

    it('remove the selectedq', async () => {
        const value1 = 'PENDING'
        const value2 = 'PICKUP_CREATED'

        await handleDeliverySelect(value1, state, setStateMock)
        const updaterFunction1 = setStateMock.mock.calls[0][0]
        const updatedState1 = updaterFunction1(state)

        await handleDeliverySelect(value2, updatedState1, setStateMock)
        const updaterFunction2 = setStateMock.mock.calls[1][0]
        const updatedState2 = updaterFunction2(updatedState1)

        await handleDeliverySelect(value1, updatedState2, setStateMock)
        const updaterFunction3 = setStateMock.mock.calls[2][0]
        const updatedState3 = updaterFunction3(updatedState2)

        expect(updatedState3).toEqual({ value: ['PICKUP_CREATED'] })
    })
})
