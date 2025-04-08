/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef } from 'react'
import EasyTable from '@/common/EasyTable'
import { notification } from 'antd'
import { Dropdown } from '@/components/ui'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import { InwardDetailsColumns, ShipmentDetailsInwardColumns } from '../inwardUtils/InwardColumns'

interface ShipmentItem {
    id: string
    barcode: string
    sku: string
    catalog_available?: string
    quantity_sent: number
    quantity_received: number
    create_date: string
}

const SEARCHOPTIONS = [
    { label: 'Sku', value: 'sku' },
    { label: 'Barcode', value: 'barcode' },
]

interface props {
    ShipmentData: ShipmentItem[]
    shipemntCulumns: any
}

const InwardMaterialModule = ({ ShipmentData: initialShipmentData }: props) => {
    const [skuWiseData, setSkuWiseData] = useState<any[]>([])
    const [qcReceived, setQcReceived] = useState<number>()
    const [qcPass, setQcPass] = useState<number>()
    const [currentSelectedSearch, setCurrentSelectedSearch] = useState<Record<string, string>>(SEARCHOPTIONS[0])
    const [locationInput, setLocationInput] = useState<string>('')
    const [updatedQuantities, setUpdatedQuantities] = useState<Record<string, number>>({})
    const qtyInputRef = useRef<any>({})
    const [shipmentData, setShipmentData] = useState<ShipmentItem[]>(initialShipmentData)
    const [formData, setFormData] = useState({ location: '', sku: '', barcode: '' })

    const columns = InwardDetailsColumns(
        qcReceived,
        setQcReceived,
        qcPass,
        setQcPass,
        locationInput,
        setLocationInput,
        formData,
        skuWiseData,
    )

    const handleQuantityChange = (stockId: string, value: number) => {
        setUpdatedQuantities((prev) => ({ ...prev, [stockId]: value }))
    }
    const ShipmentDetailsColumnData = ShipmentDetailsInwardColumns(qtyInputRef, handleQuantityChange, updatedQuantities)

    const handleAddItem = () => {
        const { sku, barcode, location } = formData
        const searchField = currentSelectedSearch.value
        const searchValue = searchField === 'sku' ? sku : barcode

        if (!searchValue.trim()) {
            notification.warning({
                message: `Please enter a ${currentSelectedSearch.label}`,
            })
            return
        }

        const existingItemIndex = shipmentData.findIndex((item) => item[searchField as keyof ShipmentItem] === searchValue)

        if (existingItemIndex >= 0) {
            const updatedData = [...shipmentData]
            updatedData[existingItemIndex] = {
                ...updatedData[existingItemIndex],
                quantity_received: (updatedData[existingItemIndex].quantity_received || 0) + 1,
                ...(location && { location }),
            }
            setShipmentData(updatedData)
            notification.success({ message: `Updated quantity for ${searchValue}` })
        } else {
            const newItem: ShipmentItem = {
                id: `new-${Date.now()}`,
                barcode: searchField === 'barcode' ? searchValue : '',
                sku: searchField === 'sku' ? searchValue : '',
                quantity_sent: 1,
                quantity_received: 1,
                create_date: new Date().toISOString(),
            }

            setShipmentData((prev) => [...prev, newItem])
            setSkuWiseData([newItem])

            notification.success({
                message: `Added new item: ${searchValue}`,
            })
        }

        setFormData((prev) => ({
            ...prev,
            [searchField]: '',
        }))
    }

    const handleSelect = (value: any) => {
        const selected = SEARCHOPTIONS.find((item) => item.value === value)
        if (selected) {
            setCurrentSelectedSearch(selected)
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prevData: any) => ({
            ...prevData,
            [name]: value,
        }))
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleAddItem()
        }
    }

    return (
        <div className="p-4 flex flex-col gap-6">
            <div>
                <div className="mb-4">
                    <label className="block text-gray-700">Location</label>
                    <input
                        name="location"
                        type="text"
                        placeholder="Enter Location"
                        className="w-auto xl:w-1/6 border border-gray-300 rounded p-2"
                        value={formData.location}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="grid grid-cols-4 gap-2">
                    <div className="mb-4 flex gap-2">
                        <div>
                            <label className="block text-gray-700">{currentSelectedSearch.label}</label>
                            <div className="flex gap-3 shadow-md rounded-md p-2">
                                <input
                                    name={currentSelectedSearch.value}
                                    type="search"
                                    placeholder={`Enter ${currentSelectedSearch.label}`}
                                    className="w-full border border-gray-300 rounded p-2"
                                    value={formData[currentSelectedSearch.value as keyof typeof formData]}
                                    onChange={handleInputChange}
                                    onKeyDown={handleKeyDown}
                                />
                                <div className="flex ">
                                    <div className="bg-gray-100 flex justify-center font-bold items-center xl:mt-1  xl:text-md text-sm w-auto rounded-md dark:bg-blue-600 dark:text-white">
                                        <Dropdown
                                            className=" text-xl text-black bg-gray-200 font-bold  "
                                            title={currentSelectedSearch?.value ? currentSelectedSearch.label : 'SELECT'}
                                            onSelect={handleSelect}
                                        >
                                            {SEARCHOPTIONS?.map((item, key) => {
                                                return (
                                                    <DropdownItem key={key} eventKey={item.value}>
                                                        <span>{item.label}</span>
                                                    </DropdownItem>
                                                )
                                            })}
                                        </Dropdown>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {<EasyTable noPage overflow mainData={skuWiseData} columns={columns} />}

            <div className="flex flex-col gap-6">
                <div className="flex justify-between">
                    <label htmlFor="" className="font-bold text-xl">
                        Shipment Details
                    </label>
                </div>

                <div>
                    <div className="flex justify-end ">
                        <button className="text-green-600 mb-4 text-xl font-bold cursor-pointer hover:text-green-400">Generate GRN</button>
                    </div>
                    <EasyTable noPage overflow mainData={shipmentData} columns={ShipmentDetailsColumnData} />
                </div>
            </div>
        </div>
    )
}

export default InwardMaterialModule
