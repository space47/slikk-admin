/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dispatch, SetStateAction, useMemo } from 'react'
import { FaCopy, FaEdit, FaTrash } from 'react-icons/fa'
import { WebType } from '../PageSettingsCommon'

const getDataType = (data: any): { key: string; value: string } => {
    if (data?.barcodes) return { key: 'Barcode', value: data.barcodes }
    if (data?.posts) return { key: 'Posts', value: data.posts }
    if (data?.brands) return { key: 'Brands', value: data.brands }
    if (data?.handles) return { key: 'Handles', value: data.handles }
    return { key: '', value: '' }
}

export const PageSettingsColumns = (
    data: WebType[],
    setYesModal: Dispatch<SetStateAction<boolean>>,
    setParticularRow: Dispatch<SetStateAction<WebType | undefined>>,
    handleCopyPage: (copiedRow: any) => void,
    handleGoToBanner: (currentPage: any, sectionHeading: any) => void,
    currentSelectedPage: Record<string, string>,
    handleRemoveRow: (row: WebType) => void,
) => {
    return useMemo(
        () => [
            {
                header: 'Edit',
                accessorKey: '',
                cell: ({ row }: any) => (
                    <button
                        className="border-none bg-none"
                        onClick={() => {
                            setYesModal(true)
                            setParticularRow(row.original)
                        }}
                    >
                        <FaEdit className="text-xl text-blue-600" />
                    </button>
                ),
            },
            {
                header: 'Copy',
                accessorKey: '',
                cell: ({ row }: any) => {
                    const copiedRow = { ...row.original }
                    return (
                        <button className="border-none bg-none" onClick={() => handleCopyPage(copiedRow)}>
                            <FaCopy className="text-xl text-green-500" />
                        </button>
                    )
                },
            },
            {
                header: 'Section Heading',
                accessorKey: 'section_heading',
                cell: ({ row }: any) => {
                    const sectionHeading = row?.original?.section_heading

                    return (
                        <div
                            className="w-[180px] text-overflow:ellipsis cursor-pointer hover:text-blue-600"
                            onClick={() => handleGoToBanner(currentSelectedPage, sectionHeading)}
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
                cell: (info: any) => <img src={info.getValue() as string} alt="" className="object-contain bg-black" />,
            },
            {
                header: 'Mobile Background Image',
                accessorKey: 'background_config.mobile_background_image',
                cell: (info: any) => <img src={info.getValue() as string} alt="" className="object-contain bg-black" />,
            },
            { header: 'Data Type', accessorKey: 'data_type.type' },
            {
                header: 'Section',
                accessorKey: 'is_section_clickable',
                cell: (info: any) => (info.getValue() ? 'Yes' : 'No'),
            },
            { header: 'Section Filter', accessorKey: 'section_filters' },
            {
                header: 'Data Type Values',
                accessorFn: (row: any) => getDataType(row.data_type),
                cell: (info: any) => {
                    const { key, value } = info.getValue() as { key: string; value: string }
                    return (
                        <div className="w-[180px] text-overflow:ellipsis">
                            {key}-{value}
                        </div>
                    )
                },
            },
            {
                header: 'Delete',
                accessorKey: '',
                cell: ({ row }: any) => (
                    <button className="border-none bg-none" onClick={() => handleRemoveRow(row.original)}>
                        <FaTrash className="text-xl text-red-500" />
                    </button>
                ),
            },
        ],
        [data],
    )
}
