/* eslint-disable @typescript-eslint/no-explicit-any */
export const SellerDetailCommon = ({ seller: sellerData }: any) => {
    console.log('seller data', sellerData)
    const BasicSellerInformationDetail = [
        { label: 'Vendor Business Name', name: 'registered_name', value: sellerData?.registered_name, visible: true },
        { label: 'Company Name', name: 'name', value: sellerData?.name, visible: true },
        { label: 'Contact Person Name', name: 'head_name', value: sellerData?.head_name, visible: true },
        { label: 'Vendor Code', name: 'vendor_code', value: sellerData?.vendor_code, visible: true },
        { label: 'Email Address', name: 'head_email', value: sellerData?.head_email, visible: true },
        { label: 'Phone Number', name: 'head_number', value: sellerData?.head_number, visible: true },
    ]

    const BusinessDetailsDetail = [
        { label: 'PAN Number', name: 'pan_number', value: sellerData?.pan_number, visible: true },
        { label: 'TAN Number', name: 'tan_number', value: sellerData?.tan_number, visible: true },
        { label: 'CIN', name: 'cin', value: sellerData?.cin, visible: true },
        { label: 'Sole Proprietorship Type', name: 'sp_type', value: sellerData?.sp_type, visible: true },
        { label: 'Pf Declaration', name: 'sp_type', value: sellerData?.sp_type, visible: true },
    ]

    const PocDetailsDetail = [
        { label: 'Vendor POC', name: 'poc', value: sellerData?.poc, visible: true },
        { label: 'Vendor POC Email', name: 'poc_email', value: sellerData?.poc_email, visible: true },
        { label: 'Vendor POC Contact', name: 'contact_number', value: sellerData?.contact_number, visible: true },
        {
            label: 'Vendor POC Alternate Number',
            name: 'alternate_contact_number',
            value: sellerData?.alternate_contact_number,
            visible: true,
        },
        { label: 'Finance Contact Name', name: 'finance_name', value: sellerData?.finance_name, visible: true },
        { label: 'Finance Contact Number', name: 'finance_contact_number', value: sellerData?.finance_contact_number, visible: true },
        { label: 'Finance Email', name: 'finance_email', value: sellerData?.finance_email, visible: true },
    ]

    const SellerBankDetail = [
        { label: 'Bank Name', name: 'bank_name', value: sellerData?.bank_name, visible: true },
        { label: 'Branch Name', name: 'branch_name', value: sellerData?.branch_name, visible: true },
        { label: 'Account Holder Name', name: 'account_holder_name', value: sellerData?.account_holder_name, visible: true },
        { label: 'Account Number', name: 'account_number', value: sellerData?.account_number, visible: true },
        { label: 'IFSC Code', name: 'ifsc', value: sellerData?.ifsc, visible: true },
        { label: 'Account Type', name: 'account_type', value: sellerData?.account_type, visible: true },
    ]

    const SellerWarehouseDetail = [
        { label: 'Warehouse Name', name: 'warehouse_name', value: sellerData?.warehouse_name, visible: true },
        { label: 'GSTIN', name: 'gstin', value: sellerData?.gstin, visible: true },
        { label: 'WareHouse Active', name: 'is_active', value: sellerData?.is_active, visible: true },
    ]

    const SellerMsMeDetail = [
        { label: 'MsMe Category', name: 'msme_category', value: sellerData?.msme_category, visible: true },
        { label: 'Is Registered Under MsMe', name: 'is_msme', value: sellerData?.is_msme, visible: true },
    ]

    const SellerCommercialsDetail = [
        { label: 'Revenue Share Percent', name: 'revenue_share', value: sellerData?.revenue_share, visible: true },
        { label: 'Handling Charges Per Sku', name: 'handling_charges_per_sku', value: sellerData?.handling_charges_per_sku, visible: true },
        {
            label: 'Warehouse Charges Per Sku',
            name: 'warehouse_charges_per_sku',
            value: sellerData?.warehouse_charges_per_sku,
            visible: true,
        },
        { label: 'Damages Per Sku', name: 'damages_charges_per_sku', value: sellerData?.damages_charges_per_sku, visible: true },
        { label: 'Removal Fee Per Sku', name: 'removal_fee_per_sku', value: sellerData?.removal_fee_per_sku, visible: true },
        { label: 'Nature of Business', name: 'business_nature', value: sellerData?.business_nature, visible: true },
        { label: 'Settlement Days', name: 'settlement_days', value: sellerData?.settlement_days, visible: true },
        { label: 'Approved Payment Terms', name: 'approved_payment_term', value: sellerData?.approved_payment_term, visible: true },
    ]

    const SellerInternalDetail = [
        { label: 'Slikk POC -Category Name', name: 'int_poc_name', value: sellerData?.int_poc_name, visible: true },
        { label: 'Slikk POC -Category Email', name: 'int_poc_email', value: sellerData?.int_poc_email, visible: true },
        { label: 'Slikk POC -Category Number', name: 'int_poc_number', value: sellerData?.int_poc_number, visible: true },
    ]

    const SellerDeclarationDetail = [
        { label: 'Authorized Person', name: 'authorized_person', value: sellerData?.authorized_person, visible: true },
        { label: 'Declaration Statement', name: 'declaration_statement', value: sellerData?.declaration_statement, visible: true },
    ]

    return {
        BasicSellerInformationDetail,
        BusinessDetailsDetail,
        PocDetailsDetail,
        SellerBankDetail,
        SellerWarehouseDetail,
        SellerMsMeDetail,
        SellerCommercialsDetail,
        SellerInternalDetail,
        SellerDeclarationDetail,
    }
}
