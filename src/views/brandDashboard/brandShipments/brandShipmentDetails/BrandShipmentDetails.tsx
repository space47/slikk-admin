/* eslint-disable @typescript-eslint/no-explicit-any */
import { beforeUpload } from '@/common/beforeUpload'
import EasyTable from '@/common/EasyTable'
import { Card, Upload } from '@/components/ui'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'
import moment from 'moment'
import React, { useEffect, useRef, useState } from 'react'
import { FaBoxOpen, FaMapMarkedAlt, FaShippingFast, FaSync } from 'react-icons/fa'
import { useNavigate, useParams } from 'react-router-dom'
import { ShipmentDetailsColumns } from '../brandShipmentsUtils/BrandShipmentColumns'

const BrandShipmentDetails = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [shipmentDetails, setShipmentDetails] = useState<any>()
    const isDashboard = import.meta.env.VITE_IS_DASHBOARD !== 'brand'
    const [updatedQuantities, setUpdatedQuantities] = useState<{ [key: number]: number }>({})
    const [showAddCsv, setShowAddCsv] = useState(false)
    const [csvEmptyArray, setCsvEmptyArray] = useState<any[]>([])
    const qtyInputRef = useRef<{ [key: number]: HTMLInputElement | null }>({})

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
    }, [id])

    const handleQuantityChange = (id: number, newQuantity: number) => {
        setUpdatedQuantities((prev) => (prev[id] === newQuantity ? prev : { ...prev, [id]: newQuantity }))
        setTimeout(() => qtyInputRef.current[id]?.focus(), 0)
    }

    const handleCsvUpload = async () => {
        try {
            notification.info({
                message: 'CSV upload is in progress',
            })
            const formData = new FormData()
            formData.append('shipment_items_file', csvEmptyArray[0])
            formData.append('shipment_id', id ?? '')

            await axioisInstance.post(`/shipment/bulkupload/items`, formData)

            notification.success({
                message: 'CSV uploaded successfully',
            })
        } catch (error) {
            console.log(error)
            notification.error({
                message: 'Failed to upload csv',
            })
        }
    }

    const Shipmentvalue = [
        { label: 'Document', value: shipmentDetails?.name },
        { label: 'Shipmemt Id', value: shipmentDetails?.shipment_id },
        { label: 'AWB Number', value: shipmentDetails?.awb_number },
        { label: 'Dispatch Date', value: moment(shipmentDetails?.dispatch_date).format('DD-MM-YYYY') },
        { label: 'Origin Address', value: shipmentDetails?.origin_address },
    ]
    const DeliveryDetailsValue = [
        { label: 'Dispatched By', value: shipmentDetails?.dispatched_by ?? 'N/A' },
        { label: 'Received By', value: shipmentDetails?.received_by ?? 'N/A' },
        { label: 'Delivery Address', value: shipmentDetails?.delivery_address ?? 'N/A' },
        { label: 'Delivery Date', value: moment(shipmentDetails?.delivery_date).format('DD-MM-YYYY') },
    ]

    const handleSyncShipment = async () => {
        const body = {
            id: id,
        }
        try {
            const response = await axioisInstance.post(`api`, body)
            notification.success({
                message: response?.data?.message || 'Shipment synced successfully',
            })
        } catch (error: any) {
            notification.success({
                message: error?.response?.data?.message || 'Failed to sync shipment',
            })
            console.log(error)
        }
    }

    const handleChangeQty = async (qty: string | number, id: any) => {
        const body = {
            quantity: updatedQuantities[id] ?? qty,
        }

        try {
            const response = await axioisInstance.patch(`/shipment/item/${id}`, body)
            notification.success({
                message: response?.data?.message || 'Quantity updated successfully',
            })
            navigate(0)
        } catch (error) {
            console.log(error)
            notification.error({
                message: 'Failed to update row',
            })
        }
    }

    const columns = ShipmentDetailsColumns(isDashboard, qtyInputRef, updatedQuantities, handleQuantityChange, handleChangeQty)

    return (
        <div className="p-6">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <Card className="p-6 shadow-xl rounded-2xl bg-gradient-to-br ">
                    <div className="flex items-center gap-2">
                        <FaShippingFast className="text-2xl" />
                        <h2 className="text-xl font-bold">Shipment Details</h2>
                    </div>

                    <div className="mt-4 space-y-2 text-sm">
                        {Shipmentvalue?.map((item, index) => (
                            <p key={index}>
                                <strong>{item.label}:</strong> {item.value}
                            </p>
                        ))}
                    </div>
                </Card>
                <Card className="p-6 shadow-xl rounded-2xl bg-gradient-to-br ">
                    <div className="flex items-center gap-2">
                        <FaMapMarkedAlt className="text-2xl" />
                        <h2 className="text-xl font-bold">Delivery Info</h2>
                    </div>
                    <div className="mt-4 space-y-2 text-sm">
                        {DeliveryDetailsValue?.map((item, index) => (
                            <p key={index}>
                                <strong>{item.label}:</strong> {item.value}
                            </p>
                        ))}
                    </div>
                </Card>
                <Card className="p-6 shadow-xl rounded-2xl bg-gradient-to-br ">
                    <div className="flex items-center gap-2">
                        <FaBoxOpen className="text-2xl" />
                        <h2 className="text-xl font-bold">Items Info</h2>
                    </div>
                    <div className="mt-4 space-y-2 text-sm">
                        <p>
                            <strong>Box Count:</strong> {shipmentDetails?.box_count ?? '0'}
                        </p>
                        <p>
                            <strong>Items Count:</strong> {shipmentDetails?.items_count ?? '0'}
                        </p>
                        {showAddCsv ? (
                            <button className="flex p-2 rounded-xl text-white bg-red-500" onClick={() => setShowAddCsv((prev) => !prev)}>
                                Close
                            </button>
                        ) : (
                            <button className="flex p-2 rounded-xl text-white bg-blue-500" onClick={() => setShowAddCsv((prev) => !prev)}>
                                Upload Shipping Items File
                            </button>
                        )}
                        {showAddCsv && (
                            <div className="flex items-center justify-center flex-col gap-2">
                                <Upload
                                    className="flex justify-center"
                                    beforeUpload={beforeUpload}
                                    fileList={csvEmptyArray}
                                    onChange={(files) => setCsvEmptyArray(files)}
                                    onFileRemove={(files) => setCsvEmptyArray(files)}
                                />
                                <button className="flex p-2 rounded-xl text-white bg-blue-500" onClick={handleCsvUpload}>
                                    Submit
                                </button>
                            </div>
                        )}
                    </div>
                </Card>
            </div>

            {shipmentDetails?.shipment_items?.length > 0 && (
                <div className="mt-10">
                    <h2 className="text-xl font-semibold text-gray-800">Shipment Items</h2>
                    <div className="mt-3 bg-white p-4 shadow-lg rounded-xl">
                        <div
                            className="flex justify-end gap-2 items-center text-xl mb-6 cursor-pointer text-green-600 hover:text-green-500"
                            onClick={handleSyncShipment}
                        >
                            <FaSync /> <span className="font-bold">Sync</span>
                        </div>
                        <EasyTable overflow mainData={shipmentDetails.shipment_items} columns={columns} />
                    </div>
                </div>
            )}
        </div>
    )
}

export default BrandShipmentDetails
