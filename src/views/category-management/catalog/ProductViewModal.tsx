import React from 'react'
import { ProductTypes } from './ProductCommon'
import { Dialog } from '@/components/ui'
import QRCode from 'react-qr-code'

interface props {
    isOpen: boolean
    setIsOpen: (x: boolean) => void
    row: ProductTypes
}

const ProductViewModal = ({ isOpen, row, setIsOpen }: props) => {
    const ProductData = [
        { name: 'Name', value: row.name },
        { name: 'SKU', value: row.sku },
        { name: 'Price', value: `₹${row.mrp}` },
        { name: 'Category', value: row.category },
        { name: 'Division', value: row.division },
        { name: 'Brand', value: row.brand },
        { name: 'Status', value: row.styles },
    ]

    const imageUrl = row?.thumbnail?.split(',')[0] ?? row.image?.split(',')[0]

    return (
        <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)}>
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-xl w-full max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold text-center text-indigo-600 dark:text-indigo-400 mb-5">Product Overview</h1>

                <div className="flex flex-col xl:flex-row gap-6">
                    {/* Product Image */}
                    <div className="flex flex-col items-center gap-4 w-full xl:w-1/2">
                        <img src={imageUrl} alt="Product" className="w-52 h-52 object-cover rounded-xl border shadow-md" />
                        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl shadow-sm">
                            <QRCode value={row.barcode ?? ''} size={100} />
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">Barcode: {row.barcode}</p>
                    </div>

                    {/* Product Details */}
                    <div className="flex flex-col justify-between w-full xl:w-1/2 gap-3 text-gray-800 dark:text-gray-200">
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
