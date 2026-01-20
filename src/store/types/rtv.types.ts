import { ApiResponse } from './generic.types'

/* eslint-disable @typescript-eslint/no-explicit-any */
export type Rtv_Data = {
    id: number
    rtv_number: string | null
    document_number: string
    destination_address: string | null
    origin_address: string | null
    document_date: string
    total_sku: number
    total_quantity: number
    rtv_document: string | null
    create_date: string
    update_date: string
    company: number
    store: number
    last_updated_by: string
    quantity_picked: number
    status: string
}

export type RTV_DATA_DETAILS = {
    id: number
    rtv_number: string | null
    document_number: string
    destination_address: string | null
    origin_address: string | null
    document_date: string
    total_sku: number
    total_quantity: number
    rtv_document: string | null
    create_date: string
    update_date: string
    company: {
        code: string
        id: number
        is_active: boolean
        name: string
    }
    store: {
        code: string
        id: number
        is_fulfillment_center: boolean
        name: string
    }
    last_updated_by: string
    quantity_picked: number
    status?: string
}

export type Rtv_Data_Response = ApiResponse<Rtv_Data>

export type Rtv_Products = {
    id: number
    sku: string
    quantity_required: number
    quantity_accepted: number
    synced_to_inventory: boolean
    synced_quantity: number
    images: string
    inventory_locations: string
    is_picked: boolean
    box_locations: any
    locations: string
    create_date: string
    update_date: string
    rtv: {
        document_number: string
        id: number
        rtv_number: string
    }
    company: number
    picker: string
    last_updated_by: string
}

export type Rtv_Products_Response = {
    status: string
    data: {
        count: number
        results: Rtv_Products[]
    }
}

export type Rtv_Get_Params = {
    page?: number
    pageSize?: number
    rtv_number?: number
    from?: string
    to?: string
    rtv_id?: string | number
    store_id?: number
}

export type Rtv_Product_Params = {
    page?: number
    pageSize?: number
    is_picked?: string
    rtv_number?: string
    rtv_id?: string
    sku?: string
}

export type Rtv_status_request = {
    rtv_id: string | number
    data: Record<string, string>
}
