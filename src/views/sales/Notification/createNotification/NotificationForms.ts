import Input from '@/components/ui/Input'

import { Checkbox } from '@/components/ui'

export const NotificationARRAY = [
    {
        label: 'Title',
        classname: 'col-span-1 w-full',
        type: 'text',
        name: 'title',
        placeholder: 'Place your Title',
        component: { Input },
    },

    {
        label: 'Active',
        classname: 'col-span-1 w-full',
        type: 'checkbox',
        name: 'is_active',
        placeholder: 'Active',
        component: { Checkbox },
    },
]

export const extractPlaceholders = (text: string) => {
    const regex = /{{(.*?)}}/g
    const matches = []
    let match
    while ((match = regex.exec(text)) !== null) {
        matches.push(match[1]) // Extract placeholder name
    }
    return matches.length > 0 ? matches : [] // Return an empty array if no matches
}
