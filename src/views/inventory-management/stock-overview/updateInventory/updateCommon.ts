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

export const UpdateCartArray = [
    {
        name: 'barcodes',
        label: 'Barcode',
        type: 'text',
        Placeholder: 'Enter Barcode',
    },
    {
        name: 'update_quantity',
        label: 'Update Quantity',
        type: 'checkbox',
        Placeholder: 'Enter Quantity',
    },
]
