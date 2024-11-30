/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useState } from 'react'
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table'
import Table from '@/components/ui/Table'
import { useAppDispatch, useAppSelector } from '@/store'
import moment from 'moment'
import { Button, Pagination, Select } from '@/components/ui'
import { useNavigate } from 'react-router-dom'
import { URLSHORTNERTYPE } from '@/store/types/shortUrl.types'
import { fetchUrlShortner, setPage, setPageSize } from '@/store/slices/urlShortner/urlShortner.slice'
import { FaEdit } from 'react-icons/fa'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'

const { Tr, Th, Td, THead, TBody } = Table

const pageSizeOptions = [
    { value: 10, label: '10 / page' },
    { value: 25, label: '25 / page' },
    { value: 50, label: '50 / page' },
    { value: 100, label: '100 / page' },
]

const GetUrlShortner = () => {
    const [globalFilter, setGlobalFilter] = useState('')
    const [urlData, setUrlData] = useState([])
    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    const { result, page, pageSize, count } = useAppSelector((state: { urlShortner: URLSHORTNERTYPE }) => state.urlShortner)

    useEffect(() => {
        dispatch(fetchUrlShortner())
    }, [dispatch, page, pageSize])

    const fetchForGlobalFilter = async () => {
        try {
            const response = await axioisInstance.get(`/short_urls?short_code=${globalFilter}`)
            const data = response?.data?.message
            setUrlData(data?.results)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        if (globalFilter) {
            fetchForGlobalFilter()
        }
    }, [globalFilter])

    const columns = useMemo(
        () => [
            {
                header: 'Edit',
                accessorKey: 'short_code',
                cell: ({ getValue }) => (
                    <span className="">
                        <FaEdit className="text-xl text-blue-500 cursor-pointer" onClick={() => handleEditUrlShortner(getValue())} />
                    </span>
                ),
            },
            {
                header: 'MARKETING TITLE',
                accessorKey: 'short_code',
                cell: ({ getValue }) => {
                    return <div className="w-[100px]">{getValue()}</div>
                },
            },
            { header: 'Short Url', accessorKey: 'short_url' },
            { header: 'WEB URL', accessorKey: 'web_url' },
            { header: 'ANDROID URL', accessorKey: 'android_url' },
            { header: 'IOS URL', accessorKey: 'ios_url' },
            {
                header: 'Create Date',
                accessorKey: 'create_date',
                cell: ({ getValue }: any) => <span className="">{moment(getValue()).format('YYYY-MM-DD hh:mm:ss a')}</span>,
            },
            {
                header: 'Update Date',
                accessorKey: 'update_date',
                cell: ({ getValue }: any) => <span className="">{moment(getValue()).format('YYYY-MM-DD hh:mm:ss a')}</span>,
            },
        ],
        [],
    )

    const handleEditUrlShortner = (value: string) => {
        navigate(`/app/appsCommuncication/urlShortner/${value}`)
    }

    const tableData = globalFilter ? urlData : result || []
    const table = useReactTable({
        data: tableData || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: false,
        // state: {
        //     pagination: {
        //         pageIndex: 0,
        //         pageSize: data?.results?.length || 10,
        //     },
        // },
    })

    const onPaginationChange = (page: number) => {
        dispatch(setPage(page))
    }

    const handleCreateUrl = () => {
        navigate('/app/appsCommuncication/urlShortner/addNew')
    }

    return (
        <div className="flex flex-col gap-5">
            {' '}
            <div>
                <div>
                    <input placeholder="Search by short code" value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} />
                </div>
                <div className="flex justify-end">
                    <Button variant="new" onClick={handleCreateUrl}>
                        CREATE URL
                    </Button>
                </div>
            </div>
            <div className="overflow-x-auto">
                <Table className="min-w-full">
                    <THead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <Tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <Th key={header.id}>{flexRender(header.column.columnDef.header, header.getContext())}</Th>
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
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4">
                <Pagination pageSize={pageSize} currentPage={page} total={count} onChange={onPaginationChange} />
                <div className="w-full sm:w-auto min-w-[130px]">
                    <Select
                        size="sm"
                        value={pageSizeOptions.find((option) => option.value === pageSize)}
                        options={pageSizeOptions}
                        onChange={(option) => dispatch(setPageSize(option?.value))}
                        className="w-full flex justify-end"
                    />
                </div>
            </div>
        </div>
    )
}

export default GetUrlShortner
