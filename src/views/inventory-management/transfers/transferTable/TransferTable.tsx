import React, { useEffect, useMemo, useState } from 'react'
import { InventoryTransferTypes, Option } from './TransferTableCommon'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { Button, Input, Pagination, Select } from '@/components/ui'
import { ColumnDef } from '@tanstack/react-table'
import moment from 'moment'
import EasyTable from '@/common/EasyTable'
import { pageSizeOptions } from '../../inward/inwardCommon'
import { useNavigate } from 'react-router-dom'
import { FaEdit } from 'react-icons/fa'
import AccessDenied from '@/views/pages/AccessDenied'

const TransferTable = () => {
    const [transferTableData, setTransferTableData] = useState<InventoryTransferTypes[]>([])
    const [page, setPage] = useState<number>(1)
    const [pageSize, setPageSize] = useState<number>(10)
    const [totalCount, setTotalCount] = useState<number>(0)
    const [globalFilter, setGlobalFilter] = useState<string>('')
    const [accessDenied, setAccessDenied] = useState(false)
    const navigate = useNavigate()

    const fetchTransferData = async () => {
        try {
            let searchParams = ''
            if (globalFilter) {
                searchParams = `&document_number=${globalFilter}`
            }
            const response = await axioisInstance.get(`/internal/inventory/transfer?p=${page}&page_size=${pageSize}${searchParams}`)
            const data = response?.data?.data
            setTransferTableData(data?.results)
            setTotalCount(data?.count)
        } catch (error: any) {
            if (error?.response && error?.response?.status === 403) {
                setAccessDenied(true)
            }
            console.error(error)
        }
    }

    useEffect(() => {
        fetchTransferData()
    }, [page, pageSize, globalFilter])

    const columns = useMemo<ColumnDef<InventoryTransferTypes>[]>(
        () => [
            // {
            //     header: 'Edit',
            //     accessorKey: '',
            //     cell: ({ row }) => (
            //         <button className="border-none bg-none">
            //             <a href={`/app/goods/transfer/edit/${row.original.document_number}`} target="_blank" rel="noreferrer">
            //                 {' '}
            //                 <FaEdit className="text-xl text-blue-500" />
            //             </a>
            //         </button>
            //     ),
            // },
            {
                header: 'Document Number',
                accessorKey: 'document_number',
                cell: ({ row }) => (
                    <div className="cursor-pointer bg-gray-200 px-3 py-3 rounded-md text-black font-semibold">
                        <a href={`/app/goods/transfer/${row?.original?.document_number}`} target="_blank" rel="noreferrer">
                            {row.original.document_number}
                        </a>
                    </div>
                ),
            },

            {
                header: 'Create Date',
                accessorKey: 'created_at',
                cell: ({ getValue }) => <span>{moment(getValue() as string).format('YYYY-MM-DD')}</span>,
            },
            {
                header: 'Store Name',
                accessorKey: 'store_name',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Transfer Type',
                accessorKey: 'transfer_type',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Requested By',
                accessorKey: 'requested_by',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Approved By',
                accessorKey: 'approved_by',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Total Sku',
                accessorKey: 'total_sku_count',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Destination Store',
                accessorKey: 'destination_store_name',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Store Count',
                accessorKey: 'destination_store',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Updated On',
                accessorKey: 'updated_at',
                cell: ({ getValue }) => <span>{moment(getValue() as string).format('YYYY-MM-DD')}</span>,
            },
        ],
        [],
    )
    const onPaginationChange = (page: number) => {
        setPage(page)
    }

    const onSelectChange = (value = 0) => {
        setPageSize(Number(value))
    }

    const handleAddTransfer = () => {
        navigate(`/app/goods/transfer/addNew`)
    }
    if (accessDenied) {
        return <AccessDenied />
    }

    return (
        <div className="p-2 shadow-xl rounded-xl ">
            <div className="flex justify-between mb-5">
                <div>
                    <Input
                        value={globalFilter}
                        placeholder="Enter document no."
                        size="sm"
                        className="rounded-xl"
                        onChange={(e) => setGlobalFilter(e.target.value)}
                    />
                </div>
                <Button size="sm" variant="new" onClick={handleAddTransfer}>
                    Add Transfer
                </Button>
            </div>
            <div>
                <EasyTable mainData={transferTableData} columns={columns} page={page} pageSize={pageSize} />
            </div>
            <div className="flex items-center justify-between mt-4">
                <Pagination pageSize={pageSize} currentPage={page} total={totalCount} onChange={onPaginationChange} />
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

export default TransferTable
