/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo } from 'react'
import moment from 'moment'
import { FaTrash } from 'react-icons/fa'

interface props {
    handleDeleteEvent: (id: number) => void
}

export const useEventsColumns = ({ handleDeleteEvent }: props) => {
    return useMemo(
        () => [
            {
                header: 'Name',
                accessorKey: 'name',
                cell: ({ row }: any) => {
                    const id = row.original.id
                    return (
                        <a
                            href={`/app/appsCommuncication/events/${id}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 no-underline"
                        >
                            {row.original.name}
                        </a>
                    )
                },
            },
            {
                header: 'Properties',
                accessorKey: 'attributes',
                cell: ({ row }: any) => (
                    <span
                        className="
                block 
                max-w-[250px] 
                max-h-[80px] 
                overflow-hidden 
                text-ellipsis 
                break-words 
                line-clamp-3
            "
                    >
                        {JSON.stringify(row?.original?.attributes)}
                    </span>
                ),
            },

            {
                header: 'create_date',
                accessorKey: 'create_date',
                cell: ({ row }: any) => <span>{moment(row.original.create_date).format('DD-MM-YYYY')}</span>,
            },
            {
                header: 'update_date',
                accessorKey: 'update_date',
                cell: ({ row }: any) => <span>{moment(row.original.update_date).format('DD-MM-YYYY')}</span>,
            },
            {
                header: 'Delete',
                accessorKey: 'id',
                cell: ({ row }: any) => (
                    <span>
                        <button className="p-2 bg-none no-underline" onClick={() => handleDeleteEvent(row.original.id)}>
                            <FaTrash className="text-red-600 text-2xl" />
                        </button>
                    </span>
                ),
            },
        ],
        [],
    )
}
