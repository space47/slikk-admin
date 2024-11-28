import { ColumnDef } from '@tanstack/react-table'
import React, { useMemo } from 'react'
import { NOTIFYSTATS, pageSizeOptions } from '../getNotiStats.common'
import moment from 'moment'
import EasyTable from '@/common/EasyTable'
import { Pagination, Select } from '@/components/ui'

interface SentProps {
    data: any[]
    page: number
    totalData: number
    pageSize: number
    onPaginationChange: any
    onSelectChange: any
}
type Option = {
    value: number
    label: string
}

const SentNotif = ({ data, page, pageSize, onPaginationChange, onSelectChange, totalData }: SentProps) => {
    const columns = useMemo<ColumnDef<NOTIFYSTATS>[]>(
        () => [
            {
                header: 'Name',
                accessorKey: 'name',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Title',
                accessorKey: 'title',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Message',
                accessorKey: 'message',
                cell: (info) => info.getValue(),
            },

            {
                header: 'Total users',
                accessorKey: 'total_users',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Success',
                accessorKey: 'success',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Failure',
                accessorKey: 'failure',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Create Date',
                accessorKey: 'create_date',
                cell: ({ getValue }) => <span>{moment(getValue() as string).format('YYYY-MM-DD hh:mm:ss a')}</span>,
            },

            {
                header: 'Notification',
                accessorKey: 'notification',
                cell: (info) => info.getValue(),
            },

            {
                header: 'Update Date',
                accessorKey: 'update_date',
                cell: ({ getValue }) => <span>{moment(getValue() as string).format('YYYY-MM-DD')}</span>,
            },
        ],
        [],
    )

    return (
        <div className="flex flex-col gap-2">
            <div className="font-bold text-xl">Sent Notification</div>
            <EasyTable overflow mainData={data} page={page} pageSize={pageSize} columns={columns} />
            <div className="flex items-center justify-between mt-4">
                <Pagination pageSize={pageSize} currentPage={page} total={totalData} onChange={(e) => onPaginationChange('sent', e)} />
                <div style={{ minWidth: 130 }}>
                    <Select<Option>
                        size="sm"
                        isSearchable={false}
                        value={pageSizeOptions.find((option) => option.value === pageSize)}
                        options={pageSizeOptions}
                        onChange={(option) => onSelectChange('sent', option?.value)}
                    />
                </div>
            </div>
        </div>
    )
}

export default SentNotif
