/* eslint-disable @typescript-eslint/no-explicit-any */
export const HEADERCONFIGARRAY = [
    // {
    //     label: 'Header Style',
    //     name: 'header_config.style',
    //     type: 'text',
    // },
    {
        label: 'Header Text',
        name: 'header_config.text',
        type: 'text',
    },
    {
        label: 'Web Header Text',
        name: 'header_config.web_text',
        type: 'text',
    },
    {
        label: 'Header mobile Font Size',
        name: 'header_config.font_size',
        type: 'number',
    },
    {
        label: 'Header Web Font Size',
        name: 'header_config.web_font_size',
        type: 'text',
    },
    {
        label: 'Header Top Margin',
        name: 'header_config.bottomMargin',
        type: 'number',
    },
    {
        label: 'Web Header Top Margin',
        name: 'header_config.web_bottomMargin',
        type: 'number',
    },
    {
        label: 'Header BG Color',
        name: 'header_config.background_color',
        type: 'text',
    },
    {
        label: 'Header Font Color',
        name: 'header_config.font_color',
        type: 'text',
    },
    {
        label: 'Header redirection url',
        name: 'header_config.redirection_url',
        type: 'text',
    },
    {
        label: 'Web Header redirection url',
        name: 'header_config.web_redirection_url',
        type: 'text',
    },
]

export const SUBHEADERCONFIGARRAY = [
    // {
    //     label: 'Sub-Header Style',
    //     name: 'sub_header_config.style',
    //     type: 'text',
    // },
    {
        label: 'Sub-Header Text',
        name: 'sub_header_config.text',
        type: 'text',
    },
    {
        label: 'Web Sub-Header Text',
        name: 'sub_header_config.web_text',
        type: 'text',
    },
    {
        label: 'Sub-Header Mobile Font Size',
        name: 'sub_header_config.font_size',
        type: 'number',
    },
    {
        label: 'Sub-Header Web Font Size',
        name: 'sub_header_config.web_font_size',
        type: 'text',
    },
    {
        label: 'Sub Header Top Margin',
        name: 'sub_header_config.topMargin',
        type: 'number',
    },
    {
        label: 'Web Sub Header Top Margin',
        name: 'sub_header_config.web_topMargin',
        type: 'number',
    },

    {
        label: 'Sub Header bottom Margin',
        name: 'sub_header_config.bottomMargin',
        type: 'number',
    },
    {
        label: 'Sub-Header BG Color',
        name: 'sub_header_config.background_color',
        type: 'text',
    },
    {
        label: 'Sub-Header Font Color',
        name: 'sub_header_config.font_color',
        type: 'text',
    },
    {
        label: 'Sub-Header redirection url',
        name: 'sub_header_config.redirection_url',
        type: 'text',
    },
    {
        label: 'Web Sub-Header redirection url',
        name: 'sub_header_config.web_redirection_url',
        type: 'text',
    },
]

export const FOOTERCONFIGARRAY = [
    {
        label: 'Footer Text',
        name: 'footer_config.text',
        type: 'text',
    },
    {
        label: 'Web Footer Text',
        name: 'footer_config.web_text',
        type: 'text',
    },
    {
        label: 'Footer Mobile Font Size',
        name: 'footer_config.font_size',
        type: 'number',
    },
    {
        label: 'Footer Web Font Size',
        name: 'footer_config.web_font_size',
        type: 'text',
    },
    {
        label: 'Footer Top Margin',
        name: 'footer_config.topMargin',
        type: 'number',
    },
    {
        label: 'Web Footer Top Margin',
        name: 'footer_config.web_topMargin',
        type: 'number',
    },
    {
        label: 'Footer BG Color',
        name: 'footer_config.background_color',
        type: 'text',
    },
    {
        label: 'Footer Font Color',
        name: 'footer_config.font_color',
        type: 'text',
    },
    {
        label: 'Footer Redirection Url',
        name: 'footer_config.redirection_url',
        type: 'text',
    },
    {
        label: 'Web Footer Redirection Url',
        name: 'footer_config.web_redirection_url',
        type: 'text',
    },
]

export const DATATYPEVALUES = [
    {
        label: 'Data Type Posts',
        name: 'data_type.posts',
        type: 'text',
    },
    {
        label: 'Data Type Brands',
        name: 'data_type.brands',
        type: 'text',
    },
    {
        label: 'Data Type Sub Category',
        name: 'data_type.sub_category',
        type: 'text',
    },
    {
        label: 'Data Type Handles',
        name: 'data_type.handles',
        type: 'text',
    },
    // {
    //     label: 'is_section_clickable',
    //     name: 'is_section_clickable',
    //     type: 'checkbox',
    // },
]

export const TimeFieldsArray = [
    {
        label: 'Timer Text',
        name: 'extra_info.timer_text',
        type: 'text',
    },
    {
        label: 'Timer Color',
        name: 'extra_info.timer_color',
        type: 'text',
    },
    {
        label: 'Timer Text color',
        name: 'extra_info.timer_text_color',
        type: 'text',
    },
    {
        label: 'Timer Text Font',
        name: 'extra_info.timer_text_font',
        type: 'checkbox',
    },
    {
        label: 'Timer Font Size',
        name: 'extra_info.timer_font_size',
        type: 'number',
    },
    {
        label: 'Timer Background Color',
        name: 'extra_info.timer_bg_color',
        type: 'text',
    },
    {
        label: 'Timer Gap',
        name: 'extra_info.timer_gap',
        type: 'number',
    },
    {
        label: 'Timer Type',
        name: 'extra_info.timer_type',
        type: 'text',
    },
    {
        label: 'Background Color',
        name: 'extra_info.bg_color',
        type: 'text',
    },
]

export interface CommonProps {
    setComponentOptions: any
    initialValue: any
    formikRef: any
    handleSubmit: any
    setBorderForm: any
    borderForm: any
    setSectioBorderShow: any
    sectionBorderShow: any
    setWebBorderForm: any
    webBorderForm: any
    setWebSectioBorderShow: any
    webSectionBorderShow: any
    setNameForm: any
    nameForm: any
    setFooterAlignForm: any
    footerAlignForm: any
    setWebNameForm: any
    webNameForm: any
    setWebFooterAlignForm: any
    webFooterAlignForm: any
    searchInput: any
    handleSearch: any
    currentSelectedPage: any
    handleSelect: any
    showTable: any
    handleActionClick: any
    productData: any
    setProductData: any
    postInput: any
    handlePOSTSearch: any
    showPostTable: any
    postTableData: any
    handlePostClick: any
    postData: any
    setPostData: any
    filters: any
    tableData: any
    editMode?: boolean
    handleRemoveImage?: any
    particularRow?: any
    handleRemoveHeaderImage?: any
    handleRemoveSubImage?: any
    handleRemoveVideo?: any
    validationSchema?: any
    handleAddFilter: any
    showAddFilter: any
    handleAddFilters: any
    handleRemoveFilter: any
}
