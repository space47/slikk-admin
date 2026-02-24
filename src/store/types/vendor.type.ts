/* eslint-disable @typescript-eslint/no-explicit-any */
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
    provisional_discount: number
    revenue_share: number
    handling_charges_per_order: number
    warehouse_charge_per_sku: number
    damages_per_sku: number
    removal_fee_per_sku: number
    create_date: string
    update_date: string
    gst_details: {
        id: number
        warehouse_address: string
        warehouse_name: string
        gstin: string
        gst_certificate: string
        poc_name: string
        poc_email: string
        poc_contact_number: string
        is_active: boolean
        create_date: string
        update_date: string
        company: number
    }[]
    status: string
    comments: string
}

export interface VendorDetails {
    account_holder_name: string
    account_number: string
    account_type: string
    address: string
    alternate_contact_number: string
    approved_onboarding_doc: string | null
    approved_payment_term: string
    authorized_person: string
    bank_name: string
    branch_name: string
    business_nature: string | null
    cancelled_cheque: string | null
    cin: string | null
    code: string
    comments: Record<string, string> | null
    commercial_approval_doc: string | null
    contact_number: string
    create_date: string
    damages_per_sku: number
    declaration_statement: string
    declaration_timestamp: string | null
    finance_contact_number: string
    finance_email: string
    finance_name: string
    gst_certificate: string | null
    gst_details: {
        id: number
        warehouse_address: string
        warehouse_name: string
        gstin: string
        gst_certificate: string
        poc_name: string
        poc_email: string
        poc_contact_number: string
        is_active: boolean
        create_date: string
        update_date: string
        company: number
    }[] // you can replace 'any' with a specific GST detail type if you know the structure
    gstin: string | null
    handling_charges_per_order: number
    head_contact: string | null
    head_email: string | null
    head_name: string | null
    id: number
    ifsc: string
    int_poc_contact: string
    int_poc_email: string
    int_poc_name: string
    is_active: boolean
    is_msme: boolean
    msme_category: string
    msme_certificate: string | null
    name: string
    pan_copy: string | null
    pan_number: string | null
    pf_declaration: string
    pf_declaration_doc: string | null
    poc: string
    poc_email: string
    registered_name: string
    removal_fee_per_sku: number
    revenue_share: number
    segment: string | null
    settlement_days: number
    sp_type: string
    status: string
    tan_copy: string | null
    tan_number: string | null
    trade_mark_certificate: string | null
    update_date: string
    warehouse_charge_per_sku: number
}

export interface VendorResponseData {
    status: string
    data: {
        count: number
        results: VendorList[]
    }
}

export interface BusinessNatureData {
    code: string
    gstin: string
    bill_to: string
    ship_to: string
    company_name: string
    company_legal_name: string
    registered_address: string
}

export interface TeamData {
    name: string
    email: string
    mobile: number
}

export interface ConfigValues {
    id: number
    name: string
    value: {
        OR: BusinessNatureData[]
        SOR: BusinessNatureData[]
        finance_team: TeamData[]
        category_team: Record<string, TeamData[]>
    }
    is_active: boolean
}
