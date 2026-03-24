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

    create_date: string
    update_date: string

    company: number
    brand: number | null
    store: number
    source_store: number

    gdn: number | null

    received_by: string | null
    last_updated_by: string | null

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
