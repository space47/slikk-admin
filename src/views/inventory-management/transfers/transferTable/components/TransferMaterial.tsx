/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useState } from 'react'
import EasyTable from '@/common/EasyTable'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { Button, Dropdown } from '@/components/ui'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import { MdCancel } from 'react-icons/md'
import { Modal, notification } from 'antd'
import MoreDataTable from './MoreDataTable'
import EventListQrScanner from '@/views/offerEngine/eventSeries/eventList/eventListUtils/EventListQrScanner'
import { FaCamera } from 'react-icons/fa'
import { RiCameraOffFill } from 'react-icons/ri'
import SkuBarcodeScanner from './SkuBarcodeScanner'

const SEARCHOPTIONS = [
    { label: 'SKU', value: 'sku' },
    { label: 'Name', value: 'name' },
    { label: 'Barcode', value: 'barcode' },
]

const TransferModule = () => {
    const [skuWiseData, setSkuWiseData] = useState<any[]>([])
    const [globalFilter, setGlobalFilter] = useState('')
    const [locationInput, setLocationInput] = useState('')
    const [currentSelectedPage, setCurrentSelectedPage] = useState<Record<string, string>>(SEARCHOPTIONS[0])
    const [clearStorageModal, setClearStorageModal] = useState(false)
    const [downloadModal, setDownloadModal] = useState(false)
    const [saveAsInput, setSaveAsInput] = useState('')
    const [moreData, setMoreData] = useState(false)
    const [dataForName, setDataForName] = useState('')
    const [isCamera, setIsCamera] = useState(false)
    const [delay, setDelay] = useState(100)
    const [qrResult, setQrResult] = useState<any>()

    const cleanedQrResult = qrResult?.replace(/"/g, '')

    useEffect(() => {
        const storedData = localStorage.getItem('skuSearchResults')
        if (storedData) {
            setSkuWiseData(JSON.parse(storedData))
        }
    }, [])

    const handleProductFetch = async () => {
        if (dataForName !== '') return

        let queryParam = ''
        if (currentSelectedPage.value === 'barcode') {
            queryParam = `barcode=${globalFilter?.trim()}`
        } else if (currentSelectedPage.value === 'sku') {
            queryParam = `sku_exact=${globalFilter?.trim()}`
        } else if (currentSelectedPage.value === 'name' && dataForName) {
            queryParam = `barcode=${dataForName}`
        }
        if (isCamera) {
            queryParam = `sku_exact=${cleanedQrResult?.trim()}`
        }

        try {
            const response = await axioisInstance.get(`/merchant/products?${queryParam}`)
            const product = response?.data?.data?.results?.[0]

            if (product?.sku) {
                handleAddOrUpdateRow(product.sku, product?.brand)
            } else {
                console.error('No product found, adding entry with globalFilter.')
                handleAddOrUpdateRow(globalFilter, '')
                if (isCamera) {
                    handleAddOrUpdateRow(cleanedQrResult, '')
                }
            }
        } catch (error) {
            console.error(error)
            handleAddOrUpdateRow(globalFilter, '')
            if (isCamera) {
                handleAddOrUpdateRow(cleanedQrResult, '')
            }
        }
        setQrResult('')
        setGlobalFilter('')
        setIsCamera(false)
    }

    const handleActionClick = async (value: any) => {
        setDataForName(value)
        if (!value) return

        try {
            const response = await axioisInstance.get(`/merchant/products?barcode=${value}`)
            const product = response?.data?.data?.results?.[0]

            if (product?.sku) {
                handleAddOrUpdateRow(product.sku, product?.brand)
            } else {
                console.error('No product found, adding entry with globalFilter.')
                handleAddOrUpdateRow(globalFilter, '')
                if (isCamera) {
                    handleAddOrUpdateRow(cleanedQrResult, '')
                }
            }
        } catch (error) {
            console.error(error)
            handleAddOrUpdateRow(globalFilter, '')
            if (isCamera) {
                handleAddOrUpdateRow(cleanedQrResult, '')
            }
        } finally {
            setDataForName('')
            setMoreData(false)
            setQrResult('')
            setIsCamera(false)
        }
    }

    useEffect(() => {
        if (currentSelectedPage?.value === 'name' && globalFilter) {
            setMoreData(true)
        } else {
            setMoreData(false)
        }
    }, [currentSelectedPage?.value, globalFilter])

    const handleAddOrUpdateRow = (sku: string, brand: string) => {
        if (!sku) return
        const existingRow = skuWiseData.find((item) => item.sku?.trim() === sku?.trim())
        console.log('existing row', existingRow)
        if (existingRow) {
            const updatedData = skuWiseData.map((item) =>
                item.sku === sku?.trim()
                    ? {
                          ...item,
                          brand: brand || item.brand,
                          quantity_returned: (item.quantity_returned || 0) + 1,
                          location: item.location.includes(locationInput) ? item.location : `${item.location}/${locationInput}`,
                      }
                    : item,
            )
            setSkuWiseData(updatedData)
            localStorage.setItem('skuSearchResults', JSON.stringify(updatedData))
        } else {
            const newRow = { sku, brand: brand || '', quantity_returned: 1, location: locationInput }
            const updatedData = [newRow, ...skuWiseData]
            setSkuWiseData(updatedData)
            localStorage.setItem('skuSearchResults', JSON.stringify(updatedData))
        }
    }

    const handleDeleteRow = (sku: string) => {
        const updatedData = skuWiseData.filter((item) => item.sku !== sku)
        setSkuWiseData(updatedData)
        localStorage.setItem('skuSearchResults', JSON.stringify(updatedData))
    }

    const columns = useMemo(
        () => [
            { header: 'SKU', accessorKey: 'sku' },
            { header: 'Brand', accessorKey: 'brand' },
            {
                header: 'Quantity',
                accessorKey: 'quantity_returned',
                cell: ({ row }: { row: any }) => (
                    <div className="flex items-center gap-2">
                        <button
                            className=" text-green-500 text-xl font-bold"
                            onClick={() => {
                                const updatedData = skuWiseData.map((item) =>
                                    item.sku === row.original.sku
                                        ? { ...item, quantity_returned: (item.quantity_returned || 0) + 1 }
                                        : item,
                                )
                                setSkuWiseData(updatedData)
                                localStorage.setItem('skuSearchResults', JSON.stringify(updatedData))
                            }}
                        >
                            +
                        </button>
                        <span>{row.original.quantity_returned}</span>
                        <button
                            className="text-red-500 text-2xl font-bold"
                            onClick={() => {
                                const updatedData = skuWiseData.map((item) =>
                                    item.sku === row.original.sku
                                        ? { ...item, quantity_returned: Math.max((item.quantity_returned || 0) - 1, 0) }
                                        : item,
                                )
                                setSkuWiseData(updatedData)
                                localStorage.setItem('skuSearchResults', JSON.stringify(updatedData))
                            }}
                        >
                            -
                        </button>
                    </div>
                ),
            },
            {
                header: 'Location',
                accessorKey: 'location',
                cell: ({ row }: { row: any }) => (
                    <div className="flex items-center gap-2">
                        <span>{row.original.location}</span>
                        <button
                            className="text-red-500 text-xl font-bold"
                            onClick={() => {
                                const updatedData = skuWiseData.map((item) =>
                                    item.sku === row.original.sku
                                        ? {
                                              ...item,
                                              location: item.location ? item.location.split('/').slice(0, -1).join('/') : '',
                                          }
                                        : item,
                                )
                                setSkuWiseData(updatedData)
                                localStorage.setItem('skuSearchResults', JSON.stringify(updatedData))
                            }}
                        >
                            -
                        </button>
                    </div>
                ),
            },
            {
                header: '-',
                accessorKey: '',
                cell: ({ row }: { row: any }) => (
                    <button className="text-red-500 text-2xl" onClick={() => handleDeleteRow(row.original.sku)}>
                        <MdCancel />
                    </button>
                ),
            },
        ],
        [skuWiseData],
    )

    const handleSelect = (value: string) => {
        const selected = SEARCHOPTIONS.find((item) => item.value === value)
        if (selected) {
            setCurrentSelectedPage(selected)
        }
    }

    const clearStorage = () => {
        setClearStorageModal(true)
    }

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleProductFetch()
        }
    }
    useEffect(() => {
        if (qrResult) {
            handleProductFetch()
        }
    }, [qrResult])

    const downloadCSV = () => {
        if (saveAsInput === '') {
            notification.error({
                message: 'SAVE AS FIELD IS EMPTY',
            })
            return
        }
        const headers = columns.map((col) => col.header).join(',')
        const rows = skuWiseData.map((row) =>
            columns
                .map((col) => {
                    if (!col.accessorKey) return ''
                    const accessorKeys = col.accessorKey.split('.')
                    let value: any = row
                    for (const key of accessorKeys) {
                        value = value?.[key]
                        if (value === undefined) break
                    }
                    return `"${value ?? ''}"`
                })
                .join(','),
        )
        const csvContent = [headers, ...rows].join('\n')
        const blob = new Blob([csvContent], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `${saveAsInput}.csv`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        setDownloadModal(false)
    }

    const handleClearStorage = () => {
        localStorage.removeItem('skuSearchResults')
        setClearStorageModal(false)
        setSkuWiseData([])
        notification.success({
            message: ' successfully cleared all the data',
        })
    }

    return (
        <div className="p-4 flex flex-col gap-6">
            <div className="space-y-6">
                {/* Location Input */}
                <div>
                    <label htmlFor="location" className="text-lg font-semibold text-gray-700 block mb-1">
                        Location:
                    </label>
                    <input
                        id="location"
                        name="location"
                        value={locationInput}
                        placeholder="Enter location"
                        className="xl:w-1/3 w-full border border-gray-300 p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        onChange={(e) => setLocationInput(e.target.value)}
                    />
                </div>

                {/* Search & Filter Section */}
                <div className="flex flex-col xl:flex-row xl:justify-between gap-5 items-start xl:items-center">
                    <div className="flex flex-wrap gap-3 items-center">
                        {/* Global Search */}
                        <input
                            name="filter"
                            value={globalFilter}
                            placeholder="Enter SKU, Name or Barcode"
                            className="border border-gray-300 p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            onKeyDown={handleInputKeyDown}
                        />

                        {/* Dropdown Filter */}
                        <div className="bg-gray-100 dark:bg-blue-600 text-sm rounded-lg">
                            <Dropdown
                                className="text-black bg-gray-200 dark:text-white font-semibold px-4 py-2 rounded-lg"
                                title={currentSelectedPage?.value ? currentSelectedPage.label : 'SELECT'}
                                onSelect={handleSelect}
                            >
                                {SEARCHOPTIONS.map((item, key) => (
                                    <DropdownItem key={key} eventKey={item.value}>
                                        <span>{item.label}</span>
                                    </DropdownItem>
                                ))}
                            </Dropdown>
                        </div>

                        {/* Camera Toggle */}
                        <button
                            className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-md transition-all duration-200"
                            onClick={() => {
                                setIsCamera((prev) => !prev)
                                setQrResult('')
                                setDelay(0)
                            }}
                        >
                            {isCamera ? <RiCameraOffFill className="text-xl" /> : <FaCamera className="text-xl" />}
                        </button>
                        <p>{qrResult}</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-3 xl:mt-0">
                        <Button
                            variant="reject"
                            className="bg-red-500 hover:bg-red-600 text-white font-medium px-5 py-2 rounded-lg transition-all"
                            onClick={clearStorage}
                        >
                            Clear
                        </Button>
                        <Button
                            variant="accept"
                            className="bg-green-500 hover:bg-green-600 text-white font-medium px-5 py-2 rounded-lg transition-all"
                            onClick={() => setDownloadModal(true)}
                        >
                            Download
                        </Button>
                    </div>
                </div>
            </div>

            {isCamera && <SkuBarcodeScanner setQrResult={setQrResult} />}

            <div className="mb-10">{moreData && <MoreDataTable nameInput={globalFilter} handleActionClick={handleActionClick} />}</div>

            <EasyTable mainData={skuWiseData} columns={columns} />

            {clearStorageModal && (
                <>
                    <Modal
                        title="Clear Data"
                        open={clearStorageModal}
                        okText="Proceed"
                        okButtonProps={{ style: { backgroundColor: 'red', borderColor: 'red' } }}
                        onOk={handleClearStorage}
                        onCancel={() => setClearStorageModal(false)}
                    >
                        <p className="text-red-500 text-xl font-semibold">Are you sure you want to clear all the Data in the table ?</p>
                    </Modal>
                </>
            )}
            {downloadModal && (
                <>
                    <Modal title="Save Download File As" open={downloadModal} onOk={downloadCSV} onCancel={() => setDownloadModal(false)}>
                        <div className="flex flex-col">
                            <div>
                                <input value={saveAsInput} placeholder="Save As" onChange={(e) => setSaveAsInput(e.target.value)} />
                            </div>
                        </div>
                    </Modal>
                </>
            )}
        </div>
    )
}

export default TransferModule
