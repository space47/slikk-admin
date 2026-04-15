/* eslint-disable @typescript-eslint/no-explicit-any */
import { DayWiseData } from '@/store/types/riderAddTypes'
import { ColumnDef } from '@tanstack/react-table'
import moment from 'moment'

export const generateDynamicColumns = (data: any[]): ColumnDef<DayWiseData>[] => {
    if (!data || data.length === 0) return []

    const keys = Object.keys(data[0])

    return keys.map((key) => ({
        header: formatHeader(key),
        accessorKey: key,
        cell: ({ row }: any) => {
            const value = row.original?.[key]

            if (value === null || value === undefined) return '-'

            // 🔹 Custom formatting rules
            if (key.includes('date')) {
                return moment(value).format('YYYY-MM-DD')
            }

            if (key.includes('time')) {
                return `${value} min`
            }

            if (key.includes('distance')) {
                return `${Number(value).toFixed(2)} km`
            }

            if (key.includes('earning') || key.includes('amount')) {
                return <span className="text-green-600 font-semibold">₹{Number(value).toFixed(2)}</span>
            }

            if (key.includes('cancel')) {
                return <span className="text-red-500">{value}</span>
            }

            if (key.includes('on_time')) {
                return <span className="text-blue-600">{value}</span>
            }

            return value
        },
    }))
}

// 🔹 Convert snake_case → Proper Header
const formatHeader = (key: string) => {
    return key.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
}
