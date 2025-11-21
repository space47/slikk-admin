export type Product = {
    account_holder_name: string
    account_number: string
    address: string
    alternate_contact_number: string
    bank_name: string
    cin: string
    contact_number: string
    create_date: string
    damages_per_sku: number
    gstin: string
    handling_charges_per_order: number
    id: number
    ifsc: string
    is_active: boolean
    name: string
    poc: string
    poc_email: string
    registered_name: string
    removal_fee_per_sku: number
    revenue_share: number
    segment: string
    settlement_days: number
    update_date: string
    warehouse_charge_per_sku: number
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

export type SellerFormTypes = {
    account_holder_name: string
    account_number: string
    address: string
    alternate_contact_number: string
    bank_name: string
    cin: string
    contact_number: string
    create_date: string
    damages_per_sku: number
    gstin: string
    handling_charges_per_order: number
    id: number
    ifsc: string
    is_active: boolean
    confirm: string
    name: string
    poc: string
    poc_email: string
    registered_name: string
    removal_fee_per_sku: number
    revenue_share: number
    segment: string
    settlement_days: number
    update_date: string
    warehouse_charge_per_sku: number
    code?: string
}

export const SellerSteps = [
    'Basic Information',
    'Business Details',
    'POC-(Vendor)',
    'Bank Details',
    'Warehouse & GST',
    'MSME Details',
    'Commercials',
    'POC-(Slikk Internal)',
    'Docs and Declaration',
]
