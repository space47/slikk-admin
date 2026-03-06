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

    const isEmpty = value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)

    let fieldQuery = ''

    if (subFields && Array.isArray(subFields) && subFields.length > 0) {
        let replacedValue = value

        subFields.forEach((sub: any) => {
            const subVal = sub.value ?? ''
            replacedValue = replacedValue.replace(`{${sub.key}}`, subVal)
        })

        if (!replacedValue) return null

        fieldQuery = `${key}=${encodeURIComponent(replacedValue)}`
        return fieldQuery
    }

    if (!isEmpty) {
        const val = encodeURIComponent(value)

        if (dataType === 'MultiSelect' && Array.isArray(value)) {
            if (value.length === 0 || value[0] === '') {
                return null
            }

            const formattedValues = value.map((item: any) => {
                const itemsEncoded = encodeURIComponent(item)

                const transformedValue = item
                    ? !['Date', 'Number', 'Boolean'].includes(dataType!)
                        ? `${prefix.toUpperCase()}${itemsEncoded.toUpperCase()}${suffix.toUpperCase()}`
                        : `${prefix.toUpperCase()}${itemsEncoded}${suffix.toUpperCase()}`
                    : ''

                return `'${transformedValue}'`
            })

            fieldQuery = `${key}=(${formattedValues.join(',')})`
        } else {
            let transformedValue = !['Date', 'Number', 'Boolean'].includes(dataType!)
                ? `${prefix.toUpperCase()}${val.toUpperCase()}${suffix.toUpperCase()}`
                : `${prefix.toUpperCase()}${val}${suffix.toUpperCase()}`

            if (key === 'store_code' || key === 'fashion_style') {
                transformedValue = !['Date', 'Number', 'Boolean'].includes(dataType!)
                    ? `${prefix}${val}${suffix}`
                    : `${prefix}${val}${suffix}`
            }

            fieldQuery = `${key}=${transformedValue}`
        }
    }

    return fieldQuery || null
}
