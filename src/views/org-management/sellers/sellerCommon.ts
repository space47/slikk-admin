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
export const SellerStepsAdd = [
    'Business Details',
    'POC-(Vendor)',
    'Bank Details',
    'Warehouse & GST',
    'MSME Details',
    'Docs and Declaration',
]

export enum SellerKeys {
    ID = 'id',
    CODE = 'code',
    NAME = 'name',
    REGISTERED_NAME = 'registered_name',
    CIN = 'cin',
    SEGMENT = 'segment',
    STATUS = 'status',
    IS_ACTIVE = 'is_active',
    IS_MSME = 'is_msme',

    ADDRESS = 'address',

    CONTACT_NUMBER = 'contact_number',
    ALTERNATE_CONTACT_NUMBER = 'alternate_contact_number',

    POC = 'poc',
    POC_EMAIL = 'poc_email',
    HEAD_NAME = 'head_name',
    HEAD_EMAIL = 'head_email',
    HEAD_CONTACT = 'head_contact',

    INT_POC_NAME = 'int_poc_name',
    INT_POC_EMAIL = 'int_poc_email',
    INT_POC_CONTACT = 'int_poc_contact',

    FINANCE_NAME = 'finance_name',
    FINANCE_EMAIL = 'finance_email',
    FINANCE_CONTACT_NUMBER = 'finance_contact_number',

    INT_FINANCE_NAME = 'int_finance_name',
    INT_FINANCE_EMAIL = 'int_finance_email',
    INT_FINANCE_CONTACT_NUMBER = 'int_finance_contact_number',

    BANK_NAME = 'bank_name',
    BRANCH_NAME = 'branch_name',
    ACCOUNT_HOLDER_NAME = 'account_holder_name',
    ACCOUNT_NUMBER = 'account_number',
    ACCOUNT_TYPE = 'account_type',
    IFSC = 'ifsc',
    CANCELLED_CHEQUE = 'cancelled_cheque',

    GSTIN = 'gstin',
    GST_DETAILS = 'gst_details',
    GST_CERTIFICATE = 'gst_certificate',

    PAN_NUMBER = 'pan_number',
    PAN_COPY = 'pan_copy',

    TAN_NUMBER = 'tan_number',
    TAN_COPY = 'tan_copy',

    MSME_CATEGORY = 'msme_category',
    MSME_CERTIFICATE = 'msme_certificate',

    TRADE_MARK_CERTIFICATE = 'trade_mark_certificate',

    APPROVED_ONBOARDING_DOC = 'approved_onboarding_doc',
    APPROVED_PAYMENT_TERM = 'approved_payment_term',
    COMMERCIAL_APPROVAL_DOC = 'commercial_approval_doc',

    DECLARATION_STATEMENT = 'declaration_statement',
    DECLARATION_TIMESTAMP = 'declaration_timestamp',
    PF_DECLARATION = 'pf_declaration',
    PF_DECLARATION_DOC = 'pf_declaration_doc',

    BUSINESS_NATURE = 'business_nature',
    BUSINESS_NATURE_COMPANY = 'business_nature_company',
    AUTHORIZED_PERSON = 'authorized_person',
    SP_TYPE = 'sp_type',
    PROVISIONAL_DISCOUNT = 'provisional_discount',
    COMMENTS = 'comments',

    DAMAGES_PER_SKU = 'damages_per_sku',
    HANDLING_CHARGES_PER_ORDER = 'handling_charges_per_order',
    REMOVAL_FEE_PER_SKU = 'removal_fee_per_sku',
    WAREHOUSE_CHARGE_PER_SKU = 'warehouse_charge_per_sku',
    REVENUE_SHARE = 'revenue_share',

    CREATE_DATE = 'create_date',
    UPDATE_DATE = 'update_date',
}
