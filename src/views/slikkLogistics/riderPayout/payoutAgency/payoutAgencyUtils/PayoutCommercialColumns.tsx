/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAppSelector } from '@/store'
import { USER_PROFILE_DATA } from '@/store/types/company.types'
import { PayoutCommercialResponse } from '@/store/types/riderPayout.types'
import { ColumnDef } from '@tanstack/react-table'
import moment from 'moment'
import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

export const PayoutCommercialColumns = () => {
    const navigate = useNavigate()
    const storeList = useAppSelector<USER_PROFILE_DATA['store']>((state) => state.company.store)

    const storeMap = useMemo(() => {
        const map = new Map<number, string>()
        storeList?.forEach((s) => map.set(s.id, s.name))
        return map
    }, [storeList])

    return useMemo<ColumnDef<PayoutCommercialResponse>[]>(
        () => [
            {
                header: 'Agency',
                accessorKey: 'agency',
                cell: ({ row }) => (
                    <div
                        className="max-w-[180px] flex justify-center cursor-pointer hover:bg-blue-500 hover:rounded-lg hover:text-white items-center"
                        onClick={() => {
                            navigate('/app/riderAgency', {
                                state: { agency_search: row?.original?.agency },
                            })
                        }}
                    >
                        {row.original.agency || '--'}
                    </div>
                ),
            },
            {
                header: 'Payout',
                accessorKey: 'payout_model',
                cell: ({ row }) => (
                    <div
                        className="max-w-[180px] flex justify-center cursor-pointer hover:bg-green-500 hover:rounded-lg hover:text-white items-center"
                        onClick={() => {
                            navigate('/app/riderPayout', {
                                state: { payout_search: row?.original?.commercials?.name },
                            })
                        }}
                    >
                        {row.original?.commercials?.name || '--'}
                    </div>
                ),
            },

            {
                header: 'Store',
                accessorKey: 'store',
                cell: ({ row }) => (
                    <div>
                        {typeof row?.original?.store === 'string'
                            ? row?.original?.store
                            : (storeMap.get(Number(row.original.store)) ?? '-')}
                    </div>
                ),
            },

            {
                header: 'Created Date',
                accessorKey: 'created_date',
                cell: ({ row }) => (
                    <span className="text-xs text-gray-500">
                        {row.original.start_date ? moment(row.original.start_date).format('YYYY-MM-DD hh:mm a') : '--'}
                    </span>
                ),
            },
            {
                header: 'Updated Date',
                accessorKey: 'updated_date',
                cell: ({ row }) => (
                    <span className="text-xs text-gray-500">
                        {row.original.end_date ? moment(row.original.end_date).format('YYYY-MM-DD hh:mm a') : '--'}
                    </span>
                ),
            },
        ],
        [],
    )
}
