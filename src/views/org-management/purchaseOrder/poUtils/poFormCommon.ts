export const PoFormFieldArray = [
    { label: 'State Code', type: 'text', name: 'state_code', is_required: true },
    { label: 'Order Billing Entity', type: 'text', name: 'order_billing_entity' },
    { label: 'Order Billing Address', type: 'text', name: 'order_billing_address' },
    { label: 'Order Shipping Address', type: 'text', name: 'order_shipping_address' },
    { label: 'Commercial Terms', type: 'text', name: 'commercial_terms' },
    { label: 'Payment Terms', type: 'text', name: 'payment_terms' },
    { label: 'Discount Sharing Applicable', type: 'checkbox', name: 'discount_sharing_applicable' },
]
export const PoOrderItemsArray = [
    { label: 'Vendor Sku', type: 'text', name: 'vendor_sku', is_required: true },
    { label: 'Slikk Sku', type: 'text', name: 'slikk_sku' },
    { label: 'Style Code', type: 'text', name: 'style_code' },
    { label: 'Category', type: 'text', name: 'category' },
    { label: 'HSN Code', type: 'text', name: 'hsn_code' },
    { label: 'Supplier MRP', type: 'number', name: 'supplier_mrp' },
    { label: 'Title', type: 'text', name: 'title' },
    { label: 'EAN', type: 'text', name: 'ean' },
    { label: 'Quantity', type: 'number', name: 'quantity' },
    { label: 'Fulfilled Quantity', type: 'number', name: 'fulfilled_quantity' },
    { label: 'Pending Quantity', type: 'number', name: 'pending_quantity' },
    { label: 'UOM', type: 'text', name: 'uom' },
    { label: 'Size', type: 'text', name: 'size' },
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

export const SpecialTermsOption = () => {
    return ['Option1', 'option2', 'Option3'].map((st) => ({
        label: st,
        value: st,
    }))
}
export const PoNatureOption = () => {
    return ['Option1', 'option2', 'Option3'].map((po) => ({
        label: po,
        value: po,
    }))
}
