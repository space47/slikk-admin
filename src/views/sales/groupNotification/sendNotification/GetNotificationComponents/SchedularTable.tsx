/* eslint-disable @typescript-eslint/no-explicit-any */
import { ColumnDef } from '@tanstack/react-table'
import React, { useMemo } from 'react'
import { NOTIFYSTATS, OtherConfig, pageSizeOptions, Rules, SchedularTypes, SchedulerConfig, User } from '../getNotiStats.common'
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

const SchedularTable = ({ data, page, pageSize, onPaginationChange, onSelectChange, totalData }: SentProps) => {
    const columns = useMemo<ColumnDef<SchedularTypes>[]>(
        () => [
            {
                header: 'ID',
                accessorKey: 'id',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Name',
                accessorKey: 'name',
                cell: (info) => info.getValue(),
            },
            // {
            //     header: 'User Name',
            //     accessorKey: 'users',
            //     cell: (info) => {
            //         const value = info.getValue();

            //     },
            // },

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
                header: 'Redirect URL',
                accessorKey: 'redirect_url',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Template ID',
                accessorKey: 'template_id',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Image',
                accessorKey: 'image',
                cell: (info) => <img src={info.getValue() as string} alt="Notification Image" className="w-32" />,
            },
            {
                header: 'Is Active',
                accessorKey: 'is_active',
                cell: (info) => (info.getValue() ? 'Yes' : 'No'),
            },
            {
                header: 'Scheduler Config',
                accessorKey: 'scheduler_config',
                cell: (info) => {
                    const { day, hour, year, month, minute } = info.getValue() as SchedulerConfig
                    return `${day} ${month} ${year} at ${hour}:${minute}`
                },
            },
            // {
            //     header: 'Next Run Time',
            //     accessorKey: 'next_run_time',
            //     cell: (info) => (info.getValue() ? moment(info.getValue() as string).format('YYYY-MM-DD hh:mm:ss a') : '-'),
            // },
            // {
            //     header: 'Last Run Time',
            //     accessorKey: 'last_run_time',
            //     cell: (info) => (info.getValue() ? moment(info.getValue() as string).format('YYYY-MM-DD hh:mm:ss a') : '-'),
            // },
            // {
            //     header: 'Other Config',
            //     accessorKey: 'other_config',
            //     cell: (info) => {
            //         const { key, filters, page_title, target_page } = info.getValue() as OtherConfig
            //         return `${key} | Filters: ${filters.join(', ')} | Page: ${page_title} | Target: ${target_page}`
            //     },
            // },
            {
                header: 'Min Purchase',
                accessorKey: 'rules',
                cell: (info) => (info.getValue() as Rules).min_purchase,
            },
            {
                header: 'Status Logs',
                accessorKey: 'status_logs',
                cell: (info) => JSON.stringify(info.getValue()), // You can adjust based on how you want to display status logs
            },
            {
                header: 'Expiry Date',
                accessorKey: 'expiry_date',
                cell: ({ getValue }) => <span>{moment(getValue() as string).format('YYYY-MM-DD')}</span>,
            },
            {
                header: 'Create Date',
                accessorKey: 'create_date',
                cell: ({ getValue }) => <span>{moment(getValue() as string).format('YYYY-MM-DD hh:mm:ss a')}</span>,
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
            <div className="font-bold text-xl">Schedular Notification</div>
            <EasyTable overflow mainData={data} page={page} pageSize={pageSize} columns={columns} />
            <div className="flex items-center justify-between mt-4">
                <Pagination pageSize={pageSize} currentPage={page} total={totalData} onChange={(e) => onPaginationChange('schedule', e)} />
                <div style={{ minWidth: 130 }}>
                    <Select<Option>
                        size="sm"
                        isSearchable={false}
                        value={pageSizeOptions.find((option) => option.value === pageSize)}
                        options={pageSizeOptions}
                        onChange={(option) => onSelectChange('schedule', option?.value)}
                    />
                </div>
            </div>
        </div>
    )
}

export default SchedularTable
