/* eslint-disable @typescript-eslint/no-explicit-any */
import Input from '@/components/ui/Input'
import { Checkbox } from '@/components/ui'
import { ProductVariant, Product } from '@/views/category-management/catalog/CommonType'

export const PRODUCT_EDIT_COMMON = [
    {
        name: 'barcode',
        type: 'text',
        label: 'Barcode',
        placeholder: 'Enter Barcode',
        component: Input,
        classname: 'w-full',
    },
    {
        name: 'sku',
        type: 'text',
        label: 'SKU',
        placeholder: 'Enter SKU',
        component: Input,
        classname: 'w-full',
    },
    {
        name: 'brand_name',
        type: 'text',
        label: 'Brand Name',
        placeholder: 'Enter Brand Name',
        component: Input,
        classname: 'w-full',
    },
    {
        name: 'name',
        type: 'text',
        label: 'Name',
        placeholder: 'Enter Name',
        component: Input,
        classname: 'w-full',
    },
    {
        name: 'other_product_info',
        type: 'text',
        label: 'Other Product Info',
        placeholder: 'Enter Other Product Info',
        component: Input,
        classname: 'w-full',
    },
    {
        name: 'variant_type',
        type: 'text',
        label: 'Variant Type',
        placeholder: 'Enter Variant Type',
        component: Input,
        classname: 'w-full',
    },
    {
        name: 'variant_id',
        type: 'text',
        label: 'Style Code',
        placeholder: 'Enter Variant ID',
        component: Input,
        classname: 'w-full',
    },
    {
        name: 'tax_rate',
        type: 'number',
        label: 'Tax Rate',
        placeholder: 'Enter Tax Rate',
        component: Input,
        classname: 'w-full',
    },
    {
        name: 'mrp',
        type: 'text',
        label: 'MRP',
        placeholder: 'Enter MRP',
        component: Input,
        classname: 'w-full',
    },
    {
        name: 'sp',
        type: 'text',
        label: 'SP',
        placeholder: 'Enter SP',
        component: Input,
        classname: 'w-full',
    },
    {
        name: 'hsn',
        type: 'text',
        label: 'HSN',
        placeholder: 'Enter HSN',
        component: Input,
        classname: 'w-full',
    },
    {
        name: 'imported_by',
        type: 'text',
        label: 'Imported By/Manufactured By',
        placeholder: 'Enter Imported By',
        component: Input,
        classname: 'w-full',
    },
    {
        name: 'status',
        type: 'text',
        label: 'Status',
        placeholder: 'Enter Status',
        component: Input,
        classname: 'w-full',
    },
]

export const PRODUCT_EDIT_COMMON_DOWN = [
    {
        name: 'category_name',
        type: 'text',
        label: 'Category Name',
        placeholder: 'Enter Category Name',
        component: Input,
        classname: 'w-full',
    },
    {
        name: 'sub_category_name',
        type: 'text',
        label: 'Sub Category Name',
        placeholder: 'Enter Sub Category Name',
        component: Input,
        classname: 'w-full',
    },
    {
        name: 'product_type_name',
        type: 'text',
        label: 'Product Type Name',
        placeholder: 'Enter Product Type Name',
        component: Input,
        classname: 'w-full',
    },
    {
        name: 'division_name',
        type: 'text',
        label: 'Division Name',
        placeholder: 'Enter Division Name',
        component: Input,
        classname: 'w-full',
    },
    {
        name: 'color',
        type: 'text',
        label: 'Colour',
        placeholder: 'Enter Color Name',
        component: Input,
        classname: 'w-full',
    },
    {
        name: 'colorfamily',
        type: 'text',
        label: 'Colour Family',
        placeholder: 'Enter Color Family Name',
        component: Input,
        classname: 'w-full',
    },
    {
        name: 'gender',
        type: 'text',
        label: 'Gender',
        placeholder: 'Enter Gender',
        component: Input,
        classname: 'w-full',
    },
    {
        name: 'origincountry',
        type: 'text',
        label: 'Origin Country',
        placeholder: 'Enter Origin Country',
        component: Input,
        classname: 'w-full',
    },
    {
        name: 'is_premium',
        type: 'checkbox',
        label: 'Is Premium',
        component: Checkbox,
        classname: 'w-full',
    },
    {
        name: 'is_returnable',
        type: 'checkbox',
        label: 'Is Returnable',
        component: Checkbox,
        classname: 'w-full',
    },
    {
        name: 'is_try_and_buy',
        type: 'checkbox',
        label: 'Is Try & Buy',
        component: Checkbox,
        classname: 'w-full',
    },
    {
        name: 'free_item',
        type: 'checkbox',
        label: 'Is Free Item ',
        component: Checkbox,
        classname: 'w-full',
    },
    {
        name: 'is_locked',
        type: 'checkbox',
        label: 'Is Locked',
        component: Checkbox,
        classname: 'w-full',
    },
]

export const INITIALVALUES: Product = {
    company: 1,

    colorfamily: '',
    name: '',
    description: '',
    about: '',
    benefits: '',
    includes: '',
    other_product_info: '',
    variant_type: '',
    variant_id: '',
    tax_rate: 0,
    mrp: 0,
    sp: 0,
    barcode: '',
    hsn: '',
    sku: '',
    usage: '',
    imported_by: '',
    shelf_life: 0,
    height: 0,
    width: 0,
    depth: 0,
    video_link: '',
    video: [],
    minimum_quantity: 0,
    reserve_quantity: 0,
    Status: 'Available',
    image: '',
    images: [],
    color_code: [],
    category_name: '',
    is_premium: false,
    is_try_and_buy: false,
    is_returnable: false,
    sub_category_name: '',
    product_type_name: '',
    division_name: '',
    color: '', //
    colorshade: '',
    skinType: '',
    formulation: '',
    hairType: '',
    gender: 'Women',
    finish: '',
    skintone: '',
    coverage: '',
    sunprotection: '',
    concious: '',
    productHexCode: '',
    packsize: '',
    size: '',
    ingrediants: '',
    vegnonveg: '',
    ingrediantsPreferences: '',
    concern: '',
    recommendationfor: '',
    scenttopnotes: '',
    scentheartnotes: '',
    scentbasenotes: '',
    color_code_link: '',
    origincountry: 'India',
    careinstruction: '',
    antiodour: '',
    pattern: '',
    closuretype: '',
    length: '',
    necktype: '',
    risetype: '',
    sleevtype: '',
    trend: '',
    trendtype: '',
    fit: '',
    fabric: '',
}

export const ProductFilterArray = [
    { label: 'SKU', value: 'sku' },
    { label: 'Name', value: 'name' },
    { label: 'SKID', value: 'skid' },
    { label: 'Barcode', value: 'barcode' },
]

export type ProductTypes = {
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
    sku: string
    filter_to_display_map: any
    thumbnail?: string
    size?: string
    skid?: string
    color?: string
}

export const DescriptionFields = [
    { name: 'description.description', label: 'Descriptions' },
    { name: 'description.about', label: 'About' },
    { name: 'description.use_cases', label: 'Use Cases' },
    { name: 'description.includes', label: 'Includes' },
    { name: 'description.other_info', label: 'Other Info' },
]
