export enum PoStatus {
    approved = 'APPROVED',
    reject = 'REJECTED',
    pending = 'PENDING',
    created = 'CREATED',
    cancelled = 'CANCELLED',
    waiting_approval = 'WAITING_APPROVAL',
}

export const PoStatusArray = [
    { label: 'ALL', value: '' },
    { label: 'Pending', value: PoStatus.pending },
    { label: 'Created', value: PoStatus.created },
    { label: 'waiting_approval', value: PoStatus.waiting_approval },
    { label: 'Approved', value: PoStatus.approved },
    { label: 'Cancelled', value: PoStatus.cancelled },
    { label: 'Rejected', value: PoStatus.reject },
]
