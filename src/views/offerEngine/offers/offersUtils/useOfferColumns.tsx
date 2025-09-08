/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo } from 'react'
import moment from 'moment'
import { FaEdit } from 'react-icons/fa'

interface DailyTimeWindow {
    start: string
    end: string
}
interface OfferRow {
    offer_name: string
    discount_type: string
    discount_value: number
    min_purchase_amount: number
    max_discount_amount: number
    start_date: string
    end_date: string
    is_active: boolean
    created_at: string
    updated_at: string
    max_order_quantity?: number | null
    is_multi_unit_eligible: boolean
    set_size: number
    max_sets: number
    buy_quantity: number
    get_quantity: number
    get_reward_type: string
    get_reward_value: number
    daily_time_windows?: DailyTimeWindow[]
    [key: string]: any
}

interface ColumnProps {
    offerData: any[]
    offerIdStore: number[]
    handleSelectAllOfferId: (e: React.ChangeEvent<HTMLInputElement>) => void
    handleSelectIds: (id: number, isSelected: boolean) => void
}

export const useOfferColumns = ({ offerData, handleSelectAllOfferId, handleSelectIds, offerIdStore }: ColumnProps) => {
    return useMemo(
        () => [
            {
                header: (
                    <div className="flex flex-col gap-2 items-center justify-center">
                        <input
                            type="checkbox"
                            name="selectAll"
                            checked={offerData?.length > 0 && offerIdStore?.length === offerData?.length}
                            onChange={handleSelectAllOfferId}
                        />
                    </div>
                ),
                accessorKey: 'x',
                cell: ({ row }: { row: { original: any } }) => {
                    const ids = row.original.id
                    return (
                        <div className="flex items-center justify-center">
                            <input
                                type="checkbox"
                                name="mobiles"
                                checked={offerIdStore.includes(ids)}
                                onChange={(e) => handleSelectIds(ids, e.target.checked)}
                            />
                        </div>
                    )
                },
            },
            {
                header: 'Edit',
                accessorKey: 'id',
                cell: ({ row }: { row: { original: OfferRow } }) => {
                    return (
                        <a
                            href={`/app/appSettings/offers/${row.original.id}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 hover:underline"
                        >
                            <FaEdit size={16} className="text-blue-500" />
                        </a>
                    )
                },
            },
            {
                header: 'Offer Name',
                accessorKey: 'offer_name',
                cell: ({ row }: { row: { original: OfferRow } }) => row.original.offer_name,
            },
            {
                header: 'Discount Type',
                accessorKey: 'discount_type',
                cell: ({ row }: { row: { original: OfferRow } }) => row.original.discount_type,
            },
            {
                header: 'Discount Value',
                accessorKey: 'discount_value',
                cell: ({ row }: { row: { original: OfferRow } }) => row.original.discount_value,
            },
            {
                header: 'Min Purchase',
                accessorKey: 'min_purchase_amount',
                cell: ({ row }: { row: { original: OfferRow } }) => row.original.min_purchase_amount,
            },
            {
                header: 'Max Discount',
                accessorKey: 'max_discount_amount',
                cell: ({ row }: { row: { original: OfferRow } }) => row.original.max_discount_amount,
            },
            {
                header: 'Start Date',
                accessorKey: 'start_date',
                cell: ({ row }: { row: { original: OfferRow } }) => moment(row.original.start_date).format('YYYY-MM-DD HH:mm'),
            },
            {
                header: 'End Date',
                accessorKey: 'end_date',
                cell: ({ row }: { row: { original: OfferRow } }) => moment(row.original.end_date).format('YYYY-MM-DD HH:mm'),
            },
            {
                header: 'Active',
                accessorKey: 'is_active',
                cell: ({ row }: { row: { original: OfferRow } }) => (row.original.is_active ? 'Yes' : 'No'),
            },
            {
                header: 'Created At',
                accessorKey: 'created_at',
                cell: ({ row }: { row: { original: OfferRow } }) => moment(row.original.created_at).format('YYYY-MM-DD HH:mm'),
            },
            {
                header: 'Updated At',
                accessorKey: 'updated_at',
                cell: ({ row }: { row: { original: OfferRow } }) => moment(row.original.updated_at).format('YYYY-MM-DD HH:mm'),
            },
            {
                header: 'Max Order Qty',
                accessorKey: 'max_order_quantity',
                cell: ({ row }: { row: { original: OfferRow } }) => row.original.max_order_quantity ?? '-',
            },
            {
                header: 'Multi Unit Eligible',
                accessorKey: 'is_multi_unit_eligible',
                cell: ({ row }: { row: { original: OfferRow } }) => (row.original.is_multi_unit_eligible ? 'Yes' : 'No'),
            },
            {
                header: 'Set Size',
                accessorKey: 'set_size',
                cell: ({ row }: { row: { original: OfferRow } }) => row.original.set_size,
            },
            {
                header: 'Max Sets',
                accessorKey: 'max_sets',
                cell: ({ row }: { row: { original: OfferRow } }) => row.original.max_sets,
            },
            {
                header: 'Buy Qty',
                accessorKey: 'buy_quantity',
                cell: ({ row }: { row: { original: OfferRow } }) => row.original.buy_quantity,
            },
            {
                header: 'Get Qty',
                accessorKey: 'get_quantity',
                cell: ({ row }: { row: { original: OfferRow } }) => row.original.get_quantity,
            },
            {
                header: 'Get Reward Type',
                accessorKey: 'get_reward_type',
                cell: ({ row }: { row: { original: OfferRow } }) => row.original.get_reward_type,
            },
            {
                header: 'Get Reward Value',
                accessorKey: 'get_reward_value',
                cell: ({ row }: { row: { original: OfferRow } }) => row.original.get_reward_value,
            },
            {
                header: 'Daily Time Windows',
                accessorKey: 'daily_time_windows',
                cell: ({ row }: { row: { original: OfferRow } }) =>
                    Array.isArray(row.original.daily_time_windows)
                        ? row.original.daily_time_windows.map((tw: DailyTimeWindow) => `${tw.start} - ${tw.end}`).join(', ')
                        : '-',
            },
        ],
        [offerIdStore],
    )
}
