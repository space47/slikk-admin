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

export const ProductFilterArray = [
    { label: 'SKU', value: 'sku' },
    { label: 'Barcode', value: 'barcode' },
    { label: 'Name', value: 'name' },
]

export type Product = {
    id: number
    name: string
    sku: string
    barcode: string
    brand_name: string
    color: string
    image: string
    size: string
    variant_id: string
}

export type InventoryItemType = {
    id: number
    batch_number: string | null
    create_date: string
    expiry_date: string | null
    gdn: string | null
    grn: string | null
    is_active: boolean
    last_updated_by: string
    location: string
    offer_is_active: boolean
    product: Product
    quantity: number
    quantity_ordered: number
    quantity_received: number
    quantity_returned: number
    quantity_sold: number
    show_out_of_stock: boolean
    store: number
    update_date: string
}

export interface ShipmentItem {
    id: string
    barcode: string
    sku: string
    catalog_available?: string
    boxCount?: number
    quantity_sent: number
    quantity_received: number
    create_date: string
}

export const InwardDetailSearchOptions = [
    { label: 'Sku', value: 'sku' },
    { label: 'Barcode', value: 'barcode' },
]
export const InwardFilterSearch = [
    { label: 'Grn Number', value: 'grn_number_search' },
    { label: 'Document Number', value: 'document_number' },
]
