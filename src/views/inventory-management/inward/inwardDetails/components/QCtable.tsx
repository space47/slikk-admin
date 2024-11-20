/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState, useEffect } from 'react'
import Input from '@/components/ui/Input'
import type { ColumnDef } from '@tanstack/react-table'
import type { InputHTMLAttributes } from 'react'
import Pagination from '@/components/ui/Pagination'
import Select from '@/components/ui/Select'
import EasyTable from '@/common/EasyTable'
import { grn_quality_check, pageSizeOptions, qctable } from './QCTableCommon'

interface DebouncedInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'size' | 'prefix'> {
    value: string | number
    onChange: (value: string | number) => void
    debounce?: number
}

function DebouncedInput({ value: initialValue, onChange, debounce = 500, ...props }: DebouncedInputProps) {
    const [value, setValue] = useState(initialValue)

    useEffect(() => {
        setValue(initialValue)
    }, [initialValue])

    useEffect(() => {
        const timeout = setTimeout(() => {
            onChange(value)
        }, debounce)

        return () => clearTimeout(timeout)
    }, [value])

    return (
        <div className="main">
            <div className="text-xl font-bold mt-5 mb-4">QUALITY CHECKLIST</div>
            <div className="flex justify-start mb-6">
                <div className="flex items-center mb-4">
                    <span className="mr-2"></span>
                    <Input {...props} value={value} onChange={(e) => setValue(e.target.value)} />
                </div>
            </div>
        </div>
    )
}

const QCtable = ({ data = [], totalData }: qctable) => {
    const [globalFilter, setGlobalFilter] = useState('')
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [paginatedData, setPaginatedData] = useState<grn_quality_check[]>([])

    const onSelectChange = (value = 0) => {
        setPageSize(Number(value))
    }

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

    useEffect(() => {
        const startIndex = (page - 1) * pageSize
        const endIndex = startIndex + pageSize
        setPaginatedData(data.slice(startIndex, endIndex))
    }, [page, pageSize, data])

    const onPaginationChange = (page: number) => {
        setPage(page)
    }

    return (
        <>
            <DebouncedInput
                value={globalFilter ?? ''}
                className="p-2 font-lg shadow border border-block"
                placeholder="Search all columns..."
                onChange={(value) => setGlobalFilter(String(value))}
            />

            <EasyTable mainData={paginatedData} columns={columns} page={page} pageSize={pageSize} />

            <div className="flex xl:justify-between xl:flex-row flex-col gap-3 justify-center items-center mt-3 ">
                <Pagination pageSize={pageSize} currentPage={page} total={totalData} onChange={onPaginationChange} />

                <Select
                    size="sm"
                    isSearchable={true}
                    value={pageSizeOptions.find((option) => option.value === pageSize)}
                    options={pageSizeOptions}
                    className="xl:w-[10%] w-[50%]"
                    onChange={(option) => onSelectChange(option?.value)}
                />
            </div>
        </>
    )
}

export default QCtable
