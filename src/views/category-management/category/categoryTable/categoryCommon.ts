export interface categoryItem {
    id: number
    name: string
    division: number
    division_name: string
    title: string
    description: string
    image: string
    footer: string
    quick_filter_tags: string
    position: number
    gender: string
    is_active: boolean
    create_date: string
    update_date: string
    is_try_and_buy: boolean
    last_updated_by: string
}

export type Option = {
    value: number
    label: string
}
export const pageSizeOptions = [
    { value: 10, label: '10 / page' },
    { value: 25, label: '25 / page' },
    { value: 50, label: '50 / page' },
    { value: 100, label: '100 / page' },
]
