type User = {
    name: string
    email: string
    mobile: string
}

export type TableData = {
    comments: string
    company: number
    create_date: string
    error_file: string
    failure: number
    id: number
    success: number
    upload_type: string
    uploaded_file: string
    user: User
}

export type Option = {
    value: number
    label: string
}

export const pageSizeOptions = [
    { value: 10, label: '10 / page' },
    { value: 25, label: '25 / page' },
    { value: 50, label: '50 / page' },
    { value: 100, label: '100 / page' },
]

export const SingleUploadArray = [
    { label: 'Document Number', type: 'text', name: 'document_number' },
    { label: 'SKU', type: 'text', name: 'sku' },
    { label: 'Barcode', type: 'text', name: 'barcode' },
    { label: 'Quantity Sent', type: 'number', name: 'quantity_sent' },
    { label: 'Quantity Received', type: 'number', name: 'quantity_received' },
    { label: 'QC Passed', type: 'number', name: 'qc_passed' },
    { label: 'QC Failed', type: 'number', name: 'qc_failed' },
    { label: 'Batch Number', type: 'text', name: 'batch_number' },
    { label: 'QC Done By', type: 'text', name: 'qc_done_by' },
    { label: 'Sent to Inventory', type: 'checkbox', name: 'sent_to_inventory' },
]
