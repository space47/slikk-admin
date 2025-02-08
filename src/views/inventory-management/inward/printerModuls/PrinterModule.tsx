import EasyTable from '@/common/EasyTable'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import React, { useEffect, useState } from 'react'
import PrinterComp from '../inwardDetails/components/PrinterComp'

const PrinterModule = () => {
    const [skuData, setSkuData] = useState()
    const [printerData, setPrinterData] = useState([])
    const [skuInput, setSkuInput] = useState('')

    const fetchDetails = async () => {
        try {
            const response = await axioisInstance.get(`inventory?p=1&page_size=10&sku=${skuInput}`)
            const data = response?.data?.data
            setPrinterData(data?.results)
        } catch (error) {
            console.log(error)
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

    console.log('printer data', printerData)

    return (
        <div className="flex flex-col gap-2">
            <div className="flex gap-4">
                <input value={skuInput} onChange={(e) => setSkuInput(e.target.value)} placeholder="Enter SKU" />
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
