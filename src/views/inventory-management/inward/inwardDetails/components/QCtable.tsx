/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from 'react'
import Input from '@/components/ui/Input'
import type { ColumnDef } from '@tanstack/react-table'
import EasyTable from '@/common/EasyTable'
import { grn_quality_check } from './QCTableCommon'
import { useParams } from 'react-router-dom'
import { useFetchApi } from '@/commonHooks/useFetchApi'
import { useDebounceInput } from '@/commonHooks/useDebounceInput'
import PageCommon from '@/common/PageCommon'
import { Spinner } from '@/components/ui'

const QCtable = () => {
    const { document_number } = useParams()
    const [globalFilter, setGlobalFilter] = useState('')
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const { debounceFilter } = useDebounceInput({ globalFilter, delay: 500 })

    const query = useMemo(() => {
        let filterData = ''
        if (debounceFilter) {
            filterData = `&sku=${debounceFilter}`
        }

        return `goods/qualitycheck?grn_number=${document_number}&p=${page}&page_size=${pageSize}${filterData}`
    }, [document_number, page, pageSize, debounceFilter])

    const { data, totalData, loading } = useFetchApi<grn_quality_check>({ url: query, initialData: [] })

    const columns = useMemo<ColumnDef<grn_quality_check>[]>(
        () => [
            {
                header: 'GRN Number',
                accessorKey: 'grn',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Create Date',
                accessorKey: 'create_date',
                cell: (info) => new Date(info.getValue() as string).toLocaleDateString(),
            },
            {
                header: 'QC done by',
                accessorKey: 'qc_done_by.name',
                cell: (info) => info.getValue(),
            },
            {
                header: 'SKU code',
                accessorKey: 'sku',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Batch Number',
                accessorKey: 'batch_number',
                cell: (info) => info.getValue(),
            },
            {
                header: 'QTY Sent',
                accessorKey: 'quantity_sent',
                cell: (info) => info.getValue(),
            },
            {
                header: 'QTY Received',
                accessorKey: 'quantity_received',
                cell: (info) => info.getValue(),
            },
            {
                header: 'QC Passed',
                accessorKey: 'qc_passed',
                cell: (info) => info.getValue(),
            },
            {
                header: 'QC Failed',
                accessorKey: 'qc_failed',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Location',
                accessorKey: 'location',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Sync to Inventory',
                accessorKey: 'sent_to_inventory',
                cell: ({ getValue }: any) => {
                    const value = getValue()

                    return (
                        <div>
                            {value === true ? (
                                <div>true</div>
                            ) : (
                                <>
                                    <div>false</div>
                                </>
                            )}
                        </div>
                    )
                },
            },
            {
                header: 'Images',
                accessorKey: 'images',
                cell: (info) => <img src={info.getValue() as string} alt="Image" style={{ width: '50px', height: '50px' }} />,
            },
            {
                header: 'shipment_item',
                accessorKey: 'shipment_item',
                cell: (info) => new Date(info.getValue() as string).toLocaleDateString(),
            },
            {
                header: 'Update Date',
                accessorKey: 'update_date',
                cell: (info) => new Date(info.getValue() as string).toLocaleDateString(),
            },
            {
                header: 'Updated By',
                accessorKey: 'last_updated_by.name',
                cell: (info) => info.getValue(),
            },
        ],
        [],
    )

    return (
        <>
            <div className="w-1/2 p-2">
                <Input
                    value={globalFilter}
                    type="search"
                    className="p-2 font-lg rounded-md shadow border border-block"
                    placeholder="Search all columns..."
                    onChange={(e) => setGlobalFilter(e.target.value)}
                />
            </div>

            {loading && (
                <div className="flex items-center justify-center mb-4">
                    <Spinner size={30} />
                </div>
            )}

            <div className="mb-3">
                <EasyTable mainData={data} columns={columns} page={page} pageSize={pageSize} />
            </div>
            <PageCommon page={page} pageSize={pageSize} setPage={setPage} setPageSize={setPageSize} totalData={totalData} />
        </>
    )
}

export default QCtable
