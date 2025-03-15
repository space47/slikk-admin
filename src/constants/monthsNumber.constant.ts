import moment from 'moment'

export const MONTHS_NUMBER = [
    { label: 'January', value: '01' },
    { label: 'February', value: '02' },
    { label: 'March', value: '03' },
    { label: 'April', value: '04' },
    { label: 'May', value: '05' },
    { label: 'June', value: '06' },
    { label: 'July', value: '07' },
    { label: 'August', value: '08' },
    { label: 'September', value: '09' },
    { label: 'October', value: '10' },
    { label: 'November', value: '11' },
    { label: 'December', value: '12' },
]

export const WEEK_NUMBERS = [
    { label: 'week 1', value: 1 },
    { label: 'week 2', value: 2 },
    { label: 'week 3', value: 3 },
    { label: 'week 4', value: 4 },
]

export const CURRENT_YEAR = moment().year()
export const YEARS = Array.from({ length: 10 }, (_, i) => (CURRENT_YEAR - i).toString())
