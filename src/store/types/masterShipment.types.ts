/* eslint-disable @typescript-eslint/no-explicit-any */
export type ShipmentType = 'MASTER_SHIPMENT' | 'CHILD_SHIPMENT'

export interface BaseShipment {
    id: number
    shipment_id: string
    name: string | null
    origin_address: string
    delivery_address: string
    shipment_type: ShipmentType
}

export interface Shipment extends BaseShipment {
    upload_count: number
    total_quantity: number
    total_box_count: number
    catalogue_found: number

    child_shipment: Shipment[]

    awb_number: string | null
    dispatch_date: string | null
    delivery_date: string | null
    document: string | null
    dispatched_by: string | null

    box_count: number
    box_details: Record<string, any>
    items_count: number | null

    shipment_documents: any | null
    delivery_chalan: string
    create_date: string
    update_date: string
    awb_url: string
    company: number
    brand: number | null
    store: number
    source_store: number
    invoice_url: string
    gdn: number | null
    invoice_number?: string | number
    received_by: string | null
    last_updated_by: string | null
    total_invoice_value?: number
    parent_shipment: number | null
}

export interface MasterShipmentResponseType {
    status: string
    data: {
        count: number
        next: boolean
        results: Shipment[]
    }
}

export interface ShipmentPickup {
    quantity: number
    sku: string
    shipment_id: number
    company_id: number
    drop_box: string
}

export interface ShipmentLineItems {
    id: number
    sku: string
    barcode: string
    quantity_sent: number
    quantity_received: number
    catalog_available: boolean
    create_date: string
    update_date: string
    shipment: number
    last_updated_by: string
    box_number: Record<string, string | number>
    company: number
    company_name: string
}

export interface ShipmentLineItemsResponse {
    status: string
    data: {
        count: number
        next: boolean
        results: ShipmentLineItems[]
    }
}
