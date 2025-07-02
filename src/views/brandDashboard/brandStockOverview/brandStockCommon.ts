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
}

export interface Stock {
    product: Product
    store: number
    quantity: number
    last_updated_by: LastUpdatedBy
    show_out_of_stock: boolean
    is_active: boolean
    offer_is_active: boolean
    expiry_date: string
    batch_number: string
    create_date: string
    update_date: string
    grn: string | number
    id: number
}
