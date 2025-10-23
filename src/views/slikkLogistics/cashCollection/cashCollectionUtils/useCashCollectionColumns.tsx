/* eslint-disable @typescript-eslint/no-explicit-any */
import moment from 'moment'
import React, { useMemo } from 'react'
import { FaCashRegister } from 'react-icons/fa'
import { RxPencil2 } from 'react-icons/rx'

interface props {
    handleUpdateCash: any
    handleDailyCash: any
}

export const useCashCollectionColumns = ({ handleUpdateCash, handleDailyCash }: props) => {
    return useMemo(
        () => [
            {
                header: 'Daily Cash Collect',
                accessorKey: 'rider',
                cell: ({ row }: any) => {
                    return (
                        <div onClick={() => handleDailyCash(row?.original)} className="cursor-pointer">
                            <FaCashRegister className="text-2xl text-green-500" />
                        </div>
                    )
                },
            },
            {
                header: 'Rider Name',
                accessorKey: 'rider',
                cell: ({ row }: any) => {
                    return <div>{row?.original?.rider?.user?.name}</div>
                },
            },
            {
                header: 'Rider Mobile',
                accessorKey: 'rider',
                cell: ({ row }: any) => {
                    return <div>{row?.original?.rider?.user?.mobile}</div>
                },
            },
            {
                header: 'Rider Type',
                accessorKey: 'rider',
                cell: ({ row }: any) => {
                    return <div>{row?.original?.rider?.rider_type}</div>
                },
            },
            {
                header: 'Rider Agency',
                accessorKey: 'rider',
                cell: ({ row }: any) => {
                    return <div>{row?.original?.rider?.agency}</div>
                },
            },
            {
                header: 'Cash to be collected',
                accessorKey: 'rider',
                cell: ({ row }: any) => {
                    return <div>{row?.original?.expected_cash_collected}</div>
                },
            },
            {
                header: 'Cash Collected',
                accessorKey: 'rider',
                cell: ({ row }: any) => {
                    return <div>{row?.original?.cash_collected}</div>
                },
            },
            {
                header: 'Cash Deposited',
                accessorKey: 'rider',
                cell: ({ row }: any) => {
                    return (
                        <div className="flex gap-2 items-center">
                            {row?.original?.cash_deposited}
                            <span>
                                <RxPencil2
                                    className="text-2xl font-bold text-blue-700 cursor-pointer"
                                    onClick={() => handleUpdateCash(row?.original)}
                                />
                            </span>
                        </div>
                    )
                },
            },
            {
                header: 'Collection Date',
                accessorKey: 'rider',
                cell: ({ row }: any) => {
                    return <div>{row?.original?.collection_date}</div>
                },
            },
            {
                header: 'Deposited To',
                accessorKey: 'rider',
                cell: ({ row }: any) => {
                    return (
                        <div>
                            {row?.original?.deposited_to?.first_name}-{row?.original?.deposited_to?.last_name}
                        </div>
                    )
                },
            },
            {
                header: 'Last Updated By',
                accessorKey: 'rider',
                cell: ({ row }: any) => {
                    return <div>{row?.original?.last_updated_by?.mobile}</div>
                },
            },
            {
                header: 'Create Date',
                accessorKey: 'rider',
                cell: ({ row }: any) => {
                    return <div>{moment(row?.original?.create_date).format('YYYY-MM-DD')}</div>
                },
            },
            {
                header: 'Update Date',
                accessorKey: 'rider',
                cell: ({ row }: any) => {
                    return <div>{moment(row?.original?.update_date).format('YYYY-MM-DD')}</div>
                },
            },
        ],
        [],
    )
}
