/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    FilterFn,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    PaginationState,
    useReactTable,
} from '@tanstack/react-table'
import React, { useState } from 'react'
import Table from '@/components/ui/Table'
import { rankItem } from '@tanstack/match-sorter-utils'

const { Tr, Th, Td, THead, TBody, Sorter } = Table

interface TABLEPROPS {
    columns: any
    page?: number
    pageSize?: number
    mainData: any
    noPage?: boolean
    overflow?: boolean
    isNotSort?: boolean
    filterValue?: string
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
    const itemRank = rankItem(row.getValue(columnId), value)
    addMeta(itemRank)
    return itemRank.passed
}

const EasyTable = ({ columns, page, pageSize, mainData, noPage, overflow, isNotSort, filterValue }: TABLEPROPS) => {
    const [sorting, setSorting] = useState<any[]>([])

    const table = useReactTable({
        data: mainData,
        columns,
        state: {
            sorting,
            globalFilter: filterValue ? filterValue : '',
            pagination: noPage
                ? undefined
                : ({
                      pageIndex: (page ? page : 1) - 1,
                      pageSize: pageSize,
                  } as PaginationState),
        },
        onSortingChange: isNotSort ? undefined : setSorting,
        getCoreRowModel: getCoreRowModel(),
        filterFns: {
            fuzzy: fuzzyFilter,
        },
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        manualPagination: isNotSort ? false : true,
        // enableMultiSort: isNotSort ? false : true,
    })

    return (
        <div>
            <Table overflow={overflow ? true : false}>
                <THead>
                    {table?.getHeaderGroups()?.map((headerGroup) => (
                        <Tr key={headerGroup.id}>
                            {headerGroup?.headers?.map((header) => (
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
                    {table.getRowModel().rows?.map((row) => (
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
