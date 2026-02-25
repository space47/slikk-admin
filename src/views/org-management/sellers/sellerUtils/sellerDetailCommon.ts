import { SellerKeys } from '../sellerCommon'

/* eslint-disable @typescript-eslint/no-explicit-any */
export const SellerDetailCommon = ({ seller: sellerData }: any) => {
    console.log('seller data', sellerData)
    const BasicSellerInformationDetail = [
        { label: 'Vendor Business Name', name: SellerKeys.REGISTERED_NAME, value: sellerData?.registered_name, visible: true },
        { label: 'Company Name', name: SellerKeys.NAME, value: sellerData?.name, visible: true },
        { label: 'Contact Person Name', name: SellerKeys.HEAD_NAME, value: sellerData?.head_name, visible: true },
        { label: 'Vendor Code', name: SellerKeys.CODE, value: sellerData?.code, visible: true },
        { label: 'Email Address', name: SellerKeys.HEAD_EMAIL, value: sellerData?.head_email, visible: true },
        { label: 'Phone Number', name: SellerKeys.HEAD_CONTACT, value: sellerData?.head_contact, visible: true },
        { label: 'Fashion Style', name: SellerKeys.SEGMENT, value: sellerData?.segment, visible: true },
    ]

    const BusinessDetailsDetail = [
        { label: 'PAN Number', name: SellerKeys.PAN_NUMBER, value: sellerData?.pan_number, visible: true },
        { label: 'TAN Number', name: SellerKeys.TAN_NUMBER, value: sellerData?.tan_number, visible: true },
        { label: 'CIN', name: SellerKeys.CIN, value: sellerData?.cin, visible: true },
        { label: 'Sole Proprietorship Type', name: SellerKeys.SP_TYPE, value: sellerData?.sp_type, visible: true },
        { label: 'Pf Declaration', name: SellerKeys.PF_DECLARATION, value: sellerData?.pf_declaration, visible: true },
    ]

    const PocDetailsDetail = [
        { label: 'Vendor POC', name: SellerKeys.POC, value: sellerData?.poc, visible: true },
        { label: 'Vendor POC Email', name: SellerKeys.POC_EMAIL, value: sellerData?.poc_email, visible: true },
        { label: 'Vendor POC Contact', name: SellerKeys.CONTACT_NUMBER, value: sellerData?.contact_number, visible: true },
        {
            label: 'Vendor POC Alternate Number',
            name: SellerKeys.ALTERNATE_CONTACT_NUMBER,
            value: sellerData?.alternate_contact_number,
            visible: true,
        },
        { label: 'Finance Contact Name', name: SellerKeys.FINANCE_NAME, value: sellerData?.finance_name, visible: true },
        {
            label: 'Finance Contact Number',
            name: SellerKeys.FINANCE_CONTACT_NUMBER,
            value: sellerData?.finance_contact_number,
            visible: true,
        },
        { label: 'Finance Email', name: SellerKeys.FINANCE_EMAIL, value: sellerData?.finance_email, visible: true },
    ]

    const SellerBankDetail = [
        { label: 'Bank Name', name: SellerKeys.BANK_NAME, value: sellerData?.bank_name, visible: true },
        { label: 'Branch Name', name: SellerKeys.BRANCH_NAME, value: sellerData?.branch_name, visible: true },
        { label: 'Account Holder Name', name: SellerKeys.ACCOUNT_HOLDER_NAME, value: sellerData?.account_holder_name, visible: true },
        { label: 'Account Number', name: 'account_number', value: sellerData?.account_number, visible: true },
        { label: 'IFSC Code', name: SellerKeys.IFSC, value: sellerData?.ifsc, visible: true },
        { label: 'Account Type', name: SellerKeys.ACCOUNT_TYPE, value: sellerData?.account_type, visible: true },
    ]

    const SellerMsMeDetail = [
        { label: 'MsMe Category', name: SellerKeys.MSME_CATEGORY, value: sellerData?.msme_category, visible: true },
        { label: 'Is Registered Under MsMe', name: SellerKeys.IS_MSME, value: sellerData?.is_msme, visible: true },
    ]

    const SellerCommercialsDetail = [
        { label: 'Revenue Share Percent', name: SellerKeys.REVENUE_SHARE, value: sellerData?.revenue_share, visible: true },
        {
            label: 'Handling Charges Per Sku',
            name: SellerKeys.HANDLING_CHARGES_PER_ORDER,
            value: sellerData?.handling_charges_per_order,
            visible: true,
        },
        {
            label: 'Warehouse Charge Per Sku',
            name: SellerKeys.WAREHOUSE_CHARGE_PER_SKU,
            value: sellerData?.warehouse_charge_per_sku,
            visible: true,
        },
        { label: 'Damages Per Sku', name: SellerKeys.DAMAGES_PER_SKU, value: sellerData?.damages_per_sku, visible: true },
        { label: 'Removal Fee Per Sku', name: SellerKeys.REMOVAL_FEE_PER_SKU, value: sellerData?.removal_fee_per_sku, visible: true },
        { label: 'Nature of Business', name: SellerKeys.BUSINESS_NATURE, value: sellerData?.business_nature, visible: true },
        {
            label: 'Provisional Discount',
            name: SellerKeys.PROVISIONAL_DISCOUNT,
            value: sellerData?.provisional_discount_rate,
            visible: true,
        },
        {
            label: 'Approved Payment Terms',
            name: SellerKeys.APPROVED_PAYMENT_TERM,
            value: sellerData?.approved_payment_term,
            visible: true,
        },
    ]

    // Create Business Nature Companies data if it exists
    const SellerBusinessNatureCompaniesDetail =
        sellerData?.business_nature_company?.length > 0
            ? [
                  {
                      label: 'Business Nature Companies',
                      name: 'business_nature_companies',
                      value: sellerData.business_nature_company,
                      visible: true,
                      isArray: true,
                  },
              ]
            : []

    const SellerInternalDetail = [
        { label: 'Slikk POC -Category Name', name: SellerKeys.INT_POC_NAME, value: sellerData?.int_poc_name, visible: true },
        { label: 'Slikk POC -Category Email', name: SellerKeys.INT_POC_EMAIL, value: sellerData?.int_poc_email, visible: true },
        { label: 'Slikk POC -Category Number', name: SellerKeys.INT_POC_CONTACT, value: sellerData?.int_poc_contact, visible: true },
    ]

    const SellerDeclarationDetail = [
        { label: 'Authorized Person', name: SellerKeys.AUTHORIZED_PERSON, value: sellerData?.authorized_person, visible: true },
        { label: 'Declaration Statement', name: SellerKeys.DECLARATION_STATEMENT, value: sellerData?.declaration_statement, visible: true },
    ]

    // Create sections array with conditional Business Nature Companies section
    const sections = [
        { key: 'Business Details', title: 'Business Details', data: BusinessDetailsDetail },
        { key: 'POC Details', title: 'POC Details', data: PocDetailsDetail },
        { key: 'Bank Details', title: 'Bank Details', data: SellerBankDetail },
        { key: 'Commercials', title: 'Commercials', data: SellerCommercialsDetail },
        // Add Business Nature Companies section only if data exists
        ...(sellerData?.business_nature_company?.length > 0
            ? [
                  {
                      key: 'Business Nature Companies',
                      title: 'Business Nature Companies',
                      data: SellerBusinessNatureCompaniesDetail,
                      isArraySection: true,
                  },
              ]
            : []),
        { key: 'Internal Details', title: 'Internal Details', data: SellerInternalDetail },
        { key: 'MSME Details', title: 'MSME Details', data: SellerMsMeDetail },
        { key: 'Declaration', title: 'Declaration', data: SellerDeclarationDetail },
    ]

    const documentsList = [
        {
            label: 'PAN Card',
            file: sellerData?.pan_copy,
            key: 'pan',
            name: SellerKeys.PAN_COPY,
            fieldName: 'panCopyFile',
        },
        {
            label: 'Tan Card',
            file: sellerData?.tan_copy,
            key: 'tan',
            name: SellerKeys.TAN_COPY,
            fieldName: 'tanCopyFile',
        },
        {
            label: 'PF Declaration Doc',
            file: sellerData?.pf_declaration_doc,
            key: 'pf',
            name: SellerKeys.PF_DECLARATION_DOC,
            fieldName: 'pd_doc_file',
        },
        {
            label: 'Trade Mark Certificate',
            file: sellerData?.trade_mark_certificate,
            key: 'trade',
            name: SellerKeys.TRADE_MARK_CERTIFICATE,
            fieldName: 'trade_mark_file',
        },
        {
            label: 'GST Certificate',
            file: sellerData?.gst_certificate,
            key: 'gst',
            name: SellerKeys.GST_CERTIFICATE,
            fieldName: 'gstCertificateFile',
        },
        {
            label: 'Cancelled Cheque',
            file: sellerData?.cancelled_cheque,
            key: 'cheque',
            name: SellerKeys.CANCELLED_CHEQUE,
            fieldName: 'cancelledChequeFile',
        },
        {
            label: 'MSME Certificate',
            file: sellerData?.msme_certificate,
            key: 'msme',
            name: SellerKeys.MSME_CERTIFICATE,
            fieldName: 'msmeCertificateFile',
        },
    ]

    return {
        BasicSellerInformationDetail,
        BusinessDetailsDetail,
        PocDetailsDetail,
        SellerBankDetail,
        sections,
        SellerMsMeDetail,
        SellerCommercialsDetail,
        SellerInternalDetail,
        SellerDeclarationDetail,
        SellerBusinessNatureCompaniesDetail,
        documentsList,
    }
}
