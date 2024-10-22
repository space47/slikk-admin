import React, { useEffect, useState, useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import axiosInstance from '@/utils/intercepter/globalInterceptorSetup'
import moment from 'moment'
import { SKUhistory } from './skuhistoru.common'
import EasyTable from '@/common/EasyTable'

const SkuOrderHistory = () => {
    const [data, setData] = useState<SKUhistory[]>([])
    const [globalFilter, setGlobalFilter] = useState('')
    const [showSkuTable, setShowSkuTable] = useState(false)

    const fetchData = async () => {
        try {
            const response = await axiosInstance.get(`/merchant/product/sku/sales?sku=${globalFilter}`)
            const data = response.data.data
            setData(data)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchData()
    }, [globalFilter])

    const columns = useMemo<ColumnDef<SKUhistory>[]>(
        () => [
            {
                header: 'SKU',
                accessorKey: 'sku',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Order ID',
                accessorKey: 'order_id',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Quantity',
                accessorKey: 'quantity',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Date',
                accessorKey: 'date',
                cell: ({ getValue }) => <span>{moment(getValue() as string).format('YYYY-MM-DD')}</span>,
            },
            {
                header: 'Mobile',
                accessorKey: 'mobile',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Name',
                accessorKey: 'name',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Selling Price (SP)',
                accessorKey: 'sp',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Image',
                accessorKey: 'image',
                cell: (info) => {
                    const firstImageUrl = (info.getValue() as string).split(',')[0].trim()
                    return <img src={firstImageUrl} alt="Product Image" className="w-16 h-16" />
                },
            },
            {
                header: 'Brand',
                accessorKey: 'brand',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Maximum Retail Price (MRP)',
                accessorKey: 'mrp',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Return Order ID',
                accessorKey: 'return_order_id',
                cell: (info) => (info.getValue() ? info.getValue() : 'N/A'),
            },
        ],
        [],
    )

    return (
        <div>
            <div className="flex flex-col gap-2 xl:flex-row xl:justify-between items-center">
                <div className="flex flex-col gap-2">
                    <div>Enter Sku</div>
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Search SKU here"
                            value={globalFilter}
                            onChange={(e) => {
                                setGlobalFilter(e.target.value)
                                setShowSkuTable(true)
                            }}
                            className="p-2 border rounded"
                        />
                    </div>
                </div>
            </div>
            {showSkuTable && <EasyTable mainData={data} columns={columns} noPage />}
        </div>
    )
}

export default SkuOrderHistory
