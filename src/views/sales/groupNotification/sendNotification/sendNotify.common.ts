export interface sendNotificationType {
    title: string
    message: string
    page: string
    filters: string
    users: string
    page_title: string
    key: string
    notification_type: string
    target_page: string
    image_url: string
    image_url_array: File[]
}

export const SendNotificationARRAY = [
    {
        label: 'Event Name',
        classname: 'col-span-1 w-full',
        type: 'text',
        name: 'event_name',
        placeholder: 'Enter Event name',
    },
    {
        label: 'Key',
        classname: 'col-span-1 w-full',
        type: 'text',
        name: 'key',
        placeholder: 'Place your key',
    },
    {
        label: 'Title',
        classname: 'col-span-1 w-full',
        type: 'text',
        name: 'title',
        placeholder: 'Place your Title',
    },
    {
        label: 'Page',
        classname: 'col-span-1 w-full',
        type: 'text',
        name: 'page',
        placeholder: 'Place page',
    },
    {
        label: 'Page Title',
        classname: 'col-span-1 w-full',
        type: 'text',
        name: 'page_title',
        placeholder: 'Enter Page Title',
    },
    {
        label: 'Mobile Numbers (Enter comma separated Values)',
        classname: 'col-span-1 w-full',
        type: 'text',
        name: 'users',
        placeholder: 'Enter Users',
    },
    {
        label: 'Send to all Users',
        classname: 'col-span-1 w-full',
        type: 'checkbox',
        name: 'users_all',
        placeholder: 'Enter Users',
    },
]

export const MAXMINARRAY = [
    {
        label: 'Max Price',
        name: 'maxprice',
        classname: 'col-span-1 w-1/2',
        placeholder: 'Enter max Price',
        type: 'text',
    },
    {
        label: 'Min Price',
        name: 'minprice',
        classname: 'col-span-1 w-1/2',
        placeholder: 'Enter min Price',
        type: 'text',
    },
]

export const OFFARRAY = [
    {
        label: 'Max off percenatge',
        name: 'maxoff',
        classname: 'col-span-1 w-1/2',
        placeholder: 'Enter maxoff %',
        type: 'text',
    },
    {
        label: 'Min off percentage',
        name: 'minoff',
        classname: 'col-span-1 w-1/2',
        placeholder: 'Enter minoff %',
        type: 'text',
    },
]

export const UtmArray = [
    {
        label: 'UTM Medium',
        classname: 'col-span-1 w-full',
        type: 'text',
        name: 'utm_medium',
        placeholder: 'Enter medium',
    },
    {
        label: 'UTM Source',
        classname: 'col-span-1 w-full',
        type: 'text',
        name: 'utm_source',
        placeholder: 'Enter source',
    },
    {
        label: 'UTM Campaign',
        classname: 'col-span-1 w-full',
        type: 'text',
        name: 'utm_campaign',
        placeholder: 'Enter campaign',
    },
    {
        label: 'UTM Tags',
        classname: 'col-span-1 w-full',
        type: 'text',
        name: 'utm_tags',
        placeholder: 'Enter tags',
    },
]

export const notificationTypeArray = [
    { value: 'sms', label: 'sms' },
    { value: 'email', label: 'email' },
    { value: 'whatsapp', label: 'whatsapp' },
    { value: 'app', label: 'app' },
]

export const targetPageArray = [
    { label: 'product', value: 'product' },
    { label: 'productListing', value: 'productListing' },
    { label: 'wishlist', value: 'wishlist' },
    { label: 'order', value: 'order' },
    { label: 'cart', value: 'cart' },
]

export const DISCOUNTOPTIONS = [
    { value: 'sort_lowtohigh', label: 'Low to High' },
    { value: 'sort_hightolow', label: 'High to Low' },
    { value: 'sort_discount', label: 'DISCOUNT' },
]
