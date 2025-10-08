/* eslint-disable @typescript-eslint/no-explicit-any */

import { notification } from 'antd'

const columnsForCsv = [
    { header: 'Name', accessorKey: 'name' },
    { header: 'Mobile', accessorKey: 'mobile' },
    { header: 'Latitude', accessorKey: 'latitude' },
    { header: 'Longitude', accessorKey: 'longitude' },
]

const convertToCSV = (data: any[], columns: any[]) => {
    const header = columns.map((col) => col.header).join(',')
    const rows = data
        .map((row) => {
            return columns
                .map((col) => {
                    if (col.accessorKey === 'name') {
                        return `${row?.profile?.first_name} ${row?.profile?.last_name}`
                    } else if (col.accessorKey === 'mobile') {
                        return row.profile?.mobile
                    } else if (col.accessorKey === 'latitude') {
                        return row?.profile?.current_location?.latitude
                    } else if (col.accessorKey === 'longitude') {
                        return row?.profile?.current_location?.longitude
                    } else {
                        return ''
                    }
                })
                .join(',')
        })
        .join('\n')
    return `${header}\n${rows}`
}

export const handleDownloadRiderCsv = (sortedRiderDetails: any) => {
    const csvData = convertToCSV(sortedRiderDetails, columnsForCsv)
    const blob = new Blob([csvData], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `riderData.csv`
    a.click()
    window.URL.revokeObjectURL(url)
}

export const handleCopyLink = () => {
    navigator.clipboard.writeText('https://slikk-dev-assets-public.s3.ap-south-1.amazonaws.com/builds/Rider+App/rider-app-new.apk')
    notification.success({ message: 'Copied' })
}
