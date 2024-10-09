import Checkbox from '@/components/ui/Checkbox'
import Input from '@/components/ui/Input'

export const genericComponentArray = [
    {
        label: 'Grid',
        name: 'component_config.grid',
        component: { Checkbox },
        type: 'checkbox',
        placeholder: 'Enter grid',
    },
    {
        label: 'Carousel AutoPlay',
        name: 'component_config.carousel_autoplay',
        component: { Checkbox },
        type: 'checkbox',
        placeholder: 'Enter Autoplay',
    },
    {
        label: 'Interval',
        name: 'component_config.interval',
        component: { Input },
        type: 'number',
        placeholder: 'Enter Interval in secs',
    },

    {
        label: 'Show Dots',
        name: 'component_config.show_dots',
        component: { Input },
        type: 'checkbox',
        placeholder: 'Enter Interval in secs',
    },
    {
        label: 'Infinit Loop',
        name: 'component_config.infinit_loop',
        component: { Input },
        type: 'checkbox',
        placeholder: 'Enter Interval in secs',
    },

    {
        label: 'carousel',
        name: 'component_config.carousel',
        component: { Checkbox },
        type: 'checkbox',
        placeholder: 'Enter carousel',
    },
    // {
    //     label: 'carousel Dot',
    //     name: 'component_config.carousel_dot',
    //     component: { Checkbox },
    //     type: 'checkbox',
    //     placeholder: 'Enter carousel dot',
    // },
    {
        label: 'Width',
        name: 'component_config.width',
        type: 'number',
        component: { Input },
        placeholder: 'Enter Width (eg: 0.5, 0.25...etc)',
    },
    {
        label: 'Corner Radius',
        name: 'component_config.corner_radius',
        type: 'number',
        component: { Input },
        placeholder: 'Enter Corner Radius',
    },
]

export const borrderStyleArray = [
    {
        label: 'BorderWidth',
        name: 'component_config.border_width',
        type: 'number',
        component: { Input },
        placeholder: 'Enter Width (eg: 1,2)',
    },
    {
        label: 'Color',
        name: 'component_config.border_color',
        type: 'text',
        component: { Input },
        placeholder: 'Enter color hexcode',
    },
]

export const BackGroundArray = [
    { label: 'Background Color', type: 'text', name: 'background_config.background_color', placeholder: 'Place bg color in hex' },
    { label: 'Background TopMargin', type: 'number', name: 'background_config.background_topMargin', placeholder: 'Place Top Margin' },
    {
        label: 'Background BottomMargin',
        type: 'number',
        name: 'background_config.background_bottomMargin',
        placeholder: 'Place bottom Margin',
    },
    {
        label: 'Desktop Position',
        type: 'text',
        name: 'background_config.desktop_position',
        placeholder: 'Place Desktop Position',
    },
    {
        label: 'Mobile Position',
        type: 'text',
        name: 'background_config.mobile_position',
        placeholder: 'Place Mobile Position',
    },
    {
        label: 'Mobile Width',
        type: 'number',
        name: 'background_config.mobile_Width',
        placeholder: 'Place Mobile width',
    },
    {
        label: 'Web Width',
        type: 'number',
        name: 'background_config.web_Width',
        placeholder: 'Place Mobile width',
    },
]
