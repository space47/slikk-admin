export const enum RTLActions {
    ADD = 'add',
    REMOVE = 'remove',
    MOVE = 'move',
}

export const enum RTLStatus {
    QC_PASSED = 'qc_passed',
    QC_FAILED = 'qc_failed',
    REFURBISHED = 'refurbished',
}
export const enum RTLFilters {
    RETURN_ID = 'return_order_id',
    ORDER_ID = 'order_id',
    SKU = 'sku',
    BARCODE = 'barcode',
    SKID = 'skid',
}

export const RTLStatusArray = [
    { label: 'QC PASSED', value: RTLStatus.QC_PASSED },
    { label: 'QC Failed', value: RTLStatus.QC_FAILED },
    { label: 'Refurbished', value: RTLStatus.REFURBISHED },
]

export const RTLFilterTypes = [
    { label: 'SKU', value: RTLFilters.SKU },
    { label: 'SKID', value: RTLFilters.SKID },
    { label: 'BARCODE', value: RTLFilters.BARCODE },
    { label: 'RETURN ORDER', value: RTLFilters.RETURN_ID },
    { label: 'ORDER', value: RTLFilters.ORDER_ID },
]
