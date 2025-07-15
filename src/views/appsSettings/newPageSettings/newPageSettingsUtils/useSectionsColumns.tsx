/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo } from 'react'
import { FaEdit } from 'react-icons/fa'
import { MdAssignment } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'

// interface props {
//     handleGoToBanner: any
// }

export const useSectionsColumns = () => {
    const navigate = useNavigate()
    return useMemo(
        () => [
            {
                header: 'Edit',
                accessorKey: '',
                cell: ({ row }: any) => (
                    <button
                        className="border-none bg-none"
                        onClick={() => navigate(`/app/appSettings/newPageSettings/edit/${row?.original?.id}`)}
                    >
                        <FaEdit className="text-xl text-blue-600" />
                    </button>
                ),
            },

            {
                header: 'Section Heading',
                accessorKey: 'section_heading',
                cell: ({ row }: any) => {
                    const sectionHeading = row?.original?.section_heading

                    return (
                        <div
                            className="w-[180px] text-overflow:ellipsis cursor-pointer hover:text-blue-600"
                            // onClick={() => handleGoToBanner(sectionHeading)}
                        >
                            {sectionHeading}
                        </div>
                    )
                },
            },
            { header: 'Component Type', accessorKey: 'component_type' },
            {
                header: 'Background Image',
                accessorKey: 'background_config.background_image',
                cell: (info: any) => (
                    <img src={info.getValue() as string} alt="" className="object-contain bg-black" width={100} height={70} />
                ),
            },
            {
                header: 'Mobile Background Image',
                accessorKey: 'background_config.mobile_background_image',
                cell: (info: any) => (
                    <img src={info.getValue() as string} alt="" className="object-contain bg-black" width={100} height={70} />
                ),
            },
            { header: 'Data Type', accessorKey: 'data_type.type' },
            {
                header: 'Section',
                accessorKey: 'is_section_clickable',
                cell: (info: any) => (info.getValue() ? 'Yes' : 'No'),
            },

            {
                header: 'Edit Assigned Section',
                accessorKey: '',
                cell: ({ row }: any) => (
                    <button
                        className="border-none bg-none"
                        onClick={() => navigate(`/app/appSettings/newPageSettings/assignSection/${row?.original?.id}`)}
                    >
                        <MdAssignment className="text-3xl text-red-600" />
                    </button>
                ),
            },
        ],
        [],
    )
}
