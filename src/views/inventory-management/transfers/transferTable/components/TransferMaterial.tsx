/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import EasyTable from '@/common/EasyTable'
import { pageSizeOptions } from '@/views/slikkLogistics/taskTracking/TaskCommonType'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { Button, Dropdown } from '@/components/ui'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import { MdCancel } from 'react-icons/md'

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
    const [storeSkuFromBarcode, setStoreSkuFromBarcode] = useState<string | null>(null)

    useEffect(() => {
        const storedData = localStorage.getItem('skuSearchResults')
        if (storedData) {
            setSkuWiseData(JSON.parse(storedData))
        }
    }, [])

    const handleDeleteRow = (sku: string) => {
        const updatedData = skuWiseData.filter((item) => item.sku !== sku)
        setSkuWiseData(updatedData)
        localStorage.setItem('skuSearchResults', JSON.stringify(updatedData))
    }

    const handleAddOrUpdateRow = (sku: string) => {
        if (!sku) return
        const existingRow = skuWiseData.find((item) => item.sku === sku)
        if (existingRow) {
            const updatedData = skuWiseData.map((item) =>
                item.sku === sku
                    ? { ...item, quantity_returned: item.quantity_returned + 1, location: `${item?.location}/${locationInput}` }
                    : item,
            )
            setSkuWiseData(updatedData)
            localStorage.setItem('skuSearchResults', JSON.stringify(updatedData))
        } else {
            const newRow = { sku, quantity_returned: 1, location: locationInput }
            const updatedData = [...skuWiseData, newRow]
            setSkuWiseData(updatedData)
            localStorage.setItem('skuSearchResults', JSON.stringify(updatedData))
        }
    }

    const columns = useMemo(
        () => [
            { header: 'SKU', accessorKey: 'sku' },
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputSku = e.target.value.trim()
        if (inputSku) {
            handleAddOrUpdateRow(inputSku)
            setGlobalFilter('')
        }
    }

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const inputSku = (e.target as HTMLInputElement).value.trim()
            if (inputSku) {
                handleAddOrUpdateRow(inputSku)
                setGlobalFilter('')
            }
        }
    }

    const downloadCSV = () => {
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
        link.download = 'sku_data.csv'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <div className="p-4 flex flex-col gap-6">
            <div className="flex justify-between">
                <div className="flex gap-2">
                    <input
                        name="filter"
                        value={globalFilter}
                        // onChange={handleInputChange}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        onKeyDown={handleInputKeyDown}
                        placeholder="Enter SKU"
                        className="border p-2 rounded-md"
                    />
                    <input
                        name="location"
                        value={locationInput}
                        onChange={(e) => setLocationInput(e.target.value)}
                        placeholder="Location"
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
                <div>
                    <Button onClick={downloadCSV} variant="accept">
                        Download
                    </Button>
                </div>
            </div>
            <EasyTable mainData={skuWiseData} columns={columns} />
        </div>
    )
}

export default TransferModule
