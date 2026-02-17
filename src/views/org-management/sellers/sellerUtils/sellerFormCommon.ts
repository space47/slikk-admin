export const BasicSellerInformation = [
    { label: 'Vendor Business Name', name: 'registered_name', type: 'text', isRequired: true, visible: true },
    { label: 'Company Name', name: 'name', type: 'text', isRequired: true, visible: true },
    { label: 'Contact Person Name', name: 'head_name', type: 'text', isRequired: true, visible: true },
    { label: 'Email Address', name: 'head_email', type: 'text', isRequired: true, visible: true },
    { label: 'Phone Number', name: 'head_contact', type: 'number', isRequired: true, visible: true, maxLength: 10 },
]
export const BusinessDetails = [
    { label: 'PAN Number', name: 'pan_number', type: 'text', isRequired: false, visible: true },
    { label: 'TAN Number', name: 'tan_number', type: 'text', isRequired: false, visible: true },
    { label: 'GSTIN', name: 'gstin', type: 'text', isRequired: false, visible: true },
    { label: 'CIN', name: 'cin', type: 'text', isRequired: false, visible: true },
    { label: 'Pf Declaration', name: 'pf_declaration', type: 'checkbox', isRequired: false, visible: true },
]
export const PocDetails = [
    { label: 'Vendor POC', name: 'poc', type: 'text', isRequired: true, visible: true },
    { label: 'Vendor POC Email', name: 'poc_email', type: 'text', isRequired: true, visible: true },
    { label: 'Vendor POC Contact', name: 'contact_number', type: 'number', isRequired: true, visible: true },
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
    { label: 'IFSC Code', name: 'ifsc', type: 'text', isRequired: false, visible: false },
]

export const SellerWarehouseArray = [
    { label: 'Warehouse Name', name: 'warehouse_name', type: 'text', isRequired: true, visible: true },
    { label: 'GSTIN', name: 'gstin', type: 'text', isRequired: true, visible: true },
    { label: 'WareHouse Active', name: 'is_active', type: 'checkbox', isRequired: true, visible: true },
]
export const SellerMsMeArray = [{ label: 'Is Registered Under MsMe', name: 'is_msme', type: 'checkbox', isRequired: false, visible: true }]
export const SellerCommercialsArray = [
    { label: 'Revenue Share Percent', name: 'revenue_share', type: 'number', isRequired: true, visible: true },
    { label: 'Handling Charges Per Sku', name: 'handling_charges_per_order', type: 'number', isRequired: true, visible: true },
    { label: 'Warehouse Charges Per Sku', name: 'warehouse_charge_per_sku', type: 'number', isRequired: true, visible: true },
    { label: 'Damages Per Sku', name: 'damages_per_sku', type: 'number', isRequired: true, visible: true },
    { label: 'Removal Fee Per Sku', name: 'removal_fee_per_sku', type: 'number', isRequired: true, visible: true },
    { label: 'Settlement Days', name: 'settlement_days', type: 'number', isRequired: true, visible: true },
    { label: 'Approved Payment Terms', name: 'approved_payment_term', type: 'text', isRequired: true, visible: true },
]

export const SellerInternalArray = [
    { label: 'Finance Name', name: 'int_ops_name', type: 'text', isRequired: true, visible: true },
    { label: 'Finance Email', name: 'int_ops_email', type: 'text', isRequired: true, visible: true },
    { label: 'Finance Number', name: 'int_ops_number', type: 'text', isRequired: true, visible: true },
]
export const SellerDeclarationArray = [
    { label: 'Authorized Person', name: 'authorized_person', type: 'text', isRequired: false, visible: true },
    { label: 'Declaration Statement', name: 'declaration_statement', type: 'text', isRequired: false, visible: true },
]

export const MSMEOptions = () => {
    return ['small', 'medium', 'large'].map((msme) => ({
        label: msme,
        value: msme,
    }))
}
export const SpOptions = () => {
    return ['Sole Proprietorship', 'Partnership Firm', 'Private Limited Company', 'Limited Liability', 'Other'].map((sp) => ({
        label: sp,
        value: sp,
    }))
}
export const NOBOptions = () => {
    return ['OR', 'SOR'].map((nob) => ({
        label: nob,
        value: nob,
    }))
}

export const AccountTypeOptions = () => {
    return ['Savings', 'Current', 'Other'].map((nob) => ({
        label: nob,
        value: nob,
    }))
}

export const simpleFields = [
    'registered_name',
    'is_active',
    'code',
    'head_name',
    'head_contact',
    'head_email',
    'gstin',
    'pan_number',
    'tan_number',
    'cin',
    'address',
    'contact_number',
    'alternate_contact_number',
    'poc_email',
    'poc',
    'finance_name',
    'finance_email',
    'finance_contact_number',
    'account_number',
    'account_holder_name',
    'ifsc',
    'bank_name',
    'branch_name',
    'account_type',
    'segment',
    'settlement_days',
    'revenue_share',
    'handling_charges_per_order',
    'warehouse_charge_per_sku',
    'damages_per_sku',
    'removal_fee_per_sku',
    'approved_payment_term',
    'business_nature',
    'sp_type',
    'pf_declaration',
    'is_msme',
    'msme_category',
    'authorized_person',
    'declaration_statement',
    'name',
]

export const fileFields = [
    'gst_certificate',
    'pan_copy',
    'tan_copy',
    'cancelled_cheque',
    'pf_declaration_doc',
    'trade_mark_certificate',
    'msme_certificate',
    'commercial_approval_doc',
    'approved_onboarding_doc',
]

export const FashionStyleOptions = [
    { label: 'Ethnic', value: 'ethnic' },
    { label: 'Accessories', value: 'accessories' },
    { label: 'Travel & Luggages', value: 'travel_luggages' },
    { label: 'Home & Living', value: 'home_living' },
    { label: 'Gift Set', value: 'gift_set' },
    { label: 'Western', value: 'western' },
    { label: 'Beauty', value: 'beauty' },
    { label: 'Footwear', value: 'footwear' },
]

export const CategoryNameOptions = [
    { label: 'Sachin', value: 'Sachin' },
    { label: 'Tanmoy', value: 'Tanmoy' },
]
export const CategoryMailOptions = [
    { label: 'sachin@slikk.club', value: 'sachin@slikk.club' },
    { label: 'tanmoy@slikk.club', value: 'tanmoy@slikk.club' },
]
export const CategoryNumberOptions = [
    { label: '7738384135', value: '7738384135' },
    { label: '9999461816', value: '9999461816' },
]
