import { Card, Table } from '@/components/ui'
import { useAppSelector } from '@/store'
import { CartItem, OrderSummaryTYPE } from '@/store/types/orderUserSummary.types'
import { flexRender, getCoreRowModel, createColumnHelper, useReactTable } from '@tanstack/react-table'
import React from 'react'

const { Tr, Th, Td, THead, TBody } = Table

const CartItems = () => {
    const { customerData } = useAppSelector<OrderSummaryTYPE>((state) => state.userSummary)
    const cartItems = customerData?.cart?.cartItems

    const columnHelper = createColumnHelper<CartItem>()

    const columns = [
        columnHelper.accessor('image', {
            header: 'image',
            cell: (props) => {
                const row = props.row.original
                return <img src={row.image.split(',')[0]} className=" xl:mt-3 w-[100px] h-[120px] cursor-pointer" />
            },
        }),
        columnHelper.accessor('name', {
            header: 'Name',
            cell: (props) => {
                const row = props.row.original
                return <div>{row.name ? row.name.toUpperCase() : ''}</div>
            },
        }),
        columnHelper.accessor('brand', {
            header: 'Brand',
            cell: (props) => {
                const row = props.row.original
                return <div>{row.brand ? row.brand.toUpperCase() : ''}</div>
            },
        }),

        columnHelper.accessor('size', {
            header: 'Size',
            cell: (props) => {
                const row = props.row.original
                return <div>{row.size ? row.size.toUpperCase() : ''}</div>
            },
        }),

        columnHelper.accessor('color', {
            header: 'Color',
            cell: (props) => {
                const row = props.row.original
                return <div>{row.color}</div>
            },
        }),
        columnHelper.accessor('sp', {
            header: 'Price',
            cell: (props) => {
                const row = props.row.original
                console.log('MRP', row?.mrp)
                console.log('SP', row?.sp)

                const percentageCalculation = Math.round(((parseFloat(row.mrp) - parseFloat(row.sp)) / parseFloat(row.mrp)) * 100)

                return percentageCalculation > 0 ? (
                    <div className="w-[200px] overflow-ellipsis flex flex-col">
                        <span className="line-through">Rs.{row.mrp}</span>
                        <span>Rs.{row.sp}</span>
                        <span>{percentageCalculation} % off</span>
                    </div>
                ) : row.mrp === row.sp ? (
                    <div>Rs.{row.sp}</div>
                ) : (
                    <div>Rs.{row.sp}</div>
                )
            },
        }),
        columnHelper.accessor('quantity', {
            header: 'Quantity',
        }),

        columnHelper.accessor('final_price', {
            header: 'Final Price',
            cell: (props) => {
                const row = props.row.original
                return <div>{row.final_price}</div>
            },
        }),
    ]

    const table = useReactTable({
        data: cartItems || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <div>
            <Card className="mb-4">
                <Table overflow>
                    <thead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <Tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <Th key={header.id} colSpan={header.colSpan}>
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                        </Th>
                                    )
                                })}
                            </Tr>
                        ))}
                    </thead>
                    <TBody>
                        {table.getRowModel().rows.map((row) => {
                            return (
                                <Tr key={row.id}>
                                    {row.getVisibleCells().map((cell) => {
                                        return <Td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</Td>
                                    })}
                                </Tr>
                            )
                        })}
                    </TBody>
                </Table>
            </Card>
        </div>
    )
}

export default CartItems
