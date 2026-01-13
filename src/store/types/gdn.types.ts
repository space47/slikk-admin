type UserInfo = {
    name: string
    mobile: string
    email: string
}

export type GDNDetails = {
    id: number
    gdn_number: string
    company: number
    store: number
    destination_store: number | null
    name: string
    email: string
    mobile: string
    dispatched_by: UserInfo
    last_updated_by: UserInfo
    origin_address: string
    delivery_address: string
    received_address: string | null
    document_number: string
    document: string
    document_url: string
    document_date: string
    gdn_dispatch_document: string | null
    images: string
    box_count: number
    box_details: Record<string, unknown>
    total_quantity: number
    total_sku: number
    indent_note: string | null
    rtv: unknown | null
    create_date: string
    update_date: string
    shipment_id: string | number
    indent_number: string
    indent_id: number
}

export type GdnParamType = {
    page: number
    pageSize: number
    company: string
    store_id: string | number
}

export type CreateShipmentDetails = {
    id: number
    shipment_id: string

    upload_count: number
    catalogue_found: number

    name: string | null

    origin_address: string
    delivery_address: string

    awb_number: string | null
    dispatch_date: string | null
    delivery_date: string | null

    document: string | null
    dispatched_by: string | null

    box_count: number
    box_details: Record<string, unknown>

    items_count: number | null

    order: number | null
    gdn: number

    company: number
    brand: number | null

    store: number | null
    source_store: number

    received_by: string | null
    last_updated_by: string | null

    create_date: string
    update_date: string
}

export type GdnProducts = {
    sku?: number
    quantity_sent?: number
    quantity_received?: number
    term_completion_count?: number
    batch_number?: string
    synced_to_inventory?: boolean
    create_date?: string
    update_date?: string
}

export type GdnProductsResponseType = {
    data: {
        count: number
        results: GdnProducts[]
    }
    status: string
}

export type UpdateGdnArgs = {
    id: number
    data: Record<string, string | number>
}

export type GdnResponseType = {
    data: {
        count: number
        results: GDNDetails[]
    }
    status: string
}
