import Input from '@/components/ui/Input'

export const USER_EDIT_FROM = [
    {
        label: 'First Name',
        name: 'first_name',
        className: 'col-span-1 w-3/4',
        type: 'text',
        placeholder: 'Enter your First Name ',
        component: Input,
    },
    {
        label: 'Last Name',
        name: 'last_name',
        className: 'col-span-1 w-3/4',
        placeholder: 'Enter your Last Name ',
        type: 'text',
        component: Input,
    },
    {
        label: 'Mobile',
        name: 'mobile',
        className: 'col-span-1 w-3/4',
        placeholder: 'Enter your Mobile Number ',
        type: 'text',
        component: Input,
    },
    {
        label: 'Email',
        name: 'email',
        className: 'col-span-1 w-3/4',
        placeholder: 'Enter your Email ',
        type: 'email',
        component: Input,
    },
    {
        label: 'Business Email',
        name: 'business_email',
        className: 'col-span-1 w-3/4',
        placeholder: 'Enter your Business Email ',
        type: 'email',
        component: Input,
    },
]
