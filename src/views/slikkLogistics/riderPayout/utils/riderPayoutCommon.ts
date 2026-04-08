/* eslint-disable @typescript-eslint/no-explicit-any */
export const PAYOUT_MODELS = [
    { value: 'day-wise', label: 'Day Wise', description: 'Payout calculated per day' },
    { value: 'order-wise', label: 'Order Wise', description: 'Payout calculated per order' },
]

export const CURRENCIES = [
    { value: 'INR', label: 'INR (₹)', symbol: '₹', country: 'India' },
    { value: 'USD', label: 'USD ($)', symbol: '$', country: 'United States' },
]

export const removeEmptyKeys = (obj: any): any => {
    if (!obj) return obj
    if (Array.isArray(obj)) {
        return obj.map((item) => removeEmptyKeys(item)).filter((item) => item !== undefined && item !== null && item !== '')
    }
    if (typeof obj === 'object') {
        const cleaned: any = {}
        for (const [key, value] of Object.entries(obj)) {
            if (key && key.trim() !== '' && value !== undefined && value !== null && value !== '') {
                const cleanedValue = removeEmptyKeys(value)
                if (
                    cleanedValue !== undefined &&
                    cleanedValue !== null &&
                    (typeof cleanedValue !== 'object' || Object.keys(cleanedValue).length > 0)
                ) {
                    cleaned[key] = cleanedValue
                }
            }
        }
        return cleaned
    }
    return obj
}
