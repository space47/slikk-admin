/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react'
import { notification } from 'antd'
import { Button, Dialog, Dropdown, Input, Tooltip } from '@/components/ui'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import moment from 'moment'
import { InwardDetailSearchOptions, ShipmentItem } from '../inwardCommon'
import { FaEdit, FaSave, FaSync, FaTimes } from 'react-icons/fa'
import EasyTable from '@/common/EasyTable'
import { useParams } from 'react-router-dom'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { InwardDetailsColumns } from '../inwardUtils/InwardColumns'

const renderEditableCell = (
    value: any,
    field: keyof ShipmentItem,
    onChange: (e: React.ChangeEvent<HTMLInputElement>, field: keyof ShipmentItem) => void,
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void,
    ref: React.RefObject<HTMLInputElement>,
) => {
    return (
        <input
            ref={ref}
            type="text"
            defaultValue={value || ''}
            className="w-full border rounded p-1"
            onChange={(e) => onChange(e, field)}
            onKeyDown={onKeyDown}
        />
    )
}

const InwardMaterialModule = () => {
    const { id } = useParams()
    const isDashboard = import.meta.env.VITE_DASHBOARD_TYPE !== 'brand'
    const [shipmentDetails, setShipmentDetails] = useState<any>()
    const [skuWiseData, setSkuWiseData] = useState<any[]>([])
    const [currentSelectedSearch, setCurrentSelectedSearch] = useState<Record<string, string>>(InwardDetailSearchOptions[0])
    const [shipmentData, setShipmentData] = useState<ShipmentItem[]>(shipmentDetails?.shipment_items ?? [])
    const [formData, setFormData] = useState({ boxCount: '', sku: '', barcode: '' })
    const [editingRow, setEditingRow] = useState<string | null>(null)
    const editFormDataRef = useRef<Partial<ShipmentItem>>({})
    const barcodeInputRef = useRef<HTMLInputElement>(null)
    const skuInputRef = useRef<HTMLInputElement>(null)
    const qtySentInputRef = useRef<HTMLInputElement>(null)
    const qtyReceivedInputRef = useRef<HTMLInputElement>(null)
    const [refreshTrigger, setRefreshTrigger] = useState(0)
    const [showAddModal, setShowAddModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [dataTobeAdded, setDataTobeAdded] = useState<any>()
    const [dataTobeEdited, setDataTobeEdited] = useState<any>()
    const [isGenerateGrn, setIsGenerateGrn] = useState(false)
    const [receivedBy, setReceivedBy] = useState('')

    useEffect(() => {
        const fetchShipmentDetails = async () => {
            try {
                const response = await axioisInstance.get(`/product-shipment?view=detail&id=${id}`)
                setShipmentDetails(response?.data?.data?.results[0])
            } catch (error) {
                console.error(error)
            }
        }
        fetchShipmentDetails()
    }, [id, refreshTrigger])

    const handleEdit = useCallback(async (row: ShipmentItem) => {
        setEditingRow(row.id)
        editFormDataRef.current = { ...row }
        setDataTobeEdited(row)
    }, [])

    const handleSave = useCallback(async (id: string) => {
        try {
            const updatedData = { ...editFormDataRef.current }
            setShipmentData((prev) => prev.map((item) => (item.id === id ? { ...item, ...updatedData } : item)))
            setSkuWiseData((prev) => prev.map((item) => (item.id === id ? { ...item, ...updatedData } : item)))
            setEditingRow(null)
            setShowEditModal(true)
        } catch (error) {
            notification.error({ message: 'Failed to update item' })
        }
    }, [])
    const handleSaveAdd = useCallback(async (id: string) => {
        try {
            const updatedData = { ...editFormDataRef.current }
            setShipmentData((prev) => prev.map((item) => (item.id === id ? { ...item, ...updatedData } : item)))
            setSkuWiseData((prev) => prev.map((item) => (item.id === id ? { ...item, ...updatedData } : item)))
            setEditingRow(null)
        } catch (error) {
            notification.error({ message: 'Failed to update item' })
        }
    }, [])

    const handleCancel = useCallback(() => {
        setEditingRow(null)
    }, [])

    const handleEditChange = useCallback((e: React.ChangeEvent<HTMLInputElement>, field: keyof ShipmentItem) => {
        editFormDataRef.current = {
            ...editFormDataRef.current,
            [field]: e.target.value,
        }
    }, [])

    const handleEditKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter' && editingRow) {
                handleSave(editingRow)
            }
        },
        [editingRow, handleSave],
    )

    const handleAddRow = async (row: ShipmentItem) => {
        setShowAddModal(true)
        setDataTobeAdded(row)
    }

    const handleAddRowItems = async () => {
        const body = {
            sku: dataTobeAdded?.sku,
            barcode: dataTobeAdded?.barcode,
            shipment_id: id,
            quantity: dataTobeAdded?.quantity_sent,
            box_number: formData?.boxCount,
        }
        console.log('body', body)
        try {
            const response = await axioisInstance.post(`/shipment/item`, body)
            notification.success({ message: response?.data?.message || 'Item added successfully' })
            setRefreshTrigger((prev) => prev + 1)
        } catch (error) {
            console.error(error)
            notification.error({ message: 'Failed to add item' })
        } finally {
            setShowAddModal(false)
        }
    }
    const handleEditRowItems = async () => {
        const body = {
            sku: dataTobeEdited?.sku,
            barcode: dataTobeEdited?.barcode,
            quantity: dataTobeEdited?.quantity_sent,
            quantity_received: dataTobeEdited?.quantity_received,
        }
        const formattedData = Object.fromEntries(Object.entries(body).filter(([_, value]) => value !== undefined))
        console.log('body', body)
        try {
            const response = await axioisInstance.post(`/shipment/item/${dataTobeEdited?.id}`, formattedData)
            notification.success({ message: response?.data?.message || 'Item Edited successfully' })
            setRefreshTrigger((prev) => prev + 1)
        } catch (error) {
            console.error(error)
            notification.error({ message: 'Failed to Edit item' })
        }
    }

    const handleAddItem = () => {
        const { sku, barcode, boxCount } = formData
        const searchField = currentSelectedSearch.value
        const searchValue = searchField === 'sku' ? sku : barcode

        if (!searchValue.trim()) {
            notification.warning({ message: `Please enter a ${currentSelectedSearch.label}` })
            return
        }

        const existingItemIndex = shipmentData.findIndex((item) => item[searchField as keyof ShipmentItem] === searchValue)
        if (existingItemIndex >= 0) {
            const updatedData: any = [...shipmentData]
            updatedData[existingItemIndex] = {
                ...updatedData[existingItemIndex],
                quantity_received: (updatedData[existingItemIndex].quantity_received || 0) + 1,
                ...(boxCount && { boxCount }),
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
            setSkuWiseData([newItem])
            notification.success({
                message: `Added new item: ${searchValue}`,
            })
        }
        setFormData((prev) => ({ ...prev, [searchField]: '' }))
    }

    const handleSelect = (value: any) => {
        const selected = InwardDetailSearchOptions.find((item) => item.value === value)
        if (selected) {
            setCurrentSelectedSearch(selected)
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prevData: any) => ({ ...prevData, [name]: value }))
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleAddItem()
            e.preventDefault()
        }
    }
    const handleDeleteRow = (row: ShipmentItem) => {
        setSkuWiseData(skuWiseData?.filter((item) => item.id !== row.id))
    }

    const columns1 = InwardDetailsColumns(
        editingRow,
        editFormDataRef,
        barcodeInputRef,
        skuInputRef,
        qtySentInputRef,
        handleEdit,
        renderEditableCell,
        handleEditChange,
        handleEditKeyDown,
        handleSaveAdd,
        handleCancel,
        handleAddRow,
        formData,
        skuWiseData,
        handleDeleteRow,
    )

    const columns2 = useMemo(
        () => [
            {
                header: 'Barcode',
                accessorKey: 'barcode',
                cell: ({ row }: any) => {
                    console.log('row id is', row?.original?.id)
                    if (editingRow === row.original.id) {
                        return renderEditableCell(
                            editFormDataRef.current.barcode,
                            'barcode',
                            handleEditChange,
                            handleEditKeyDown,
                            barcodeInputRef,
                        )
                    }
                    return row.original.barcode
                },
            },
            {
                header: 'SKU',
                accessorKey: 'sku',
                cell: ({ row }: any) => {
                    if (editingRow === row.original.id) {
                        return renderEditableCell(editFormDataRef.current.sku, 'sku', handleEditChange, handleEditKeyDown, skuInputRef)
                    }
                    return row.original.sku
                },
            },
            {
                header: 'Catalog Available',
                accessorKey: 'catalog_available',
                cell: ({ row }: any) => {
                    return <div>{row.original.catalog_available ? 'true' : 'false'}</div>
                },
            },
            {
                header: 'Quantity Sent',
                accessorKey: 'quantity_sent',
                cell: ({ row }: any) => {
                    if (editingRow === row.original.id) {
                        return renderEditableCell(
                            editFormDataRef.current.quantity_sent,
                            'quantity_sent',
                            handleEditChange,
                            handleEditKeyDown,
                            qtySentInputRef,
                        )
                    }
                    return row.original.quantity_sent
                },
            },
            {
                header: 'Quantity Received',
                accessorKey: 'quantity_received',
                cell: ({ row }: any) => {
                    if (editingRow === row.original.id) {
                        return renderEditableCell(
                            editFormDataRef.current.quantity_received,
                            'quantity_received',
                            handleEditChange,
                            handleEditKeyDown,
                            qtyReceivedInputRef,
                        )
                    }
                    return row.original.quantity_received
                },
            },
            {
                header: 'QC failed',
                accessorKey: 'qc_failed',
                cell: ({ row }: any) => {
                    const quantityReceived = row?.original?.quantity_received ?? 0
                    const quantitySent = row?.original?.quantity_sent ?? 0
                    return <div>{quantitySent - quantityReceived}</div>
                },
            },
            {
                header: 'Created Date',
                accessorKey: 'create_date',
                cell: ({ row }: any) => {
                    return <span>{moment(row.original.create_date).format('DD-MM-YYYY')}</span>
                },
            },
            {
                header: isDashboard ? 'Edit' : '',
                accessorKey: 'action',
                cell: ({ row }: any) => {
                    const isEditing = editingRow === row.original.id
                    if (!isDashboard) return null
                    return (
                        <div className="flex gap-2">
                            {isEditing ? (
                                <>
                                    <button className="text-green-500 hover:text-green-700" onClick={() => handleSave(row.original.id)}>
                                        <Tooltip title="Save">
                                            <FaSave className="text-xl" />
                                        </Tooltip>
                                    </button>
                                    <button className="text-red-500 hover:text-red-700" onClick={handleCancel}>
                                        <Tooltip title="Cancel">
                                            <FaTimes className="text-xl" />
                                        </Tooltip>
                                    </button>
                                </>
                            ) : (
                                <button className="text-blue-500 hover:text-blue-700" onClick={() => handleEdit(row.original)}>
                                    <FaEdit className="text-xl" />
                                </button>
                            )}
                        </div>
                    )
                },
            },
        ],
        [editingRow, handleEdit, handleSave, handleCancel, handleEditChange, handleEditKeyDown],
    )

    const handleSync = async () => {
        const body = {
            shipment_id: id,
            received_by: receivedBy,
        }
        try {
            const response = await axioisInstance.post(`/shipment/grn/sync`, body)
            notification.success({ message: response?.data?.message || 'Synced successfully' })
            setIsGenerateGrn(false)
        } catch (error) {
            console.error(error)
            notification.error({ message: 'Failed to Sync' })
        }
    }

    return (
        <div className="p-4 flex flex-col gap-6">
            <div>
                <div className="mb-4">
                    <label className="block text-gray-700">Box Number</label>
                    <input
                        name="boxCount"
                        type="text"
                        placeholder="Enter Box Number"
                        className="w-auto xl:w-1/6 border border-gray-300 rounded p-2"
                        value={formData.boxCount}
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
                                            {InwardDetailSearchOptions?.map((item, key) => {
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

            <EasyTable overflow columns={columns1} mainData={skuWiseData} />

            <div className="mt-8">
                <div className="text-xl font-bold mb-8">Items Received</div>
                <div>
                    {isDashboard && (
                        <div className="flex gap-2 mb-7 justify-end cursor-pointer" onClick={() => setIsGenerateGrn(true)}>
                            <span>
                                <FaSync className="text-green-500 text-xl" />
                            </span>
                            <span className="font-bold  text-green-500">SYNC</span>
                        </div>
                    )}
                </div>
                <EasyTable overflow columns={columns2} mainData={shipmentDetails?.shipment_items ?? []} />
            </div>
            {showAddModal && (
                <Dialog isOpen={showAddModal} onClose={() => setShowAddModal(false)}>
                    <div className="text-xl font-bold">Add Items</div>
                    <div className="flex flex-col gap-3 mt-6">
                        <span>Are You Sure You want to Add This Item with SKU: {dataTobeAdded?.sku} </span>
                        <div className="flex justify-end gap-4">
                            <div>
                                <Button variant="reject" size="sm" onClick={() => setShowAddModal(false)}>
                                    Cancel
                                </Button>
                            </div>
                            <div>
                                <Button variant="accept" size="sm" onClick={handleAddRowItems}>
                                    Add
                                </Button>
                            </div>
                        </div>
                    </div>
                </Dialog>
            )}
            {showEditModal && (
                <Dialog isOpen={showEditModal} onClose={() => setShowEditModal(false)}>
                    <div className="text-xl font-bold">Edit Items</div>
                    <div className="flex flex-col gap-3 mt-6">
                        <span>Are You Sure You want to Edit This Item with SKU: {dataTobeEdited?.sku} </span>
                        <div className="flex justify-end gap-4">
                            <div>
                                <Button variant="reject" size="sm" onClick={() => setShowEditModal(false)}>
                                    Cancel
                                </Button>
                            </div>
                            <div>
                                <Button variant="accept" size="sm" onClick={handleEditRowItems}>
                                    Add
                                </Button>
                            </div>
                        </div>
                    </div>
                </Dialog>
            )}
            {isGenerateGrn && (
                <Dialog isOpen={isGenerateGrn} onClose={() => setIsGenerateGrn(false)} onRequestClose={() => setIsGenerateGrn(false)}>
                    <div className="text-xl mb-4">Received By</div>
                    <div className="h-1/2 mb-10">
                        <Input
                            value={receivedBy}
                            className="rounded-xl"
                            placeholder="Enter Received By"
                            onChange={(e) => setReceivedBy(e.target.value)}
                        />
                    </div>
                    <div className="text-right mt-6">
                        <Button className="ltr:mr-2 rtl:ml-2" variant="plain" onClick={() => setIsGenerateGrn(false)}>
                            Cancel
                        </Button>
                        <Button variant="solid" onClick={handleSync}>
                            SYNC
                        </Button>
                    </div>
                </Dialog>
            )}
        </div>
    )
}

export default InwardMaterialModule
