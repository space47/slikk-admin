import { ScreenSize } from '../types'

export type BANNER_TYPES =
    | 'Coupon'
    | 'Division Bar'
    | 'Bell C'
    | 'Square'
    | 'New Drop'
    | 'Product C'
    | 'Spotlight'
    | 'Denim C'
    | 'Style Guide'
    | 'SYF'
    | 'Pallet'
    | 'Trendsetter'
    | 'Reels'
    | 'Upcoming Trends'
    | 'loyalty'
    | 'Full Width banner'
    | 'Full banner with Products'
    | 'Brands'
    | 'celebrity_banner'
    | 'creator'
    | 'Login Banner'
    | 'Big Ribbon'
    | 'Banner'
    | 'Offer Banner'
    | 'Generic'
    | 'Default'

export type NullableString = string | null

export type CarouselGridConfig = {
    row?: number | null
    column?: number | null
    gap?: number | null
    vertical_gap?: number | null
    carousel?: boolean | null
    coverFlow?: boolean | null
    grid?: boolean | null
    width?: number | null
    carousel_autoplay?: boolean | null
    corner_radius?: number | null
    carousel_dot?: boolean | null
    border?: boolean | null
    interval?: number | null
    border_style?: string | null
    border_width?: number | null
    border_color?: string | null
    show_dots?: boolean | null
    infinit_loop?: boolean | null
    section_corner_radius?: number | null
    web_carousel_dot?: boolean | null
    web_row?: number | null
    web_column?: number | null
    web_gap?: number | null
    web_vertical_gap?: number | null
    web_carousel?: boolean | null
    web_grid?: boolean | null
    web_width?: number | null
    web_carousel_autoplay?: boolean | null
    web_section_corner_radius?: number | null
    web_corner_radius?: number | null
    web_border?: boolean | null
    web_interval?: number | null
    web_border_style?: string | null
    web_border_width?: number | null
    web_border_color?: string | null
    web_show_dots?: boolean | null
    web_infinit_loop?: boolean | null
    name?: boolean | null
    name_position?: string | null
    name_align?: string | null
    name_topMargin?: number
    name_bottomMargin?: number
    footer_topMargin?: number
    footer_bottomMargin?: number
    aspect_ratio?: number | null
    font_color?: string | null
    font_style?: FontStyleType
    footer_font_color?: string | null
    footer_font_style?: FontStyleType
    name_footer?: boolean | null
    name_footer_align?: string | null
    font_size?: number | null
    footer_font_size?: number | null
    section_alignment?: string | null
    content_alignment?: string | null
    section_border?: boolean | null
    section_border_width?: number | null
    section_border_style?: string | null
    section_border_color?: string | null
    web_section_border?: boolean | null
    web_section_border_width?: number | null
    web_section_border_style?: string | null
    web_section_border_color?: string | null
    section_topMargin?: number | null
    section_bottomMargin?: number | null
    section_leftMargin?: number | null
    section_rightMargin?: number | null
    section_topPadding?: number | null
    section_leftPadding?: number | null
    section_rightPadding?: number | null
    section_bottomPadding?: number | null
    web_font_color?: string | null
    web_font_style?: FontStyleType
    web_footer_font_color?: string | null
    web_footer_font_style?: FontStyleType
    web_aspect_ratio?: number | null
    web_name_topMargin?: number
    web_name_bottomMargin?: number
    web_footer_topMargin?: number
    web_footer_bottomMargin?: number
    web_name?: boolean | null
    web_name_position?: string | null
    web_name_align?: string | null
    web_name_footer?: boolean | null
    web_name_footer_align?: string | null
    web_font_size?: number | null
    web_footer_font_size?: number | null
    web_section_alignment?: string | null
    web_content_alignment?: string | null
    web_section_topMargin?: number | null
    web_section_bottomMargin?: number | null
    web_section_leftMargin?: number | null
    web_section_rightMargin?: number | null
    web_section_topPadding?: number | null
    web_section_leftPadding?: number | null
    web_section_rightPadding?: number | null
    web_section_bottomPadding?: number | null
}
export type AlignmentType = 'left' | 'right' | 'center'
export type FontStyleType = 'regular' | 'bold' | 'italic' | 'underline'
export type BackgroundConfig = {
    background_lottie?: string
    mobile_background_lottie?: string
    is_background_lottie?: boolean
    mobile_width?: number | null
    web_width?: number | null
    desktop_position?: 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top' | 'bottom' | null
    mobile_position?: 'left' | 'right' | 'top' | 'bottom' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | null
    background_color?: string | null
    web_background_color?: string | null
    background_image?: string | null
    background_topMargin?: number | null
    background_bottomMargin?: number | null
    background_leftMargin?: number | null
    background_rightMargin?: number | null
    web_background_leftMargin?: number | null
    web_background_rightMargin?: number | null
    web_background_topMargin?: number | null
    web_background_bottomMargin?: number | null
    mobile_background_image?: string | null
    background_video?: string | null
    mobile_background_video?: string | null
    is_background_video?: true | null
    web_corner_radius?: number | null
    corner_radius?: number | null
    redirection_url?: string
    web_redirection_url?: string
    background_image_aspect_ratio?: number | null
    mobile_image_aspect_ratio?: number | null
}

export type POSITION_ITEM_BACKEND = {
    section_type?: string
    border?: boolean
    section_border?: boolean
    web_border?: boolean
    web_section_border?: boolean
    position?: number
    component_type?: BANNER_TYPES | null
    header_config?: HandlingErrorTempBeforeLaunch | null
    sub_header_config?: HandlingErrorTempBeforeLaunch | null
    footer_config?: HandlingErrorTempBeforeLaunch | null
    background_image?: NullableString
    mobile_background_image?: NullableString
    section_heading?: NullableString
    section_filters?: string[]
    is_section_clickable?: boolean
    extra_info?: TimerConfig | null
    data?: any
    data_type?: any //Change this later
    component_config?: CarouselGridConfig | null
    background_config?: BackgroundConfig | null
    numOptions?: number | null
    callBack?: ((data: any) => void) | null
    genderPosition?: 'centered' | 'left' | 'right' | null
    defVal?: string | null
}
export type TimerConfig = {
    timeout?: string
    timer_text?: string
    timer_font_size?: number
    timer_text_position?: 'left' | 'top' | 'right' | 'bottom'
    timer_text_font?: boolean
    timer_bg_color?: string
    timer_gap?: number
    timer_type?: string
    bg_color?: string
    timer_color?: string // Added for "#a7a7a7"
    timer_text_color?: string // Added for "#FFFFFF"
}
export interface POSITION_ITEM_FRONTEND extends POSITION_ITEM_BACKEND {
    size: ScreenSize
    heartOnClick?: (product: any, h: any, setH: any) => void
    DefaultComponent?: () => JSX.Element
}

//For now this is for Bell Carousel
export type BANNER_ITEM_BACKEND = {
    pk: number
    name?: NullableString
    brand?: NullableString
    division?: NullableString
    category?: NullableString
    image_web?: string
    image_mobile?: string
    product_type?: NullableString
    sub_category?: NullableString
    offers?: boolean
    offer_id?: NullableString
    tags?: string[]
    quick_filter_tags?: string[]
    footer?: NullableString
    coupon_code?: NullableString
    // "child_banners": [],
    is_clickable: boolean
    max_price?: number
    min_price?: number
    // uptooff: string;
    redirection_url?: NullableString
    extra_attributes?: EXTRA_ATTRIBUTES
}

export type EXTRA_ATTRIBUTES = {
    lottie_web?: string
    lottie_mobile?: string
    video_web?: string
    video_mobile?: string
    web_aspect_ratio?: number
    mobile_aspect_ratio?: number
    web_redirection_url?: string
    mobile_redirection_url?: string
}
export interface BANNER_ITEM_FRONTEND extends BANNER_ITEM_BACKEND {
    size: ScreenSize
}

export type HandlingErrorTempBeforeLaunch = {
    icon?: string
    text?: string
    web_text?: string
    image?: string
    style?: string
    font_size?: number | null
    web_font_size?: number | null
    position?: string
    font_color?: string
    background_color?: string
    bottomMargin?: number
    topMargin?: number
    web_bottomMargin?: number
    web_topMargin?: number
    redirection_url?: string
    web_redirection_url?: string
}
export type CATEGORIES = {
    name?: string
    image?: string
    title?: string
    quick_filter_tags?: string[]
    filter_id?: string
}
export type REELSDATA = {
    id: 12
    caption: string
    creator: {
        name: string
        dp: string
        handle: string
    }
    type: 'image' | 'video' | null
    likes_count: number
    clicks_count: number
    unique_clicks_count: number
    views_count: number
    thumbnail_url: string
    url: string
    create_date: string
    post_id: string
    name?: NullableString
    footer?: NullableString
    filter_id?: string
}

export type CREATORBASEINFO = {
    handle: string
    display_name: string
    bio: string
    area_of_interest: string[]
    dp: string
}
