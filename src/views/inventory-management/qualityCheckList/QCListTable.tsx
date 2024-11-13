import React, { useEffect, useState, useMemo } from 'react'
import Table from '@/components/ui/Table'
import Pagination from '@/components/ui/Pagination'
import Select from '@/components/ui/Select'

import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    flexRender,
    // useGlobalFilter,
    PaginationState,
    Updater,
} from '@tanstack/react-table'
import type { ColumnDef } from '@tanstack/react-table'
import axiosInstance from '@/utils/intercepter/globalInterceptorSetup'
import AccessDenied from '@/views/pages/AccessDenied'

type QUALITY_CHECK = {
    quantity_sent: number
    quantity_received: number
    qc_passed: number
    qc_failed: number
    sent_to_inventory: number
    qc_done_by: QC_DONE_BY
    last_updated_by: LAST_UPDATED_BY
}

type LAST_UPDATED_BY = {
    name: string
    mobile: string
}

type QC_DONE_BY = {
    name: string
    mobile: string
}

type QualityData = {
    [quantity_id: string]: QUALITY_CHECK
}

type Option = {
    value: number
    label: string
}

const { Tr, Th, Td, THead, TBody } = Table

const pageSizeOptions = [
    { value: 10, label: '10 / page' },
    { value: 25, label: '25 / page' },
    { value: 50, label: '50 / page' },
    { value: 100, label: '100 / page' },
]

const QCListTable = () => {
    const [data, setData] = useState<QualityData>()
    const [accessDenied, setAccessDenied] = useState(false)
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [globalFilter, setGlobalFilter] = useState('')

    const [quantityId, setQuantityId] = useState<Array<{ key: string; value: QUALITY_CHECK }>>([])

    const fetchData = async () => {
        try {
            const response = await axiosInstance.get(`goods/qc/summary`)
            const data = response.data

            setData(data)
            console.log('ssssssssssssssss', data)
            const QCData = data.data

            console.log('tttttttttttttt', QCData)

            const skuDetailsArray = Object.entries(QCData).map(([key, value]) => ({
                key,
                value,
            }))

            setQuantityId(skuDetailsArray)
        } catch (error: any) {
            if (error.response && error.response.status === 403) {
                setAccessDenied(true)
            }
            console.error(error)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    console.log('SKU Details:', quantityId)

    const columns = useMemo<ColumnDef<{ key: QUALITY_CHECK; value: QUALITY_CHECK }>[]>(
        () => [
            {
                header: 'ID',
                accessorKey: 'key',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Quantity Sent',
                accessorKey: 'value.quantity_sent',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Quantity Received',
                accessorKey: 'value.quantity_received',
                cell: (info) => info.getValue(),
            },
            {
                header: 'QC Passed',
                accessorKey: 'value.qc_passed',
                cell: (info) => info.getValue(),
            },
            {
                header: 'QC Inventory',
                accessorKey: 'value.sent_to_inventory',
                cell: (info) => info.getValue(),
            },
            {
                header: 'QC Done Name',
                accessorKey: 'value.qc_done_by.name',
                cell: (info) => info.getValue(),
            },
            {
                header: 'QC Done Mobile ',
                accessorKey: 'value.qc_done_by.mobile',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Last Updated By ',
                accessorKey: 'value.last_updated_by.name',
                cell: (info) => info.getValue(),
            },
            {
                header: 'QC Done Mobile ',
                accessorKey: 'value.last_updated_by.mobile',
                cell: (info) => info.getValue(),
            },
        ],
        [],
    )

    const table = useReactTable({
        data: quantityId,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        pageCount: Math.ceil(quantityId.length / pageSize),
        manualPagination: true,
        state: {
            pagination: {
                pageIndex: page - 1,
                pageSize: pageSize,
            },
            globalFilter,
        },
        onPaginationChange: (updater: Updater<PaginationState>) => {
            const newPagination = typeof updater === 'function' ? updater({ pageIndex: page - 1, pageSize }) : updater

            setPage(newPagination.pageIndex + 1)
            setPageSize(newPagination.pageSize)
        },
        onGlobalFilterChange: setGlobalFilter,
    })

    const onPaginationChange = (page: number) => {
        setPage(page)
    }

    const onSelectChange = (value = 0) => {
        setPageSize(Number(value))
    }
    if (accessDenied) {
        return <AccessDenied />
    }

    return (
        <div className="overflow-x-auto">
            <div className="upper flex justify-between mb-5 items-center ">
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Search here"
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="p-2 border rounded"
                    />
                </div>
            </div>

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
            <div className="flex items-center justify-between mt-4">
                <Pagination pageSize={pageSize} currentPage={page} total={quantityId && quantityId.length} onChange={onPaginationChange} />
                <div style={{ minWidth: 130 }}>
                    <Select<Option>
                        size="sm"
                        isSearchable={false}
                        value={pageSizeOptions.find((option) => option.value === pageSize)}
                        options={pageSizeOptions}
                        onChange={(option) => onSelectChange(option?.value)}
                    />
                </div>
            </div>
        </div>
    )
}

export default QCListTable
