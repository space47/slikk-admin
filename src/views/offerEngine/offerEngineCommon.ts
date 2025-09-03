export type OfferTypes = {
    id?: number
    name?: string
    description?: string
    store?: number
    upto_off?: number
    days?: string
    slab?: number
    apply_offer_type?: string
    apply_price_type?: string
    offer_type?: string
    offer_value?: number
    offer_id?: string
    code?: string
    quantity_x?: string
    offer_item_type_x?: string
    offer_type_y?: string
    offer_value_y?: string
    start_date?: string
    end_date?: string
    quantity_y?: string
    min_quantity?: number
    min_amount?: string
    offer_item_type_y?: string
    create_date?: string // ISO date string
    update_date?: string // ISO date string
    last_updated_by?: string
}

export type OfferFormTypes = {
    id?: number
    store_ids?: string
    slab_id?: number
    offer_name?: string
    discount_type?: 'PERCENTAGE' | 'FLAT' | string // you can refine allowed values
    discount_value?: number
    min_purchase_amount?: number
    max_discount_amount?: number
    start_date?: string // ISO DateTime
    end_date?: string // ISO DateTime
    is_active?: boolean
    created_at?: string // ISO DateTime
    updated_at?: string // ISO DateTime
    min_order_quantity?: number | null
    max_order_quantity?: number | null
    is_multi_unit_eligible?: boolean
    set_size?: number
    max_sets?: number
    buy_quantity?: number
    buy_filter_id?: number
    get_quantity?: number
    get_filter_id?: number
    get_reward_type?: 'FREE' | 'DISCOUNT' | string
    get_reward_value?: number
    daily_time_windows?: {
        start?: string // HH?:mm?:ss
        end?: string // HH:mm:ss
    }[]
}

export const offerFormArray = [
    {
        name: 'name',
        type: 'text',
        label: 'Name',
    },
    {
        name: 'description',
        type: 'text',
        label: 'Description',
    },

    {
        name: 'code',
        type: 'text',
        label: 'Code',
    },
    {
        name: 'upto_off',
        type: 'number',
        label: 'Max Discount (%)',
    },

    {
        name: 'offer_value',
        type: 'number',
        label: 'Offer Value',
    },
    // {
    //     name: 'quantity_x',
    //     type: 'number',
    //     label: 'Quantity X',
    // },
    {
        name: 'min_quantity',
        type: 'number',
        label: 'Minimum Quantity',
    },
    {
        name: 'min_amount',
        type: 'number',
        label: 'Minimum Amount',
    },
]
