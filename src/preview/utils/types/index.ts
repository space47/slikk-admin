import { NullableString, POSITION_ITEM_FRONTEND } from '../DataTypes'

export type ComponentTypes = 'BigBgWithCarousel' | 'BigRectangleCarousel' | 'BellCarousel' | 'SmallBgWithCarousel'

export type ScreenSize = 'sm' | 'md' | 'lg'

export interface GenderData {
    name: string
    icon: string
    selectedIcon: string
    value: string
}

type CompVars = 'centered' | 'left' | 'right'

export type GenderCompProps = POSITION_ITEM_FRONTEND & {
    numOptions?: number
    callBack: (e: GenderData) => void
    size?: ScreenSize
    type?: CompVars
    defVal: string
}

export type SingleCarouselData = {
    image: string
    footer?: string | null
}

export interface SingleCarouselElementProp extends SingleCarouselData {
    size: ScreenSize
}

export type BackendSingleCarouselData = {
    data: SingleCarouselData[]
    type: ComponentTypes
    background_image?: string | null
}

export type CarouselProps = {
    data: SingleCarouselData[]
    size: ScreenSize
    background_image?: string | null
}

export type BannerAPIResponse = {
    data: BackendSingleCarouselData[]
}

export type AllCompProps = {
    data: BackendSingleCarouselData[]
    size: ScreenSize
}

export type BrandData = {
    id?: number
    name: string
    title?: string
    filter_id?: string
    description?: string
    logo?: NullableString
    image: string
    is_top: boolean
    is_exclusive: boolean
    is_private: boolean
    footer?: NullableString
    quick_filter_tags: string[]
    is_active?: boolean
    is_subscribed?: boolean
    create_date?: string
    update_date?: string
    is_try_and_buy?: boolean
    last_updated_by?: NullableString
    onClick?: (name: string) => void
    thumbnail?: string
    image_low_res?: string
    image_high_res?: string
}

export type SingleBrandCardProps = {
    data: BrandData
    size: ScreenSize
}

export type MultipleBrandsProps = {
    data: BrandData[]
    size: ScreenSize
}

export type ProductRating = {
    rating?: string
    rating_count?: string
}

export type ProductCardData = {
    barcode?: string
    mrp: string
    sp: string
    name?: string
    category?: string
    sub_category?: string
    product_type?: string
    brand?: string
    product_feedback?: ProductRating[] | null
    footer?: NullableString
    is_wish_listed: boolean
    is_try_and_buy?: boolean
    trends?: [] | null
    styles?: [] | null
    inventory_count?: number
    image?: string
    division?: string
    image_high_res?: string
}

export interface SingleProductProps extends ProductCardData {
    size?: ScreenSize
    type?: 'light' | 'dark'
    heartOnClick?: (product: any, h: any, setH: any) => void
}

export type MultipleProductProps = {
    products: ProductCardData[]
    size: ScreenSize
    type: 'light' | 'dark'
    heartOnClick?: (product: any, h: any, setH: any) => void
}
