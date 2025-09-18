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

interface props {
    handleOpenModal: (img: any) => void
    handleViewProducts: (row: any) => void
}

export const useProductColumns = ({ handleOpenModal, handleViewProducts }: props) => {
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

    return useMemo<ColumnDef<Product>[]>(
        () => [
            {
                header: 'Edit',
                accessorKey: '',
                cell: ({ row }) => (
                    <button className="border-none bg-none" onClick={() => navigate(`/app/catalog/products/${row.original.barcode}`)}>
                        {/* <a href={`/app/catalog/products/${row.original.barcode}`} target="_blank" rel="noreferrer">
                            {' '}
                            </a> */}
                        <FaEdit className="text-xl text-blue-600" />
                    </button>
                ),
            },
            {
                header: 'View',
                accessorKey: '',
                cell: ({ row }) => (
                    <button className="border-none bg-none" onClick={() => handleViewProducts(row?.original)}>
                        <FaEye className="text-xl text-yellow-500" />
                    </button>
                ),
            },
            {
                header: 'Re-Size Image',
                accessorKey: '',
                cell: ({ row }) => (
                    <button className="border-none bg-none" onClick={() => handleResize(row?.original?.barcode)}>
                        <GiResize className="text-xl text-green-500" />
                    </button>
                ),
            },
            {
                header: 'SKU',
                accessorKey: 'sku',
                cell: (info) => info.getValue(),
            },
            {
                header: 'SKID',
                accessorKey: 'skid',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Barcode',
                accessorKey: 'barcode',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Product Name',
                accessorKey: 'name',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Brand',
                accessorKey: 'brand',
                cell: (info) => info.getValue(),
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
                cell: (info) => info.getValue(),
            },
            {
                header: 'Selling Price',
                accessorKey: 'sp',
                cell: (info) => info.getValue(),
            },

            {
                header: 'Division',
                accessorKey: 'division',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Category',
                accessorKey: 'category',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Sub Category',
                accessorKey: 'sub_category',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Stocks',
                accessorKey: 'inventory_count',
                cell: (info) => info.getValue(),
            },
            {
                header: 'COLOR',
                accessorKey: 'color',
                cell: (info) => info.getValue(),
            },
            {
                header: 'COLOR Family',
                accessorKey: 'filter_tags.colorfamily',
                cell: ({ getValue }: any) => {
                    return (
                        <div>
                            {getValue()
                                ?.map((item: any) => item)
                                .join(',') ?? 'N/A'}
                        </div>
                    )
                },
            },
            {
                header: 'SIZE',
                accessorKey: 'size',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Create Date',
                accessorKey: 'create_date',
                cell: (info) => {
                    return <div>{moment(info.getValue() as string).format('YYYY-MM-DD HH:mm:ss')}</div>
                },
            },
            {
                header: 'Return Amount',
                accessorKey: 'return_amount',
                cell: (info) => {
                    return <div>{moment(info.getValue() as string).format('YYYY-MM-DD HH:mm:ss')}</div>
                },
            },
        ],
        [],
    )
}
