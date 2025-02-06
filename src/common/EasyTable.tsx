/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table'
import React, { useState } from 'react'
import Table from '@/components/ui/Table'

const { Tr, Th, Td, THead, TBody, Sorter } = Table

interface TABLEPROPS {
    columns: any
    page?: number
    pageSize?: number
    mainData: any
    noPage?: boolean
    overflow?: boolean
    isNotSort?: boolean
}

const EasyTable = ({ columns, page, pageSize, mainData, noPage, overflow, isNotSort }: TABLEPROPS) => {
    const [sorting, setSorting] = useState<any[]>([]) // To store the sorting state

    const table = useReactTable({
        data: mainData,
        columns,
        state: {
            sorting, // Pass sorting state
            pagination: noPage
                ? undefined
                : {
                      pageIndex: page - 1,
                      pageSize: pageSize,
                  },
        },
        onSortingChange: isNotSort ? undefined : setSorting,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(), // Enable sorting
        getPaginationRowModel: getPaginationRowModel(),
        manualPagination: isNotSort ? false : true,
        enableMultiSort: isNotSort ? false : true,
    })

    return (
        <div>
            <Table overflow={overflow ? true : false}>
                <THead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <Tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <Th key={header.id} colSpan={header.colSpan}>
                                    {header.isPlaceholder ? null : (
                                        <div
                                            className={header.column.getCanSort() ? 'cursor-pointer select-none' : ''}
                                            onClick={header.column.getToggleSortingHandler()}
                                        >
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                            <Sorter sort={header.column.getIsSorted()} />
                                        </div>
                                    )}
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
        </div>
    )
}

export default EasyTable
