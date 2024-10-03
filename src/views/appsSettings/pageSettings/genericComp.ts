import Checkbox from '@/components/ui/Checkbox'
import Input from '@/components/ui/Input'

export const genericComponentArray = [
    {
        label: 'Grid',
        name: 'grid',
        component: { Checkbox },
        type: 'checkbox',
        placeholder: 'Enter grid',
    },
    {
        label: 'Crousel AutoPlay',
        name: 'crousel_autoplay',
        component: { Checkbox },
        type: 'checkbox',
        placeholder: 'Enter Autoplay',
    },
    {
        label: 'Crousel',
        name: 'crousel',
        component: { Checkbox },
        type: 'checkbox',
        placeholder: 'Enter crousel',
    },
    {
        label: 'Width',
        name: 'width',
        type: 'text',
        component: { Input },
        placeholder: 'Enter Width (eg: 0.5, 0.25...etc)',
    },
    {
        label: 'Corner Radius',
        name: 'corner_radius',
        type: 'text',
        component: { Input },
        placeholder: 'Enter Corner Radius',
    },
]

export const borrderStyleArray = [
    {
        label: 'BorderWidth',
        name: 'border_width',
        type: 'text',
        component: { Input },
        placeholder: 'Enter Width (eg: 1,2)',
    },
    {
        label: 'Color',
        name: 'border_color',
        type: 'text',
        component: { Input },
        placeholder: 'Enter color hexcode',
    },
]
