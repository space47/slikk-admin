export interface GDN_TYPES {
    id: number
    document_number: string
    company: number
    document_url: string
    images: string
    origin_address: string
    received_address: string | null
    document_date: string
    total_sku: number
    total_quantity: number
    dispatched_by: string | null
    last_updated_by: string | null
    gdn_number: string
    document: string
    delivery_address: string
    create_date: string
    update_date: string
    store: number
}

export const receiveAddress = [
    { label: 'Origin Address', type: 'text', name: 'origin_address' },
    { label: 'Delivery Address', type: 'text', name: 'delivery_address' },
]

export const DocumentArrayGDN = [
    { label: 'Document Number', type: 'text', name: 'document_number' },
    { label: 'Dispatched By', type: 'text', name: 'dispatched_by' },
    { label: 'Total Sku', type: 'number', name: 'total_sku' },
    { label: 'Total Quantity', type: 'number', name: 'total_quantity' },
    { label: 'Origin Address', type: 'text', name: 'origin_address' },
    { label: 'Delivery Address', type: 'text', name: 'delivery_address' },
]
