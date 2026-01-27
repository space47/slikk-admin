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

export const RTLStatusArray = [
    { label: 'QC PASSED', value: RTLStatus.QC_PASSED },
    { label: 'QC Failed', value: RTLStatus.QC_FAILED },
    { label: 'Refurbished', value: RTLStatus.REFURBISHED },
]
