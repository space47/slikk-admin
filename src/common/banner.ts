export const BANNER_PAGE_NAME = [
    { name: 'Home', value: 'Home' },
    { name: 'Trend', value: 'Trend' },
    { name: 'Offers', value: 'Offers' },
    { name: 'Login', value: 'Login' },
    { name: 'Profile', value: 'Profile' },
    { name: 'Collection', value: 'Collection' },
    { name: 'Loyalty', value: 'Loyalty' },
    { name: 'My Addresses', value: 'My Addresses' },
    { name: 'Wishlist', value: 'Wishlist' },
    { name: 'My Order', value: 'My Order' },
    { name: 'Product', value: 'Product' },
    { name: 'Search', value: 'Search' },
    // { name: 'Brand', value: 'Brand' },
    // { name: 'Cart', value: 'Cart' },
]


export type BANNER_UPLOAD_DATA = {
    id?: number;

    page?: string,
    section_heading?: string,

    name?: string;
    image_web?: string;
    image_mobile?: string;

    brand?: string;
    division?: string;
    category?: string;
    sub_category?: string;
    product_type?: string;
    quick_filter_tags?: [];
    is_clickable?: boolean;
    max_price?: number;
    min_price?: number;
    barcodes?: string;
    redirection_url?: string;
    from_date?: string;
    to_date?: string;
    footer?: string;
    coupon_code?: string;
}