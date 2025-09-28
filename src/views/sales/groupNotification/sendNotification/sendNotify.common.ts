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

export const initialValue: sendNotificationType = {
    page: '',
    notification_type: '',
    title: '',
    message: '',
    target_page: '',
    key: '',
    users: '9818454888,8310903174',
    page_title: '',
    filters: '',
    image_url: '',
    image_url_array: [],
}

export const SchedulerARRAY = [
    {
        label: 'Month',
        classname: 'col-span-1 w-full',
        type: 'text',
        name: 'schedule_month',
    },
    {
        label: 'Minute',
        classname: 'col-span-1 w-full',
        type: 'text',
        name: 'schedule_minute',
    },
    {
        label: 'Year',
        classname: 'col-span-1 w-full',
        type: 'text',
        name: 'schedule_year',
    },
    {
        label: 'Day',
        classname: 'col-span-1 w-full',
        type: 'text',
        name: 'schedule_day',
    },
    {
        label: 'Hour',
        classname: 'col-span-1 w-full',
        type: 'text',
        name: 'schedule_hour',
    },
]

export type SendNotificationARRAYType = {
    label: string
    classname: string
    type: string
    name: string
    placeholder: string
}

export const SendNotificationARRAY = [
    {
        label: 'Campaign Name',
        classname: 'col-span-1 w-1/2',
        type: 'text',
        name: 'event_name',
        placeholder: 'Enter Event name',
    },

    {
        label: 'Page Title',
        classname: 'col-span-1 w-1/2',
        type: 'text',
        name: 'page_title',
        placeholder: 'Enter Page Title',
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
    { label: 'events', value: 'events' },
]

export const DISCOUNTOPTIONS = [
    { value: 'sort_lowtohigh', label: 'Low to High' },
    { value: 'sort_hightolow', label: 'High to Low' },
    { value: 'sort_discount', label: 'DISCOUNT' },
    { value: 'sort_rating', label: 'RATING' },
    { value: 'sort_newest', label: 'NEWEST' },
    { value: 'sort_popularity', label: 'POPULARiTY' },
]

export const USERNOTFARRAY = [
    {
        label: 'Test Numbers (Enter comma separated Values)',
        classname: 'col-span-1 w-auto',
        type: 'text',
        name: 'users',
        placeholder: 'Enter Users',
    },
    // {
    //     label: 'Send to all Users',
    //     classname: 'col-span-1 w-full',
    //     type: 'checkbox',
    //     name: 'users_all',
    //     placeholder: 'Enter Users',
    // },
]

export const REPEATARRAY = [
    { label: 'FIXED', value: 'no_repeat' },
    { label: 'REPEAT', value: 'repeat' },
]

export const MINUTE_OPTIONS = Array.from({ length: 60 }, (_, i) => ({ label: i.toString(), value: i.toString() }))
export const HOUR_OPTIONS = Array.from({ length: 24 }, (_, i) => ({ label: i.toString(), value: i.toString() }))
export const DAY_OPTIONS = Array.from({ length: 31 }, (_, i) => ({ label: (i + 1).toString(), value: (i + 1).toString() }))
export const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => ({ label: (i + 1).toString(), value: (i + 1).toString() }))
