/* eslint-disable @typescript-eslint/no-explicit-any */
import { beforeUpload } from '@/common/beforeUpload'
import EasyTable from '@/common/EasyTable'
import { Card, Upload } from '@/components/ui'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'
import moment from 'moment'
import React, { useEffect, useRef, useState } from 'react'
import { FaBoxOpen, FaMapMarkedAlt, FaShippingFast } from 'react-icons/fa'
import { useParams } from 'react-router-dom'
import { ShipmentDetailsColumns } from '../brandShipmentsUtils/BrandShipmentColumns'

const BrandShipmentDetails = () => {
    const { id } = useParams()
    const [shipmentDetails, setShipmentDetails] = useState<any>()
    const isDashboard = import.meta.env.VITE_IS_DASHBOARD !== 'brand'
    const [updatedQuantities, setUpdatedQuantities] = useState<{ [key: number]: number }>({})
    const [showAddCsv, setShowAddCsv] = useState(false)
    const [csvEmptyArray, setCsvEmptyArray] = useState<any[]>([])
    const qtyInputRef = useRef<{ [key: number]: HTMLInputElement | null }>({})

    console.log('csv', csvEmptyArray)

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

    const columns = ShipmentDetailsColumns(isDashboard, qtyInputRef, updatedQuantities, handleQuantityChange)

    return (
        <div className="p-6">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <Card className="p-6 shadow-xl rounded-2xl bg-gradient-to-br ">
                    <div className="flex items-center gap-2">
                        <FaShippingFast className="text-2xl" />
                        <h2 className="text-xl font-bold">Shipment Details</h2>
                    </div>
                    <div className="mt-4 space-y-2 text-sm">
                        <p>
                            <strong>Document:</strong> {shipmentDetails?.name}
                        </p>
                        <p>
                            <strong>Shipment ID:</strong> {shipmentDetails?.shipment_id}
                        </p>
                        <p>
                            <strong>AWB Number:</strong> {shipmentDetails?.awb_number}
                        </p>
                        <p>
                            <strong>Dispatch Date:</strong> {moment(shipmentDetails?.dispatch_date).format('DD-MM-YYYY')}
                        </p>
                        <p>
                            <strong>Sender Address:</strong> {shipmentDetails?.origin_address}
                        </p>
                    </div>
                </Card>
                <Card className="p-6 shadow-xl rounded-2xl bg-gradient-to-br ">
                    <div className="flex items-center gap-2">
                        <FaMapMarkedAlt className="text-2xl" />
                        <h2 className="text-xl font-bold">Delivery Info</h2>
                    </div>
                    <div className="mt-4 space-y-2 text-sm">
                        <p>
                            <strong>Dispatched By:</strong> {shipmentDetails?.dispatched_by ?? 'N/A'}
                        </p>
                        <p>
                            <strong>Received By:</strong> {shipmentDetails?.received_by ?? 'N/A'}
                        </p>
                        <p>
                            <strong>Delivery Address:</strong> {shipmentDetails?.delivery_address ?? 'N/A'}
                        </p>
                        <p>
                            <strong>Delivery Date:</strong>{' '}
                            {shipmentDetails?.delivery_date ? moment(shipmentDetails?.delivery_date).format('DD-MM-YYYY') : 'N/A'}
                        </p>
                    </div>
                </Card>

                {/* Items Info */}
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
                <div className="mt-6">
                    <h2 className="text-xl font-semibold text-gray-800">Shipment Items</h2>
                    <div className="mt-3 bg-white p-4 shadow-lg rounded-xl">
                        <EasyTable overflow mainData={shipmentDetails.shipment_items} columns={columns} />
                    </div>
                </div>
            )}
        </div>
    )
}

export default BrandShipmentDetails
