/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'
import { FaEdit } from 'react-icons/fa'

interface Props {
    handleDetailsModal: (mobile: string) => void
    handleEditModal: (data: any) => void
}

export const usePickerColumns = ({ handleDetailsModal, handleEditModal }: Props) => {
    const navigate = useNavigate()

    return useMemo(
        () => [
            {
                header: 'Edit',
                accessorKey: 'edit',
                cell: ({ row }: { row: { original: any } }) => (
                    <div className="font-medium text-blue-500 dark:text-white cursor-pointer" onClick={() => handleEditModal(row.original)}>
                        <FaEdit className="text-xl flex justify-center items-center" />
                    </div>
                ),
            },
            {
                header: 'Name',
                accessorKey: 'user.first_name',
                cell: ({ row }: { row: { original: any } }) => {
                    const user = row.original.user
                    const fullName = `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || 'N/A'
                    return (
                        <div
                            className="font-medium text-green-500 dark:text-white cursor-pointer"
                            onClick={() => handleDetailsModal(user?.mobile)}
                        >
                            {fullName}
                        </div>
                    )
                },
            },
            {
                header: 'Mobile',
                accessorKey: 'user.mobile',
                cell: ({ getValue }: any) => (
                    <div
                        className="text-blue-600 font-semibold dark:text-blue-600 cursor-pointer"
                        onClick={() => navigate(`/app/pickerDetails/${getValue()}`)}
                    >
                        {getValue() || 'N/A'}
                    </div>
                ),
            },
            {
                header: 'Email',
                accessorKey: 'user.email',
                cell: ({ getValue }: any) => <div className="text-gray-700 dark:text-white">{getValue() || 'N/A'}</div>,
            },
            {
                header: 'Stores',
                accessorKey: 'store',
                cell: ({ row }: { row: { original: any } }) => (
                    <div className="text-gray-700 dark:text-white">
                        {row.original.store?.length > 0 ? row.original.store.map((s: any) => s.name).join(', ') : 'N/A'}
                    </div>
                ),
            },
            {
                header: 'Shift Timing',
                accessorKey: 'shift_start_time',
                cell: ({ row }: { row: { original: any } }) => {
                    const { shift_start_time, shift_end_time } = row.original
                    return (
                        <div className="text-gray-700 dark:text-white">
                            {shift_start_time && shift_end_time ? `${shift_start_time} - ${shift_end_time}` : 'N/A'}
                        </div>
                    )
                },
            },
            {
                header: 'Active',
                accessorKey: 'is_active',
                cell: ({ getValue }: any) => (
                    <div className={getValue() ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                        {getValue() ? 'Yes' : 'No'}
                    </div>
                ),
            },
            {
                header: 'KYC Verified',
                accessorKey: 'kyc_status',
                cell: ({ getValue }: any) => (
                    <div className={getValue() ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                        {getValue() ? 'Verified' : 'Pending'}
                    </div>
                ),
            },
            {
                header: 'Created At',
                accessorKey: 'create_date',
                cell: ({ getValue }: any) => (
                    <div className="text-gray-700 dark:text-white">
                        {getValue() ? moment(getValue()).format('DD MMM YYYY, HH:mm') : 'N/A'}
                    </div>
                ),
            },
            {
                header: 'Updated At',
                accessorKey: 'update_date',
                cell: ({ getValue }: any) => (
                    <div className="text-gray-700 dark:text-white">
                        {getValue() ? moment(getValue()).format('DD MMM YYYY, HH:mm') : 'N/A'}
                    </div>
                ),
            },
        ],
        [handleEditModal, handleDetailsModal, navigate],
    )
}
