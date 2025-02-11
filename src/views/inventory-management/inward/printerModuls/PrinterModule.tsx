import EasyTable from '@/common/EasyTable'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import React, { useEffect, useState } from 'react'
import PrinterComp from '../inwardDetails/components/PrinterComp'
import { Dropdown } from '@/components/ui'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'

const ProductFilterArray = [
    { label: 'SKU', value: 'sku' },
    { label: 'Barcode', value: 'barcode' },
]

const PrinterModule = () => {
    const [skuData, setSkuData] = useState()
    const [printerData, setPrinterData] = useState([])
    const [skuInput, setSkuInput] = useState('')
    const [currentSelectedPage, setCurrentSelectedPage] = useState<Record<string, string>>(ProductFilterArray[0])

    const fetchDetails = async () => {
        try {
            let skuFilter = ''
            if (currentSelectedPage?.value === 'sku' && skuInput) {
                skuFilter = `&sku=${skuInput}`
            }
            const response = await axioisInstance.get(`inventory?p=1&page_size=10&${skuFilter}`)
            const data = response?.data?.data
            setPrinterData(data?.results)
        } catch (error) {
            console.log(error)
        }
    }

    const fetchByBarcode = async () => {
        try {
            let barcodeData = ''
            if (currentSelectedPage?.value === 'barcode' && skuInput) {
                barcodeData = `&barcode=${skuInput}`
            }
            const response = await axioisInstance.get(`/merchant/products?dashboard=true${barcodeData}`)
            const data = response?.data?.data
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        if (skuInput) {
            fetchDetails()
        }
    }, [skuInput])

    const columns = [
        { header: 'SKU', accessorKey: 'product.sku' },
        {
            header: 'Name',
            accessorKey: 'product.name',
        },
        {
            header: 'Brand Name',
            accessorKey: 'product.brand_name',
        },
        {
            header: 'Color',
            accessorKey: 'product.color',
        },
        {
            header: 'size',
            accessorKey: 'product.size',
        },
        {
            header: 'QUANTITY RECEIVED',
            accessorKey: 'quantity_received',
        },

        {
            header: 'QC PASSED',
            accessorKey: 'qc_passed',
            cell: ({ getValue }) => <div>{getValue() ?? 0}</div>,
        },

        {
            header: 'QC FAILED',
            accessorKey: 'qc_failed',
            cell: ({ row }) => {
                const qc_received = row?.original?.quantity_received ?? 0
                const qc_passed = row?.original?.qc_passed ?? 0
                const qc_failed = qc_received - qc_passed
                return <div>{qc_failed}</div>
            },
        },
        {
            header: 'LOCATION',
            accessorKey: 'location',
        },
    ]

    const handleProductSelect = (value: any) => {
        const selected = ProductFilterArray.find((item) => item.value === value)
        if (selected) {
            setCurrentSelectedPage(selected)
        }
    }

    console.log('printer data', printerData)

    return (
        <div className="flex flex-col gap-2">
            <div className="flex gap-2 items-center">
                <div className="flex gap-4">
                    <input value={skuInput} onChange={(e) => setSkuInput(e.target.value)} placeholder="Enter SKU" />
                </div>
                <div className="bg-gray-100 xl:text-md text-sm w-auto rounded-md dark:bg-blue-600 dark:text-white font-bold">
                    <Dropdown
                        className="text-black bg-gray-200 font-bold px-4 py-2 rounded-md"
                        title={currentSelectedPage?.value ? currentSelectedPage.label : 'SELECT'}
                        onSelect={handleProductSelect}
                    >
                        {ProductFilterArray?.map((item, key) => (
                            <DropdownItem key={key} eventKey={item.value}>
                                <span>{item.label}</span>
                            </DropdownItem>
                        ))}
                    </Dropdown>
                </div>
            </div>

            <div className="mt-6">
                <EasyTable columns={columns} mainData={printerData} noPage overflow />
            </div>
            <div className="flex justify-start items-center">
                {printerData?.length > 0 && <span className="text-xl font-bold">Print Product Data: </span>}
                <span>{printerData?.length > 0 && <PrinterComp dataForPrinter={printerData} />}</span>
            </div>
        </div>
    )
}

export default PrinterModule
