/* eslint-disable @typescript-eslint/no-explicit-any */
import moment from 'moment'

export const convertToCSV = (data: any[], columns: any[]) => {
    const header = columns.map((col) => col.csvHeader).join(',')

    const rows = data
        .map((row) => {
            return columns
                .map((col) => {
                    if (col.accessorKey === 'user') {
                        return row.user
                    } else {
                        const hasAttendance = row.attendanceData.some(
                            (attendance: any) => moment(attendance.checkin_date).format('YYYY-MM-DD') === col.accessorKey,
                        )
                        return hasAttendance ? '1' : '0'
                    }
                })
                .join(',')
        })
        .join('\n')
    return `${header}\n${rows}`
}

export const handleDownloadAttendanceCsv = (groupedRiderAttendance: any[], columns: any[], selectedMonth: string) => {
    const csvData = convertToCSV(groupedRiderAttendance, columns)
    const blob = new Blob([csvData], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `rider_attendance_${selectedMonth}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
}
