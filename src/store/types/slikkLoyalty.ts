type TierUpgradeCondition = {
    type: 'order_count' | 'revenue' | string
    value: number
    duration: 'lifetime' | 'monthly' | 'yearly' | string
}

type TierUpgradeOffer = {
    type: 'percent_off' | 'amount_off' | string
    value: number
    max_discount: number | null
    min_discount: number | null
    max_order_value: number | null
    min_order_value: number
}

export type TierData = {
    id: number
    name: string
    tier_upgrade_condition: TierUpgradeCondition
    description: string | null
    discount: number
    max_discount: number
    max_yearly_discount: number
    benefits: string | null
    tier_upgrade_offer: TierUpgradeOffer[]
    level: number
    create_date: string
    update_date: string
}

export type LoyaltyType = {
    loyalty: TierData[]
    page: number
    pageSize: number
    loading: boolean
    message: string
}
