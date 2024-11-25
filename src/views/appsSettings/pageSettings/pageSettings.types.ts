export interface DataType {
    type: string
    filters: any[]
    barcodes: string
    posts: string
    brands: string
    handles: string
}

interface Config {
    icon: string
    text: string
    image: string
    style: string
    position: string
}

export type ProductTable = {
    sku: string
    barcode: string
    product: string
    image: string[]
    brand: string
}

export type WebType = {
    data_type: DataType
    footer_config: Config
    header_config: Config
    component_type: string
    section_heading: string
    background_image: string
    sub_header_config: Config
    mobile_background_image: string
    background_image_array: File[]
    mobile_background_array: File[]
    footer_config_icon_Array: File[] //.........
    footer_config_image_Array: File[]
    header_config_icon_Array: File[]
    header_config_image_Array: File[]
    sub_header_config_icon_Array: File[]
    sub_header_config_image_Array: File[]
    is_section_clickable: boolean
    section_filters: string[]
}
