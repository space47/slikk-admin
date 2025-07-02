/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dropdown } from '@/components/ui'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import moment from 'moment'
import React, { useMemo } from 'react'

export const STATUS_OPTIONS = [
    { label: 'SUBMITTED', value: 'SUBMITTED' },
    { label: 'REVIEWED', value: 'REVIEWED' },
    { label: 'INTERVIEWING', value: 'INTERVIEWING' },
    { label: 'OFFERED', value: 'OFFERED' },
    { label: 'REJECTED', value: 'REJECTED' },
]

interface props {
    applicantStatus: {
        [key: string]: {
            value: string
            label: string
        }
    }
    handleApplicantStatus: any
}

export const CareerColumns = ({ applicantStatus, handleApplicantStatus }: props) => {
    return useMemo(
        () => [
            {
                header: 'Name',
                accessorKey: 'name',
                cell: ({ row }: any) => <div>{row.original.name}</div>,
            },
            {
                header: 'Mobile',
                accessorKey: 'mobile',
                cell: ({ row }: any) => <div>{row.original.mobile}</div>,
            },
            {
                header: 'Email',
                accessorKey: 'email',
                cell: ({ row }: any) => <div>{row.original.email}</div>,
            },
            {
                header: 'Current Location',
                accessorKey: 'current_location',
                cell: ({ row }: any) => <div>{row.original.current_location}</div>,
            },
            {
                header: 'Resume',
                accessorKey: 'resume',
                cell: ({ row }: any) =>
                    row.original.resume ? (
                        <a href={row.original.resume} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                            View Resume
                        </a>
                    ) : (
                        'N/A'
                    ),
            },
            {
                header: 'Notice Period',
                accessorKey: 'notice_period',
                cell: ({ row }: any) => <div>{row.original.notice_period ?? 'N/A'}</div>,
            },
            {
                header: 'Cover Letter',
                accessorKey: 'cover_letter',
                cell: ({ row }: any) => <div>{row.original.cover_letter}</div>,
            },
            {
                header: 'Status',
                accessorKey: 'status',
                cell: ({ row }: any) => {
                    const Rowid = row?.original.id
                    const selectedStatus = applicantStatus[Rowid]?.label || row.original?.status || 'SELECT'
                    return (
                        <Dropdown
                            className="w-full px-4 py-2 text-xl text-black bg-gray-100 border border-gray-300 rounded-md shadow-sm"
                            title={selectedStatus}
                            onSelect={(value) => handleApplicantStatus(value, Rowid)}
                        >
                            <div className="max-h-60 overflow-y-auto">
                                {STATUS_OPTIONS.map((item, key) => (
                                    <DropdownItem
                                        key={key}
                                        eventKey={item.value}
                                        className="px-2 py-2 text-black hover:bg-gray-100 cursor-pointer"
                                    >
                                        <span>{item.label}</span>
                                    </DropdownItem>
                                ))}
                            </div>
                        </Dropdown>
                    )
                },
            },
            {
                header: 'Applied At',
                accessorKey: 'applied_at',
                cell: ({ row }: any) => <div>{moment(row.original.applied_at).format('DD-MM-YYYY HH:mm A')}</div>,
            },
            {
                header: 'Updated At',
                accessorKey: 'updated_at',
                cell: ({ row }: any) => <div>{moment(row.original.updated_at).format('DD-MM-YYYY HH:mm A')}</div>,
            },
            {
                header: 'LinkedIn Profile',
                accessorKey: 'linkedin_profile',
                cell: ({ row }: any) =>
                    row.original.linkedin_profile ? (
                        <a
                            href={row.original.linkedin_profile}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 underline"
                        >
                            LinkedIn
                        </a>
                    ) : (
                        'N/A'
                    ),
            },
        ],
        [applicantStatus],
    )
}

export default CareerColumns
