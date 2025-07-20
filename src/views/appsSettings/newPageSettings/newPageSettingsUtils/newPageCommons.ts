export const BackGroundArray = [
    { label: 'Background Color', type: 'text', key: 'background_color', placeholder: 'Place bg color in hex' },
    { label: 'Background Top Margin', type: 'number', key: 'background_topMargin', placeholder: 'Place Top Margin' },
    { label: 'Background Bottom Margin', type: 'number', key: 'background_bottomMargin', placeholder: 'Place Bottom Margin' },
    { label: 'Background Left Margin', type: 'number', key: 'background_leftMargin', placeholder: 'Place Left Margin' },
    { label: 'Background Right Margin', type: 'number', key: 'background_rightMargin', placeholder: 'Place Right Margin' },
    { label: 'Corner Radius', type: 'number', key: 'corner_radius', placeholder: 'Place Corner Radius' },
    { label: 'Redirection Url', type: 'text', key: 'redirection_url', placeholder: 'Place Redirection Url' },
]

export const getBackgroundArray = (prefix: string) => {
    return BackGroundArray?.map((item) => ({
        label: item?.label,
        name: `${prefix}.${item?.key}`,
        type: item?.type,
        placeholder: item?.placeholder,
    }))
}
export const getWebBackgroundArray = (prefix: string) => {
    return BackGroundArray?.map((item) => ({
        label: `Web ${item?.label}`,
        name: `${prefix}.web_${item?.key}`,
        type: item?.type,
        placeholder: item?.placeholder,
    }))
}

export const BackgroundFields = getBackgroundArray('background_config')
export const webBackgroundFields = getWebBackgroundArray('background_config')

export const BackgroundExtraArray = [
    { label: 'Video', type: 'checkbox', name: 'background_config.is_background_video', placeholder: '' },
    { label: 'Lottie', type: 'checkbox', name: 'background_config.is_background_lottie', placeholder: '' },
]

export const MobileAndDesktopPositions = [
    { label: 'Top', value: 'top' },
    { label: 'Right', value: 'right' },
    { label: 'Center', value: 'center' },
    { label: 'Left', value: 'left' },
    { label: 'Bottom', value: 'bottom' },
    { label: 'Top-Left', value: 'top-left' },
    { label: 'Top-Right', value: 'top-right' },
    { label: 'Bottom-Left', value: 'bottom-left' },
    { label: 'Bottom-Right', value: 'bottom-right' },
]

// Other configs

export const ConfigArray = [
    { label: 'Text', key: 'text', type: 'text' },
    { label: 'Letter Spacing', key: 'letter_spacing', type: 'number' },
    { label: 'mobile Font Size', key: 'font_size', type: 'number' },
    { label: 'Top Margin', key: 'topMargin', type: 'number' },
    { label: 'bottom Margin', key: 'sub_bottomMargin', type: 'number' },
    { label: 'redirection url', key: 'redirection_url', type: 'text' },
]

export const getConfigArray = (title: string, prefix: string) => {
    return ConfigArray?.map((item) => ({
        label: `${title} ${item?.label}`,
        name: `${prefix}.${item?.key}`,
        type: item?.type,
    }))
}
export const getWebConfigArray = (title: string, prefix: string) => {
    return ConfigArray?.map((item) => ({
        label: `Web ${title} ${item?.label}`,
        name: `${prefix}.web_${item?.key}`,
        type: item?.type,
    }))
}

export const HeaderConfigArray = getConfigArray('Header', 'header_config')?.filter((item) => item?.name !== 'header_config.topMargin')
export const WebHeaderConfigArray = getWebConfigArray('Header', 'header_config')?.filter(
    (item) => item?.name !== 'header_config.web_topMargin',
)

export const SubHeaderConfigArray = getConfigArray('Sub Header', 'sub_header_config')
export const WebSubHeaderConfigArray = getWebConfigArray('Sub Header', 'sub_header_config')

export const FooterConfigArray = getConfigArray('Footer', 'footer_config')?.filter((item) => item?.name !== 'footer_config.bottomMargin')
export const WebFooterConfigArray = getWebConfigArray('Footer', 'footer_config')?.filter(
    (item) => item?.name !== 'footer_config.web_bottomMargin',
)

export const CommonConfigArray = [
    { label: ' BG Color', key: 'background_color', type: 'text' },
    { label: 'Font Color', key: 'font_color', type: 'text' },
]

export const getCommonConfigArray = (title: string, prefix: string) => {
    return CommonConfigArray?.map((item) => ({
        label: `${title} ${item?.label}`,
        name: `${prefix}.${item?.key}`,
        type: item?.type,
    }))
}

export const HeaderCommonConfigArray = getCommonConfigArray('Header', 'header_config')
export const SubHeaderCommonConfigArray = getCommonConfigArray('Sub Header', 'sub_header_config')
export const FooterCommonConfigArray = getCommonConfigArray('Footer', 'footer_config')

export const CtaArray = [
    { label: 'CTA Text', name: 'extra_info.cta_config.text', type: 'text' },
    { label: 'CTA Letter Spacing', name: 'extra_info.cta_config.letter_spacing', type: 'number' },
    { label: 'CTA Web Letter Spacing', name: 'extra_info.cta_config.web_letter_spacing', type: 'number' },
    { label: 'CTA mobile Font Size', name: 'extra_info.cta_config.font_size', type: 'number' },
    { label: 'CTA Web Font Size', name: 'extra_info.cta_config.web_font_size', type: 'text' },
    { label: 'CTA Bottom Margin', name: 'extra_info.cta_config.bottomMargin', type: 'number' },
    { label: 'Web CTA Bottom Margin', name: 'extra_info.cta_config.web_bottomMargin', type: 'number' },
    { label: 'CTA Top Margin', name: 'extra_info.cta_config.topMargin', type: 'number' },
    { label: 'Web CTA Top Margin', name: 'extra_info.cta_config.web_topMargin', type: 'number' },
    { label: 'CTA BG Color', name: 'extra_info.cta_config.background_color', type: 'text' },
    { label: 'CTA Font Color', name: 'extra_info.cta_config.font_color', type: 'text' },
    { label: 'CTA Width', name: 'extra_info.cta_config.width', type: 'number' },
    { label: 'Web CTA Width', name: 'extra_info.cta_config.web_width', type: 'number' },
    { label: 'CTA Horizontal Padding ', name: 'extra_info.cta_config.horizontalPadding', type: 'number' },
    { label: 'Web CTA Horizontal Padding ', name: 'extra_info.cta_config.web_horizontalPadding', type: 'number' },
    { label: 'CTA vertical Padding ', name: 'extra_info.cta_config.verticalPadding', type: 'number' },
    { label: 'Web CTA vertical Padding ', name: 'extra_info.cta_config.web_verticalPadding', type: 'number' },
    { label: 'CTA Corner Radius', name: 'extra_info.cta_config.cornerRadius', type: 'number' },
    { label: 'Web CTA Corner Radius', name: 'extra_info.cta_config.web_cornerRadius', type: 'number' },
    { label: 'CTA Border Width', name: 'extra_info.cta_config.borderWidth', type: 'number' },
    { label: 'Web CTA Border Width', name: 'extra_info.cta_config.web_borderWidth', type: 'number' },
    { label: 'CTA Border Color', name: 'extra_info.cta_config.borderColor', type: 'text' },
]

export const TimerPositionArray = [
    { label: 'Left', value: 'left' },
    { label: 'Right', value: 'right' },
    { label: 'Top', value: 'top' },
    { label: 'Bottom', value: 'bottom' },
]

export const TimeFieldsArray = [
    { label: 'Timer Text', name: 'extra_info.timer_text', type: 'text' },
    { label: 'Timer Color', name: 'extra_info.timer_color', type: 'text' },
    { label: 'Timer Text color', name: 'extra_info.timer_text_color', type: 'text' },
    { label: 'Timer Text Font', name: 'extra_info.timer_text_font', type: 'checkbox' },
    { label: 'Timer Font Size', name: 'extra_info.timer_font_size', type: 'number' },
    { label: 'Timer Background Color', name: 'extra_info.timer_bg_color', type: 'text' },
    { label: 'Timer Gap', name: 'extra_info.timer_gap', type: 'number' },
    { label: 'Timer Type', name: 'extra_info.timer_type', type: 'text' },
    { label: 'Background Color', name: 'extra_info.bg_color', type: 'text' },
]

export const SortArrays = [
    { label: 'High to Low', value: 'hightolow' },
    { label: 'Low to High', value: 'lowtohigh' },
    { label: 'Discount', value: 'discount' },
    { label: 'Rating', value: 'rating' },
    { label: 'Newest', value: 'newest' },
]
