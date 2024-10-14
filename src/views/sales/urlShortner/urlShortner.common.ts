export type URLTYPES = {
    short_code: string
    web_url: string
    android_url: string
    ios_url: string
    default_url: string
}

export const initialValueForUrl: URLTYPES = {
    short_code: '',
    web_url: '',
    android_url: '',
    ios_url: '',
    default_url: '',
}

export const URLARRAY = [
    {
        label: 'Short Url(Enter unique urls)',
        name: 'short_code',
        placeholder: 'Enter short code',
        type: 'text',
        classname: 'w-full',
    },
    {
        label: 'Web URL',
        name: 'web_url',
        placeholder: 'Enter web URL',
        type: 'url',
        classname: 'w-full',
    },
    {
        label: 'Android URL',
        name: 'android_url',
        placeholder: 'Enter Android URL',
        type: 'url',
        classname: 'w-full',
    },
    {
        label: 'iOS URL',
        name: 'ios_url',
        placeholder: 'Enter iOS URL',
        type: 'url',
        classname: 'w-full',
    },
    // {
    //     label: 'Default URL',
    //     name: 'default_url',
    //     placeholder: 'Enter default URL',
    //     type: 'url',
    //     classname: 'w-full',
    // },
]
