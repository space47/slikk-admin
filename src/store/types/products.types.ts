/* eslint-disable @typescript-eslint/no-explicit-any */
export type ProductVariant = {
    name: string
    variant_type: string
    color_code_link: string
    size: string[]
    barcode: string
    sku: string
    mrp: string
    sp: string
    inventory_count: number
}

export type ProductTypes = {
    barcode: string
    mrp: string
    sp: string
    name: string
    brand: string
    product_feedback: string | null
    is_wish_listed: boolean
    is_try_and_buy: boolean
    styles: any
    inventory_count: number
    image: string
    division: string
    category: string
    sub_category: string
    product_type: string
    variants: ProductVariant[]
    sku: string
    filter_to_display_map: any
    thumbnail?: string
    color?: string
}

export const ProductFilterArray = [
    { label: 'SKU', value: 'sku' },
    { label: 'Name', value: 'name' },
    { label: 'Barcode', value: 'barcode' },
]

export type ProductResponseType = {
    status: string
    data: {
        count: number
        results: ProductTypes[]
    }
}

export type ProductLockType = {
    id: number
    product_filter: number
    name: string
    start_date: string
    end_date: string
    status: string
    error_barcodes: Record<string, unknown>
    products_count: number
    create_date: string
    update_date: string
    locked_by: string
}

export type ProductLockResponseType = {
    status: string
    data: {
        count: number
        results: ProductLockType[]
    }
}
