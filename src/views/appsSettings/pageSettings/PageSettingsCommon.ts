/* eslint-disable @typescript-eslint/no-explicit-any */
export const PAGEARRAY = [
    {
        name: 'gap',
        label: 'Gap',
        type: 'text',
        placeholder: 'Enter Gap',
    },
    {
        name: 'width',
        label: 'Width',
        type: 'number',
        placeholder: 'Enter Width',
    },
    {
        name: 'aspect_ratio',
        label: 'Aspect Ratio',
        type: 'text',
        placeholder: 'Enter Aspect Ratio',
    },
    {
        name: 'corner_radius',
        label: 'Corner Radius',
        type: 'number',
        placeholder: 'Enter Corner Radius',
    },
    {
        name: 'grid',
        label: 'Grid',
        type: 'checkbox',
        placeholder: '',
    },
    {
        name: 'border',
        label: 'Border',
        type: 'text',
        placeholder: 'Enter Border Style',
    },
    {
        name: 'autoplay',
        label: 'Autoplay',
        type: 'checkbox',
        placeholder: '',
    },
]

interface DataType {
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

export type WebType = {
    data_type: DataType
    footer_config: Config
    header_config: Config
    component_type: string
    section_heading: string
    background_image: string
    sub_header_config: Config
    mobile_background_image: string
    mobile_background_array?: File[]
}

export const SubDataTypeArray = [
    { label: 'Top Seller', value: 'top_seller' },
    { label: 'Top Searched', value: 'top_searched' },
    { label: 'Favourite', value: 'favourite' },
    { label: 'New', value: 'new' },
]
