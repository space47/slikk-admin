import { Checkbox, Input } from '@/components/ui'

export const ExtraAttributes = [
    {
        name: 'extra_attributes.x_axis',
        label: 'X-Axis',
        type: 'text',
        component: Input,
    },
    {
        name: 'extra_attributes.y_axis',
        label: 'Y-Axis',
        type: 'text',
        component: Input,
    },
    {
        name: 'extra_attributes.secondary_y_axis',
        label: 'Secondary y-Axis',
        type: 'text',
        component: Input,
    },
    {
        name: 'extra_attributes.is_graph',
        label: 'Graph',
        type: 'checkbox',
        component: Checkbox,
    },
]
