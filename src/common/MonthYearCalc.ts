import moment from 'moment'

export const handleYearSelect = (
    year: string,
    setSelectedYear: (year: string) => void,
    setYear: (year: string) => void,
    handleYearMonthChange: (year: string, month: string) => void,
    selectedMonth: string,
) => {
    setSelectedYear(year)
    setYear(year)
    handleYearMonthChange(year, selectedMonth)
}

export const handleMonthSelect = (
    month: string,
    setSelectedMonth: (month: string) => void,
    setMonth: (month: string) => void,
    handleYearMonthChange: (year: string, month: string) => void,
    selectedYear: string,
) => {
    setSelectedMonth(month)
    setMonth(month)
    handleYearMonthChange(selectedYear, month)
}

export const handleWeekSelect = (
    weekIndex: number,
    setSelectedWeek: (weekIndex: number) => void,
    handleWeekChange: (startWeek: string, endWeek: string) => void,
    isWeek: boolean,
    selectedYear: string,
    selectedMonth: string,
) => {
    setSelectedWeek(weekIndex)
    const firstDayOfMonth = moment(`${selectedYear}-${selectedMonth}-01`, 'YYYY-MM-DD')
    const startWeek = firstDayOfMonth
        .clone()
        .add((weekIndex - 1) * 7, 'days')
        .format('YYYY-MM-DD')
    const lastDayOfMonth = firstDayOfMonth.clone().endOf('month')
    const endWeek = moment.min(firstDayOfMonth.clone().add(weekIndex * 7 - 1, 'days'), lastDayOfMonth).format('YYYY-MM-DD')

    if (isWeek) {
        console.log('isWeek', isWeek)
        handleWeekChange(startWeek, endWeek)
    }
}
