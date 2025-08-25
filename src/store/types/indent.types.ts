export interface IndentParamsTypes {
    from?: string
    to?: string
    mobile?: string
    page?: number
    pageSize?: number
    store_id?: string | number
    source_type?: string
}

export interface IndentResultType {
    id: string
}

export interface IndentResponseTypes {
    data: {
        count: number
        results: IndentResultType[]
    }
    success: string
}

export interface IndentItem {
    intent_note: number
    sku: string
    company: number
    quantity_required: number
    quantity_accepted: number
    notes: string | null
}

export interface Store {
    id: number
    code: string
    name: string
    is_fulfillment_center: boolean
}

export interface IndentDetailsTypes {
    id: number
    intent_number: string
    source_company: number | null
    source_store: Store
    target_store: Store
    status: string
    notes: string
    items: IndentItem[]
}

export interface IndentDetailsResponseTypes {
    data: IndentDetailsTypes
    success: string
}
