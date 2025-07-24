/* eslint-disable @typescript-eslint/no-explicit-any */
export interface pageSettingsType {
    id?: number
    section_heading: string
    display_name: string
    is_active: string
    banners: any[]
    component_type: string
    data_type: Record<string, string | number | [] | any>
    component_config: Record<string, string | number>
    background_config: Record<string, string | number | []>
    header_config: Record<string, string | number | []>
    sub_header_config: Record<string, string | number | []>
    footer_config: Record<string, string | number | []>
    extra_info: Record<string, string | number | [] | any>
    is_section_clickable: boolean
    last_updated_by: string
    created_at: string
    updated_at: string
    division_select?: string
}

export interface pageSettingsResponseType {
    status: string
    data: {
        count: number
        results: pageSettingsType[]
    }
}

export interface pageNameTypes {
    id: number
    name: string
    display_name: string
    extra_attributes: Record<string, string | number>
    create_date: string
    update_date: string
    last_updated_by: string
}
export interface pageNamesResponseType {
    status: string
    data: {
        count: number
        results: pageNameTypes[]
    }
}

export interface subPageResponseTypes {
    status: string
    data: pageNameTypes[]
}

export interface mainPageSettings {
    id: number
    page: string
    sub_page: string
    section: {
        id: number
        section_heading: string
        display_name: string
        is_active: boolean
    }
    store: {
        id: number
        code: string
        name: string
        is_fulfillment_center: boolean
    }[]
    last_updated_by: {
        name: string
        mobile: string
        email: string
    }
    is_active: boolean
    position: number
    create_date: string
    update_date: string
}

export interface mainPageSettingsResponseTypes {
    status: string
    data: {
        count: number
        results: mainPageSettings[]
    }
}
