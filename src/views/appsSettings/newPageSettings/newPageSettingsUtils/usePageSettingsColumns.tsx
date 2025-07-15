/* eslint-disable @typescript-eslint/no-explicit-any */
import moment from 'moment'
import React, { useMemo } from 'react'
import { FaEdit } from 'react-icons/fa'
import { MdAssignment } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'

interface props {
    handleGoToBanner: any
    positionRef: any
    handlePositionChange: any
    updatedPosition: any
    handleUpdate: any
}

export const usePageSettingsColumns = ({ handleGoToBanner, positionRef, handlePositionChange, updatedPosition, handleUpdate }: props) => {
    const navigate = useNavigate()
    return useMemo(
        () => [
            {
                header: 'Edit',
                accessorKey: '',
                cell: ({ row }: any) => (
                    <button
                        className="border-none bg-none"
                        onClick={() => navigate(`/app/appSettings/newPageSettings/edit/${row?.original?.section?.id}`)}
                    >
                        <FaEdit className="text-xl text-blue-600" />
                    </button>
                ),
            },

            {
                header: 'Section Heading',
                accessorKey: 'section_heading',
                cell: ({ row }: any) => {
                    const sectionHeading = row?.original?.section?.section_heading

                    return (
                        <div
                            className="w-[180px] text-overflow:ellipsis cursor-pointer hover:text-blue-600"
                            onClick={() => handleGoToBanner(sectionHeading)}
                        >
                            {sectionHeading}
                        </div>
                    )
                },
            },
            {
                header: 'Position',
                accessorKey: 'position',
                cell: ({ row }: any) => {
                    const index = row.original?.id

                    return (
                        <input
                            ref={(el) => (positionRef.current[index] = el)}
                            className="w-[70px] rounded-xl"
                            type="number"
                            value={updatedPosition[index] ?? row.original.position}
                            onChange={(e) => handlePositionChange(index, Number(e.target.value))}
                            onKeyDown={(e) => handleUpdate(e, row?.original?.id)}
                        />
                    )
                },
            },
            {
                header: 'Display Name',
                accessorKey: 'display_name',
                cell: ({ row }: any) => {
                    const display = row?.original?.section?.display_name

                    return (
                        <div
                            className="w-[180px] text-overflow:ellipsis cursor-pointer hover:text-blue-600"
                            onClick={() => navigate(`/app/appSettings/sections/${row?.original?.section?.id}`)}
                        >
                            {display}
                        </div>
                    )
                },
            },
            { header: 'Page', accessorKey: 'page' },
            { header: 'Sub Page', accessorKey: 'sub_page' },
            {
                header: 'Stores Assigned',
                accessorKey: 'stores',
                cell: ({ row }: any) => {
                    return <div>{row?.original?.store?.map((item: any, key: any) => <div key={key}>{item?.name}</div>)}</div>
                },
            },
            { header: 'Last Updated By', accessorKey: 'last_updated_by.name' },
            { header: 'Last Updated By Number', accessorKey: 'last_updated_by.mobile' },
            {
                header: 'Created Date',
                accessorKey: 'create_date',
                cell: ({ row }: any) => moment(row.original.create_date).format('YYYY-MM-DD HH:mm:ss'),
            },
            {
                header: 'Updated Date',
                accessorKey: 'update_date',
                cell: ({ row }: any) => moment(row.original.update_date).format('YYYY-MM-DD HH:mm:ss'),
            },
            {
                header: 'Edit Assigned Section',
                accessorKey: '',
                cell: ({ row }: any) => (
                    <button
                        className="border-none bg-none"
                        onClick={() => navigate(`/app/appSettings/newPageSettings/assignSection/${row?.original?.section?.id}`)}
                    >
                        <MdAssignment className="text-3xl text-red-600" />
                    </button>
                ),
            },
        ],
        [positionRef, updatedPosition],
    )
}
