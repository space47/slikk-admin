export const DocumentArray = [
    {
        label: 'Document Number',
        name: 'document_number',
        type: 'text',
    },
    {
        label: 'Date',
        name: 'document_date',
        type: 'Date',
    },
]

export const Addresses = [
    {
        label: 'Received By Name',
        name: 'received_by.name',
        type: 'text',
    },
    {
        label: 'Received By Mobile',
        name: 'received_by.mobile',
        type: 'text',
    },
    {
        label: 'Total SKUs',
        name: 'total_sku',
        type: 'number',
    },
    {
        label: 'Total Quantity',
        name: 'total_quantity',
        type: 'number',
    },
]

export const receiveAddress = [
    {
        label: 'Supplier Address',
        name: 'origin_address',
        type: 'text',
    },
    {
        label: 'Receiver Address',
        name: 'received_address',
        type: 'text',
    },
]

type ReceivedBy = {
    name: string
    email: string
    mobile: string
}

export type FormModel = {
    id?: number
    select: string
    create_date: string | null
    singleCheckbox: boolean | false
    files: File[]
    file_type: string
    document_number: string
    company?: number
    received_by: ReceivedBy
    document_date: Date | string
    origin_address: string
    received_address: string
    slikk_owned: boolean
    total_sku: number | null
    total_quantity: number | null
    document: string
    images: string
    image: File[]
}
