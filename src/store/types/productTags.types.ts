export interface TagsDataTypes {
    is_tag: boolean
    tag_name: string
    is_filter: boolean
    filter_name: string
    display_name: string
    filter_position: number
    is_update_field: boolean
    file_header_name: string
    product_field_name: string
}

export type ProductTagsDataTypes = {
    [key: string]: TagsDataTypes
}
