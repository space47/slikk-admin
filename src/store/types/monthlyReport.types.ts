interface RepeatUsers {
    count: number
    users: string[]
}

interface DeliveryType {
    EXPRESS: number
    STANDARD: number
    TRY_AND_BUY: number
}

interface OrderByDate {
    create_at_date: string
    total: number
}

interface UserRepeatFromLastMonth {
    total: number
    users: string[]
}

export interface TransactionsData {
    total_completed_transactions: number
    total_transactions: number
    AOV: number
    ABS: number
    unique_users: number
    repeat_users: RepeatUsers
    user_with_2_orders: RepeatUsers
    user_with_2to4_orders: RepeatUsers
    user_with_5_orders: RepeatUsers
    delivery_type: DeliveryType
    order_by_date: OrderByDate[]
    return_count: number
    user_repeat_from_last_month: UserRepeatFromLastMonth
}

export interface MONTHLYREPORTTYPES {
    monthlyReport: TransactionsData | null
    from: any
    to: any
    loading: boolean
    message: string
}
