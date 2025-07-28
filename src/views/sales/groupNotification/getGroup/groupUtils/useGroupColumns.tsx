/* eslint-disable @typescript-eslint/no-explicit-any */
import { Spinner } from '@/components/ui'
import moment from 'moment'
import React, { useMemo } from 'react'
import { FaDownload, FaEdit } from 'react-icons/fa'

interface GroupColumn {
    handleEditClick: any
    handleDownloadUserCsv: any
    downloadSpinner: boolean
}

export const useGroupColumns = ({ handleEditClick, handleDownloadUserCsv, downloadSpinner }: GroupColumn) => {
    return useMemo(
        () => [
            {
                header: 'Edit',
                accessorKey: 'id',
                cell: ({ getValue }: any) => (
                    <button onClick={() => handleEditClick(getValue())}>
                        <FaEdit className="text-blue-500 text-xl" />
                    </button>
                ),
            },
            {
                header: 'name',
                accessorKey: 'name',
            },
            {
                header: 'Group',
                accessorKey: 'group',
                cell: ({ getValue }: any) => {
                    return getValue().map((item: any, key: any) => (
                        <div key={key} className="">
                            {item.name}
                        </div>
                    ))
                },
            },
            {
                header: 'USER INFO',
                accessorKey: 'rules?.userInfo',
                cell: ({ getValue }: any) => {
                    const orders = getValue()

                    return (
                        <div className="flex flex-col gap-2">
                            {orders?.map((item: any, key: any) => {
                                return (
                                    <div key={key} className="flex gap-2">
                                        <div>
                                            <strong>{item.type}:</strong>
                                        </div>
                                        <div>{JSON.stringify(item.value)}</div>
                                    </div>
                                )
                            })}
                        </div>
                    )
                },
            },
            {
                header: 'CART',
                accessorKey: 'rules.cart',
                cell: ({ getValue }: any) => {
                    const orders = getValue()

                    return (
                        <div className="flex flex-col gap-2">
                            {orders?.map((item: any, key: any) => {
                                return (
                                    <div key={key} className="flex gap-2">
                                        <div>
                                            <strong>{item.type}:</strong>
                                        </div>
                                        <div>{JSON.stringify(item.value)}</div>
                                    </div>
                                )
                            })}
                        </div>
                    )
                },
            },
            {
                header: 'Order',
                accessorKey: 'rules.order',
                cell: ({ getValue }: any) => {
                    const orders = getValue()

                    return (
                        <div className="flex flex-col gap-2">
                            {orders?.map((item: any, key: any) => {
                                return (
                                    <div key={key} className="flex gap-2">
                                        <div>
                                            <strong>{item.type}:</strong>
                                        </div>
                                        <div>{JSON.stringify(item.value)}</div>
                                    </div>
                                )
                            })}
                        </div>
                    )
                },
            },

            {
                header: 'Order Items',
                accessorKey: 'rules.order_item',
                cell: ({ getValue }: any) => {
                    const orders = getValue()

                    return (
                        <div className="flex flex-col gap-2">
                            {orders?.map((item: any, key: any) => {
                                return (
                                    <div key={key} className="flex gap-2">
                                        <div>
                                            <strong>{item.type}:</strong>
                                        </div>
                                        <div>{JSON.stringify(item.value)}</div>
                                    </div>
                                )
                            })}
                        </div>
                    )
                },
            },

            {
                header: 'Loyalty',
                accessorKey: 'rules.loyalty',
                cell: ({ getValue }: any) => {
                    const orders = getValue()

                    return (
                        <div className="flex flex-col gap-2">
                            {orders?.map((item: any, key: any) => {
                                return (
                                    <div key={key} className="flex gap-2">
                                        <div>
                                            <strong>{item.type}:</strong>
                                        </div>
                                        <div>{JSON.stringify(item.value)}</div>
                                    </div>
                                )
                            })}
                        </div>
                    )
                },
            },

            {
                header: 'Location',
                accessorKey: 'rules.location',
                cell: ({ getValue }: any) => {
                    const orders = getValue()

                    return (
                        <div className="flex flex-col gap-2">
                            {orders?.map((item: any, key: any) => {
                                return (
                                    <div key={key} className="flex gap-2">
                                        <div>
                                            <strong>{item.type}:</strong>
                                        </div>
                                        <div>{item.value}</div>
                                    </div>
                                )
                            })}
                        </div>
                    )
                },
            },

            {
                header: 'Create Date',
                accessorKey: 'create_date',
                cell: ({ getValue }: any) => <span className="">{moment(getValue()).format('YYYY-MM-DD hh:mm:ss a')}</span>,
            },

            {
                header: 'Download User CSV',
                accessorKey: '',
                cell: ({ row }: any) => (
                    <span className="">
                        <div>
                            {downloadSpinner ? (
                                <>
                                    <Spinner size={30} color="blue" />
                                </>
                            ) : (
                                <FaDownload
                                    className="text-xl cursor-pointer text-blue-700  hover:text-blue-500"
                                    onClick={() => handleDownloadUserCsv(row?.original?.id)}
                                />
                            )}
                        </div>
                    </span>
                ),
            },
        ],
        [],
    )
}
