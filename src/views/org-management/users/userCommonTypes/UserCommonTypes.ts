/* eslint-disable @typescript-eslint/no-explicit-any */
import { Input } from '@/components/ui'

type UserField = {
    type: string
    defVal: string | number | boolean
    placeHolder: string
    name: string
    component: React.ComponentType<any>
}

type UserFields = {
    [key: string]: UserField
}

export const ADD_USER_BASIC_FIELDS: UserFields = {
    name: {
        type: 'text',
        defVal: '',
        placeHolder: 'Enter Name',
        name: 'first_name',
        component: Input,
    },
    footer: {
        type: 'text',
        defVal: '',
        placeHolder: 'Enter Footer',
        name: 'first_name',
        component: Input,
    },
    coupon_code: {
        type: 'text',
        defVal: '',
        placeHolder: 'Enter Coupon',
        name: 'first_name',
        component: Input,
    },
    max_price: {
        type: 'number',
        defVal: 0,
        placeHolder: 'Enter Max Price',
        name: 'first_name',
        component: Input,
    },
    min_price: {
        type: 'number',
        defVal: 0,
        placeHolder: 'Enter Min Price',
        name: 'first_name',
        component: Input,
    },
    redirection_url: {
        type: 'text',
        defVal: '',
        placeHolder: 'Enter Redirection URL',
        name: 'first_name',
        component: Input,
    },
    from_date: {
        type: 'date',
        defVal: '',
        placeHolder: 'Enter From Date',
        name: 'first_name',
        component: Input,
    },
    to_date: {
        type: 'date',
        defVal: '',
        placeHolder: 'Enter To Date',
        name: 'first_name',
        component: Input,
    },
    is_clickable: {
        type: 'checkbox',
        defVal: true,
        placeHolder: 'is_clickable',
        name: 'first_name',
        component: Input,
    },
}

export interface User {
    first_name: string
    last_name: string
    email: string
    mobile: string
    country_code: string
    dob: string
    gender: string
    image: string
    date_joined: string
}

export const SEARCHOPTIONS = [
    { value: 'mobile', label: 'Mobile' },
    { value: 'name', label: 'Name' },
]
