import Input from '@/components/ui/Input'

export const COUPON_FORM = [
    {
        label: 'Code',
        classname: 'col-span-1 w-full',
        type: 'text',
        name: 'code',
        placeholder: 'Enter coupon code',
        component: { Input },
        status: 'code'
    },
    {
        label: 'Image',
        classname: 'col-span-1 w-full',
        type: 'text', // Assuming this would be a text field for an image URL or path
        name: 'image',
        placeholder: 'Enter image URL or leave empty',
        component: { Input },
        status: 'image'
    },
    {
        label: 'Type',
        classname: 'col-span-1 w-full',
        type: 'text',
        name: 'type',
        placeholder: 'Enter coupon type',
        component: { Input },
        status: 'type'
    },
    {
        label: 'Value',
        classname: 'col-span-1 w-full',
        type: 'text',
        name: 'value',
        placeholder: 'Enter coupon value',
        component: { Input },
        status: 'value'
    },
    {
        label: 'Min Cart Value',
        classname: 'col-span-1 w-full',
        type: 'text',
        name: 'min_cart_value',
        placeholder: 'Enter minimum cart value',
        component: { Input },
        status: 'min_cart_value'
    },
    {
        label: 'Max Count',
        classname: 'col-span-1 w-full',
        type: 'text',
        name: 'max_count',
        placeholder: 'Enter maximum count',
        component: { Input },
        status: 'max_count'
    },
    {
        label: 'Maximum Price',
        classname: 'col-span-1 w-full',
        type: 'text',
        name: 'maximum_price',
        placeholder: 'Enter maximum price',
        component: { Input },
        status: 'maximum_price'
    },
    {
        label: 'Valid From',
        classname: 'col-span-1 w-full',
        type: 'text',
        name: 'valid_from',
        placeholder: 'Enter valid from date',
        component: { Input },
        status: 'valid_from'
    },
    {
        label: 'Valid To',
        classname: 'col-span-1 w-full',
        type: 'text',
        name: 'valid_to',
        placeholder: 'Enter valid to date',
        component: { Input },
        status: 'valid_to'
    },
    {
        label: 'Description',
        classname: 'col-span-1 w-full',
        type: 'text',
        name: 'description',
        placeholder: 'Enter description',
        component: { Input },
        status: 'description'
    },
    {
        label: 'Max Count Per User',
        classname: 'col-span-1 w-full',
        type: 'text',
        name: 'max_count_per_user',
        placeholder: 'Enter maximum count per user',
        component: { Input },
        status: 'max_count_per_user'
    },
    {
        label: 'Coupon Used Count',
        classname: 'col-span-1 w-full',
        type: 'text',
        name: 'coupon_used_count',
        placeholder: 'Enter coupon used count',
        component: { Input },
        status: 'coupon_used_count'
    },
    {
        label: 'Frequency',
        classname: 'col-span-1 w-full',
        type: 'text',
        name: 'frequency',
        placeholder: 'Enter frequency or leave empty',
        component: { Input },
        status: 'frequency'
    },
    {
        label: 'Coupon Discount Type',
        classname: 'col-span-1 w-full',
        type: 'text',
        name: 'coupon_discount_type',
        placeholder: 'Enter coupon discount type',
        component: { Input },
        status: 'coupon_discount_type'
    },
    {
        label: 'User',
        classname: 'col-span-1 w-full',
        type: 'text',
        name: 'user',
        placeholder: 'Enter user',
        component: { Input },
        status: 'user'
    }
]
