export interface LastUpdatedBy {
    name: string
    mobile: string
    email: string
}

export interface Product {
    barcode: string
    brand_name: string
    color: string
    id: number
    name: string
    size: string
    sku: string
    variant_id: string
    image: string
}

export interface Stock {
    product: Product
    store: number
    quantity: any
    last_updated_by: LastUpdatedBy
    show_out_of_stock: boolean
    is_active: boolean
    offer_is_active: boolean
    expiry_date: string
    batch_number: string
    create_date: string
    update_date: string
    grn: any
    from: string
    to: string
    id: any
    location: string
}

export type Option = {
    value: number
    label: string
}

export const pageSizeOptions = [
    { value: 10, label: '10 / page' },
    { value: 25, label: '25 / page' },
    { value: 50, label: '50 / page' },
    { value: 100, label: '100 / page' },
]
