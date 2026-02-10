/* eslint-disable @typescript-eslint/no-explicit-any */
import { Tooltip } from '@/components/ui'
import moment from 'moment'
import React, { useMemo } from 'react'
import { FaEdit } from 'react-icons/fa'
import { MdAssignment } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'

interface props {
    handleGoToBanner: any
    mainPageSettingsData: any
    pageIdStore: any
    handleSelectAllBanners: any
    handleSelectPageId: any
    currentPageName?:
        | {
              label: string
              value: number | null
          }
        | undefined
}

export const usePageSettingsColumns = ({
    handleGoToBanner,
    mainPageSettingsData,
    pageIdStore,
    handleSelectAllBanners,
    handleSelectPageId,
    currentPageName,
}: props) => {
    const navigate = useNavigate()
    return useMemo(
        () => [
            {
                header: (
                    <div className="flex flex-col gap-2 items-center justify-center">
                        <input
                            type="checkbox"
                            name="selectAll"
                            checked={mainPageSettingsData?.length > 0 && pageIdStore?.length === mainPageSettingsData?.length}
                            onChange={handleSelectAllBanners}
                        />
                    </div>
                ),
                accessorKey: 'id',
                cell: ({ row }: { row: { original: any } }) => {
                    const pageId = row.original.id
                    return (
                        <div className="flex items-center justify-center">
                            <input
                                type="checkbox"
                                name="pageId"
                                checked={pageIdStore.includes(pageId)}
                                onChange={(e) => handleSelectPageId(pageId, e.target.checked)}
                            />
                        </div>
                    )
                },
            },
            {
                header: 'Edit',
                accessorKey: '',
                cell: ({ row }: any) => (
                    <button
                        className="border-none bg-none"
                        onClick={() =>
                            navigate(`/app/appSettings/newPageSettings/edit/${row?.original?.section?.id}`, {
                                state: {
                                    pageState: currentPageName?.label,
                                },
                            })
                        }
                    >
                        <Tooltip title="Edit the section related to this page sections">
                            <FaEdit className="text-xl text-blue-600" />
                        </Tooltip>
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
                            <Tooltip title="Go to Banners with the section heading">{sectionHeading}</Tooltip>
                        </div>
                    )
                },
            },
            // {
            //     header: 'Position',
            //     accessorKey: 'position',
            //     cell: ({ row }: any) => {
            //         const index = row.original?.id
            //         return (
            //             <input
            //                 ref={(el) => (positionRef.current[index] = el)}
            //                 className="w-[70px] rounded-xl"
            //                 type="number"
            //                 value={updatedPosition[index] ?? row.original.position}
            //                 onChange={(e) => handlePositionChange(index, Number(e.target.value))}
            //                 onKeyDown={(e) => handleUpdate(e, row?.original?.id)}
            //             />
            //         )
            //     },
            // },
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
                            <Tooltip title="Go to the particular section related to this page section">{display}</Tooltip>
                        </div>
                    )
                },
            },
            {
                header: 'BG Image',
                accessorKey: 'extra_attributes.background_image',
                cell: ({ row }: any) => {
                    const imageUrl = row?.original?.extra_attributes?.background_image

                    return (
                        <div>
                            {imageUrl ? (
                                <>
                                    <img src={imageUrl} alt="Image" className="w-24 h-20 object-cover cursor-pointer" />
                                </>
                            ) : (
                                'N/A'
                            )}
                        </div>
                    )
                },
            },
            {
                header: 'Mobile BG Image',
                accessorKey: 'extra_attributes.mobile_background_image',
                cell: ({ row }: any) => {
                    const imageUrl = row?.original?.extra_attributes?.mobile_background_image

                    return (
                        <div>
                            {imageUrl ? (
                                <>
                                    <img src={imageUrl} alt="Image" className="w-24 h-20 object-cover cursor-pointer" />
                                </>
                            ) : (
                                'N/A'
                            )}
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
                    return (
                        <div>
                            {row?.original?.store?.map((item: any, key: any) => (
                                <div key={key}>{item?.name}</div>
                            ))}
                        </div>
                    )
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
                        onClick={() => navigate(`/app/appSettings/newPageSettings/assignSection/${row?.original?.id}`)}
                    >
                        <MdAssignment className="text-3xl text-red-600" />
                    </button>
                ),
            },
        ],
        [mainPageSettingsData, pageIdStore],
    )
}
