export type InventoryTransferTypes = {
    id: number
    document_number: string
    store: number
    store_name: string
    transfer_type: string | null
    transfer_date: string | null
    requested_by: string | null
    approved_by: string | null
    total_sku_count: number
    inventory_sync_errors: Record<string, unknown>
    created_at: string
    updated_at: string
    destination_store_name: string
    destination_store: number
}

export type Option = {
    value: number
    label: string
}
