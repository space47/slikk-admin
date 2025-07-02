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

export type Product = {
    barcode: string
    mrp: string
    sp: string
    name: string
    brand: string
    product_feedback: string | null
    is_wish_listed: boolean
    is_try_and_buy: boolean
    trends: boolean
    styles: any
    inventory_count: number
    image: string
    division: string
    category: string
    sub_category: string
    product_type: string
    variants: ProductVariant[]
}
