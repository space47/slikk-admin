import AdaptableCard from '@/components/shared/AdaptableCard'
import Table from '@/components/ui/Table'

import { useReactTable, getCoreRowModel, flexRender, createColumnHelper } from '@tanstack/react-table'
import { NumericFormat } from 'react-number-format'
import { useState } from 'react'
import ImageMODAL from '@/common/ImageModal'

import ReplaceDrawer from './ReplaceDrawer'

import.meta.env.VITE_WEB_URI

type Product = {
    id: number
    barcode: string
    brand: string
    name: string
    color: string
    size: string
    product_type: string
    image: string
    sp: string
    quantity: string
    sub_category: string
    location: string
    mrp: string
    fulfilled_quantity: string
    final_price: number
    sku: string
    category: string
}

type OrderProductsProps = {
    data?: Product[]
    invoice_id: string | undefined
    status: string
}

const { Tr, Th, Td, THead, TBody } = Table

const columnHelper = createColumnHelper<Product>()

const ProductColumn = ({ row }: { row: Product }) => {
    const [showImageModal, setShowImageModal] = useState(false)
    const [particularRowImage, setParticularROwImage] = useState('')

    const segregatedNames = (value: string) => {
        return value?.replace(/\s+/g, '-')
    }

    const handleImageView = (img: string) => {
        setParticularROwImage(img)
        setShowImageModal(true)
    }
    return (
        <div className="flex gap-8 justify-center flex-col xl:flex-row">
            <img
                src={row.image.split(',')[0]}
                className=" xl:mt-3 w-[100px] h-[120px] cursor-pointer"
                onClick={() => handleImageView(row.image)}
            />

            <div className="ltr:ml-2 rtl:mr-2 xl:w-[300px] ">
                <div className="mb-2 text-[18px] font-bold ">
                    Brand Name:
                    <h4 className="font-light text-[16px] flex-wrap">{row.brand}</h4>
                </div>
                <div className="mb-2 text-[18px] font-bold ">
                    Product Name:
                    <h4 className="font-light text-[14px] flex-wrap">
                        <a
                            href={`https://slikk.club/${segregatedNames(row.category)}/${segregatedNames(row.sub_category)}/${segregatedNames(row.brand)}/${segregatedNames(row.name)}/${row.barcode}`}
                            className="hover:text-blue-500 hover:underline"
                        >
                            {row.name}
                        </a>
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
    return <NumericFormat displayType="text" value={(Math.round(amount * 100) / 100).toFixed(2)} prefix={'Rs.'} thousandSeparator={true} />
}

const OrderProducts = ({ data = [], invoice_id, status }: OrderProductsProps) => {
    const [replaceDrawer, setReplaceDrawer] = useState(false)
    const [itemId, setItemId] = useState<number>()

    const columns = [
        columnHelper.accessor('name', {
            header: '',
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

                const percentageCalculation = Math.round(((parseFloat(row.mrp) - parseFloat(row.sp)) / parseFloat(row.mrp)) * 100)

                return percentageCalculation > 0 ? (
                    <div className=" overflow-ellipsis flex flex-col">
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
        columnHelper.accessor('name', {
            header: `${status !== 'CANCELLED' ? 'Replace' : ''}`,
            cell: (props) => {
                const rowID = props.row.original.id
                return (
                    <>
                        {status !== 'CANCELLED' && (
                            <button className="text-white bg-red-500 px-3 py-2 rounded-[10px]" onClick={() => handleReplace(rowID)}>
                                Replace
                            </button>
                        )}
                    </>
                )
            },
        }),
    ]

    console.log('STATUS OF ITEM', status)

    const handleReplace = (itemId: number) => {
        setReplaceDrawer(true)
        setItemId(itemId)
    }

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    const handleReplaceClose = () => {
        setReplaceDrawer(false)
    }

    const handleReplaceSubmit = () => {}

    return (
        <AdaptableCard className="mb-4">
            <Table overflow>
                <THead>
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
                </THead>
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

            {replaceDrawer && (
                <ReplaceDrawer
                    dialogIsOpen={replaceDrawer}
                    onDialogClose={handleReplaceClose}
                    handleSubmit={handleReplaceSubmit}
                    id={itemId}
                    invoice_id={invoice_id}
                />
            )}
        </AdaptableCard>
    )
}

export default OrderProducts
