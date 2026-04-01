export const BrandShipentForms = [
    { label: 'Document Name', name: 'name', type: 'text' },
    { label: 'Shipment Id', name: 'shipment_id', type: 'text' },
    { label: 'AWB Number', name: 'awb', type: 'text' },
]
export const DownloadTypeArray = [
    { label: 'PDF', value: 'pdf' },
    { label: 'CSV', value: 'csv' },
]

export const Shipment_Information = [
    { label: 'Document Name', name: 'name', type: 'text', isRequired: true },
    { label: 'Shipment Id', name: 'shipment_id', type: 'text', isRequired: true },
    { label: 'AWB Number', name: 'awb_number', type: 'text', isRequired: true },
    { label: 'Invoice Number', name: 'invoice_number', type: 'text', isRequired: true },
    { label: 'Dispatch Date', name: 'dispatch_date', type: 'dateForm', isRequired: true },
    { label: 'Expected Delivery Date', name: 'delivery_date', type: 'dateForm', isRequired: true },
    { label: 'Point of Contact Name', name: 'dispatched_by', type: 'text', isRequired: false },
]
export const Address_Detail = [
    { label: 'Origin Address', name: 'origin_address', type: 'textEditor', isRequired: true },
    { label: 'Delivery Address', name: 'delivery_address', type: 'textEditor', isRequired: true },
    { label: 'Point of Contact Name', name: 'dispatched_by', type: 'text', isRequired: true },
]
export const Package_Detail = [
    { label: 'Box Count', name: 'box_count', type: 'number', isRequired: true },
    { label: 'SKU Count', name: 'items_count', type: 'number', isRequired: true },
    { label: 'Total Quantity', name: 'total_quantity', type: 'number', isRequired: true },
    { label: 'Total Invoice Value', name: 'total_invoice_value', type: 'number', isRequired: true },
]
