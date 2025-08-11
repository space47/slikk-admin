export type GetQualityCheckListResultTypes = {
    id: number
    last_updated_by: {
        name: string
        mobile: string
        email: string
    }
    qc_done_by: {
        name: string
        mobile: string
        email: string
    }
    name: string
    size: string
    qc_number: string | null
    sku: string
    quantity_sent: number
    quantity_received: number
    images: string[] | null
    qc_passed: number
    qc_failed: number
    batch_number: string | null
    sent_to_inventory: boolean
    synced_quantity: number
    inventory_sync_error: string[]
    location: string
    cost_price: number | null
    create_date: string
    update_date: string
    grn: number
    shipment_item: string | null
}

export type GetQualityCheckListResponse = {
    success: string
    data: {
        count: number
        results: GetQualityCheckListResultTypes[]
    }
}
