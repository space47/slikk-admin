import EasyTable from '@/common/EasyTable'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import React, { useEffect, useState } from 'react'
import PrinterComp from '../inwardDetails/components/PrinterComp'
import { Dropdown } from '@/components/ui'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import MoreDataTable from '../../transfers/transferTable/components/MoreDataTable'
import { InventoryItemType, ProductFilterArray } from '../inwardCommon'
import { GenericCommonTypes } from '@/common/allTypesCommon'

const PrinterModule = () => {
    const [printerData, setPrinterData] = useState<InventoryItemType[]>([])
    const [skuInput, setSkuInput] = useState<string>('')
    const [currentSelectedPage, setCurrentSelectedPage] = useState<Record<string, string>>(ProductFilterArray[0])
    const [moreData, setMoreData] = useState<boolean>(false)
    const [dataFromBarcode, setDataFromBarcode] = useState<string>('')
    const [getSkuFromName, setGetSkuFromName] = useState<string>('')

    const fetchDetails = async () => {
        try {
            let skuFilter = ''
            if (currentSelectedPage?.value === 'sku' && skuInput) {
                skuFilter = `&sku=${skuInput}`
            }
            if (currentSelectedPage?.value === 'name' && getSkuFromName) {
                skuFilter = `&sku=${getSkuFromName}`
            }
            if (currentSelectedPage?.value === 'barcode' && dataFromBarcode) {
                skuFilter = `&sku=${dataFromBarcode}`
            }
            const response = await axioisInstance.get(`inventory?p=1&page_size=10${skuFilter}`)
            const data = response?.data?.data
            setPrinterData(data?.results)
        } catch (error) {
            console.log(error)
        }
    }

    const fetchByBarcode = async () => {
        try {
            const response = await axioisInstance.get(`/merchant/products?dashboard=true&barcode=${skuInput}`)
            const product = response?.data?.data?.results?.[0]
            if (product?.sku) {
                setDataFromBarcode(product?.sku)
            } else {
                setDataFromBarcode('')
            }
        } catch (error) {
            console.error(error)
        } finally {
            setMoreData(false)
        }
    }

    useEffect(() => {
        if (currentSelectedPage?.value === 'barcode' && skuInput) {
            fetchByBarcode()
        }
    }, [currentSelectedPage?.value, skuInput])

    useEffect(() => {
        if (skuInput) {
            fetchDetails()
        }
    }, [skuInput, currentSelectedPage?.value, getSkuFromName])

    useEffect(() => {
        if (currentSelectedPage?.value === 'name' && skuInput) {
            setMoreData(true)
        } else {
            setMoreData(false)
        }
    }, [currentSelectedPage?.value, skuInput])

    const handleActionClick = async (value: GenericCommonTypes['ChangeEventCommon']) => {
        if (!value) return
        try {
            const response = await axioisInstance.get(`/merchant/products?barcode=${value}`)
            const product = response?.data?.data?.results?.[0]

            if (product?.sku) {
                setGetSkuFromName(product.sku)
            } else {
                setGetSkuFromName('')
            }
        } catch (error) {
            console.error(error)
        } finally {
            setMoreData(false)
        }
    }

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
            cell: ({ getValue }: any) => <div>{getValue() ?? 0}</div>,
        },

        {
            header: 'QC FAILED',
            accessorKey: 'qc_failed',
            cell: ({ row }: any) => {
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

            <div className="mb-10">{moreData && <MoreDataTable nameInput={skuInput} handleActionClick={handleActionClick} />}</div>

            <div className="mt-6 flex flex-col gap-2">
                <div className="text-xl font-bold">Sku Details:</div>
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
