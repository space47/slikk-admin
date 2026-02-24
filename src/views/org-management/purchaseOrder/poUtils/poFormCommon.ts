export enum PoField {
    ORDER_BILLING_ADDRESS = 'order_billing_address',
    ORDER_BILLING_ENTITY = 'order_billing_entity',
    ORDER_SHIPPING_ADDRESS = 'order_shipping_address',
    PAYMENT_TERMS = 'payment_terms',
    PAYMENT_MODE = 'payment_mode',
    SPECIAL_TERMS = 'special_terms',
    DISCOUNT_SHARING = 'discount_sharing_applicable',
    COMMERCIAL_TERMS = 'commercial_terms',
    COMPANY_GST = 'company_gst',
    EXPECTED_DELIVERY = 'expected_delivery_date',
    PO_NATURE = 'po_nature',
}

export const PoFormFieldArray = [
    { label: 'Order Billing Address(Bill-to)', type: 'text', name: PoField.ORDER_BILLING_ADDRESS },
    { label: 'Order Shipping Address(Ship-to)', type: 'text', name: PoField.ORDER_SHIPPING_ADDRESS },
    { label: 'Payment Terms', type: 'text', name: PoField.PAYMENT_TERMS },
    { label: 'Payment Mode', type: 'text', name: PoField.PAYMENT_MODE },
    { label: 'special_terms', type: 'text', name: PoField.SPECIAL_TERMS },
    { label: 'Discount Sharing Applicable', type: 'checkbox', name: PoField.DISCOUNT_SHARING },
]

export const PoOrderItemsArray = [
    { label: 'SKU', type: 'text', name: 'sku', is_required: true },
    { label: 'Supplier MRP', type: 'number', name: 'supplier_mrp', is_required: true },
    { label: 'Quantity', type: 'number', name: 'quantity', is_required: true },
]

export const IndianStateCodes = [
    { label: 'Jammu & Kashmir', value: '1' },
    { label: 'Himachal Pradesh', value: '2' },
    { label: 'Punjab', value: '3' },
    { label: 'Chandigarh', value: '4' },
    { label: 'Uttarakhand', value: '5' },
    { label: 'Haryana', value: '6' },
    { label: 'Delhi', value: '7' },
    { label: 'Rajasthan', value: '8' },
    { label: 'Uttar Pradesh', value: '9' },
    { label: 'Bihar', value: '10' },
    { label: 'Sikkim', value: '11' },
    { label: 'Arunachal Pradesh', value: '12' },
    { label: 'Nagaland', value: '13' },
    { label: 'Manipur', value: '14' },
    { label: 'Mizoram', value: '15' },
    { label: 'Tripura', value: '16' },
    { label: 'Meghalaya', value: '17' },
    { label: 'Assam', value: '18' },
    { label: 'West Bengal', value: '19' },
    { label: 'Jharkhand', value: '20' },
    { label: 'Odisha', value: '21' },
    { label: 'Chhattisgarh', value: '22' },
    { label: 'Madhya Pradesh', value: '23' },
    { label: 'Gujarat', value: '24' },
    { label: 'Daman & Diu', value: '25' },
    { label: 'Dadra & Nagar Haveli', value: '26' },
    { label: 'Maharashtra', value: '27' },
    { label: 'Andhra Pradesh', value: '28' },
    { label: 'Karnataka', value: '29' },
    { label: 'Goa', value: '30' },
    { label: 'Lakshadweep', value: '31' },
    { label: 'Kerala', value: '32' },
    { label: 'Tamil Nadu', value: '33' },
    { label: 'Puducherry', value: '34' },
    { label: 'Andaman & Nicobar Islands', value: '35' },
    { label: 'Telangana', value: '36' },
    { label: 'Ladakh', value: '37' },
]

export const PoNatureOption = () => {
    return ['FOB Purchase', 'General Goods Procurement'].map((po) => ({
        label: po,
        value: po,
    }))
}

export const PoStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
        case 'approved':
            return 'bg-green-500'
        case 'rejected':
            return 'bg-red-500'
        case 'accepted':
            return 'bg-blue-500'
        case 'waiting_approval':
            return 'bg-yellow-500'
        default:
            return 'bg-gray-500'
    }
}
