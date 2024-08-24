import Input from '@/components/ui/Input'
import { Checkbox } from '@/components/ui'
import Product from '@/views/category-management/catalog/CommonType'

export const PRODUCT_EDIT_COMMON = [
    {
        name: 'barcode',
        type: 'text',
        label: 'Barcode',
        placeholder: 'Enter Barcode',
        component: Input,
        classname: 'w-full'
    },
    {
        name: 'sku',
        type: 'text',
        label: 'SKU',
        placeholder: 'Enter SKU',
        component: Input,
        classname: 'w-full'
    },
    {
        name: 'brand_name',
        type: 'text',
        label: 'Brand Name',
        placeholder: 'Enter Brand Name',
        component: Input,
        classname: 'w-full'
    },
    {
        name: 'name',
        type: 'text',
        label: 'Name',
        placeholder: 'Enter Name',
        component: Input,
        classname: 'w-full'
    },
    {
        name: 'description',
        type: 'text',
        label: 'Description',
        placeholder: 'Enter Description',
        component: Input,
        classname: 'w-full'
    },
    {
        name: 'other_product_info',
        type: 'text',
        label: 'Other Product Info',
        placeholder: 'Enter Other Product Info',
        component: Input,
        classname: 'w-full'
    },
    {
        name: 'variant_type',
        type: 'text',
        label: 'Variant Type',
        placeholder: 'Enter Variant Type',
        component: Input,
        classname: 'w-full'
    },
    {
        name: 'variant_id',
        type: 'text',
        label: 'Style Code',
        placeholder: 'Enter Variant ID',
        component: Input,
        classname: 'w-full'
    },
    {
        name: 'tax_rate',
        type: 'number',
        label: 'Tax Rate',
        placeholder: 'Enter Tax Rate',
        component: Input,
        classname: 'w-full'
    },
    {
        name: 'mrp',
        type: 'text',
        label: 'MRP',
        placeholder: 'Enter MRP',
        component: Input,
        classname: 'w-full'
    },
    {
        name: 'sp',
        type: 'text',
        label: 'SP',
        placeholder: 'Enter SP',
        component: Input,
        classname: 'w-full'
    },
    {
        name: 'hsn',
        type: 'text',
        label: 'HSN',
        placeholder: 'Enter HSN',
        component: Input,
        classname: 'w-full'
    },
    {
        name: 'imported_by',
        type: 'text',
        label: 'Imported By/Manufactured By',
        placeholder: 'Enter Imported By',
        component: Input,
        classname: 'w-full'
    },
    {
        name: 'status',
        type: 'text',
        label: 'Status',
        placeholder: 'Enter Status',
        component: Input,
        classname: 'w-full'
    }
]

export const PRODUCT_EDIT_COMMON_DOWN = [
    {
        name: 'category_name',
        type: 'text',
        label: 'Category Name',
        placeholder: 'Enter Category Name',
        component: Input,
        classname: 'w-full'
    },
    {
        name: 'sub_category_name',
        type: 'text',
        label: 'Sub Category Name',
        placeholder: 'Enter Sub Category Name',
        component: Input,
        classname: 'w-full'
    },
    {
        name: 'product_type_name',
        type: 'text',
        label: 'Product Type Name',
        placeholder: 'Enter Product Type Name',
        component: Input,
        classname: 'w-full'
    },
    {
        name: 'division_name',
        type: 'text',
        label: 'Division Name',
        placeholder: 'Enter Division Name',
        component: Input,
        classname: 'w-full'
    },
    {
        name: 'color',
        type: 'text',
        label: 'Colour',
        placeholder: 'Enter Color Name',
        component: Input,
        classname: 'w-full'
    },
    {
        name: 'skinType',
        type: 'text',
        label: 'Skin Type',
        placeholder: 'Enter Skin Type',
        component: Input,
        classname: 'w-full'
    },
    {
        name: 'gender',
        type: 'text',
        label: 'Gender',
        placeholder: 'Enter Gender',
        component: Input,
        classname: 'w-full'
    },
    {
        name: 'packsize',
        type: 'text',
        label: 'Pack Size',
        placeholder: 'Enter Pack Size',
        component: Input,
        classname: 'w-full'
    },
    {
        name: 'size',
        type: 'text',
        label: 'Product Size',
        placeholder: 'Enter Product Size',
        component: Input,
        classname: 'w-full'
    },
    {
        name: 'origincountry',
        type: 'text',
        label: 'Origin Country',
        placeholder: 'Enter Origin Country',
        component: Input,
        classname: 'w-full'
    },
    {
        name: 'careinstruction',
        type: 'text',
        label: 'Care Instruction',
        placeholder: 'Enter Care Instruction',
        component: Input,
        classname: 'w-full'
    },
    {
        name: 'antiodour',
        type: 'text',
        label: 'Antiodour',
        placeholder: 'Enter Antiodour',
        component: Input,
        classname: 'w-full'
    },
    {
        name: 'pattern',
        type: 'text',
        label: 'Pattern',
        placeholder: 'Enter Pattern',
        component: Input,
        classname: 'w-full'
    },
    {
        name: 'closuretype',
        type: 'text',
        label: 'Closure Type',
        placeholder: 'Enter Closure Type',
        component: Input,
        classname: 'w-full'
    },
    {
        name: 'length',
        type: 'text',
        label: 'Length',
        placeholder: 'Enter Length',
        component: Input,
        classname: 'w-full'
    },
    {
        name: 'necktype',
        type: 'text',
        label: 'Neck Type',
        placeholder: 'Enter Neck Type',
        component: Input,
        classname: 'w-full'
    },
    {
        name: 'risetype',
        type: 'text',
        label: 'Rise Type',
        placeholder: 'Enter Rise Type',
        component: Input,
        classname: 'w-full'
    },
    {
        name: 'sleevtype',
        type: 'text',
        label: 'Sleeve Type',
        placeholder: 'Enter Sleeve Type',
        component: Input,
        classname: 'w-full'
    },
    {
        name: 'trend',
        type: 'text',
        label: 'Trend',
        placeholder: 'Enter Trend',
        component: Input,
        classname: 'w-full'
    },
    {
        name: 'trendtype',
        type: 'text',
        label: 'Trend Type',
        placeholder: 'Enter Trend Type',
        component: Input,
        classname: 'w-full'
    },
    {
        name: 'fit',
        type: 'text',
        label: 'Fit',
        placeholder: 'Enter Fit',
        component: Input,
        classname: 'w-full'
    },
    {
        name: 'fabric',
        type: 'text',
        label: 'Fabric',
        placeholder: 'Enter Fabric',
        component: Input,
        classname: 'w-full'
    },
    {
        name: 'is_premium',
        type: 'checkbox',
        label: 'Is Premium',
        component: Checkbox,
        classname: 'w-full'
    },
    {
        name: 'is_returnable',
        type: 'checkbox',
        label: 'Is Returnable',
        component: Checkbox,
        classname: 'w-full'
    },
    {
        name: 'is_try_and_buy',
        type: 'checkbox',
        label: 'Is Try & Buy',
        component: Checkbox,
        classname: 'w-full'
    }
]

export const INITIALVALUES: Product = {
    company: 1,
    brand: '',
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
    fabric: ''
}
