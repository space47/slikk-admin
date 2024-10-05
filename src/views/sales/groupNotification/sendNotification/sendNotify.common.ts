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
