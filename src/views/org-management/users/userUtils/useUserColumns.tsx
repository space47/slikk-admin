import { ColumnDef } from '@tanstack/react-table'
import React, { useMemo } from 'react'
import { User } from '../userCommonTypes/UserCommonTypes'
import { Button } from '@/components/ui'
import { FaEdit } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { MdImageNotSupported } from 'react-icons/md'

export const useUserColumns = () => {
    const navigate = useNavigate()
    return useMemo<ColumnDef<User>[]>(
        () => [
            {
                header: 'Name',
                accessorFn: (row) => `${row.first_name} ${row.last_name}`,
                cell: (info) => info.getValue(),
            },
            {
                header: 'Mobile',
                accessorKey: 'mobile',
                cell: (info) => info.getValue(),
            },
            {
                header: 'EMAIL',
                accessorKey: 'business_email',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Image',
                accessorKey: 'image',
                cell: ({ row }) => {
                    return row?.original?.image ? (
                        <img src={row?.original?.image} alt="User" className="w-12 h-12 object-cover" />
                    ) : (
                        <div className="flex items-center ">
                            <MdImageNotSupported className="text-2xl" />
                        </div>
                    )
                },
            },
            {
                header: 'Edit',
                accessorKey: '',
                cell: ({ row }) => (
                    <Button onClick={() => navigate(`/app/users/edit/${row?.original?.mobile}`)} className="bg-none border-none">
                        <FaEdit className="text-xl text-blue-600" />
                    </Button>
                ),
            },
        ],
        [],
    )
}
