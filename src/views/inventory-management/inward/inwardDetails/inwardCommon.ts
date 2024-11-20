export type GRN_QUALITY_CHECK = {
    batch_number: string
    create_date: string
    grn: number
    id: number
    images: string
    last_updated_by: {
        email: string
        mobile: string
        name: string
    }
    qc_done_by: {
        email: string
        mobile: string
        name: string
    }
    qc_failed: number
    qc_passed: number
    quantity_received: number
    quantity_sent: number
    sent_to_inventory: boolean
    sku: string
    update_date: Date
}

export type inwardDetailsResponse = {
    company: number
    document_number: string
    grn_number: string
    last_updated_by: {
        name: string
        email: string
        mobile: string
    }

    total_sku: number
    origin_address: string
    received_address: string
    received_by: {
        email: string
        mobile: string
        name: string
    }
    document_date: string
    document_url: string
    total_quantity: number
    grn_quality_check: GRN_QUALITY_CHECK[]
}
