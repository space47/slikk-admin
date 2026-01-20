import React, { useMemo, useState } from 'react'
import { EProductQr, ProductTypes } from './ProductCommon'
import { Dialog, Select } from '@/components/ui'
import QRCode from 'react-qr-code'
// import { BsFillPrinterFill } from 'react-icons/bs'

type QrKey = EProductQr.SKU | EProductQr.BARCODE | EProductQr.SKID

const QrOptions = [
    { label: 'SKU', value: EProductQr.SKU },
    { label: 'BARCODE', value: EProductQr.BARCODE },
    { label: 'SKID', value: EProductQr.SKID },
]

const getFirstImage = (images?: string): string => images?.split(',')?.[0] || ''
interface props {
    isOpen: boolean
    setIsOpen: (x: boolean) => void
    row: ProductTypes
}

const ProductViewModal = ({ isOpen, row, setIsOpen }: props) => {
    const [qrValues, setQrValues] = useState<QrKey>(EProductQr.SKU)

    const ProductData = useMemo(() => {
        return [
            { name: 'Name', value: row?.name },
            { name: 'Barcode', value: row?.barcode },
            { name: 'Brand', value: row?.brand },
            { name: 'Price', value: `₹${row?.mrp}` },
            { name: 'Stock', value: row?.inventory_count },
            { name: 'Size', value: row?.size },
            { name: 'Color', value: row?.color },
        ]
    }, [row])

    const imageUrl = getFirstImage(row?.image)
    const thumbnail = getFirstImage(row?.thumbnail)

    return (
        <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)} height={700} width={800}>
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-xl max-h-[650px] xl:h-[600px] w-full max-w-2xl mx-auto overflow-scroll scrollbar-hide">
                <h1 className="text-2xl font-bold text-center text-indigo-600 dark:text-indigo-400 mb-5">Product Overview</h1>

                <div className="flex flex-col xl:flex-row gap-6">
                    {/* Product Image */}
                    <div className="flex flex-col items-center gap-4 w-full xl:w-1/2">
                        <img src={thumbnail || imageUrl} alt="Product" className="w-52 h-52 object-cover rounded-xl border shadow-md" />
                        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl shadow-sm">
                            <QRCode value={row?.[qrValues] ?? ''} size={100} />
                        </div>
                        <div className="">
                            <Select
                                options={QrOptions}
                                defaultValue={QrOptions[0]}
                                getOptionLabel={(option) => option.label}
                                getOptionValue={(option) => option.value}
                                onChange={(val) => setQrValues(val?.value as EProductQr)}
                            />
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">{row?.[qrValues]}</p>
                    </div>
                    <div className="flex flex-col justify-between w-full xl:w-1/2 gap-1 text-gray-800 dark:text-gray-200">
                        {ProductData?.map((item, key) => (
                            <div key={key}>
                                <p>
                                    <span className="font-semibold">{item?.name}:</span> {item?.value}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Dialog>
    )
}

export default ProductViewModal
