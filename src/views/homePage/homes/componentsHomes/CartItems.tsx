import EasyTable from '@/common/EasyTable'
import { Card } from '@/components/ui'
import { useAppSelector } from '@/store'
import { CartItem, OrderSummaryTYPE } from '@/store/types/orderUserSummary.types'
import { createColumnHelper } from '@tanstack/react-table'
import React from 'react'

const CartItems = () => {
    const { customerData } = useAppSelector<OrderSummaryTYPE>((state) => state.userSummary)
    const cartItems = customerData?.cart?.cartItems
    const headerLink = import.meta.env.VITE_WEBSITE_URL
    const columnHelper = createColumnHelper<CartItem>()

    const columns = [
        columnHelper.accessor('image', {
            header: 'image',
            cell: (props) => {
                const row = props.row.original
                return <img src={row?.image && row?.image.split(',')[0]} className=" xl:mt-3 w-[100px] h-[120px] cursor-pointer" />
            },
        }),
        columnHelper.accessor('name', {
            header: 'Name',
            cell: (props) => {
                const row = props.row.original
                return (
                    <div className="text-blue-500 hover:text-green-500 cursor-pointer">
                        <a href={`${headerLink}/product/${props?.row?.original?.sku}`} target="_blank" rel="noreferrer">
                            {row.name ? row.name.toUpperCase() : ''}
                        </a>
                    </div>
                )
            },
        }),
        columnHelper.accessor('brand', {
            header: 'Brand',
            cell: (props) => {
                const row = props.row.original
                return <div>{row.brand ? row.brand.toUpperCase() : ''}</div>
            },
        }),
        columnHelper.accessor('sku', {
            header: 'SKU',
            cell: (props) => {
                const row = props.row.original
                return <div>{row.size ? row.sku : ''}</div>
            },
        }),
        columnHelper.accessor('barcode', {
            header: 'Barcode',
            cell: (props) => {
                const row = props.row.original
                return <div>{row.barcode ? row.barcode : ''}</div>
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
                const percentageCalculation = Math.round(
                    ((parseFloat(row?.mrp as string) - parseFloat(row?.sp as string)) / parseFloat(row?.mrp as string)) * 100,
                )

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

    return (
        <div>
            <Card className="mb-4">{cartItems ? <EasyTable overflow noPage mainData={cartItems} columns={columns} /> : ''}</Card>
        </div>
    )
}

export default CartItems
