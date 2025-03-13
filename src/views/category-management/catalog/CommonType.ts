export type Product = Partial<{
    company: number | null
    brand_name: string
    name: string
    description: string
    about: string
    benefits: string
    includes: string
    other_product_info: string
    variant_type: string
    variant_id: string
    tax_rate: number
    colorfamily: string
    mrp: number
    sp: number
    barcode: string
    hsn: string
    sku: string
    usage: string
    imported_by: string
    shelf_life: number
    height: number
    width: number
    depth: number
    video_link: string
    video: File[]
    minimum_quantity: number
    reserve_quantity: number
    Status: string
    image: string
    images: File[]
    color_code: File[]
    category_name: string
    is_premium: boolean
    is_try_and_buy: boolean
    is_returnable: boolean
    sub_category_name: string
    product_type_name: string
    division_name: string
    color: string
    colorshade: string
    skinType: string
    formulation: string
    hairType: string
    gender: string
    finish: string
    skintone: string
    coverage: string
    sunprotection: string
    concious: string
    productHexCode: string
    packsize: string
    size: string
    ingrediants: string
    vegnonveg: string
    ingrediantsPreferences: string
    concern: string
    recommendationfor: string
    scenttopnotes: string
    scentheartnotes: string
    scentbasenotes: string
    origincountry: string
    color_code_link: string
    careinstruction: string
    antiodour: string
    pattern: string
    closuretype: string
    length: string
    necktype: string
    risetype: string
    sleevtype: string
    trend: string
    trendtype: string
    fit: string
    fabric: string
    size_chart_image: string
    size_chart_image_array: File[]
}>

export const DROPDOWNARRAY = [
    { label: 'Brand', value: 'brand' },
    { label: 'Division', value: 'division' },
    { label: 'Sub Category', value: 'sub_category' },
    { label: 'Category', value: 'category' },
    { label: 'Product Type', value: 'Product_type' },
]

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
