import React, { useEffect, useState, useMemo } from 'react'
import Table from '@/components/ui/Table'
// import Pagination from '@/components/ui/Pagination'
// import Select from '@/components/ui/Select'
// import Button from '@/components/ui/Button'
import { useReactTable, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, flexRender } from '@tanstack/react-table'
import type { ColumnDef } from '@tanstack/react-table'
import axiosInstance from '@/utils/intercepter/globalInterceptorSetup'

import moment from 'moment'
// import { FaEdit } from 'react-icons/fa'
import { SKUhistory } from './skuhistoru.common'

// type Option = {
//     value: number
//     label: string
// }

const { Tr, Th, Td, THead, TBody } = Table

// const pageSizeOptions = [
//     { value: 10, label: '10 / page' },
//     { value: 25, label: '25 / page' },
//     { value: 50, label: '50 / page' },
//     { value: 100, label: '100 / page' },
// ]

const SkuOrderHistory = () => {
    const [data, setData] = useState<SKUhistory[]>([])
    // const [totalData, setTotalData] = useState(0)
    // const [page, setPage] = useState(1)
    // const [pageSize, setPageSize] = useState(10)
    const [globalFilter, setGlobalFilter] = useState('')
    const [showSkuTable, setShowSkuTable] = useState(false)

    const fetchData = async () => {
        try {
            // const filterValue = globalFilter ? `&name=${globalFilter}` : ''
            const response = await axiosInstance.get(`/merchant/product/sku/sales?sku=${globalFilter}`)
            const data = response.data.data
            setData(data)
            // setTotalData(total)
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

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        // pageCount: Math.ceil(totalData / pageSize),
        manualPagination: true,
        state: {
            // pagination: {
            //     pageIndex: page - 1,
            //     pageSize: pageSize,
            // },
            globalFilter,
        },
        // onPaginationChange: ({ pageIndex, pageSize }) => {
        //     setPage(pageIndex + 1)
        //     setPageSize(pageSize)
        // },
    })

    // const onPaginationChange = (page: number) => {
    //     setPage(page)
    // }

    // const onSelectChange = (value = 0) => {
    //     setPageSize(Number(value))
    // }
    // const navigate = useNavigate()

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
            {showSkuTable && (
                <Table>
                    <THead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <Tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <Th key={header.id} colSpan={header.colSpan}>
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                    </Th>
                                ))}
                            </Tr>
                        ))}
                    </THead>
                    <TBody>
                        {table.getRowModel().rows.map((row) => (
                            <Tr key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <Td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</Td>
                                ))}
                            </Tr>
                        ))}
                    </TBody>
                </Table>
            )}
        </div>
    )
}

export default SkuOrderHistory
