/* eslint-disable @typescript-eslint/no-explicit-any */
import AdaptableCard from '@/components/shared/AdaptableCard'
import Table from '@/components/ui/Table'
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    createColumnHelper,
} from '@tanstack/react-table'
import { NumericFormat } from 'react-number-format'
import { useAppSelector } from '@/store'
import { ReturnOrderState } from '@/store/types/returnDetails.types'

const { Tr, Th, Td, THead, TBody } = Table

const columnHelper = createColumnHelper<any>()

const ProductColumn = ({ row }: { row: any }) => {
    return (
        <div className="flex gap-8 justify-center flex-col xl:flex-row">
            <img
                src={row.product.image.split(',')[0]}
                className=" xl:mt-3 w-[100px] h-[120px]"
            />
            <div className="ltr:ml-2 rtl:mr-2">
                <div className="mb-2 text-[18px] font-bold ">
                    Brand Name:
                    <h4 className="font-light text-[16px] flex-wrap">
                        {row.product.brand}
                    </h4>
                </div>
                <div className="mb-2 text-[18px] font-bold ">
                    Product Name:
                    <h4 className="font-light text-[16px] flex-wrap">
                        {row.product.name}
                    </h4>
                </div>
                <h4 className="font-light text-[14px]">
                    SKU: {row.product.sku}
                </h4>
            </div>
        </div>
    )
}

const PriceAmount = ({ amount }: { amount: number }) => {
    return (
        <NumericFormat
            displayType="text"
            value={(Math.round(amount * 100) / 100).toFixed(2)}
            prefix={'Rs.'}
            thousandSeparator={true}
        />
    )
}

const columns = [
    columnHelper.accessor('order_item', {
        header: 'Order Item',
        cell: (props) => {
            const row = props.row.original
            return <ProductColumn row={row} />
        },
    }),
    columnHelper.accessor('quantity', {
        header: 'Quantity',
    }),
    columnHelper.accessor('return_amount', {
        header: 'Return Amount',
        cell: (props) => {
            const row = props.row.original
            return <PriceAmount amount={row.return_amount} />
        },
    }),
    columnHelper.accessor('return_reason', {
        header: 'Return Reason',
        cell: (props) => {
            const row = props.row.original
            return <div>{row.return_reason}</div>
        },
    }),
]

const ReturnProductsDetails = () => {
    const returnOrder = useAppSelector<ReturnOrderState>(
        (state) => state.returnOrders,
    )
    const returnProducts =
        returnOrder?.returnOrders?.return_order_items.map((item) => item) || []

    const table = useReactTable({
        data: returnProducts,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <AdaptableCard className="mb-4">
            <Table>
                <THead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <Tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <Th key={header.id} colSpan={header.colSpan}>
                                    {flexRender(
                                        header.column.columnDef.header,
                                        header.getContext(),
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
                                <Td key={cell.id}>
                                    {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext(),
                                    )}
                                </Td>
                            ))}
                        </Tr>
                    ))}
                </TBody>
            </Table>
        </AdaptableCard>
    )
}

export default ReturnProductsDetails
