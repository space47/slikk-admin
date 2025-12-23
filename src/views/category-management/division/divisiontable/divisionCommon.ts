export interface DataItem {
    id: number
    name: string
    description: string
    image: string
    footer: string
    quick_filter_tags: string
    seo_tags: string
    position: number
    is_active: boolean
    create_date: string
    update_date: string
    last_updated_by: string
}
export type DivisionFormModel = {
    id: number | undefined
    name: string | undefined
    division: number | undefined
    title: string | undefined
    description: string | undefined
    image: string | undefined
    footer: string | undefined
    quick_filter_tags: string | undefined
    position: number | undefined
    gender: string | undefined
    is_active: boolean | undefined
    create_date: string | undefined
    update_date: string | undefined
    is_try_and_buy: boolean | undefined
    last_updated_by: string | undefined
    image_array: File[]
}
