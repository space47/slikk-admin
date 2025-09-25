/* eslint-disable @typescript-eslint/no-explicit-any */
import moment from 'moment'
import React, { useMemo } from 'react'
import { FaEdit } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

export const useSubPageColumns = () => {
    const navigate = useNavigate()
    return useMemo(
        () => [
            {
                header: 'Edit',
                accessorKey: '',
                cell: ({ row }: any) => {
                    return (
                        <div onClick={() => navigate(`/app/appSettings/pageSubPage/editSubPage/${row?.original?.id}`)}>
                            <FaEdit className="text-xl cursor-pointer text-blue-500" />
                        </div>
                    )
                },
            },
            {
                header: 'name',
                accessorKey: 'name',
                cell: ({ row }: any) => {
                    return <div>{row?.original?.name}</div>
                },
            },
            {
                header: 'Last Updated By',
                accessorKey: 'last_updated_by',
                cell: ({ row }: any) => {
                    return <div>{row?.original?.last_updated_by}</div>
                },
            },
            {
                header: 'Create Date',
                accessorKey: 'create_date',
                cell: ({ row }: any) => {
                    return <div>{moment(row?.original?.create_date).format('YYYY-MM-DD HH:mm:ss')}</div>
                },
            },
            {
                header: 'Image',
                accessorKey: 'image',
                cell: ({ row }: any) => {
                    const imageUrl = row?.original?.image?.split(',')[0]
                    return (
                        <>
                            <img src={imageUrl} alt="Image" className="w-24 h-20 object-cover cursor-pointer" />
                        </>
                    )
                },
            },
            {
                header: 'update Date',
                accessorKey: 'update_date',
                cell: ({ row }: any) => {
                    return <div>{moment(row?.original?.update_date).format('YYYY-MM-DD HH:mm:ss')}</div>
                },
            },
        ],
        [],
    )
}
