export const BANNER_PAGE_NAME = [
    { name: 'Home', value: 'Home' },
    { name: 'Trend', value: 'Trend' },
    { name: 'Offers', value: 'Offers' },
    { name: 'Login', value: 'Login' },
    { name: 'Referral', value: 'Referral' },
    { name: 'Brand', value: 'Brand' },
    { name: 'Cart', value: 'Cart' },
    { name: 'Order Details', value: 'Order Details' },
    { name: 'Category', value: 'Category' },
    { name: 'Profile', value: 'Profile' },
    { name: 'Collection', value: 'Collection' },
    // { name: 'Loyalty', value: 'Loyalty' },
    { name: 'My Addresses', value: 'My Addresses' },
    { name: 'Wishlist', value: 'Wishlist' },
    { name: 'My Order', value: 'My Order' },
    { name: 'Product', value: 'Product' },
    { name: 'Search', value: 'Search' },
]

export type BANNER_UPLOAD_DATA = {
    id?: number

    page?: string
    section_heading?: string

    name?: string
    image_web?: string
    image_mobile?: string

    brand?: string
    division?: string
    category?: string
    sub_category?: string
    product_type?: string
    quick_filter_tags?: []
    is_clickable?: boolean
    max_price?: number
    min_price?: number
    barcodes?: string
    redirection_url?: string
    from_date?: string
    to_date?: string
    footer?: string
    coupon_code?: string
}

export const COMPONENT_CATEGORY_TYPES = [
    { label: 'Default', value: 'Default' },
    { label: 'Generic Component', value: 'Generic' },
    { label: 'Cart', value: 'Cart' },
    { label: 'PDP', value: 'PDP' },
    { label: 'Order_Confirmation', value: 'Order_Confirmation' },
    { label: 'Coupon', value: 'Coupon' },
    { label: 'Bell C', value: 'Bell C' },
    { label: 'Marquee', value: 'Marquee' },
    { label: 'Division Bar', value: 'Division Bar' },
    { label: 'Square', value: 'Square' },
    { label: 'New Drop', value: 'New Drop' },
    { label: 'Product C', value: 'Product C' },
    { label: 'Spotlight', value: 'Spotlight' },
    { label: 'Denim C', value: 'Denim C' },
    { label: 'Style Guide', value: 'Style Guide' },
    { label: 'SYF', value: 'SYF' },
    { label: 'Pallet', value: 'Pallet' },
    { label: 'Trendsetter', value: 'Trendsetter' },
    { label: 'Reels', value: 'Reels' },
    { label: 'Upcoming Trends', value: 'Upcoming Trends' },
    { label: 'loyalty', value: 'loyalty' },
    { label: 'Full Width banner', value: 'Full Width banner' },
    { label: 'Full banner with Products', value: 'Full banner with Products' },
    { label: 'Brands', value: 'Brands' },
    { label: 'celebrity_banner', value: 'celebrity_banner' },
    { label: 'creator', value: 'creator' },
    { label: 'Login Banner', value: 'Login Banner' },
    { label: 'Offer Banner', value: 'Offer Banner' },
    { label: 'Ribbon', value: 'Ribbon' },
    { label: 'Banner', value: 'Banner' },
    { label: 'Big Ribbon', value: 'Big Ribbon' },
    { label: 'Short Ribbon', value: 'Short Ribbon' },
]
