export type Product = {
    id: number
    name: string
    sub_category_name: string
    title: string
    description: string
    image: string
    footer: string | null
    quick_filter_tags: string
    position: number
    gender: string
    is_active: boolean
    create_date: string
    update_date: string
    is_try_and_buy: boolean
    sub_category: number
    last_updated_by: string | null
}
