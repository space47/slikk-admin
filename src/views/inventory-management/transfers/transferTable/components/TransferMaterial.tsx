/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useState } from 'react'
import EasyTable from '@/common/EasyTable'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { Button, Dropdown } from '@/components/ui'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import { MdCancel } from 'react-icons/md'
import { Modal, notification } from 'antd'
import MoreDataTable from './MoreDataTable'

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

    useEffect(() => {
        const storedData = localStorage.getItem('skuSearchResults')
        if (storedData) {
            setSkuWiseData(JSON.parse(storedData))
        }
    }, [])

    const handleProductFetch = async () => {
        if (!globalFilter) return
        if (dataForName !== '') return

        let queryParam = ''
        if (currentSelectedPage.value === 'barcode') {
            queryParam = `barcode=${globalFilter}`
        } else if (currentSelectedPage.value === 'sku') {
            queryParam = `sku=${globalFilter}`
        } else if (currentSelectedPage.value === 'name' && dataForName) {
            queryParam = `barcode=${dataForName}`
        }

        try {
            const response = await axioisInstance.get(`/merchant/products?${queryParam}`)
            const product = response?.data?.data?.results?.[0]

            if (product?.sku) {
                handleAddOrUpdateRow(product.sku, product?.brand)
            } else {
                console.error('No product found, adding entry with globalFilter.')
                handleAddOrUpdateRow(globalFilter, '')
            }
        } catch (error) {
            console.error(error)
            handleAddOrUpdateRow(globalFilter, '')
        }

        setGlobalFilter('')
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
            }
        } catch (error) {
            console.error(error)
            handleAddOrUpdateRow(globalFilter, '')
        } finally {
            setDataForName('')
            setMoreData(false)
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
        const existingRow = skuWiseData.find((item) => item.sku === sku)
        if (existingRow) {
            const updatedData = skuWiseData.map((item) =>
                item.sku === sku
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
            { header: 'Quantity', accessorKey: 'quantity_returned' },
            { header: 'Location', accessorKey: 'location' },
            {
                header: '-',
                accessorKey: '',
                cell: ({ row }: { row: any }) => (
                    <button onClick={() => handleDeleteRow(row.original.sku)} className="text-red-500">
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
            <div className="">
                <div className="text-xl mb-2">Location:</div>
                <input
                    name="location"
                    value={locationInput}
                    onChange={(e) => setLocationInput(e.target.value)}
                    placeholder="Location"
                    className="border p-2 rounded-md"
                />
            </div>
            <div className="flex justify-between">
                <div className="flex gap-2">
                    <input
                        name="filter"
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        onKeyDown={handleInputKeyDown}
                        placeholder="Enter SKU, Name or Barcode"
                        className="border p-2 rounded-md"
                    />

                    <div className="bg-gray-100 items-center text-sm w-auto rounded-md dark:bg-blue-600 dark:text-white">
                        <Dropdown
                            className="text-xl text-black bg-gray-200 font-bold"
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
                </div>
                <div className="flex gap-2">
                    <Button onClick={clearStorage} variant="reject">
                        Clear
                    </Button>
                    <Button onClick={() => setDownloadModal(true)} variant="accept">
                        Download
                    </Button>
                </div>
            </div>

            <div className="mb-10">{moreData && <MoreDataTable nameInput={globalFilter} handleActionClick={handleActionClick} />}</div>

            <EasyTable mainData={skuWiseData} columns={columns} />

            {clearStorageModal && (
                <>
                    <Modal
                        title="Clear Data"
                        open={clearStorageModal}
                        onOk={handleClearStorage}
                        onCancel={() => setClearStorageModal(false)}
                        okText="Proceed"
                        okButtonProps={{ style: { backgroundColor: 'red', borderColor: 'red' } }}
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
                                <input value={saveAsInput} onChange={(e) => setSaveAsInput(e.target.value)} placeholder="Save As" />
                            </div>
                        </div>
                    </Modal>
                </>
            )}
        </div>
    )
}

export default TransferModule
