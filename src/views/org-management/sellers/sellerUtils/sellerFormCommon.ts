export const BasicSellerInformation = [
    { label: 'Vendor Business Name', name: 'registered_name', type: 'text', isRequired: true, visible: true },
    { label: 'Company Name', name: 'name', type: 'text', isRequired: true, visible: true },
    { label: 'Contact Person Name', name: 'head_name', type: 'text', isRequired: false, visible: true },
    { label: 'Vendor Code', name: 'vendor_code', type: 'text', isRequired: true, visible: true },
    { label: 'Email Address', name: 'head_email', type: 'text', isRequired: false, visible: true },
    { label: 'Phone Number', name: 'head_number', type: 'number', isRequired: false, visible: true },
]
export const BusinessDetails = [
    { label: 'PAN Number', name: 'pan_number', type: 'text', isRequired: true, visible: true },
    { label: 'TAN Number', name: 'tan_number', type: 'text', isRequired: false, visible: true },
    { label: 'CIN', name: 'cin', type: 'text', isRequired: false, visible: true },
    { label: 'Sole Proprietorship Type', name: 'sp_type', type: 'text', isRequired: false, visible: true },
    { label: 'Pf Declaration', name: 'sp_type', type: 'checkbox', isRequired: false, visible: true },
]
export const PocDetails = [
    { label: 'Vendor POC', name: 'poc', type: 'text', isRequired: false, visible: true },
    { label: 'Vendor POC Email', name: 'poc_email', type: 'text', isRequired: false, visible: true },
    { label: 'Vendor POC Contact', name: 'contact_number', type: 'number', isRequired: false, visible: true },
    { label: 'Vendor POC Alternate Number', name: 'alternate_contact_number', type: 'number', isRequired: false, visible: true },
    { label: 'Finance Contact Name', name: 'finance_name', type: 'text', isRequired: false, visible: true },
    { label: 'Finance Contact Number', name: 'finance_contact_number', type: 'text', isRequired: false, visible: true },
    { label: 'Finance Email', name: 'finance_email', type: 'text', isRequired: false, visible: true },
]

export const SellerBankData = [
    { label: 'Bank Name', name: 'bank_name', type: 'text', isRequired: false, visible: true },
    { label: 'Branch Name', name: 'branch_name', type: 'text', isRequired: false, visible: true },
    { label: 'Account Holder Name', name: 'account_holder_name', type: 'text', isRequired: false, visible: true },
    { label: 'Account Number', name: 'account_number', type: 'number', isRequired: false, visible: true },
    { label: 'IFSC Code', name: 'ifsc', type: 'text', isRequired: true, visible: false },
    { label: 'Account Type', name: 'account_type', type: 'text', isRequired: false, visible: true },
]

export const SellerWarehouseArray = [
    { label: 'Warehouse Name', name: 'warehouse_name', type: 'text', isRequired: true, visible: true },
    { label: 'GSTIN', name: 'gstin', type: 'text', isRequired: true, visible: true },
    { label: 'WareHouse Active', name: 'is_active', type: 'checkbox', isRequired: true, visible: true },
]
export const SellerMsMeArray = [{ label: 'Is Registered Under MsMe', name: 'is_msme', type: 'checkbox', isRequired: true, visible: true }]
export const SellerCommercialsArray = [
    { label: 'Revenue Share Percent', name: 'revenue_share', type: 'text', isRequired: true, visible: true },
    { label: 'Handling Charges Per Sku', name: 'handling_charges_per_sku', type: 'text', isRequired: true, visible: true },
    { label: 'Warehouse Charges Per Sku', name: 'warehouse_charges_per_sku', type: 'text', isRequired: true, visible: true },
    { label: 'Damages Per Sku', name: 'damages_charges_per_sku', type: 'text', isRequired: true, visible: true },
    { label: 'Removal Fee Per Sku', name: 'removal_fee_per_sku', type: 'text', isRequired: true, visible: true },
    { label: 'Nature of Business', name: 'business_nature', type: 'text', isRequired: true, visible: true },
    { label: 'Settlement Days', name: 'settlement_days', type: 'text', isRequired: true, visible: true },
    { label: 'Approved Payment Terms', name: 'approved_payment_term', type: 'text', isRequired: true, visible: true },
]

export const SellerInternalArray = [
    { label: 'Slikk POC -Category Name', name: 'int_poc_name', type: 'text', isRequired: true, visible: true },
    { label: 'Slikk POC -Category Email', name: 'int_poc_email', type: 'text', isRequired: true, visible: true },
    { label: 'Slikk POC -Category Number', name: 'int_poc_number', type: 'text', isRequired: true, visible: true },
]
export const SellerDeclarationArray = [
    { label: 'Authorized Person', name: 'authorized_person', type: 'text', isRequired: true, visible: true },
    { label: 'Declaration Statement', name: 'declaration_statement', type: 'text', isRequired: true, visible: true },
]

export const MSMEOptions = () => {
    return ['small', 'medium', 'large'].map((msme) => ({
        label: msme,
        value: msme,
    }))
}
