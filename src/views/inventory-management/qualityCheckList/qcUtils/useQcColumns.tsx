/* eslint-disable @typescript-eslint/no-explicit-any */
import moment from 'moment'
import { useMemo } from 'react'

export const useQcColumns = () => {
    return useMemo(() => {
        return [
            {
                header: 'Name',
                accessorKey: 'name',
                cell: ({ row }: any) => <div>{row?.original?.name}</div>,
            },
            {
                header: 'Size',
                accessorKey: 'size',
                cell: ({ row }: any) => <div>{row?.original?.size}</div>,
            },
            {
                header: 'SKU',
                accessorKey: 'sku',
                cell: ({ row }: any) => <div>{row?.original?.sku}</div>,
            },
            {
                header: 'Quantity Sent',
                accessorKey: 'quantity_sent',
                cell: ({ row }: any) => <div>{row?.original?.quantity_sent}</div>,
            },
            {
                header: 'Quantity Received',
                accessorKey: 'quantity_received',
                cell: ({ row }: any) => <div>{row?.original?.quantity_received}</div>,
            },
            {
                header: 'QC Passed',
                accessorKey: 'qc_passed',
                cell: ({ row }: any) => <div>{row?.original?.qc_passed}</div>,
            },
            {
                header: 'QC Failed',
                accessorKey: 'qc_failed',
                cell: ({ row }: any) => <div>{row?.original?.qc_failed}</div>,
            },
            {
                header: 'Location',
                accessorKey: 'location',
                cell: ({ row }: any) => <div>{row?.original?.location}</div>,
            },
            {
                header: 'Sent to Inventory',
                accessorKey: 'sent_to_inventory',
                cell: ({ row }: any) => <div>{row?.original?.sent_to_inventory ? 'Yes' : 'No'}</div>,
            },
            {
                header: 'Batch Number',
                accessorKey: 'batch_number',
                cell: ({ row }: any) => <div>{row?.original?.batch_number || '-'}</div>,
            },
            {
                header: 'GRN',
                accessorKey: 'grn',
                cell: ({ row }: any) => <div>{row?.original?.grn}</div>,
            },
            {
                header: 'Cost Price',
                accessorKey: 'cost_price',
                cell: ({ row }: any) => <div>{row?.original?.cost_price || '-'}</div>,
            },
            {
                header: 'Last Updated By',
                accessorKey: 'last_updated_by',
                cell: ({ row }: any) => (
                    <div>
                        {row?.original?.last_updated_by?.name} ({row?.original?.last_updated_by?.email})
                    </div>
                ),
            },
            {
                header: 'QC Done By',
                accessorKey: 'qc_done_by',
                cell: ({ row }: any) => (
                    <div>
                        {row?.original?.qc_done_by?.name} ({row?.original?.qc_done_by?.email})
                    </div>
                ),
            },
            {
                header: 'Created At',
                accessorKey: 'create_date',
                cell: ({ row }: any) => <div>{moment(row?.original?.create_date).format('DD-MM-YYYY HH:mm:ss')}</div>,
            },
            {
                header: 'Updated At',
                accessorKey: 'update_date',
                cell: ({ row }: any) => <div>{moment(row?.original?.update_date).format('DD-MM-YYYY HH:mm:ss')}</div>,
            },
        ]
    }, [])
}
