export enum PoStatus {
    approved = 'APPROVED',
    reject = 'REJECT',
    pending = 'PENDING',
    created = 'CREATED',
}

export const PoStatusArray = [
    { label: 'Approved', value: PoStatus.approved },
    { label: 'Created', value: PoStatus.created },
    { label: 'Rejected', value: PoStatus.reject },
    { label: 'Pending', value: PoStatus.pending },
]
