//TODO: Change the state code to dropdown

export const PoFormFieldArray = [
    { label: 'State Code', type: 'text', name: 'state_code', is_required: true },
    { label: 'Vendor Billing Entity', type: 'text', name: 'order_billing_entity' },
    { label: 'Vendor Billing Address(Bill-to)', type: 'text', name: 'order_billing_address' },
    { label: 'Vendor Shipping Address(Ship-to)', type: 'text', name: 'order_shipping_address' },
    { label: 'Commercial Terms', type: 'text', name: 'commercial_terms' },
    { label: 'Payment Terms', type: 'text', name: 'payment_terms' },
    { label: 'special_terms', type: 'text', name: 'special_terms' },
    { label: 'Discount Sharing Applicable', type: 'checkbox', name: 'discount_sharing_applicable' },
]
export const PoOrderItemsArray = [
    { label: 'Is Catalog Available', type: 'checkbox', name: 'is_catalog_available' },
    { label: 'Vendor Sku', type: 'text', name: 'vendor_sku', is_required: true },
    { label: 'Slikk Sku', type: 'text', name: 'slikk_sku' },
    { label: 'Style Code', type: 'text', name: 'style_code' },
    { label: 'Category', type: 'text', name: 'category' },
    { label: 'HSN Code', type: 'text', name: 'hsn_code', isOptional: true },
    { label: 'Supplier MRP', type: 'number', name: 'supplier_mrp', isOptional: true },
    { label: 'Title', type: 'text', name: 'title', isOptional: true },
    { label: 'Size', type: 'text', name: 'size', isOptional: true },
    { label: 'EAN', type: 'text', name: 'ean' },
    { label: 'Quantity', type: 'number', name: 'quantity' },
    { label: 'Fulfilled Quantity', type: 'number', name: 'fulfilled_quantity' },
    { label: 'Pending Quantity', type: 'number', name: 'pending_quantity' },
    { label: 'UOM', type: 'text', name: 'uom' },
    { label: 'Stock Correction (%)', type: 'number', name: 'stock_correction_percentage' },
    { label: 'Item Value', type: 'number', name: 'item_value' },
    { label: 'GV', type: 'number', name: 'gv' },
    { label: 'Tax Type', type: 'text', name: 'tax_type' },
    { label: 'Tax Percentage', type: 'number', name: 'tax_percentage' },
    { label: 'CGST', type: 'number', name: 'cgst' },
    { label: 'SGST', type: 'number', name: 'sgst' },
    { label: 'IGST', type: 'number', name: 'igst' },
    { label: 'Total Value', type: 'number', name: 'total_value' },
    { label: 'Order', type: 'number', name: 'order' },
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
        case 'pending':
            return 'bg-yellow-500'
        default:
            return 'bg-gray-500'
    }
}
