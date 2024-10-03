import React, { useEffect, useMemo } from 'react'
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table'
import Table from '@/components/ui/Table'
import { NotificationEvent } from './commonNotification'
import { fetchNotification, setPage, setPageSize } from '@/store/slices/notificationSlice/notificationSlice'
import { useAppDispatch, useAppSelector } from '@/store'
import { NotificationData } from '@/store/types/notification.types'
import moment from 'moment'
import { Button } from '@/components/ui'
import { useNavigate } from 'react-router-dom'

const { Tr, Th, Td, THead, TBody } = Table
const NotificationTable = () => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    const { notification, page, pageSize, count } = useAppSelector((state: { notification: NotificationData }) => state.notification)

    useEffect(() => {
        dispatch(fetchNotification())
    }, [dispatch, page, pageSize])

    console.log('NOTIFICATION', notification)

    const columns = useMemo(
        () => [
            { header: 'Title', accessorKey: 'title' },
            { header: 'Event Name', accessorKey: 'event_name' },
            { header: 'Type', accessorKey: 'notification_type' },
            { header: 'Message', accessorKey: 'message' },
            { header: 'Mobile', accessorKey: 'mobile' },
            {
                header: 'Create Date',
                accessorKey: 'create_date',
                cell: ({ getValue }) => <span className="">{moment(getValue()).format('YYYY-MM-DD hh:mm:ss a')}</span>,
            },
            {
                header: 'Update Date',
                accessorKey: 'update_date',
                cell: ({ getValue }) => <span className="">{moment(getValue()).format('YYYY-MM-DD hh:mm:ss a')}</span>,
            },
            {
                header: 'Image',
                accessorKey: 'config_data.image_url',
                cell: ({ getValue }) => {
                    console.log('IMAGE DATA', getValue())
                    return <img src={getValue()} alt="product" width="50" />
                },
            },
            {
                header: 'target_page',
                accessorKey: 'config_data.target_page',
            },
            {
                header: 'page_title',
                accessorKey: 'config_data.page_title',
            },
            {
                header: 'notification_title',
                accessorKey: 'config_data.notification_title',
            },
            {
                header: 'body',
                accessorKey: 'config_data.body',
            },
        ],
        [],
    )

    const table = useReactTable({
        data: notification || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: false,
        // state: {
        //     pagination: {
        //         pageIndex: 0,
        //         pageSize: data?.results?.length || 10,
        //     },
        // },
    })

    const handleAddNotification = () => {
        navigate('/app/appSettings/addNotification')
    }

    return (
        <div className="flex flex-col gap-5">
            {' '}
            <div className="flex justify-end">
                <Button variant="new" onClick={handleAddNotification}>
                    Add Config
                </Button>
            </div>
            <div className="overflow-x-auto">
                <Table className="min-w-full">
                    <THead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <Tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <Th key={header.id}>{flexRender(header.column.columnDef.header, header.getContext())}</Th>
                                ))}
                            </Tr>
                        ))}
                    </THead>
                    <TBody>
                        {table.getRowModel().rows.map((row) => (
                            <Tr key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <Td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</Td>
                                ))}
                            </Tr>
                        ))}
                    </TBody>
                </Table>
            </div>
        </div>
    )
}

export default NotificationTable
