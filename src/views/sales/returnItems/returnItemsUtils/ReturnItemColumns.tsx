import { useMemo } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import moment from 'moment'
import { ReturnData } from '@/store/types/returnOrderData.types'

interface Props {
    handleOpenModal: (x: string) => void
}

export const ReturnItemColumns = ({ handleOpenModal }: Props) => {
    return useMemo<ColumnDef<ReturnData>[]>(
        () => [
            {
                header: 'Item ID',
                accessorKey: 'return_order_item',
                cell: ({ row }) => <div>{row.original.return_order_item || '-'}</div>,
            },
            {
                header: 'SKU',
                accessorKey: 'sku',
                cell: ({ row }) => <div>{row.original.sku || '-'}</div>,
            },
            {
                header: 'Quantity',
                accessorKey: 'quantity',
                cell: ({ row }) => <div>{row.original.quantity}</div>,
            },
            {
                header: 'QC Passed',
                accessorKey: 'qc_passed',
                cell: ({ row }) => <div>{row.original.qc_passed}</div>,
            },
            {
                header: 'QC Failed',
                accessorKey: 'qc_failed',
                cell: ({ row }) => <div>{row.original.qc_failed}</div>,
            },
            {
                header: 'QC Failed Image',
                id: 'qc_failed_image',
                cell: ({ row }) => {
                    const qcData = row.original.qc_field_data

                    if (!qcData || qcData.length === 0) return '-'

                    return (
                        <div className="flex gap-2 flex-wrap">
                            {qcData.map((item, index) =>
                                item.image ? (
                                    <img
                                        key={index}
                                        src={item.image?.split(',')[0]}
                                        alt={`QC Failed ${index + 1}`}
                                        className="h-10 w-10 object-cover rounded border"
                                        onClick={() => handleOpenModal(item?.image)}
                                    />
                                ) : (
                                    <span key={index}>-</span>
                                ),
                            )}
                        </div>
                    )
                },
            },
            {
                header: 'QC Failed Reason',
                id: 'qc_failed_reason',
                cell: ({ row }) => {
                    const qcData = row.original.qc_field_data

                    if (!qcData || qcData.length === 0) return '-'

                    return (
                        <div className="space-y-1">
                            {qcData.map((item, index) => (
                                <div key={index} className="text-sm flex gap-2">
                                    <span className="p-2 shadow-sm border rounded-lg">{item.reason || '-'}</span>
                                </div>
                            ))}
                        </div>
                    )
                },
            },
            {
                header: 'Refurbished',
                accessorKey: 'refurbished',
                cell: ({ row }) => <div>{row.original.refurbished}</div>,
            },
            {
                header: 'Synced Qty',
                accessorKey: 'synced_quantity',
                cell: ({ row }) => <div>{row.original.synced_quantity}</div>,
            },
            {
                header: 'Inventory Sync Error',
                accessorKey: 'inventory_sync_error',
                cell: ({ row }) => (
                    <div>{row.original.inventory_sync_error?.length > 0 ? row.original.inventory_sync_error.length : '-'}</div>
                ),
            },

            {
                header: 'Created At',
                accessorKey: 'create_date',
                cell: ({ row }) => (
                    <div>{row.original.create_date ? moment(row.original.create_date).format('DD MMM YYYY, hh:mm A') : '-'}</div>
                ),
            },
            {
                header: 'Updated At',
                accessorKey: 'update_date',
                cell: ({ row }) => (
                    <div>{row.original.update_date ? moment(row.original.update_date).format('DD MMM YYYY, hh:mm A') : '-'}</div>
                ),
            },
        ],
        [],
    )
}
