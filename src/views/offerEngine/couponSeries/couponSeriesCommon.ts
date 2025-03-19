import Input from '@/components/ui/Input'

export const COUPON_SERIES_FORM = [
    {
        label: 'Campaign Name',
        classname: 'col-span-1 w-full',
        type: 'text',
        name: 'campaign',
        placeholder: 'Enter Campaign Name',
        component: { Input },
        status: 'campaign',
    },

    {
        label: 'Value',
        classname: 'col-span-1 w-full',
        type: 'number',
        name: 'value',
        placeholder: 'Enter coupon value',
        component: { Input },
        status: 'value',
    },
    {
        label: 'Min Cart Value',
        classname: 'col-span-1 w-full',
        type: 'number',
        name: 'min_cart_value',
        placeholder: 'Enter minimum cart value',
        component: { Input },
        status: 'min_cart_value',
    },
    {
        label: 'Max Count',
        classname: 'col-span-1 w-full',
        type: 'number',
        name: 'max_count',
        placeholder: 'Enter maximum count',
        component: { Input },
        status: 'max_count',
    },
    {
        label: 'Maximum Discount',
        classname: 'col-span-1 w-full',
        type: 'number',
        name: 'maximum_price',
        placeholder: 'Enter maximum price',
        component: { Input },
        status: 'maximum_price',
    },

    {
        label: 'Max Count Per User',
        classname: 'col-span-1 w-full',
        type: 'number',
        name: 'max_count_per_user',
        placeholder: 'Enter maximum count per user',
        component: { Input },
        status: 'max_count_per_user',
    },

    {
        label: 'Is Public',
        classname: 'col-span-1 w-full',
        type: 'checkbox',
        name: 'is_public',
        placeholder: 'Enter user',
        component: { Input },
        status: 'is_public',
    },
    {
        label: 'New Users Only',
        classname: 'col-span-1 w-full',
        type: 'checkbox',
        name: 'extra_attributes.new_users_only',
        placeholder: 'Enter user',
        component: { Input },
        status: 'new_users_only',
    },
]
