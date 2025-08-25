/* eslint-disable @typescript-eslint/no-explicit-any */
export const getChangedValues = <T extends Record<string, any>>(currentValues: T, initialValues: T): Partial<T> => {
    const changedValues: Partial<T> = {}

    Object.keys(currentValues).forEach((key) => {
        const currentVal = currentValues[key as keyof T]
        const initialVal = initialValues[key as keyof T]

        if (!deepEqual(currentVal, initialVal)) {
            ;(changedValues as any)[key] = currentVal
        }
    })

    return changedValues
}

export const hasChanges = <T extends Record<string, any>>(currentValues: T, initialValues: T): boolean => {
    return Object.keys(getChangedValues(currentValues, initialValues)).length > 0
}

const deepEqual = (a: any, b: any): boolean => {
    if (a === b) return true

    if (a == null || b == null) return false
    if (typeof a !== 'object' || typeof b !== 'object') return a === b

    if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length) return false
        return a.every((item, index) => deepEqual(item, b[index]))
    }

    if (Array.isArray(a) || Array.isArray(b)) return false

    const keysA = Object.keys(a)
    const keysB = Object.keys(b)

    if (keysA.length !== keysB.length) return false

    return keysA.every((key) => keysB.includes(key) && deepEqual(a[key], b[key]))
}
