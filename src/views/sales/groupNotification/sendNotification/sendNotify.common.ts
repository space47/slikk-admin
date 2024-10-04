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
        label: 'Users',
        classname: 'col-span-1 w-full',
        type: 'text',
        name: 'users',
        placeholder: 'Enter Users',
    },
]
