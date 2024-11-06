export const LOGISTIC_PARTNER = [
    { value: 'porter', label: 'PORTER' },
    { value: 'shiprocket', label: 'SHIPROCKET' },
    { value: 'shadowfax', label: 'SHADOWFAX' },
    { value: 'slikk', label: 'SLIKK' },
    { value: 'pidge', label: 'PIDGE' },
]

export type Payment = {
    amount: number
    mode: string
    transaction_time: string
}

export type Product = {
    image: string
    quantity: string
    fulfilled_quantity: string
    final_price: number
    sku: string
    name: string
    id: number
    brand: string
}

export type LOGISTIC = {
    order: number
    partner: string
}
