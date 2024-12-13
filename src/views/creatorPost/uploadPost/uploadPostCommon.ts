export interface Product {
    barcode: string
    mrp: string
    sp: string
    name: string
    brand: string
    product_feedback: string | null
    is_wish_listed: boolean
    is_try_and_buy: boolean
    trends: any | null
    styles: any | null
    inventory_count: number
    image: string
    division: string
    category: string
    sub_category: string
    product_type: string
    variants: any[]
}

export interface Post {
    id: number
    url: string
    products: Product[]
    post_id: string
    caption: string
    type: string
    latitude: string
    longitude: string
    likes_count: number
    comments_count: number
    clicks_count: number
    unique_clicks_count: number
    views_count: number
    thumbnail_url: string
    low_res_url: string
    video_url: string
    video_low_bandwidth_url: string
    video_low_res_url: string
    is_active: boolean
    create_date: string
    update_date: string
    approval_status: string
    owner: string
}
