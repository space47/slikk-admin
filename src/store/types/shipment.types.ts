export interface ShipmentData {
    awb_number: string | null
    box_count: number
    box_details: Record<string, number>
    brand: string | null
    catalogue_found: number
    company: number
    create_date: string
    delivery_address: string
    delivery_date: string | null
    dispatch_date: string | null
    dispatched_by: string | null
    document: string | null
    gdn: number
    id: number
    child_shipment: ShipmentData[]
    items_count: number | null
    last_updated_by: string | null
    name: string | null
    origin_address: string
    received_by: string | null
    shipment_id: string | null
    source_store: number | null
    store: null
    update_date: string
    upload_count: number | null
    total_box_count: number
    total_quantity: number
    shipment_type?: string
}

export interface ShipmentResponse {
    status: string
    data: {
        count: number
        results: ShipmentData[]
    }
}

export interface ShipmentItems {
    barcode: string | null
    box_number: string | null
    catalog_available: boolean
    company: string | number
    create_date: string | null
    id: number
    last_updated_by: string | null
    quantity_received: number
    quantity_sent: number
    shipment: number
    sku: string | null
    update_date: string | null
}

export interface ShipmentItemsResponse {
    status: string
    data: {
        count: number
        results: ShipmentItems[]
    }
}

export interface ShipmentDownloadResponse {
    status: string
    data: string[]
}
