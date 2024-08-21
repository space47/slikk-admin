import Input from '@/components/ui/Input'
import Checkbox from '@/components/ui/Checkbox'

export const BANNER_FIELDS_TYPE = [
    {
        label: 'Name',
        classname: 'col-span-1 w-full',
        type: 'text',
        name: 'name',
        placeholder: 'Place your Name',
        component: { Input },
        status: 'name'
    },
    {
        label: 'Section Heading',
        classname: 'col-span-1 w-full',
        type: 'text',
        name: 'section_heading',
        placeholder: 'Place your Section Heading',
        component: { Input },
        status: 'section_heading'
    },
    {
        label: 'Parent Banner',
        classname: 'col-span-1 w-full',
        type: 'text',
        name: 'parent_banner',
        placeholder: 'Place your Parent Banner',
        component: { Input },
        status: 'parent_banner'
    },
    {
        label: 'Type',
        classname: 'col-span-1 w-full',
        type: 'text',
        name: 'type',
        placeholder: 'Place your Type',
        component: { Input },
        status: 'type'
    },
    // {
    //     label: 'Image (Web)',
    //     classname: 'col-span-1 w-full',
    //     type: 'text',
    //     name: 'image_web',
    //     placeholder: 'Place your Image URL for Web',
    //     component: { Input },
    //     status: 'image_web',
    // },
    // {
    //     label: 'Image (Mobile)',
    //     classname: 'col-span-1 w-full',
    //     type: 'text',
    //     name: 'image_mobile',
    //     placeholder: 'Place your Image URL for Mobile',
    //     component: { Input },
    //     status: 'image_mobile',
    // },

    {
        label: 'Offer ID',
        classname: 'col-span-1 w-full',
        type: 'text',
        name: 'offer_id',
        placeholder: 'Place your Offer ID',
        component: { Input },
        status: 'offer_id'
    },
    {
        label: 'Page',
        classname: 'col-span-1 w-full',
        type: 'text',
        name: 'page',
        placeholder: 'Place your Page',
        component: { Input },
        status: 'page'
    },
    {
        label: 'Upto Off',
        classname: 'col-span-1 w-full',
        type: 'text',
        name: 'uptooff',
        placeholder: 'Place your Upto Off',
        component: { Input },
        status: 'uptooff'
    },
    {
        label: 'Tags',
        classname: 'col-span-1 w-full',
        type: 'text',
        name: 'tags',
        placeholder: 'Place your Tags',
        component: { Input },
        status: 'tags'
    },
    {
        label: 'Footer',
        classname: 'col-span-1 w-full',
        type: 'text',
        name: 'footer',
        placeholder: 'Place your Footer',
        component: { Input },
        status: 'footer'
    },
    {
        label: 'Coupon Code',
        classname: 'col-span-1 w-full',
        type: 'text',
        name: 'coupon_code',
        placeholder: 'Place your Coupon Code',
        component: { Input },
        status: 'coupon_code'
    },

    // {
    //     label: 'Section Background (Web)',
    //     classname: 'col-span-1 w-full',
    //     type: 'text',
    //     name: 'section_background_web',
    //     placeholder: 'Place your Section Background URL for Web',
    //     component: { Input },
    //     status: 'section_background_web',
    // },
    // {
    //     label: 'Section Background (Mobile)',
    //     classname: 'col-span-1 w-full',
    //     type: 'text',
    //     name: 'section_background_mobile',
    //     placeholder: 'Place your Section Background URL for Mobile',
    //     component: { Input },
    //     status: 'section_background_mobile',
    // },
    {
        label: 'Max Price',
        classname: 'col-span-1 w-full',
        type: 'number',
        name: 'max_price',
        placeholder: 'Place your Max Price',
        component: { Input },
        status: 'max_price'
    },
    {
        label: 'Min Price',
        classname: 'col-span-1 w-full',
        type: 'number',
        name: 'min_price',
        placeholder: 'Place your Min Price',
        component: { Input },
        status: 'min_price'
    },
    {
        label: 'Barcodes',
        classname: 'col-span-1 w-full',
        type: 'text',
        name: 'barcodes',
        placeholder: 'Place your Barcodes',
        component: { Input },
        status: 'barcodes'
    },
    {
        label: 'Redirection URL',
        classname: 'col-span-1 w-full',
        type: 'text',
        name: 'redirection_url',
        placeholder: 'Place your Redirection URL',
        component: { Input },
        status: 'redirection_url'
    },
    {
        label: 'Offers',
        classname: '',
        type: 'checkbox',
        name: 'offers',
        component: { Checkbox },
        status: 'offers'
    },
    {
        label: 'Is Clickable',
        classname: '',
        type: 'checkbox',
        name: 'is_clickable',
        component: { Checkbox },
        status: 'is_clickable'
    }
]
