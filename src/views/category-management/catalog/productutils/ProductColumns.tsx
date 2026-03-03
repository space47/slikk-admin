/* eslint-disable @typescript-eslint/no-explicit-any */
import { ColumnDef } from '@tanstack/react-table'
import { useMemo } from 'react'
import { Product } from '../CommonType'
import { FaEdit, FaEye } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'
import { GiResize } from 'react-icons/gi'
import { notification } from 'antd'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { Tooltip } from '@/components/ui'

interface props {
    handleOpenModal: (img: any) => void
    handleViewProducts: (row: any) => void
    currentTableSelected: string[]
}

export const useProductColumns = ({ handleOpenModal, handleViewProducts, currentTableSelected }: props) => {
    const navigate = useNavigate()

    const handleResize = async (barcode: string | undefined) => {
        try {
            const res = await axioisInstance.post(`/backend/task/create`, {
                task_name: 'resize_product_images',
                barcodes: barcode,
            })
            notification.success({ message: res?.data?.message || 'Successfully Resized' })
        } catch (error) {
            notification.error({ message: 'Failed to Resize' })
            console.error('Error resizing product:', error)
        }
    }

    return useMemo<ColumnDef<Product>[]>(() => {
        const baseColumns: ColumnDef<Product>[] = [
            {
                header: 'Edit',
                accessorKey: '',
                cell: ({ row }) => (
                    <button className="border-none bg-none" onClick={() => navigate(`/app/catalog/products/${row.original.skid}`)}>
                        <FaEdit className="text-xl text-blue-600" />
                    </button>
                ),
            },
            {
                header: 'View',
                accessorKey: '',
                cell: ({ row }) => (
                    <button className="border-none bg-none" onClick={() => handleViewProducts(row.original)}>
                        <FaEye className="text-xl text-yellow-500" />
                    </button>
                ),
            },
            {
                header: 'Re-Size Image',
                accessorKey: '',
                cell: ({ row }) => (
                    <button className="border-none bg-none" onClick={() => handleResize(row.original?.barcode)}>
                        <GiResize className="text-xl text-green-500" />
                    </button>
                ),
            },
            {
                header: 'SKU',
                accessorKey: 'sku',
            },
            {
                header: 'SKID',
                accessorKey: 'skid',
            },
            {
                header: 'Barcode',
                accessorKey: 'barcode',
            },
            {
                header: 'Product Name',
                accessorKey: 'name',
            },
            {
                header: 'Brand',
                accessorKey: 'brand',
            },
            {
                header: 'Image',
                accessorKey: 'image',
                cell: ({ row }: any) => {
                    const imageUrl = row?.original?.thumbnail ? row?.original?.thumbnail.split(',')[0] : row?.original?.image.split(',')[0]
                    return (
                        <>
                            <img
                                src={imageUrl}
                                alt="Image"
                                className="w-24 h-20 object-cover cursor-pointer"
                                onClick={() => handleOpenModal(row.original.image)}
                            />
                        </>
                    )
                },
            },
            {
                header: 'Frame Image',
                accessorKey: 'framed_image_url',
                cell: ({ row }: any) => {
                    const imageUrl = row?.original?.framed_image_url?.split(',')[0]
                    return (
                        <>
                            <img
                                src={imageUrl}
                                alt="Image"
                                className="w-24 h-20 object-cover cursor-pointer"
                                onClick={() => handleOpenModal(row.original.framed_image_url)}
                            />
                        </>
                    )
                },
            },
            {
                header: 'Price',
                accessorKey: 'mrp',
            },
            {
                header: 'Selling Price',
                accessorKey: 'sp',
            },
            {
                header: 'Create Date',
                accessorKey: 'create_date',
                cell: (info) => {
                    return <div>{moment(info.getValue() as string).format('YYYY-MM-DD HH:mm:ss')}</div>
                },
            },
            {
                header: 'Update Date',
                accessorKey: 'update_date',
                cell: (info) => {
                    return <div>{moment(info.getValue() as string).format('YYYY-MM-DD HH:mm:ss')}</div>
                },
            },
        ]

        const resolveNestedValue = (obj: any, path: string) => path.split('.').reduce((acc, key) => acc?.[key], obj)

        const dynamicColumns: ColumnDef<Product>[] =
            currentTableSelected?.map((tableVal) => {
                if (tableVal === 'color_family') {
                    return {
                        header: 'COLOR Family',
                        accessorKey: 'filter_tags.colorfamily',
                        cell: ({ row }) => {
                            const value = resolveNestedValue(row.original, 'filter_tags.colorfamily')
                            console.log('value is', value)
                            if (!value || !Array.isArray(value) || !value.length) return 'N/A'
                            return value.join(',')
                        },
                    }
                }
                if (tableVal === 'last_updated_by') {
                    return {
                        header: 'Updated By',
                        accessorKey: 'last_updated_by',
                        cell: (props) => {
                            return (
                                <Tooltip title="Go to user">
                                    <a
                                        href={`/app/customerAnalytics/${props?.row?.original?.last_updated_by}`}
                                        className="cursor-pointer hover:text-green-500"
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        {props?.row?.original?.last_updated_by || 'User Not found'}
                                    </a>
                                </Tooltip>
                            )
                        },
                    }
                }

                return {
                    header: tableVal.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()),

                    accessorKey: tableVal,

                    cell: ({ row }) => {
                        const value = resolveNestedValue(row.original, tableVal)

                        if (value === null || value === undefined) return 'N/A'

                        if (Array.isArray(value)) {
                            return value.length ? value.join(', ') : 'N/A'
                        }

                        return value
                    },
                }
            }) ?? []

        return [...baseColumns, ...dynamicColumns]
    }, [currentTableSelected, navigate, handleViewProducts])
}
