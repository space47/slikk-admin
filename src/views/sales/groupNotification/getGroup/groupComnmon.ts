type User = {
    first_name: string
    last_name: string
    email: string
    mobile: string
}

type Group = {
    id: number
    name: string
}

type CartRules = {
    status: string
    minimum_item_count: number
}

type OrderRule = {
    type: string
    value: {
        end?: string
        start?: string
        max?: number | string
        min?: number | string
        max_amount?: number | string
        min_amount?: number | string
        max_order_count?: number
        min_order_count?: number
    }
}

type LocationRule = {
    type: string
    value: string
}

type UserInfoRule = {
    type: string
    value: {
        end?: string
        start?: string
        gender?: string[]
    }
}

type OrderItemRule = {
    type: string
    value: {
        max: number
        min: number
        filters?: string[]
    }
}

type LoyaltyRule = {
    type: string
    value: string
}

type Rules = {
    cart?: CartRules | CartRules[]
    order?: OrderRule[]
    location?: LocationRule[]
    userInfo?: UserInfoRule[]
    order_item?: OrderItemRule[]
    loyalty?: LoyaltyRule[]
}

type Result = {
    id: number
    user: User[]
    group: Group[]
    name: string
    rules: Rules
    create_date: string
    update_date: string
}

export type ResultsData = {
    results: Result[]
}

export const pageSizeOptions = [
    { value: 10, label: '10 / page' },
    { value: 25, label: '25 / page' },
    { value: 50, label: '50 / page' },
    { value: 100, label: '100 / page' },
]
