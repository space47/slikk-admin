import { Button, Dialog, Input } from '@/components/ui'
import { ProductTableField } from '../ProductCommon'
import { FiInfo } from 'react-icons/fi'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { successMessage } from '@/utils/responseMessages'
import { useState } from 'react'

interface props {
    isOpen: boolean
    setIsOpen: (x: boolean) => void
    currentSelectedPage: {
        label: string
        value: string
    }
    globalFilter: string
    typeFetch: string
}

const ProductDownload = ({ isOpen, setIsOpen, currentSelectedPage, globalFilter, typeFetch }: props) => {
    const filteredFields = [ProductTableField.SKU, ProductTableField.SKID, ProductTableField.BARCODE]
    const [selectedFields, setSelectedFields] = useState<string[]>([])
    const [isDownloading, setIsDownloading] = useState(false)

    const productTableFieldOptions = Object.values(ProductTableField)
        ?.filter((item) => !filteredFields.includes(item))
        .map((value) => ({
            value,
            name: value.replace(/_/g, ' ').toUpperCase(),
        }))

    const handleSelect = (val: string, isChecked: boolean) => {
        setSelectedFields((prev) => (isChecked ? [...prev, val] : prev.filter((id) => id !== val)))
    }

    const handleDownload = async () => {
        try {
            const downloadableData = selectedFields?.length ? `&fields_to_download=${selectedFields?.join(',')}` : ''
            setIsDownloading(true)
            const searchKey =
                [ProductTableField.SKU, ProductTableField.NAME, ProductTableField.BARCODE].includes(
                    currentSelectedPage.value as ProductTableField,
                ) && globalFilter
                    ? `&${currentSelectedPage.value}=${encodeURIComponent(globalFilter)}`
                    : ''
            const response = await axioisInstance.get(`merchant/products?download=true&${typeFetch}${searchKey}${downloadableData}`)
            successMessage(response)
            setIsOpen(false)
        } catch (error) {
            console.error('Error downloading the file:', error)
        } finally {
            setIsDownloading(false)
        }
    }

    return (
        <Dialog isOpen={isOpen} height="90vh" width={800} onClose={() => setIsOpen(false)}>
            <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-2xl mx-auto flex flex-col h-full overflow-hidden">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">Select Fields to Download</h1>

                    <div className="mt-2 flex items-start gap-3 rounded-xl border border-yellow-200 bg-yellow-50 p-2 dark:bg-yellow-900/20 dark:border-yellow-800">
                        <FiInfo className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />

                        <p className="text-sm text-yellow-800 dark:text-yellow-300 leading-relaxed">
                            <span className="font-medium">SKU, Barcode, and SKID</span> are included by default. Add additional fields as
                            needed.
                        </p>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-3">
                    <div className="grid grid-cols-2 gap-2">
                        {productTableFieldOptions?.map((item, key) => (
                            <label
                                key={key}
                                className="flex items-center justify-between p-3 rounded-xl border border-gray-200 dark:border-gray-700 
                        bg-gray-50 dark:bg-gray-800 hover:bg-indigo-50 dark:hover:bg-gray-700 
                        cursor-pointer transition-all duration-200 group"
                            >
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-indigo-600">
                                    {item?.name}
                                </span>

                                <Input
                                    type="checkbox"
                                    className="h-4 w-4 accent-indigo-600 cursor-pointer"
                                    onChange={(e) => handleSelect(item?.value, e.target.checked)}
                                />
                            </label>
                        ))}
                    </div>
                </div>
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
                    <Button variant="reject" onClick={() => setIsOpen(false)}>
                        Cancel
                    </Button>

                    <Button
                        variant="new"
                        loading={isDownloading}
                        className="px-4 py-2 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition shadow"
                        onClick={handleDownload}
                    >
                        Download
                    </Button>
                </div>
            </div>
        </Dialog>
    )
}

export default ProductDownload
