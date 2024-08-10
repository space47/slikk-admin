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
    mrp: string
    sp: string
    name: string
    brand: string
    product_feedback: string | null
    is_wish_listed: boolean
    is_try_and_buy: boolean
    trends: string | null
    styles: string | null
    inventory_count: number
    image: string
    division: string
    category: string
    sub_category: string
    product_type: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    variants: any[]
}

type OrderProductsProps = {
    data?: Product[]
}

const { Tr, Th, Td, THead, TBody } = Table

const columnHelper = createColumnHelper<Product>()

const ProductColumn = ({ row }: { row: Product }) => {
    return (
        <div className="flex gap-8">
            <Avatar size={120} src={row.image} className="xl:mt-6" />
            <div className="ltr:ml-2 rtl:mr-2">
                <div className="mb-2 text-[14px] font-bold">
                    Brand Name:
                    <h4 className="font-light text-[12px] truncate whitespace-nowrap">
                        {row.brand}
                    </h4>
                </div>
                <div className="mb-2 text-[14px] font-bold">
                    Product Name:
                    <h4 className="font-light text-[12px] truncate whitespace-nowrap">
                        {row.name}
                    </h4>
                </div>
                <h4 className="font-light text-[14px]"></h4>
            </div>
        </div>
    )
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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

    columnHelper.accessor('mrp', {
        header: 'Price',
        cell: (props) => {
            const row = props.row.original
            return <div>Rs:{row.mrp}</div>
        },
    }),
    columnHelper.accessor('trends', {
        header: 'Trends',
        cell: (props) => {
            const row = props.row.original
            return <div>{row.trends}</div>
        },
    }),
    columnHelper.accessor('division', {
        header: 'Division',
        cell: (props) => {
            const row = props.row.original
            return <div>{row.division}</div>
        },
    }),
    columnHelper.accessor('category', {
        header: 'Category',
        cell: (props) => {
            const row = props.row.original
            return <div>{row.category}</div>
        },
    }),
    columnHelper.accessor('sub_category', {
        header: 'Sub Category',
        cell: (props) => {
            const row = props.row.original
            return <div>{row.sub_category}</div>
        },
    }),
    columnHelper.accessor('product_type', {
        header: 'Product Type',
        cell: (props) => {
            const row = props.row.original
            return <div>{row.product_type}</div>
        },
    }),
]

const AcceptedProduct = ({ data = [] }: OrderProductsProps) => {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <AdaptableCard className="mb-4 border border-gray-800">
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

export default AcceptedProduct
