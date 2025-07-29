import { Checkbox, Input } from '@/components/ui'

const ComponentConfigArray = [
    {
        label: 'Grid',
        key: 'grid',
        component: { Checkbox },
        type: 'checkbox',
    },
    {
        label: 'Cover Flow',
        key: 'coverFlow',
        component: { Checkbox },
        type: 'checkbox',
    },
    {
        label: 'Shadow Intensity',
        key: 'shadow_intensity',
        type: 'number',
    },
    {
        label: 'Shadow Color',
        key: 'shadow_color',
        type: 'text',
    },
    {
        label: "Carousel AutoPlay (Section alignment center doesn't work with autoplay)",
        key: 'carousel_autoplay',
        component: { Checkbox },
        type: 'checkbox',
    },
    {
        label: 'Interval',
        key: 'interval',
        component: { Input },
        type: 'number',
    },
    {
        label: 'Show Dots',
        key: 'show_dots',
        component: { Checkbox }, // Updated component to match type
        type: 'checkbox',
    },
    {
        label: 'Infinite Loop',
        key: 'infinit_loop',
        component: { Checkbox }, // Updated component to match type
        type: 'checkbox',
    },
    {
        label: 'Carousel',
        key: 'carousel',
        component: { Checkbox },
        type: 'checkbox',
    },
    {
        label: 'Width',
        key: 'width',
        type: 'number',
        component: { Input },
    },

    {
        label: 'Row',
        key: 'row',
        type: 'number',
        component: { Input },
    },
    {
        label: 'Column',
        key: 'column',
        type: 'number',
        component: { Input },
    },
    {
        label: 'Corner Radius',
        key: 'corner_radius',
        type: 'number',
        component: { Input },
    },
    {
        label: 'Section Corner Radius',
        key: 'section_corner_radius',
        type: 'number',
        component: { Input },
    },

    {
        label: 'Section Top Margin',
        key: 'section_topMargin',
        type: 'number',
        component: { Input },
    },
    {
        label: 'Section Bottom Margin',
        key: 'section_bottomMargin',
        type: 'number',
        component: { Input },
    },
    {
        label: 'Section Left Margin',
        key: 'section_leftMargin',
        type: 'number',
        component: { Input },
    },
    {
        label: 'Section Right Margin',
        key: 'section_rightMargin',
        type: 'number',
        component: { Input },
    },
    {
        label: 'Section Top Padding',
        key: 'section_topPadding',
        type: 'number',
        component: { Input },
    },
    {
        label: 'Section Bottom Padding',
        key: 'section_bottomPadding',
        type: 'number',
        component: { Input },
    },
    {
        label: 'Section Left Padding',
        key: 'section_leftPadding',
        type: 'number',
        component: { Input },
    },
    {
        label: 'Section Right Padding',
        key: 'section_rightPadding',
        type: 'number',
        component: { Input },
    },

    {
        label: 'Gap',
        key: 'gap',
        type: 'number',
        component: { Input },
    },
    {
        label: 'Vertical Gap',
        key: 'vertical_gap',
        type: 'number',
        component: { Input },
    },
    {
        label: 'Font Size',
        key: 'font_size',
        type: 'number',
        component: { Input },
    },
    {
        label: 'Footer Font Size',
        key: 'footer_font_size',
        type: 'number',
        component: { Input },
    },
    {
        label: 'Font Color',
        key: 'font_color',
        type: 'text',
        component: { Input },
    },
    {
        label: 'Footer Font Color',
        key: 'footer_font_color',
        type: 'text',
        component: { Input },
    },
    {
        label: 'Section Margin',
        key: 'section_margin',
        type: 'number',
        component: { Input },
    },
    {
        label: 'Section Padding',
        key: 'section_padding',
        type: 'number',
        component: { Input },
    },
    {
        label: 'Aspect Ratio',
        key: 'aspect_ratio',
        type: 'number',
        component: { Input },
    },
]

export const getComponentConfigArray = (prefix: string) => {
    return ComponentConfigArray?.map((item) => ({
        label: item?.label,
        name: `${prefix}.${item?.key}`,
        component: item?.component,
        type: item?.type,
    }))
}
export const getComponentWebConfigArray = (prefix: string) => {
    return ComponentConfigArray?.map((item) => ({
        label: `Web ${item?.label}`,
        name: `${prefix}.web_${item?.key}`,
        component: item?.component,
        type: item?.type,
    }))
}

export const ParallaxConfigArray = [
    { label: 'OffsetX', key: 'carousel_offsetX', type: 'number', message: 'Range between 0 -1' },
    { label: 'OffsetY', key: 'carousel_offsetY', type: 'number', message: 'Range between 0 -1' },
    { label: 'Angle Offset', key: 'carousel_angleOffset', type: 'number', message: 'Values in %' },
    { label: 'Min Opacity', key: 'carousel_minOpacity', type: 'number', message: 'Range between 0 -1' },
    { label: 'Max Opacity', key: 'carousel_maxOpacity', type: 'number', message: 'Range between 0 -1' },
    { label: 'Min Scale', key: 'carousel_minScale', type: 'number', message: 'Range between 0 -1' },
    { label: 'Max Scale', key: 'carousel_maxScale', type: 'number', message: 'Range between 0 -1' },
]

export const SectionBorderStyleArray = [
    {
        label: 'Section Border Width',
        key: 'section_border_width',
        type: 'number',
        component: { Input },
        placeholder: 'Enter Width (eg: 1,2)',
    },
    {
        label: 'Section Color',
        key: 'section_border_color',
        type: 'text',
        component: { Input },
        placeholder: 'Enter color hexcode',
    },
]

//

export const NameFieldArray = [
    {
        label: 'Name Top Margin',
        type: 'number',
        key: 'name_topMargin',
        placeholder: 'Place name top margin',
    },
    {
        label: 'Name Bottom Margin',
        type: 'number',
        key: 'name_bottomMargin',
        placeholder: 'Place name bottom margin',
    },
]

export const getNameFieldArray = (prefix: string) => {
    return NameFieldArray?.map((item) => ({
        label: item?.label,
        name: `${prefix}.${item?.key}`,
        placeholder: item?.placeholder,
        type: item?.type,
    }))
}

export const getWebNameFieldArray = (prefix: string) => {
    return NameFieldArray?.map((item) => ({
        label: `Web ${item?.label}`,
        name: `${prefix}.web_${item?.key}`,
        placeholder: item?.placeholder,
        type: item?.type,
    }))
}

export const componentNameFieldArray = getNameFieldArray('component_config')
export const childNameFieldArray = getNameFieldArray('extra_info.child_component_config')

export const componentWebNameFieldArray = getWebNameFieldArray('component_config')
export const childWebNameFieldArray = getWebNameFieldArray('extra_info.child_component_config')

// .....

export const getParallaxConfigArrayArray = (prefix: string) => {
    return ParallaxConfigArray?.map((item) => ({
        label: item?.label,
        name: `${prefix}.${item?.key}`,
        message: item?.message,
        type: item?.type,
    }))
}
export const sectionBorderArray = (prefix: string) => {
    return SectionBorderStyleArray?.map((item) => ({
        label: item?.label,
        name: `${prefix}.${item?.key}`,
        placeholder: item?.placeholder,
        component: item?.component,
        type: item?.type,
    }))
}

export const componentSectionBorderArray = sectionBorderArray('component_config')
export const childSectionBorderArray = sectionBorderArray('extra_info.child_component_config')

export const componentConfigFieldsArray = getComponentConfigArray('component_config')
export const childConfigFieldsArray = getComponentConfigArray('extra_info.child_component_config')

export const componentConfigWebFieldsArray = getComponentWebConfigArray('component_config')
export const childConfigWebFieldsArray = getComponentWebConfigArray('extra_info.child_component_config')

export const componentParallaxFieldsArray = getParallaxConfigArrayArray('component_config')
export const childParallaxFieldsArray = getParallaxConfigArrayArray('extra_info.child_component_config')

export const sectionWebBorderArray = (prefix: string) => {
    return SectionBorderStyleArray?.map((item) => ({
        label: `Web ${item?.label}`,
        name: `${prefix}.web_${item?.key}`,
        placeholder: item?.placeholder,
        component: item?.component,
        type: item?.type,
    }))
}

export const componentWebSectionBorderArray = sectionWebBorderArray('component_config')
export const childWebSectionBorderArray = sectionWebBorderArray('extra_info.child_component_config')

export const borderMainArray = [
    {
        label: 'Border Width',
        key: 'border_width',
        type: 'number',
        component: { Input },
        placeholder: 'Enter Width (eg: 1,2)',
    },
    {
        label: 'Color',
        key: 'border_color',
        type: 'text',
        component: { Input },
        placeholder: 'Enter color hexcode',
    },
]

export const getWebBorderMainArray = (prefix: string) => {
    return borderMainArray?.map((item) => ({
        label: `Web ${item?.label}`,
        name: `${prefix}.web_${item?.key}`,
        placeholder: item?.placeholder,
        component: item?.component,
        type: item?.type,
    }))
}
export const getBorderMainArray = (prefix: string) => {
    return borderMainArray?.map((item) => ({
        label: `${item?.label}`,
        name: `${prefix}.${item?.key}`,
        placeholder: item?.placeholder,
        component: item?.component,
        type: item?.type,
    }))
}

export const componentBorderWebData = getWebBorderMainArray('component_config')
export const childBorderWebData = getWebBorderMainArray('extra_info.child_component_config')

export const componentBorderData = getBorderMainArray('component_config')
export const childBorderData = getBorderMainArray('extra_info.child_component_config')
