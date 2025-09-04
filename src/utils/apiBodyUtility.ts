/* eslint-disable @typescript-eslint/no-explicit-any */
import _ from 'lodash'

export function getChangedValues<T extends Record<string, any>>(initial: T, current: T): Partial<T> {
    const changes: Partial<T> = {}

    Object.keys(current).forEach((key) => {
        const initialValue = initial?.[key]
        const currentValue = current?.[key]

        // Deep compare using lodash
        if (!_.isEqual(initialValue, currentValue)) {
            changes[key as keyof T] = currentValue
        }
    })

    return changes
}

export function filterEmptyValues<T extends Record<string, any>>(obj: T): Partial<T> {
    return Object.fromEntries(Object.entries(obj).filter(([, value]) => value !== undefined && value !== '')) as Partial<T>
}
