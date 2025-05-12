import React, { useEffect, useState } from 'react'
import { MdCancel } from 'react-icons/md'
import EasyTable from '@/common/EasyTable'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import PrinterComp from '../inwardDetails/components/PrinterComp'
import { Dropdown } from '@/components/ui'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import MoreDataTable from '../../transfers/transferTable/components/MoreDataTable'
import { InventoryItemType, ProductFilterArray } from '../inwardCommon'
import { GenericCommonTypes } from '@/common/allTypesCommon'

const PrinterModule = () => {
    const [printerData, setPrinterData] = useState<InventoryItemType[]>([])
    const [skuInput, setSkuInput] = useState<string>('')
    const [selectedFilter, setSelectedFilter] = useState(ProductFilterArray[0])
    const [moreData, setMoreData] = useState<boolean>(false)
    const [fetchedSku, setFetchedSku] = useState<string>('')

    useEffect(() => {
        if (!skuInput) {
            resetState()
        }
    }, [skuInput])

    useEffect(() => {
        if (selectedFilter.value === 'barcode' && skuInput) {
            fetchByBarcode()
        }
    }, [selectedFilter.value, skuInput])

    useEffect(() => {
        if (skuInput && selectedFilter.value !== 'name') {
            fetchDetails()
        } else if (selectedFilter.value === 'name' && fetchedSku) {
            fetchDetails()
        }
    }, [skuInput, fetchedSku, selectedFilter.value])

    useEffect(() => {
        setMoreData(selectedFilter.value === 'name' && !!skuInput)
    }, [selectedFilter.value, skuInput])

    const resetState = () => {
        setFetchedSku('')
        setPrinterData([])
    }

    const fetchDetails = async () => {
        if (!skuInput) return

        let skuFilter = ''
        if (selectedFilter.value === 'sku') skuFilter = `&sku_exact=${skuInput}`
        if (selectedFilter.value === 'name') skuFilter = `&sku=${fetchedSku}`
        if (selectedFilter.value === 'barcode') skuFilter = `&sku=${fetchedSku}`

        try {
            const response = await axioisInstance.get(`inventory?p=1&page_size=10${skuFilter}`)
            setPrinterData(response?.data?.data?.results || [])
        } catch (error) {
            console.error(error)
        }
    }

    const fetchByBarcode = async () => {
        try {
            const response = await axioisInstance.get(`/merchant/products?dashboard=true&barcode=${skuInput}`)
            setFetchedSku(response?.data?.data?.results?.[0]?.sku || '')
        } catch (error) {
            console.error(error)
        } finally {
            setMoreData(false)
        }
    }

    const handleActionClick = async (value: GenericCommonTypes['ChangeEventCommon']) => {
        if (!value) return

        try {
            const response = await axioisInstance.get(`/merchant/products?barcode=${value}`)
            setFetchedSku(response?.data?.data?.results?.[0]?.sku || '')
        } catch (error) {
            console.error(error)
        } finally {
            setMoreData(false)
        }
    }

    const handleDeleteRow = (id: number) => {
        setPrinterData(printerData.filter((item) => item?.id !== id))
    }

    const handleProductSelect = (value: string) => {
        const selected = ProductFilterArray.find((item) => item.value === value)
        if (selected) setSelectedFilter(selected)
    }

    const columns = [
        { header: 'SKU', accessorKey: 'product.sku' },
        { header: 'Name', accessorKey: 'product.name' },
        { header: 'Brand Name', accessorKey: 'product.brand_name' },
        { header: 'Color', accessorKey: 'product.color' },
        { header: 'Size', accessorKey: 'product.size' },
        { header: 'Quantity Received', accessorKey: 'quantity_received' },
        {
            header: 'QC Passed',
            accessorKey: 'qc_passed',
            cell: ({ getValue }: any) => <div>{getValue() ?? 0}</div>,
        },
        {
            header: 'QC Failed',
            accessorKey: 'qc_failed',
            cell: ({ row }: any) => {
                const qcReceived = row?.original?.quantity_received ?? 0
                const qcPassed = row?.original?.qc_passed ?? 0
                return <div>{qcReceived - qcPassed}</div>
            },
        },
        { header: 'Location', accessorKey: 'location' },
        {
            header: 'Remove',
            accessorKey: 'remove',
            cell: ({ row }: any) => (
                <MdCancel className="text-xl text-red-500 cursor-pointer" onClick={() => handleDeleteRow(row?.original?.id)} />
            ),
        },
    ]

    return (
        <div className="flex flex-col gap-2">
            <div className="flex gap-2 items-center">
                <div>
                    <input
                        type="search"
                        value={skuInput}
                        onChange={(e) => setSkuInput(e.target.value)}
                        placeholder={`Search by ${selectedFilter.value}`}
                    />
                </div>
                <div className="bg-gray-100 xl:text-md text-sm w-auto rounded-md dark:bg-blue-600 dark:text-white font-bold">
                    <Dropdown
                        className="text-black bg-gray-200 font-bold px-4 py-2 rounded-md"
                        title={selectedFilter.label}
                        onSelect={handleProductSelect}
                    >
                        {ProductFilterArray.map((item) => (
                            <DropdownItem key={item.value} eventKey={item.value}>
                                {item.label}
                            </DropdownItem>
                        ))}
                    </Dropdown>
                </div>
            </div>

            {moreData && <MoreDataTable nameInput={skuInput} handleActionClick={handleActionClick} />}

            <div className="mt-6 flex flex-col gap-2">
                <div className="text-xl font-bold">Sku Details:</div>
                <EasyTable columns={columns} mainData={printerData} noPage overflow />
            </div>

            {printerData.length > 0 && (
                <div className="flex items-center">
                    <span className="text-xl font-bold">Print Product Data: </span>
                    <PrinterComp dataForPrinter={printerData} />
                </div>
            )}
        </div>
    )
}

export default PrinterModule
