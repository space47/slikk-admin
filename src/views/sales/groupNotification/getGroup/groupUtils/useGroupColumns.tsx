/* eslint-disable @typescript-eslint/no-explicit-any */
import { Spinner } from '@/components/ui'
import { Switch } from 'antd'
import moment from 'moment'
import React, { useMemo } from 'react'
import { FaDownload, FaEdit, FaEye } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

interface GroupColumn {
    handleEditClick: any
    handleDownloadUserCsv: any
    downloadSpinner: boolean
    handleActiveCareer: any
}

export const useGroupColumns = ({ handleEditClick, handleDownloadUserCsv, downloadSpinner, handleActiveCareer }: GroupColumn) => {
    const navigate = useNavigate()
    return useMemo(
        () => [
            {
                header: 'Activate / Inactivate',
                accessorKey: 'is_active',
                cell: ({ row }: any) => {
                    return (
                        <div>
                            <Switch
                                className="bg-red-500"
                                checked={row.original.is_active}
                                onChange={(checked) => handleActiveCareer(row.original.id, checked, row.original.is_active)}
                            />
                        </div>
                    )
                },
            },
            {
                header: 'Edit',
                accessorKey: 'id',
                cell: ({ getValue }: any) => (
                    // <button onClick={() => handleEditClick(getValue())}>
                    //     <FaEdit className="text-blue-500 text-xl" />
                    ///appsCommuncication/events/:id`
                    // </button>
                    <a href={`/app/appsCommuncication/cohorts/${getValue()}`} target="_blank" rel="noreferrer" className="">
                        <FaEdit className="text-blue-500 text-xl" />
                    </a>
                ),
            },
            {
                header: 'View Users',
                accessorKey: 'group users',
                cell: ({ row }: any) => (
                    <a href={`/app/appsCommuncication/eventUsers/${row?.original?.id}`} target="_blank" rel="noreferrer" className="">
                        <FaEye className="text-blue-500 text-xl cursor-pointer" />
                    </a>
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
                header: 'User',
                accessorKey: 'users',
                cell: ({ row }: any) => {
                    return <div>{row?.original.user?.length || 0} Users</div>
                },
            },
            // {
            //     header: 'USER INFO',
            //     accessorKey: 'rules?.userInfo',
            //     cell: ({ getValue }: any) => {
            //         const orders = getValue()

            //         return (
            //             <div className="flex flex-col gap-2">
            //                 {orders?.map((item: any, key: any) => {
            //                     return (
            //                         <div key={key} className="flex gap-2">
            //                             <div>
            //                                 <strong>{item.type}:</strong>
            //                             </div>
            //                             <div>{JSON.stringify(item.value)}</div>
            //                         </div>
            //                     )
            //                 })}
            //             </div>
            //         )
            //     },
            // },
            // {
            //     header: 'CART',
            //     accessorKey: 'rules.cart',
            //     cell: ({ getValue }: any) => {
            //         const orders = getValue()

            //         return (
            //             <div className="flex flex-col gap-2">
            //                 {orders?.map((item: any, key: any) => {
            //                     return (
            //                         <div key={key} className="flex gap-2">
            //                             <div>
            //                                 <strong>{item.type}:</strong>
            //                             </div>
            //                             <div>{JSON.stringify(item.value)}</div>
            //                         </div>
            //                     )
            //                 })}
            //             </div>
            //         )
            //     },
            // },
            // {
            //     header: 'Order',
            //     accessorKey: 'rules.order',
            //     cell: ({ getValue }: any) => {
            //         const orders = getValue()

            //         return (
            //             <div className="flex flex-col gap-2">
            //                 {orders?.map((item: any, key: any) => {
            //                     return (
            //                         <div key={key} className="flex gap-2">
            //                             <div>
            //                                 <strong>{item.type}:</strong>
            //                             </div>
            //                             <div>{JSON.stringify(item.value)}</div>
            //                         </div>
            //                     )
            //                 })}
            //             </div>
            //         )
            //     },
            // },

            // {
            //     header: 'Order Items',
            //     accessorKey: 'rules.order_item',
            //     cell: ({ getValue }: any) => {
            //         const orders = getValue()

            //         return (
            //             <div className="flex flex-col gap-2">
            //                 {orders?.map((item: any, key: any) => {
            //                     return (
            //                         <div key={key} className="flex gap-2">
            //                             <div>
            //                                 <strong>{item.type}:</strong>
            //                             </div>
            //                             <div>{JSON.stringify(item.value)}</div>
            //                         </div>
            //                     )
            //                 })}
            //             </div>
            //         )
            //     },
            // },

            // {
            //     header: 'Loyalty',
            //     accessorKey: 'rules.loyalty',
            //     cell: ({ getValue }: any) => {
            //         const orders = getValue()

            //         return (
            //             <div className="flex flex-col gap-2">
            //                 {orders?.map((item: any, key: any) => {
            //                     return (
            //                         <div key={key} className="flex gap-2">
            //                             <div>
            //                                 <strong>{item.type}:</strong>
            //                             </div>
            //                             <div>{JSON.stringify(item.value)}</div>
            //                         </div>
            //                     )
            //                 })}
            //             </div>
            //         )
            //     },
            // },

            // {
            //     header: 'Location',
            //     accessorKey: 'rules.location',
            //     cell: ({ getValue }: any) => {
            //         const orders = getValue()

            //         return (
            //             <div className="flex flex-col gap-2">
            //                 {orders?.map((item: any, key: any) => {
            //                     return (
            //                         <div key={key} className="flex gap-2">
            //                             <div>
            //                                 <strong>{item.type}:</strong>
            //                             </div>
            //                             <div>{item.value}</div>
            //                         </div>
            //                     )
            //                 })}
            //             </div>
            //         )
            //     },
            // },

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
