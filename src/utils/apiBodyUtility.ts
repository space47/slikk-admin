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

/* eslint-disable @typescript-eslint/no-explicit-any */

export const getChangedFormData = (fullFormData: FormData, initialValues: Record<string, any>): FormData => {
    const filteredFormData = new FormData()

    const isFile = (val: any) => val instanceof File || val instanceof Blob
    const currentEntries: Record<string, any> = {}
    for (const [key, value] of fullFormData.entries()) {
        currentEntries[key] = value
    }

    for (const key in currentEntries) {
        const newValue = currentEntries[key]
        const oldValue = initialValues[key]
        if ((newValue === null || newValue === undefined || newValue === '') && !isFile(newValue) && typeof newValue !== 'boolean') {
            continue
        }
        if (isFile(newValue)) {
            if (typeof oldValue === 'string' || oldValue === null || oldValue === undefined) {
                filteredFormData.append(key, newValue)
            }
            continue
        }

        if (typeof newValue === 'object' && newValue !== null) {
            if (!_.isEqual(newValue, oldValue)) {
                filteredFormData.append(key, JSON.stringify(newValue))
            }
            continue
        }

        if (newValue !== oldValue) {
            filteredFormData.append(key, newValue)
        }
    }

    return filteredFormData
}

export const buildFormData = (values: Record<string, any>): FormData => {
    const formData = new FormData()
    console.log('values got')

    const safeStringify = (obj: any) => {
        const seen = new WeakSet()
        return JSON.stringify(obj, (key, val) => {
            if (typeof val === 'object' && val !== null) {
                if (seen.has(val)) return
                seen.add(val)
            }
            // Skip React internals or DOM elements
            if (val instanceof HTMLElement || (val && val.__reactFiber) || (val && val.__reactProps)) {
                return undefined
            }
            return val
        })
    }

    Object.entries(values).forEach(([key, value]) => {
        if (value === undefined || value === null) return

        if (value instanceof File) {
            formData.append(key, value)
        } else if (Array.isArray(value) && value.length && value[0] instanceof File) {
            value.forEach((file: File, index: number) => {
                formData.append(`${key}[${index}]`, file)
            })
        } else if (typeof value === 'object') {
            try {
                formData.append(key, safeStringify(value))
            } catch (err) {
                console.warn(`Skipping circular object for key: ${key}`, err)
            }
        } else {
            formData.append(key, String(value))
        }
    })

    return formData
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
