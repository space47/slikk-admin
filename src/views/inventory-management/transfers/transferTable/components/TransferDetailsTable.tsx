import EasyTable from '@/common/EasyTable'
import { useFetchApi } from '@/commonHooks/useFetchApi'
import { Input, Pagination, Select } from '@/components/ui'
import { pageSizeOptions } from '@/constants/pageUtils.constants'
import moment from 'moment'
import React, { InputHTMLAttributes, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'

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
            <div className="text-xl font-bold mt-5 mb-4"></div>
            <div className="flex justify-start mb-6">
                <div className="flex items-center mb-4">
                    <span className="mr-2"></span>
                    <Input {...props} value={value} onChange={(e) => setValue(e.target.value)} />
                </div>
            </div>
        </div>
    )
}

const TransferDetailsTable = () => {
    const { document_number } = useParams()
    const [globalFilter, setGlobalFilter] = useState('')
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)

    console.log('document_number', document_number)

    const onSelectChange = (value = 0) => {
        setPage(1)
        setPageSize(Number(value))
    }

    const query = useMemo(() => {
        let filterData = ''
        if (globalFilter) {
            filterData = `&sku=${globalFilter}`
        }

        return `/internal/transfer/products?document_number=${document_number}&p=${page}&page_size=${pageSize}${filterData}`
    }, [document_number, page, pageSize, globalFilter])

    const { data, totalData } = useFetchApi<any>({ url: query, initialData: [] })

    const columns = [
        {
            header: 'Name',
            accessorKey: 'name',
            cell: ({ getValue }) => {
                return <div>{getValue()}</div>
            },
        },
        {
            header: 'SKU',
            accessorKey: 'sku',
            cell: ({ getValue }) => {
                return <div>{getValue()}</div>
            },
        },
        {
            header: 'Size',
            accessorKey: 'size',
            cell: ({ getValue }) => {
                return <div>{getValue()}</div>
            },
        },
        {
            header: 'quantity ',
            accessorKey: 'quantity',
        },
        {
            header: 'Inventory Transfer',
            accessorKey: 'inventory_transfer',
            cell: ({ getValue }) => {
                return <div>{getValue()}</div>
            },
        },
        {
            header: 'synced to inventory',
            accessorKey: 'synced_to_inventory',
        },
        {
            header: 'create date',
            accessorKey: 'created_at',
            cell: ({ getValue }) => {
                return <div>{moment(getValue()).format('YYYY-MM-DD')}</div>
            },
        },
        {
            header: 'update date',
            accessorKey: 'update_at',
            cell: ({ getValue }) => {
                return <div>{moment(getValue()).format('YYYY-MM-DD')}</div>
            },
        },
    ].filter((column) => column.header && column.accessorKey)

    return (
        <div>
            <DebouncedInput
                value={globalFilter ?? ''}
                type="search"
                className="p-2 font-lg shadow border border-block"
                placeholder="Search all columns..."
                onChange={(value) => setGlobalFilter(String(value))}
            />
            <EasyTable mainData={data} columns={columns} page={page} pageSize={pageSize} overflow />
            <div className="flex xl:justify-between xl:flex-row flex-col gap-3 justify-center items-center mt-3 ">
                <Pagination pageSize={pageSize} currentPage={page} total={totalData} onChange={(page) => setPage(page)} />

                <Select
                    size="sm"
                    isSearchable={true}
                    value={pageSizeOptions.find((option) => option.value === pageSize)}
                    options={pageSizeOptions}
                    className="xl:w-[10%] w-[50%]"
                    onChange={(option) => onSelectChange(option?.value)}
                />
            </div>
        </div>
    )
}

export default TransferDetailsTable
