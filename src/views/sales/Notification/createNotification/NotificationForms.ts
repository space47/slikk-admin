import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import { Checkbox } from '@/components/ui'

export const NotificationARRAY = [
    {
        label: 'Event Name',
        classname: 'col-span-1 w-full',
        type: 'text',
        name: 'event_name',
        placeholder: 'Place your Event Name',
        component: { Input },
    },
    {
        label: 'Title',
        classname: 'col-span-1 w-full',
        type: 'text',
        name: 'title',
        placeholder: 'Place your Title',
        component: { Input },
    },
    {
        label: 'Template Id/Name',
        classname: 'col-span-1 w-full',
        type: 'text',
        name: 'template_id',
        placeholder: 'Place your Template ID',
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
