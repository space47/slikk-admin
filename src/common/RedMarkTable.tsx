/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table'
import React from 'react'
import Table from '@/components/ui/Table'

const { Tr, Th, Td, THead, TBody, Sorter } = Table

interface TABLEPROPS {
    columns: any
    page: number
    pageSize: number
    mainData: any
    noPage?: boolean
    overflow?: boolean
    isDelayedStatus: Record<string, boolean>
}

const RedMarkTable = ({ columns, page, pageSize, mainData, noPage, overflow, isDelayedStatus }: TABLEPROPS) => {
    const table = useReactTable({
        data: mainData,
        columns,
        state: noPage
            ? {}
            : {
                  pagination: {
                      pageIndex: (page as number) - 1,
                      pageSize: pageSize,
                  },
              },
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        manualPagination: !noPage,
    })

    const getRowClassName = (row: any) => {
        const rowId = row?.original?.invoice_id
        const isDelayed = isDelayedStatus[rowId] ?? false
        if (isDelayed) {
            return 'bg-red-200 font-bold'
        }

        return ''
    }

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
                        <Tr key={row.id} className={getRowClassName(row)}>
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

export default RedMarkTable
