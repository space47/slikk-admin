/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import moment from 'moment'
import { notification, Spin } from 'antd'
import { FaBoxOpen, FaMapMarkedAlt, FaShippingFast, FaTimes, FaUpload } from 'react-icons/fa'
import { Card, Upload } from '@/components/ui'
import { beforeUpload } from '@/common/beforeUpload'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { shipmentService } from '@/store/services/shipmentService'
import { ShipmentData } from '@/store/types/shipment.types'
import InwardMaterialModule from '@/views/inventory-management/inward/inwardModules/InwardMaterialModule'
import { AxiosError } from 'axios'
import { errorMessage } from '@/utils/responseMessages'
import ShipmentDownload from '../brandShipmentsUtils/ShipmentDownload'

const formatDate = (date?: string | null) => {
    if (!date) return 'N/A'
    const formatted = moment(date)
    return formatted.isValid() ? formatted.format('DD-MM-YYYY') : 'N/A'
}

const BrandShipmentDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const [shipmentDetails, setShipmentDetails] = useState<ShipmentData | null>(null)
    const [showAddCsv, setShowAddCsv] = useState(false)
    const [csvFileList, setCsvFileList] = useState<File[]>([])
    const [isUploading, setIsUploading] = useState(false)
    const shipmentDetailCall = shipmentService.useGetShipmentDetailQuery({ id: id as string }, { skip: !id })

    useEffect(() => {
        if (shipmentDetailCall.isSuccess) {
            const result = shipmentDetailCall?.data?.data?.results?.[0] ?? null
            setShipmentDetails(result)
        }
        if (shipmentDetailCall.isError) notification.error({ message: 'Failed to fetch shipment details' })
    }, [shipmentDetailCall.isSuccess, shipmentDetailCall.isError, shipmentDetailCall.data])

    const handleCsvUpload = useCallback(async () => {
        if (!id) {
            notification.error({ message: 'Shipment ID missing' })
            return
        }

        if (!csvFileList.length) {
            notification.warning({ message: 'Please select a file before uploading' })
            return
        }

        try {
            setIsUploading(true)
            const formData = new FormData()
            formData.append('shipment_items_file', csvFileList[0])
            formData.append('shipment_id', id)
            await axioisInstance.post('/shipment/bulkupload/items', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
            notification.success({ message: 'CSV uploaded successfully' })
            setCsvFileList([])
            setShowAddCsv(false)
            shipmentDetailCall.refetch()
        } catch (error) {
            if (error instanceof AxiosError) errorMessage(error)
        } finally {
            setIsUploading(false)
        }
    }, [csvFileList, id, shipmentDetailCall])

    const shipmentInfo = useMemo(
        () => [
            { label: 'Document', value: shipmentDetails?.name ?? 'N/A' },
            { label: 'Shipment Id', value: shipmentDetails?.shipment_id ?? 'N/A' },
            { label: 'AWB Number', value: shipmentDetails?.awb_number ?? 'N/A' },
            { label: 'Dispatch Date', value: formatDate(shipmentDetails?.dispatch_date) },
            { label: 'Origin Address', value: shipmentDetails?.origin_address ?? 'N/A' },
        ],
        [shipmentDetails],
    )

    const deliveryInfo = useMemo(
        () => [
            { label: 'Dispatched By', value: shipmentDetails?.dispatched_by ?? 'N/A' },
            { label: 'Received By', value: shipmentDetails?.received_by ?? 'N/A' },
            { label: 'Delivery Address', value: shipmentDetails?.delivery_address ?? 'N/A' },
            { label: 'Delivery Date', value: formatDate(shipmentDetails?.delivery_date) },
        ],
        [shipmentDetails],
    )
    const itemStats = useMemo(
        () => [
            { label: 'Box Count', value: shipmentDetails?.total_box_count ?? 0 },
            { label: 'Items Count', value: shipmentDetails?.upload_count ?? 0 },
            { label: 'Total Quantity', value: shipmentDetails?.total_quantity ?? 0 },
        ],
        [shipmentDetails],
    )

    return (
        <Spin spinning={shipmentDetailCall.isLoading || isUploading}>
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
                            {shipmentInfo.map((item, index) => (
                                <div key={index} className="flex justify-between">
                                    <span className="font-semibold text-gray-600">{item.label}:</span>
                                    <span>{item.value}</span>
                                </div>
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
                            {deliveryInfo.map((item, index) => (
                                <div key={index} className="flex justify-between">
                                    <span className="font-semibold text-gray-600">{item.label}:</span>
                                    <span>{item.value}</span>
                                </div>
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

                        <div className="space-y-3 text-sm">
                            {itemStats.map((item) => (
                                <div key={item.label} className="flex justify-between border-b pb-2 last:border-none">
                                    <span className="font-semibold text-gray-600">{item.label}</span>
                                    <span className="font-medium text-gray-800">{item.value}</span>
                                </div>
                            ))}
                        </div>

                        <div className="pt-6">
                            {showAddCsv ? (
                                <div className="space-y-4">
                                    <button
                                        className="w-full py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white"
                                        onClick={() => setShowAddCsv(false)}
                                    >
                                        <FaTimes className="inline mr-2" />
                                        Close Upload
                                    </button>

                                    <div className="p-4 bg-white rounded-lg border border-dashed">
                                        <Upload
                                            beforeUpload={beforeUpload}
                                            fileList={csvFileList}
                                            onChange={(files) => setCsvFileList(files)}
                                            onFileRemove={(files) => setCsvFileList(files)}
                                        />

                                        <button
                                            className="w-full mt-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
                                            onClick={handleCsvUpload}
                                            disabled={!csvFileList.length || isUploading}
                                        >
                                            Upload File
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
                                    onClick={() => setShowAddCsv(true)}
                                >
                                    <FaUpload className="inline mr-2" />
                                    Upload Shipping Items File
                                </button>
                            )}
                        </div>
                    </Card>
                </div>
                <div>
                    <ShipmentDownload id={id as string} />
                </div>
                <div className="mt-12">
                    <h2 className="text-xl font-semibold text-gray-800">Shipment Items</h2>
                    <InwardMaterialModule />
                </div>
            </div>
        </Spin>
    )
}

export default BrandShipmentDetails
