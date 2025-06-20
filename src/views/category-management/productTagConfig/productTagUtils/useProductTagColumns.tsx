/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo } from 'react'
import { FaEdit } from 'react-icons/fa'

interface props {
    setIsEditModal: (x: boolean) => void
    setParticularRow: (x: any) => void
}

export const useProductTagColumns = ({ setIsEditModal, setParticularRow }: props) => {
    return useMemo(
        () => [
            {
                header: 'Edit',
                accessorKey: 'edit',
                cell: ({ row }: any) => (
                    <div
                        onClick={() => {
                            setIsEditModal(true)
                            setParticularRow(row.original)
                        }}
                    >
                        <FaEdit className="text-xl text-blue-500 cursor-pointer" />
                    </div>
                ),
            },
            {
                header: 'Tag Name',
                accessorKey: 'tag_name',
                cell: ({ row }: any) => <div>{row?.original?.tag_name}</div>,
            },
            {
                header: 'Display Name',
                accessorKey: 'display_name',
                cell: ({ row }: any) => <div>{row?.original?.display_name}</div>,
            },
            {
                header: 'Domains',
                accessorKey: 'domains',
                cell: ({ row }: any) => (
                    <div>
                        {row?.original?.domains?.map((item: string, key: number) => {
                            return (
                                <div key={key}>
                                    <div className="flex flex-wrap gap-2">{item}</div>
                                </div>
                            )
                        })}
                    </div>
                ),
            },
            {
                header: 'File Header Name',
                accessorKey: 'file_header_name',
                cell: ({ row }: any) => <div>{row?.original?.file_header_name}</div>,
            },
            {
                header: 'Filter Name',
                accessorKey: 'filter_name',
                cell: ({ row }: any) => <div>{row?.original?.filter_name}</div>,
            },
            {
                header: 'Filter Position',
                accessorKey: 'filter_position',
                cell: ({ row }: any) => <div>{row?.original?.filter_position}</div>,
            },
            {
                header: 'Is Filter',
                accessorKey: 'is_filter',
                cell: ({ row }: any) => <div>{String(row?.original?.is_filter)}</div>,
            },
            {
                header: 'Is Tag',
                accessorKey: 'is_tag',
                cell: ({ row }: any) => <div>{String(row?.original?.is_tag)}</div>,
            },
            {
                header: 'Is Update Field',
                accessorKey: 'is_update_field',
                cell: ({ row }: any) => <div>{String(row?.original?.is_update_field)}</div>,
            },
            {
                header: 'Product Field Name',
                accessorKey: 'product_field_name',
                cell: ({ row }: any) => <div>{row?.original?.product_field_name}</div>,
            },
        ],
        [],
    )
}
