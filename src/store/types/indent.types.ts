import { ApiResponse } from './generic.types'

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IndentParamsTypes {
    from?: string
    to?: string
    mobile?: string
    page?: number
    pageSize?: number
    store_id?: string | number
    source_type?: string
    status: string
    document_id?: string
}

export interface IndentResultType {
    id: number
    intent_number: string
    status: string
    source_store: number
    target_store: number
    create_date: string
    update_date: string
    notes: string | null
    document_id: number | null
    gdn_number: string | null
    grn_number: string | null
    shipment_id: string | null
    source_company: number | null
}

export type IndentResponseTypes = ApiResponse<IndentResultType>

export interface IndentItem {
    intent_note: number
    sku: string
    company: number
    quantity_required: number
    quantity_accepted: number
    notes: string | null
    is_picked: boolean
    box_mapping: Record<string, any>
}

export interface Store {
    id: number
    code: string
    name: string
    is_fulfillment_center: boolean
}

export interface IndentPickerItem {
    picker: string
    total_accepted: number
    total_required: number
}

export interface IndentDetailsTypes {
    id: number
    intent_number: string
    source_company: number | null
    source_store: Store
    target_store: Store
    status: string
    notes: string
    // items: IndentItem[]
    picker_items: IndentPickerItem[]
    total_items: number
    items_picked: number
}

export interface IndentDetailsResponseTypes {
    data: IndentDetailsTypes
    success: string
}

export interface IndentItemsResponseType {
    status: string
    data: {
        count: number
        results: IndentItem[]
    }
}
