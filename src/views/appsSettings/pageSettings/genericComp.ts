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
        label: 'Carousel AutoPlay',
        name: 'carousel_autoplay',
        component: { Checkbox },
        type: 'checkbox',
        placeholder: 'Enter Autoplay',
    },
    {
        label: 'Interval',
        name: 'interval',
        component: { Input },
        type: 'number',
        placeholder: 'Enter Interval in secs',
    },
    {
        label: 'carousel',
        name: 'carousel',
        component: { Checkbox },
        type: 'checkbox',
        placeholder: 'Enter carousel',
    },
    {
        label: 'Width',
        name: 'width',
        type: 'number',
        component: { Input },
        placeholder: 'Enter Width (eg: 0.5, 0.25...etc)',
    },
    {
        label: 'Corner Radius',
        name: 'corner_radius',
        type: 'number',
        component: { Input },
        placeholder: 'Enter Corner Radius',
    },
]

export const borrderStyleArray = [
    {
        label: 'BorderWidth',
        name: 'border_width',
        type: 'number',
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
