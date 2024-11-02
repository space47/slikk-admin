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

export type FormModel = {
    select: string
    date: Date | null
    time: Date | null
    singleCheckbox: boolean
    files: File[]
    file_type: string
    document_number: string
    company: number
    received_by: string
    document_date: Date | null
    origin_address: string
    received_address: string
    slikk_owned: boolean
    total_sku: number | null
    total_quantity: number | null
    document: string
    images: string
    image: File[]
}

export const initialValue: FormModel = {
    select: '',
    date: null,
    time: null,
    singleCheckbox: false,
    file_type: '',
    document_number: '',
    company: 1,
    files: [],
    received_by: '',
    document_date: null,
    origin_address: '',
    received_address: '',
    slikk_owned: false,
    total_sku: null,
    total_quantity: null,
    document: '',
    images: '',
    image: [],
}
