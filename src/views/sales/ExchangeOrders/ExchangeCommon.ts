export const SEARCHOPTIONS_EXCHNAGE = [
    { label: 'INVOICE', value: 'invoice' },
    { label: 'MOBILE', value: 'mobile' },
]
export const scheduleSlots_exchange: Record<string, { start: string; end: string }> = {
    '1': { start: '10:00 AM', end: '01:00 PM' },
    '2': { start: '01:00 PM', end: '04:00 PM' },
    '3': { start: '04:00 PM', end: '07:00 PM' },
    '4': { start: '07:00 PM', end: '10:00 PM' },
}

export interface DropdownStatus {
    value: string[]
    name: string[]
}
