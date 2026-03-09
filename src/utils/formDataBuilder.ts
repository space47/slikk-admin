/* eslint-disable @typescript-eslint/no-explicit-any */
// utils/formDataBuilder.ts
export const buildFormData = (data: Record<string, any>) => {
    const formData = new FormData()

    Object.entries(data).forEach(([key, value]) => {
        if (value === null || value === undefined) return

        // Handle arrays
        if (Array.isArray(value)) {
            value.forEach((item, idx) => {
                if (typeof item === 'object') {
                    Object.entries(item).forEach(([k, v]) => {
                        formData.append(`${key}[${idx}][${k}]`, v as any)
                    })
                } else {
                    formData.append(`${key}[${idx}]`, item as any)
                }
            })
            return
        }

        // Handle objects
        if (typeof value === 'object') {
            Object.entries(value).forEach(([childKey, childValue]) => {
                formData.append(`${key}[${childKey}]`, childValue as any)
            })
            return
        }

        // Primitive values
        formData.append(key, value as any)
    })

    return formData
}
