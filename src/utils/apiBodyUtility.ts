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

export const filterEmptyChangedValues = (initial: any, changed: any) => {
    const result: any = {}

    Object.keys(changed).forEach((key) => {
        const newValue = changed[key]
        const oldValue = initial[key]

        if (newValue === '' || newValue === null || newValue === undefined) {
            if (oldValue !== '' && oldValue !== null && oldValue !== undefined) {
                result[key] = newValue
            }
            return
        }

        result[key] = newValue
    })

    return result
}
