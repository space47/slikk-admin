/* eslint-disable @typescript-eslint/no-explicit-any */
import { ColumnDef } from '@tanstack/react-table'
import React, { useMemo, useState } from 'react'
import { pageSizeOptions, Rules, SchedularTypes, SchedulerConfig } from '../getNotiStats.common'
import moment from 'moment'
import EasyTable from '@/common/EasyTable'
import { Pagination, Select } from '@/components/ui'
import { useNavigate } from 'react-router-dom'
import { TbPlayerTrackNextFilled } from 'react-icons/tb'
import { FaEdit } from 'react-icons/fa'
import { Switch } from 'antd'
import ActiveInactiveModal from '@/views/appsSettings/careers/careerDetails/ActiveInactiveModal'

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
    const [forActive, setForActive] = useState('')
    const [showModalForActive, setShowModalForActive] = useState(false)
    const [checkActive, setCheckActive] = useState(false)

    const handleActiveCareer = (id: number | string, e: React.MouseEvent, checked: boolean) => {
        setForActive(id as string)
        setShowModalForActive(true)
        setCheckActive(checked)
    }
    const navigate = useNavigate()
    const columns = useMemo<ColumnDef<SchedularTypes>[]>(
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
                cell: (info) => (
                    <button onClick={() => navigate(`/app/appsCommuncication/sendNotification/edit/${info.getValue()}`)}>
                        <FaEdit className="text-2xl text-blue-500" />
                    </button>
                ),
            },
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
            {
                header: 'Send Notification',
                accessorKey: 'notification',
                cell: ({ row }) => (
                    <button
                        onClick={() => navigate(`/app/appsCommuncication/sendNotification/${row.original.id}`)}
                        className="text-blue-600 hover:underline"
                    >
                        <TbPlayerTrackNextFilled className="text-2xl" />
                    </button>
                ),
            },
        ],
        [],
    )

    return (
        <div className="flex flex-col gap-2 mt-10">
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
            {showModalForActive && (
                <ActiveInactiveModal
                    dialogIsOpen={showModalForActive}
                    setIsOpen={setShowModalForActive}
                    idForUpdate={forActive}
                    isActive={checkActive}
                    url={`/user_notification/${forActive}`}
                    label="Notification"
                />
            )}
        </div>
    )
}

export default SchedularTable
