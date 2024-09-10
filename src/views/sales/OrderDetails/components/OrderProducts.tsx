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
import { useState } from 'react'
import ImageMODAL from '@/common/ImageModal'
import { useNavigate } from 'react-router-dom'

import.meta.env.VITE_WEB_URI

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
    location: string
    mrp: number
    fulfilled_quantity: string
    final_price: number
    sku: string
    category: string
}

type OrderProductsProps = {
    data?: Product[]
}

const { Tr, Th, Td, THead, TBody } = Table

const columnHelper = createColumnHelper<Product>()

const ProductColumn = ({ row }: { row: Product }) => {
    const [showImageModal, setShowImageModal] = useState(false)
    const [particularRowImage, setParticularROwImage] = useState('')
    const navigate = useNavigate()

    const segregatedNames = (value: any) => {
        return value?.replace(/\s+/g, '-')
    }

    const handleImageView = (img: any) => {
        setParticularROwImage(img)
        setShowImageModal(true)
    }
    console.log(
        'BRRRRRRRRRRRADN',
        `https://slikk.club/${segregatedNames(row.category)}/${segregatedNames(row.sub_category)}/${segregatedNames(row.brand)}/${segregatedNames(row.name)}/${row.barcode}`,
    )

    return (
        <div className="flex gap-8 justify-center flex-col xl:flex-row">
            <div className="flex flex-col items-center gap-1">
                <img
                    src={row.image.split(',')[0]}
                    className=" xl:mt-3 w-[100px] h-[120px] cursor-pointer"
                    onClick={() => handleImageView(row.image)}
                />
                <div className="cursor-pointer text-blue-500 hover:underline">
                    <a
                        href={`${`https://slikk.club/${segregatedNames(row?.category)}/${segregatedNames(row?.sub_category)}/${segregatedNames(row?.brand)}/${segregatedNames(row?.name)}/${row?.barcode}`}`}
                    >
                        Redirect
                    </a>
                </div>
            </div>
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
            {showImageModal && (
                <ImageMODAL
                    dialogIsOpen={showImageModal}
                    setIsOpen={setShowImageModal}
                    image={particularRowImage && particularRowImage?.split(',')}
                />
            )}
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
    columnHelper.accessor('location', {
        header: 'Location',
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

            const percentageCalculation = Math.round(
                ((parseFloat(row.mrp) - parseFloat(row.sp)) /
                    parseFloat(row.mrp)) *
                    100,
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
