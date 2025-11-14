/* eslint-disable @typescript-eslint/no-explicit-any */
import AdaptableCard from '@/components/shared/AdaptableCard'
import Table from '@/components/ui/Table'

import { useReactTable, getCoreRowModel, flexRender, createColumnHelper } from '@tanstack/react-table'
import { NumericFormat } from 'react-number-format'
import { useState } from 'react'
import ImageMODAL from '@/common/ImageModal'
import ReplaceDrawer from './ReplaceDrawer'
import { Button, Dialog } from '@/components/ui'
import QRCode from 'react-qr-code'
import { MdQrCodeScanner } from 'react-icons/md'
import { CommonOrderProduct } from '../orderList.common'

type OrderProductsProps = {
    data: CommonOrderProduct[]
    invoice_id: string | undefined
    status: string
}

const { Tr, Th, Td, THead, TBody } = Table

const columnHelper = createColumnHelper<CommonOrderProduct>()

type productProps = {
    row: CommonOrderProduct
    status: string
}

const ProductColumn = ({ row, status }: productProps) => {
    const [showImageModal, setShowImageModal] = useState(false)
    const [particularRowImage, setParticularROwImage] = useState('')
    const [qrCode, setQrCode] = useState('')
    const headerLink = import.meta.env.VITE_WEBSITE_URL

    const segregatedNames = (value: string) => {
        return encodeURIComponent(value?.replace(/\s+/g, '-'))
    }

    const handleImageView = (img: string) => {
        setParticularROwImage(img)
        setShowImageModal(true)
    }
    console.log('row data is', status)
    return (
        <div className="flex gap-8 justify-center flex-col xl:flex-row">
            <div className="relative">
                <img
                    src={row?.image?.split(',')[0] || ''}
                    className="xl:mt-3 w-[100px] h-[120px] cursor-pointer"
                    onClick={() => handleImageView(row.image || '')}
                />
                {Number(row?.fulfilled_quantity) <= 0 && status !== 'PENDING' && status !== 'ACCEPTED' && status !== 'CANCELLED' && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none bottom-8">
                        <div className="mt-10 font-bold border-2 border-red-500 rounded-xl inline-flex py-3 px-3 bg-red-50 text-red-700 whitespace-nowrap -rotate-45 opacity-70">
                            Out of stock
                        </div>
                    </div>
                )}
            </div>

            <div className="ltr:ml-2 rtl:mr-2 xl:w-[300px] ">
                <div className="mb-2 text-[18px] font-bold ">
                    Brand Name:
                    <h4 className="font-light text-[16px] flex-wrap">{row.brand}</h4>
                </div>
                <div className="mb-2 text-[18px] font-bold ">
                    Product Name:
                    <h4 className="font-light text-[14px] flex-wrap">
                        <a
                            href={`${headerLink}${segregatedNames(row.category || '')}/${segregatedNames(row.sub_category || '')}/${segregatedNames(row.brand || '')}/${segregatedNames(row.name || '')}/${row.barcode}`}
                            className="hover:text-blue-500 hover:underline"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {row.name}
                        </a>
                    </h4>
                </div>
                {/* skv */}
                <div className="font-light text-[14px]">
                    {' '}
                    <div className="flex gap-2 items-center">
                        <span>SKU:{row.sku} </span>
                        <span className="rounded-full border p-2 bg-blue-100 hover:bg-gray-200" title="Click to view QR code">
                            <MdQrCodeScanner onClick={() => setQrCode(row?.sku as string)} className="text-xl cursor-pointer" />
                        </span>
                    </div>{' '}
                </div>
            </div>
            {showImageModal && (
                <ImageMODAL
                    dialogIsOpen={showImageModal}
                    setIsOpen={setShowImageModal}
                    image={particularRowImage && particularRowImage?.split(',')}
                />
            )}
            {qrCode && (
                <>
                    <Dialog isOpen={!!qrCode} onClose={() => setQrCode('')} width={600}>
                        <div className="bg-gray-100 mt-5 flex items-center justify-center dark:bg-gray-800 p-4 rounded-xl shadow-sm">
                            <QRCode value={row?.sku ?? ''} size={200} />
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 font-medium mt-10">sku: {row?.sku}</p>
                    </Dialog>
                </>
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
    const [showImageModal, setShowImageModal] = useState(false)
    const [particularRowImage, setParticularROwImage] = useState('')
    const [qrCode, setQrCode] = useState('')

    const columns = [
        columnHelper.accessor('name', {
            header: '',
            cell: (props) => {
                const row = props.row.original
                return <ProductColumn row={row} status={status} />
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
        columnHelper.accessor('location_details', {
            header: 'Location Details',
            cell: (props) => {
                const row = props.row.original
                const locationEntries = Object.entries(row?.location_details || {})
                if (locationEntries.length === 0) return 'N/A'

                return (
                    <div>
                        {locationEntries.map(([key, val]) => (
                            <div key={key}>
                                {key}: {val}
                            </div>
                        ))}
                    </div>
                )
            },
        }),
        columnHelper.accessor('sp', {
            header: 'Price',
            cell: (props) => {
                const row = props.row.original
                console.log('MRP', row?.mrp)
                console.log('SP', row?.sp)

                const percentageCalculation = Math.round(
                    ((parseFloat(row.mrp as string) - parseFloat(row.sp as string)) / parseFloat(row.mrp as string)) * 100,
                )

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
        columnHelper.accessor('final_price', {
            header: 'Final Price',
            cell: (props) => {
                const row = props.row.original
                return <PriceAmount amount={row.final_price ?? 0} />
            },
        }),
        columnHelper.accessor('quantity', {
            header: 'Quantity',
        }),

        columnHelper.accessor('fulfilled_quantity', {
            header: 'Fulfilled Quantity',
        }),
        columnHelper.accessor('llinfo', {
            header: 'LLInfo',
        }),
        columnHelper.accessor('is_gift_wrap', {
            header: 'Gift Wrap',
            cell: (props) => {
                const row = props.row.original
                return <div>{row?.is_gift_wrap ? 'Yes' : 'NO'}</div>
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

    const handleReplace = (itemId: number | undefined) => {
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

    const handleImageView = (img: string) => {
        setParticularROwImage(img)
        setShowImageModal(true)
    }

    const handleReplaceSubmit = () => {}

    return (
        <AdaptableCard className="mb-4">
            <div className="xl:block hidden">
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
            </div>

            <div>
                {data && data.length > 0 && (
                    <div className="grid grid-cols-1 gap-4 xl:hidden ">
                        {data?.map((pdts) => (
                            <div
                                key={pdts.id}
                                className={`flex  p-3 shadow-lg rounded-lg hover:shadow-2xl transition-shadow xl:gap-12 dark:bg-gray-800 dark:text-white ${Number(pdts?.fulfilled_quantity) <= 0 && status !== 'PENDING' && status !== 'ACCEPTED' ? 'bg-red-200' : 'bg-white'}`}
                            >
                                <div className="flex-shrink-0">
                                    <img
                                        src={pdts?.image?.split(',')[0] || ''}
                                        alt={pdts.name}
                                        className="w-28 xl:w-44 h-52 object-cover rounded-lg cursor-pointer"
                                        onClick={() => handleImageView(pdts?.image || '')}
                                    />
                                    {qrCode && (
                                        <div className="bg-gray-100 mt-5 flex items-center justify-center dark:bg-gray-800 p-4 rounded-xl shadow-sm">
                                            <QRCode value={qrCode ?? ''} size={80} />
                                        </div>
                                    )}
                                </div>

                                <div className="ml-6 w-full ">
                                    <div className="font-bold text-[12px] xl:text-2xl">{pdts.brand}</div>
                                    <div className="font-normal text-[12px] text-gray-500 xl:text-2xl w-[100px] xl:w-full">{pdts.name}</div>
                                    <br />
                                    <div className="mb-3 xl:text-lg w-[80px] flex flex-wrap break-words text-red-700 xl:w-full dark:text-red-500">
                                        {pdts.sku}
                                    </div>
                                    <div>
                                        <MdQrCodeScanner
                                            onClick={() => {
                                                if (qrCode) {
                                                    setQrCode('')
                                                } else {
                                                    setQrCode(pdts?.sku as string)
                                                }
                                            }}
                                            className="text-xl cursor-pointer"
                                        />
                                    </div>
                                    <div className=" mb-3 xl:text-sm w-[100px] text-gray-700 xl:w-full dark:text-white">
                                        color:{pdts.color}
                                    </div>
                                    <div className=" mb-3 xl:text-sm w-[100px] text-gray-700 xl:w-full dark:text-white">
                                        price: ₹{pdts.final_price}
                                    </div>
                                    <div className=" mb-3 xl:text-sm w-[100px] text-gray-700 xl:w-full dark:text-white">
                                        size:{pdts.size}
                                    </div>
                                    <div className=" mb-3 xl:text-sm w-[100px] text-gray-700 xl:w-full dark:text-white">
                                        Gift Wrap:{pdts.is_gift_wrap ? 'YES' : 'NO'}
                                    </div>

                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex flex-col xl:flex-row xl:gap-6 xl:items-center gap-2">
                                            <div className="text-md xl:text-md dark:text-white">
                                                Qty:
                                                {pdts?.quantity}
                                            </div>
                                        </div>
                                        <div className="flex flex-col xl:flex-row xl:gap-6 xl:items-center gap-2">
                                            <div className="text-md xl:text-md dark:text-white">
                                                Fulfilled Qty: {pdts.fulfilled_quantity}
                                            </div>
                                        </div>
                                    </div>
                                    {pdts.location && (
                                        <div className="text-gray-900 mb-3 xl:text-md w-[100px]  flex-wrap break-words xl:w-full font-bold flex gap-1 dark:text-white">
                                            <span className="font-semibold">Loc:</span>
                                            <span className="w-[50px] flex flex-wrap break-words">{pdts.location}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-end mt-10">
                                        <Button variant="reject" size="sm" onClick={() => handleReplace(pdts?.id)}>
                                            Replace
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {showImageModal && (
                <ImageMODAL
                    dialogIsOpen={showImageModal}
                    setIsOpen={setShowImageModal}
                    image={particularRowImage && particularRowImage?.split(',')}
                />
            )}
            {replaceDrawer && (
                <ReplaceDrawer
                    dialogIsOpen={replaceDrawer}
                    handleSubmit={handleReplaceSubmit}
                    id={itemId}
                    invoice_id={invoice_id}
                    setIsDialogOpen={setReplaceDrawer}
                    onDialogClose={handleReplaceClose}
                />
            )}
        </AdaptableCard>
    )
}

export default OrderProducts
