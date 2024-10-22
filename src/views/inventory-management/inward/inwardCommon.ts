export type TableData = {
    id: number
    company: number
    create_date: string
    document_url: string
    document_date: string
    document_number: string
    images: string
    last_updated_by: {
        name: string
        mobile: string
    }
    received_address: string
    received_by: {
        name: string
        mobile: string
    }
    slikk_owned: boolean
    store: number
    total_quantity: number
    total_sku: number
    update_date: string
    grn_number: string
    action: React.ReactNode
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
