export type Item = {
    quantity: number
    brand_name: string
    selling_price: number
    mrp: number
    name: string
    sku: string
    color: string
    size: string
    create_date: string
}

export type REMITANCE = {
    count: number
    loading: boolean
    total_amount: number
    remitance: Item[]
    from: string
    to: string
    brandValue: any
    page: number
    pageSize: number
}
