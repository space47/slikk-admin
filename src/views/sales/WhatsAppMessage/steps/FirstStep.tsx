/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormContainer, FormItem, Input } from '@/components/ui'
import { Field } from 'formik'
import React, { useState } from 'react'
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table'
import Table from '@/components/ui/Table'

const { Tr, Th, Td, THead, TBody, Sorter } = Table

interface props {
    messageTemplateData: any
    selectedTemplateName: any
    setSelectedTemplateName: any
}

const FirstStep = ({ messageTemplateData, selectedTemplateName, setSelectedTemplateName }: props) => {
    const handleSelect = (templateName: string) => {
        setSelectedTemplateName(templateName)
    }

    const columns = [
        {
            header: '',
            accessorKey: 'select',
            cell: ({ row }) => {
                const templateName = row.original.name
                return (
                    <input
                        type="radio"
                        name="template"
                        onChange={() => handleSelect(templateName)}
                        checked={selectedTemplateName === templateName}
                    />
                )
            },
        },
        {
            header: 'Template Name',
            accessorKey: 'name',
            cell: ({ getValue }) => {
                return <div>{getValue()}</div>
            },
        },
        {
            header: 'Category',
            accessorKey: 'category',
            cell: ({ getValue }) => {
                return <div>{getValue()}</div>
            },
        },
        {
            header: 'Library Template Name',
            accessorKey: 'library_template_name',
            cell: ({ getValue }) => {
                return <div>{getValue()}</div>
            },
        },
        {
            header: 'Parameter Format',
            accessorKey: 'parameter_format',
            cell: ({ getValue }) => {
                return <div>{getValue()}</div>
            },
        },
        {
            header: 'Status',
            accessorKey: 'status',
            cell: ({ getValue }) => {
                const status = getValue()
                const className =
                    status === 'REJECTED' ? 'text-red-700 bg-red-100' : status === 'APPROVED' ? 'text-green-700 bg-green-100' : ''

                return <div className={`p-2 items-center flex justify-center rounded-2xl ${className}`}>{status}</div>
            },
        },
    ]

    const table = useReactTable({
        data: messageTemplateData,
        columns,

        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    })

    return (
        <div>
            <FormContainer>
                <FormItem label="campaign Name">
                    <Field name="campaign_name" type="text" component={Input} placeholder="Enter Campaign" />
                </FormItem>

                <FormItem>
                    <Table overflow>
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
                </FormItem>
            </FormContainer>
        </div>
    )
}

export default FirstStep
