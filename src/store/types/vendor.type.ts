export interface VendorList {
    id: number
    registered_name: string
    code: string
    name: string
    gstin: string
    segment: string
    cin: string
    address: string
    contact_number: string
    alternate_contact_number: string
    poc: string
    poc_email: string
    account_number: string
    account_holder_name: string
    ifsc: string
    bank_name: string
    is_active: boolean
    settlement_days: number
    revenue_share: number
    handling_charges_per_order: number
    warehouse_charge_per_sku: number
    damages_per_sku: number
    removal_fee_per_sku: number
    create_date: string
    update_date: string
}

export interface VendorResponseData {
    status: string
    data: {
        count: number
        results: VendorList[]
    }
}
