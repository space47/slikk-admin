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
    // {
    //     label: 'Section AlignMent',
    //     name: 'component_config.section_alignment',
    //     component: { Input },
    //     type: 'text',
    //     placeholder: 'Enter Section Alignment',
    // },
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
        component: { Checkbox }, // Updated component to match type
        type: 'checkbox',
        placeholder: 'Enter Show Dots',
    },
    {
        label: 'Infinite Loop',
        name: 'component_config.infinit_loop',
        component: { Checkbox }, // Updated component to match type
        type: 'checkbox',
        placeholder: 'Enter Infinite Loop',
    },
    {
        label: 'Carousel',
        name: 'component_config.carousel',
        component: { Checkbox },
        type: 'checkbox',
        placeholder: 'Enter carousel',
    },
    {
        label: 'Width',
        name: 'component_config.width',
        type: 'number',
        component: { Input },
        placeholder: 'Enter Width (e.g., 0.5, 0.25, etc.)',
    },

    {
        label: 'Row',
        name: 'component_config.row',
        type: 'number',
        component: { Input },
        placeholder: 'Enter Web Row',
    },
    {
        label: 'Column',
        name: 'component_config.column',
        type: 'number',
        component: { Input },
        placeholder: 'Enter Web Column',
    },
    {
        label: 'Corner Radius',
        name: 'component_config.corner_radius',
        type: 'number',
        component: { Input },
        placeholder: 'Enter Corner Radius',
    },
    {
        label: 'Gap',
        name: 'component_config.gap',
        type: 'number',
        component: { Input },
        placeholder: 'Enter gap',
    },
    {
        label: 'Vertical Gap',
        name: 'component_config.vertical_gap',
        type: 'number',
        component: { Input },
        placeholder: 'Enter gap',
    },
    {
        label: 'Font Size',
        name: 'component_config.font_size',
        type: 'number',
        component: { Input },
        placeholder: 'Enter Font Size',
    },
    {
        label: 'Footer Font Size',
        name: 'component_config.footer_font_size',
        type: 'number',
        component: { Input },
        placeholder: 'Enter Footer Font Size',
    },
    {
        label: 'Font Color',
        name: 'component_config.font_color',
        type: 'color',
        component: { Input },
        placeholder: 'Enter Font Color',
    },
    {
        label: 'Footer Font Color',
        name: 'component_config.footer_font_color',
        type: 'color',
        component: { Input },
        placeholder: 'Enter Font Color',
    },
    {
        label: 'Section Margin',
        name: 'component_config.section_margin',
        type: 'number',
        component: { Input },
        placeholder: 'Enter margin',
    },
    {
        label: 'Section Padding',
        name: 'component_config.section_padding',
        type: 'number',
        component: { Input },
        placeholder: 'Enter Web Font Color',
    },
    {
        label: 'Aspect Ratio',
        name: 'component_config.aspect_ratio',
        type: 'number',
        component: { Input },
        placeholder: 'Enter Aspect Ratio',
    },

    // Web Versions below
    {
        label: 'Web Grid',
        name: 'component_config.web_grid',
        component: { Checkbox },
        type: 'checkbox',
        placeholder: 'Enter Web grid',
    },
    {
        label: 'Web Carousel AutoPlay',
        name: 'component_config.web_carousel_autoplay',
        component: { Checkbox },
        type: 'checkbox',
        placeholder: 'Enter Web Autoplay',
    },
    // {
    //     label: 'Web Section AlignMent',
    //     name: 'component_config.web_section_alignment',
    //     component: { Input },
    //     type: 'text',
    //     placeholder: 'Enter Section Alignment',
    // },
    {
        label: 'Web Interval',
        name: 'component_config.web_interval',
        component: { Input },
        type: 'number',
        placeholder: 'Enter Web Interval in secs',
    },
    {
        label: 'Web Show Dots',
        name: 'component_config.web_show_dots',
        component: { Checkbox }, // Updated component to match type
        type: 'checkbox',
        placeholder: 'Enter Web Show Dots',
    },
    {
        label: 'Web Infinite Loop',
        name: 'component_config.web_infinit_loop',
        component: { Checkbox }, // Updated component to match type
        type: 'checkbox',
        placeholder: 'Enter Web Infinite Loop',
    },
    {
        label: 'Web Carousel',
        name: 'component_config.web_carousel',
        component: { Checkbox },
        type: 'checkbox',
        placeholder: 'Enter Web carousel',
    },
    {
        label: 'Web Width',
        name: 'component_config.web_width',
        type: 'number',
        component: { Input },
        placeholder: 'Enter Web Width (e.g., 0.5, 0.25, etc.)',
    },
    {
        label: 'Web row',
        name: 'component_config.web_row',
        type: 'number',
        component: { Input },
        placeholder: 'Enter Web Row',
    },
    {
        label: 'Web Column',
        name: 'component_config.web_column',
        type: 'number',
        component: { Input },
        placeholder: 'Enter Web Column',
    },
    {
        label: 'Web Corner Radius',
        name: 'component_config.web_corner_radius',
        type: 'number',
        component: { Input },
        placeholder: 'Enter Web Corner Radius',
    },
    {
        label: 'Web Gap',
        name: 'component_config.web_gap',
        type: 'number',
        component: { Input },
        placeholder: 'Enter web gap',
    },
    {
        label: 'Web Vertical Gap',
        name: 'component_config.web_vertical_gap',
        type: 'number',
        component: { Input },
        placeholder: 'Enter gap',
    },
    {
        label: 'Web Font Size',
        name: 'component_config.web_font_size',
        type: 'number',
        component: { Input },
        placeholder: 'Enter Web Font Size',
    },
    {
        label: 'Web Footer Font Size',
        name: 'component_config.web_footer_font_size',
        type: 'number',
        component: { Input },
        placeholder: 'Enter Footer Font Size',
    },
    {
        label: 'Web Font Color',
        name: 'component_config.web_font_color',
        type: 'color',
        component: { Input },
        placeholder: 'Enter Web Font Color',
    },
    {
        label: 'Web Footer Font Color',
        name: 'component_config.web_footer_font_color',
        type: 'color',
        component: { Input },
        placeholder: 'Enter Web Font Color',
    },
    {
        label: 'Web Section Margin',
        name: 'component_config.web_section_margin',
        type: 'number',
        component: { Input },
        placeholder: 'Enter Web Font Color',
    },
    {
        label: 'Web Section Padding',
        name: 'component_config.web_section_padding',
        type: 'number',
        component: { Input },
        placeholder: 'Enter Web Font Color',
    },
    {
        label: 'Web Aspect Ratio',
        name: 'component_config.web_aspect_ratio',
        type: 'number',
        component: { Input },
        placeholder: 'Enter Aspect Ratio',
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
        type: 'color',
        component: { Input },
        placeholder: 'Enter color hexcode',
    },
]

export const sectionBorrderStyleArray = [
    {
        label: 'Section Border Width',
        name: 'component_config.section_border_width',
        type: 'number',
        component: { Input },
        placeholder: 'Enter Width (eg: 1,2)',
    },
    {
        label: 'Section Color',
        name: 'component_config.section_border_color',
        type: 'color',
        component: { Input },
        placeholder: 'Enter color hexcode',
    },
]

export const WebSectionBorrderStyleArray = [
    {
        label: 'Web Section Border Width',
        name: 'component_config.web_section_border_width',
        type: 'number',
        component: { Input },
        placeholder: 'Enter Width (eg: 1,2)',
    },
    {
        label: 'Web Section Color',
        name: 'component_config.web_section_border_color',
        type: 'color',
        component: { Input },
        placeholder: 'Enter color hexcode',
    },
]

export const webBorrderStyleArray = [
    {
        label: 'Web BorderWidth',
        name: 'component_config.web_border_width',
        type: 'number',
        component: { Input },
        placeholder: 'Enter Width (eg: 1,2)',
    },
    {
        label: 'Web Color',
        name: 'component_config.web_border_color',
        type: 'color',
        component: { Input },
        placeholder: 'Enter color hexcode',
    },
]

export const BackGroundArray = [
    { label: 'Background Color', type: 'color', name: 'background_config.background_color', placeholder: 'Place bg color in hex' },
    { label: 'Background TopMargin', type: 'number', name: 'background_config.background_topMargin', placeholder: 'Place Top Margin' },
    {
        label: 'Background BottomMargin',
        type: 'number',
        name: 'background_config.background_bottomMargin',
        placeholder: 'Place bottom Margin',
    },
    // {
    //     label: 'Desktop Position',
    //     type: 'text',
    //     name: 'background_config.desktop_position',
    //     placeholder: 'Place Desktop Position',
    // },
    // {
    //     label: 'Mobile Position',
    //     type: 'text',
    //     name: 'background_config.mobile_position',
    //     placeholder: 'Place Mobile Position',
    // },
    {
        label: 'Mobile Width',
        type: 'number',
        name: 'background_config.mobile_width',
        placeholder: 'Place Mobile width',
    },
    {
        label: 'Web Width',
        type: 'number',
        name: 'background_config.web_width',
        placeholder: 'Place Mobile width',
    },
]

export const NAMEPOSITION = [
    {
        label: 'Top',
        value: 'top',
    },
    {
        label: 'Bottom',
        value: 'bottom',
    },
]

export const ALIGNVALUES = [
    {
        label: 'Right',
        value: 'right',
    },
    {
        label: 'Center',
        value: 'center',
    },
    {
        label: 'Left',
        value: 'left',
    },
]
export const MobileAndDesktopPositions = [
    {
        label: 'Right',
        value: 'right',
    },
    {
        label: 'Center',
        value: 'center',
    },
    {
        label: 'Left',
        value: 'left',
    },
    {
        label: 'Bottom',
        value: 'bottom',
    },
]
