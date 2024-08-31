type BRANDTYPES = {
    image: string
    name: string
    title: string
    id:number
}

type DIVTYPES = {
    image: string
    name: string
    description: string
    id: number
}

type TAGSTYPE = {
    id: string
    name: string
}

export interface BANNERMODEL {
    id: number
    name: string
    section_heading: string
    parent_banner: string | null
    quick_filter_tags: string[]
    brand: BRANDTYPES[]
    division: DIVTYPES[]
    category: DIVTYPES[]
    image_web_array: []
    image_mobile_array: []
    sub_category: DIVTYPES[]
    product_type: DIVTYPES[]
    type: string | null
    image_web: string
    image_mobile: string
    offers: boolean
    offer_id: string
    page: string
    from_date: string
    to_date: string
    uptooff: string
    tags: TAGSTYPE[]
    footer: string | null
    coupon_code: string | null
    is_clickable: boolean
    section_background_web: string
    section_background_mobile: string
    section_background_web_array: []
    section_background_mobile_array: []
    max_price: number
    min_price: number
    barcodes: string
    redirection_url: string | null
}
