import { SellerKeys } from '../sellerCommon'

export const BasicSellerInformation = [
    { label: 'Vendor Business Name (Trade Name)', name: SellerKeys.REGISTERED_NAME, type: 'text', isRequired: true, visible: true },
    { label: 'Company Code (Internal Identifier)', name: SellerKeys.CODE, type: 'text', isRequired: true, visible: true },
    { label: 'Registered Legal Name', name: SellerKeys.NAME, type: 'text', isRequired: true, visible: true },
    { label: 'Head Person Name', name: SellerKeys.HEAD_NAME, type: 'text', isRequired: true, visible: true },
    { label: 'Head Person Email Address', name: SellerKeys.HEAD_EMAIL, type: 'text', isRequired: true, visible: true },
    { label: 'Head Person Phone Number', name: SellerKeys.HEAD_CONTACT, type: 'number', isRequired: true, visible: true, maxLength: 10 },
]

export const BasicExtra = [
    { label: 'Vendor POC', name: SellerKeys.POC, type: 'text', isRequired: true, visible: true },
    { label: 'Vendor POC Email', name: SellerKeys.POC_EMAIL, type: 'text', isRequired: true, visible: true },
    { label: 'Vendor POC Contact', name: SellerKeys.CONTACT_NUMBER, type: 'number', isRequired: true, visible: true },
]

export const BusinessDetails = [
    { label: 'PAN Number', name: SellerKeys.PAN_NUMBER, type: 'text', isRequired: false, visible: true },
    { label: 'TAN Number', name: SellerKeys.TAN_NUMBER, type: 'text', isRequired: false, visible: true },
    { label: 'GSTIN', name: SellerKeys.GSTIN, type: 'text', isRequired: false, visible: true },
    { label: 'CIN', name: SellerKeys.CIN, type: 'text', isRequired: false, visible: true },
    { label: 'Pf Declaration', name: SellerKeys.PF_DECLARATION, type: 'checkbox', isRequired: false, visible: true },
]

export const PocDetails = [
    { label: 'Vendor POC', name: SellerKeys.POC, type: 'text', isRequired: true, visible: true },
    { label: 'Vendor POC Email', name: SellerKeys.POC_EMAIL, type: 'text', isRequired: true, visible: true },
    { label: 'Vendor POC Contact', name: SellerKeys.CONTACT_NUMBER, type: 'number', isRequired: true, visible: true },
    { label: 'Vendor POC Alternate Number', name: SellerKeys.ALTERNATE_CONTACT_NUMBER, type: 'number', isRequired: false, visible: true },
    { label: 'Finance Contact Name', name: SellerKeys.FINANCE_NAME, type: 'text', isRequired: false, visible: true },
    { label: 'Finance Contact Number', name: SellerKeys.FINANCE_CONTACT_NUMBER, type: 'text', isRequired: false, visible: true },
    { label: 'Finance Email', name: SellerKeys.FINANCE_EMAIL, type: 'text', isRequired: false, visible: true },
]

export const PocDetailsAdd = [
    { label: 'Vendor POC Alternate Number', name: SellerKeys.ALTERNATE_CONTACT_NUMBER, type: 'number', isRequired: false, visible: true },
    { label: 'Finance Contact Name', name: SellerKeys.FINANCE_NAME, type: 'text', isRequired: false, visible: true },
    { label: 'Finance Contact Number', name: SellerKeys.FINANCE_CONTACT_NUMBER, type: 'text', isRequired: false, visible: true },
    { label: 'Finance Email', name: SellerKeys.FINANCE_EMAIL, type: 'text', isRequired: false, visible: true },
]

export const SellerBankData = [
    { label: 'Bank Name', name: SellerKeys.BANK_NAME, type: 'text', isRequired: false, visible: true },
    { label: 'Branch Name', name: SellerKeys.BRANCH_NAME, type: 'text', isRequired: false, visible: true },
    { label: 'Account Holder Name', name: SellerKeys.ACCOUNT_HOLDER_NAME, type: 'text', isRequired: false, visible: true },
    { label: 'Account Number', name: SellerKeys.ACCOUNT_NUMBER, type: 'number', isRequired: false, visible: true },
    { label: 'IFSC Code', name: SellerKeys.IFSC, type: 'text', isRequired: false, visible: false },
]

export const SellerWarehouseArray = [
    { label: 'Warehouse Name', name: SellerKeys.NAME, type: 'text', isRequired: true, visible: true },
    { label: 'GSTIN', name: SellerKeys.GSTIN, type: 'text', isRequired: true, visible: true },
    { label: 'WareHouse Active', name: SellerKeys.IS_ACTIVE, type: 'checkbox', isRequired: true, visible: true },
]

export const SellerMsMeArray = [
    { label: 'Is Registered Under MsMe', name: SellerKeys.IS_MSME, type: 'checkbox', isRequired: false, visible: true },
]

export const SellerCommercialsArray = [
    { label: 'Revenue Share Percent (Gross of GST)', name: SellerKeys.REVENUE_SHARE, type: 'number', isRequired: true, visible: true },
    { label: 'Handling Charges Per Sku', name: SellerKeys.HANDLING_CHARGES_PER_ORDER, type: 'number', isRequired: true, visible: true },
    { label: 'Warehouse Charges Per Sku', name: SellerKeys.WAREHOUSE_CHARGE_PER_SKU, type: 'number', isRequired: true, visible: true },
    { label: 'Damages Per Sku', name: SellerKeys.DAMAGES_PER_SKU, type: 'number', isRequired: true, visible: true },
    { label: 'Removal Fee Per Sku', name: SellerKeys.REMOVAL_FEE_PER_SKU, type: 'number', isRequired: true, visible: true },
    { label: 'Provisional Discount', name: SellerKeys.PROVISIONAL_DISCOUNT, type: 'number', isRequired: true, visible: true },
    { label: 'Approved Payment Terms', name: SellerKeys.APPROVED_PAYMENT_TERM, type: 'text', isRequired: true, visible: true },
]

export const SellerInternalArray = [
    { label: 'Finance Name', name: SellerKeys.INT_FINANCE_NAME, type: 'text', isRequired: true, visible: true },
    { label: 'Finance Email', name: SellerKeys.INT_FINANCE_EMAIL, type: 'text', isRequired: true, visible: true },
    { label: 'Finance Number', name: SellerKeys.INT_FINANCE_CONTACT_NUMBER, type: 'text', isRequired: true, visible: true },
]

export const SellerDeclarationArray = [
    { label: 'Authorized Person', name: SellerKeys.AUTHORIZED_PERSON, type: 'text', isRequired: false, visible: true },
    { label: 'Declaration Statement', name: SellerKeys.DECLARATION_STATEMENT, type: 'text', isRequired: false, visible: true },
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
    SellerKeys.REGISTERED_NAME,
    SellerKeys.IS_ACTIVE,
    SellerKeys.CODE,
    SellerKeys.HEAD_NAME,
    SellerKeys.HEAD_CONTACT,
    SellerKeys.HEAD_EMAIL,
    SellerKeys.GSTIN,
    SellerKeys.PAN_NUMBER,
    SellerKeys.TAN_NUMBER,
    SellerKeys.CIN,
    SellerKeys.CONTACT_NUMBER,
    SellerKeys.ALTERNATE_CONTACT_NUMBER,
    SellerKeys.POC_EMAIL,
    SellerKeys.POC,
    SellerKeys.ACCOUNT_NUMBER,
    SellerKeys.ACCOUNT_HOLDER_NAME,
    SellerKeys.INT_FINANCE_NAME,
    SellerKeys.INT_FINANCE_EMAIL,
    SellerKeys.INT_FINANCE_CONTACT_NUMBER,
    SellerKeys.IFSC,
    SellerKeys.BUSINESS_NATURE_COMPANY,
    SellerKeys.BANK_NAME,
    SellerKeys.BRANCH_NAME,
    SellerKeys.ACCOUNT_TYPE,
    SellerKeys.SEGMENT,
    SellerKeys.PROVISIONAL_DISCOUNT,
    SellerKeys.REVENUE_SHARE,
    SellerKeys.HANDLING_CHARGES_PER_ORDER,
    SellerKeys.WAREHOUSE_CHARGE_PER_SKU,
    SellerKeys.DAMAGES_PER_SKU,
    SellerKeys.REMOVAL_FEE_PER_SKU,
    SellerKeys.APPROVED_PAYMENT_TERM,
    SellerKeys.BUSINESS_NATURE,
    SellerKeys.SP_TYPE,
    SellerKeys.PF_DECLARATION,
    SellerKeys.IS_MSME,
    SellerKeys.MSME_CATEGORY,
    SellerKeys.AUTHORIZED_PERSON,
    SellerKeys.DECLARATION_STATEMENT,
    SellerKeys.NAME,
    SellerKeys.FINANCE_EMAIL,
    SellerKeys.FINANCE_CONTACT_NUMBER,
    SellerKeys.FINANCE_NAME,
]

export const fileFields = [
    SellerKeys.GST_CERTIFICATE,
    SellerKeys.PAN_COPY,
    SellerKeys.TAN_COPY,
    SellerKeys.CANCELLED_CHEQUE,
    SellerKeys.PF_DECLARATION_DOC,
    SellerKeys.TRADE_MARK_CERTIFICATE,
    SellerKeys.MSME_CERTIFICATE,
    SellerKeys.COMMERCIAL_APPROVAL_DOC,
    SellerKeys.APPROVED_ONBOARDING_DOC,
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
