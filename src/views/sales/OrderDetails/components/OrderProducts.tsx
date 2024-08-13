import AdaptableCard from '@/components/shared/AdaptableCard'
import Table from '@/components/ui/Table'
import Avatar from '@/components/ui/Avatar'
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    createColumnHelper,
} from '@tanstack/react-table'
import { NumericFormat } from 'react-number-format'

type Product = {
    barcode: string
    brand: string
    name: string
    color: string
    size: string
    product_type: string
    image: string
    sp: number
    quantity: string
    sub_category: string

    mrp: number
    fulfilled_quantity: string
    final_price: number
    sku: string
}

type OrderProductsProps = {
    data?: Product[]
}

const { Tr, Th, Td, THead, TBody } = Table

const columnHelper = createColumnHelper<Product>()

const ProductColumn = ({ row }: { row: Product }) => {
    return (
        <div className="flex gap-8 justify-center flex-col xl:flex-row">
            <Avatar size={120} src={row.image} className=" xl:mt-6" />
            <div className="ltr:ml-2 rtl:mr-2">
                <div className="mb-2 text-[18px] font-bold ">
                    Brand Name:
                    <h4 className="font-light text-[16px] flex-wrap">
                        {row.brand}
                    </h4>
                </div>
                <div className="mb-2 text-[18px] font-bold ">
                    Product Name:
                    <h4 className="font-light text-[16px] flex-wrap">
                        {row.name}
                    </h4>
                </div>
                {/* skv */}
                <h4 className="font-light text-[14px]"> SKU:{row.sku} </h4>
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
    columnHelper.accessor('name', {
        header: 'Product',
        cell: (props) => {
            const row = props.row.original
            return <ProductColumn row={row} />
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
            return <PriceAmount amount={row.sp} />
        },
    }),
    columnHelper.accessor('quantity', {
        header: 'Quantity',
    }),
    columnHelper.accessor('fulfilled_quantity', {
        header: 'Fullfilled Quantity',
    }),
    columnHelper.accessor('final_price', {
        header: 'Final Price',
        cell: (props) => {
            const row = props.row.original
            return <PriceAmount amount={row.final_price} />
        },
    }),
]

const OrderProducts = ({ data = [] }: OrderProductsProps) => {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <AdaptableCard className="mb-4">
            <Table>
                <THead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <Tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <Th
                                        key={header.id}
                                        colSpan={header.colSpan}
                                    >
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext(),
                                        )}
                                    </Th>
                                )
                            })}
                        </Tr>
                    ))}
                </THead>
                <TBody>
                    {table.getRowModel().rows.map((row) => {
                        return (
                            <Tr key={row.id}>
                                {row.getVisibleCells().map((cell) => {
                                    return (
                                        <Td key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </Td>
                                    )
                                })}
                            </Tr>
                        )
                    })}
                </TBody>
            </Table>
        </AdaptableCard>
    )
}

export default OrderProducts
