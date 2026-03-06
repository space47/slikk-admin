/* eslint-disable @typescript-eslint/no-explicit-any */
export const getBgColor = (depth: number) => {
    switch (depth % 3) {
        case 0:
            return 'bg-white'
        case 1:
            return 'bg-blue-50'
        case 2:
            return 'bg-green-50'
        default:
            return 'bg-white'
    }
}
export const getBorderColor = (depth: number) => {
    switch (depth % 3) {
        case 0:
            return 'border-gray-300'
        case 1:
            return 'border-blue-200'
        case 2:
            return 'border-green-200'
        default:
            return 'border-gray-300'
    }
}

export const processField = (field: any): string | null => {
    const { key, value = '', prefix = '', suffix = '', dataType, subFields } = field

    let fieldQuery = ''

    if (subFields && Array.isArray(subFields) && subFields.length > 0) {
        let replacedValue = value || ''

        subFields.forEach((sub: any) => {
            const subVal = sub.value ?? ''
            replacedValue = replacedValue.replace(`{${sub.key}}`, subVal)
        })

        fieldQuery = `${key}=${encodeURIComponent(replacedValue || '')}`
        return fieldQuery
    }

    const normalizedValue = value === undefined || value === null ? '' : value

    if (dataType === 'MultiSelect') {
        if (!Array.isArray(normalizedValue) || normalizedValue.length === 0) {
            return `${key}=()`
        }

        const formattedValues = normalizedValue.map((item: any) => {
            const itemsEncoded = encodeURIComponent(item ?? '')

            const transformedValue = item
                ? !['Date', 'Number', 'Boolean'].includes(dataType!)
                    ? `${prefix.toUpperCase()}${itemsEncoded.toUpperCase()}${suffix.toUpperCase()}`
                    : `${prefix.toUpperCase()}${itemsEncoded}${suffix.toUpperCase()}`
                : ''

            return `'${transformedValue}'`
        })

        fieldQuery = `${key}=(${formattedValues.join(',')})`
    } else {
        const val = encodeURIComponent(normalizedValue)

        let transformedValue = !['Date', 'Number', 'Boolean'].includes(dataType!)
            ? `${prefix.toUpperCase()}${val.toUpperCase()}${suffix.toUpperCase()}`
            : `${prefix.toUpperCase()}${val}${suffix.toUpperCase()}`

        if (key === 'store_code' || key === 'fashion_style') {
            transformedValue = `${prefix}${val}${suffix}`
        }

        fieldQuery = `${key}=${transformedValue}`
    }

    return fieldQuery
}
