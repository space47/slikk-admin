/* eslint-disable @typescript-eslint/no-explicit-any */
import { beforeUpload } from '@/common/beforeUpload'
import { Card, Upload } from '@/components/ui'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { FaBoxOpen, FaMapMarkedAlt, FaShippingFast, FaTimes, FaUpload } from 'react-icons/fa'
import { useParams } from 'react-router-dom'
import InwardMaterialModule from '@/views/inventory-management/inward/inwardModules/InwardMaterialModule'

const BrandShipmentDetails = () => {
    const { id } = useParams()
    const [shipmentDetails, setShipmentDetails] = useState<any>()
    const [showAddCsv, setShowAddCsv] = useState(false)
    const [csvEmptyArray, setCsvEmptyArray] = useState<any[]>([])

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

    return (
        <div className="p-6">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <Card className="p-6 shadow-xl rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-gray-100">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <FaShippingFast className="text-2xl text-green-500" />
                        </div>
                        <h2 className="text-xl font-bold">Shipment Details</h2>
                    </div>

                    <div className="mt-4 space-y-2 text-sm">
                        {Shipmentvalue?.map((item, index) => (
                            <p key={index} className="flex justify-between">
                                <strong>{item.label}:</strong> {item.value}
                            </p>
                        ))}
                    </div>
                </Card>
                <Card className="p-6 shadow-xl rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-gray-100">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <FaMapMarkedAlt className="text-2xl text-red-600" />
                        </div>
                        <h2 className="text-xl font-bold">Delivery Info</h2>
                    </div>
                    <div className="mt-4 space-y-2 text-sm">
                        {DeliveryDetailsValue?.map((item, index) => (
                            <p key={index} className="flex justify-between">
                                <strong>{item.label}:</strong> {item.value}
                            </p>
                        ))}
                    </div>
                </Card>
                <Card className="p-6 shadow-xl rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-gray-100">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <FaBoxOpen className="text-2xl text-blue-600" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-800">Items Information</h2>
                    </div>

                    <div className="">
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-gray-600 font-bold">Box Count:</span>
                            <span className="font-semibold">{shipmentDetails?.total_box_count ?? '0'}</span>
                        </div>

                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-gray-600 font-bold">Items Count:</span>
                            <span className="font-semibold">{shipmentDetails?.upload_count ?? '0'}</span>
                        </div>

                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-gray-600 font-bold">Total Quantity:</span>
                            <span className="font-semibold">{shipmentDetails?.total_quantity ?? '0'}</span>
                        </div>

                        <div className="pt-4">
                            {showAddCsv ? (
                                <div className="space-y-4">
                                    <button
                                        className="w-full py-2 px-4 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition-colors flex items-center justify-center gap-2"
                                        onClick={() => setShowAddCsv((prev) => !prev)}
                                    >
                                        <FaTimes className="text-sm" />
                                        Close Upload
                                    </button>

                                    <div className="flex flex-col items-center gap-4 p-4 bg-white rounded-lg border border-dashed border-gray-300">
                                        <Upload
                                            className="w-full"
                                            beforeUpload={beforeUpload}
                                            fileList={csvEmptyArray}
                                            onChange={(files) => setCsvEmptyArray(files)}
                                            onFileRemove={(files) => setCsvEmptyArray(files)}
                                        />
                                        <button
                                            className="w-full py-2 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
                                            onClick={handleCsvUpload}
                                        >
                                            Submit File
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    className="w-full py-2 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors flex items-center justify-center gap-2"
                                    onClick={() => setShowAddCsv((prev) => !prev)}
                                >
                                    <FaUpload className="text-sm" />
                                    Upload Shipping Items File
                                </button>
                            )}
                        </div>
                    </div>
                </Card>
            </div>

            <div className="mt-12">
                <h2 className="text-xl font-semibold text-gray-800">Shipment Items</h2>
                <InwardMaterialModule />
            </div>
        </div>
    )
}

export default BrandShipmentDetails
