import { ApiResponse } from './generic.types'

export type GRNDetails = {
    id: number
    company: number
    store: number
    grn_number: string
    document_number: string
    create_date: string
    update_date: string
    document_date: string
    origin_address: string
    received_address: string
    total_quantity: number
    qc_passed_quantity: number
    synced_quantity: number
    total_sku: number
    slikk_owned: boolean
    images: string
    document: string | null
    document_url: string | null
    grn_qc_document: string | null
    gtn: string | null
    shipment: number | null
    received_by: {
        name: string
        mobile: string
        email: string
    }
    last_updated_by: {
        name: string
        mobile: string
        email: string
    }
    gdn_number: string
    gdn_id: number
    indent_id: number
    indent_number: string
}

export type InwardParamType = {
    id: number
    search_type: string
    search_value: string
    company: string
    store_id: string
    page: number
    pageSize: number
}

export type GrnResponseType = ApiResponse<GRNDetails>

export type UserInfo = {
    name: string
    mobile: string
    email: string
}
export type GRNItemDetails = {
    id: number
    grn: number

    batch_number: string
    sku: string
    name: string
    size: string
    location: string

    quantity_sent: number
    quantity_received: number
    qc_passed: number
    qc_failed: number
    synced_quantity: number

    sent_to_inventory: boolean

    create_date: string
    update_date: string

    company: number | null
    cost_price: number | null
    images: string[] | null
    shipment_item: number | null
    qc_number: string | null

    inventory_sync_error: unknown[]

    qc_done_by: UserInfo
    last_updated_by: UserInfo
}

export type GrnItemsResponseType = ApiResponse<GRNItemDetails>
