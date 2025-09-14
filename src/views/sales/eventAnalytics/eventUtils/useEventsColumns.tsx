/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo } from 'react'
import moment from 'moment'

export const useEventsColumns = () => {
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
                cell: ({ row }: any) => <span>{JSON.stringify(row?.original?.attributes)}</span>,
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
        ],
        [],
    )
}
