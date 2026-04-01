/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { notification, Spin } from 'antd'
import { shipmentService } from '@/store/services/shipmentService'
import { ShipmentData } from '@/store/types/shipment.types'
import { FiBox, FiCalendar, FiLayers, FiMapPin, FiPackage, FiTruck, FiUpload, FiUser } from 'react-icons/fi'
import AddShipmentModal from './AddShipmentModal'
import ShipmentDownload from '../brandShipmentsUtils/ShipmentDownload'
import InwardMaterialModule from '@/views/inventory-management/inward/inwardModules/InwardMaterialModule'
import { Button } from '@/components/ui'
import { FaUpload } from 'react-icons/fa'

const BrandShipmentDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const [shipmentDetails, setShipmentDetails] = useState<ShipmentData | null>(null)
    const [showAddCsv, setShowAddCsv] = useState(false)
    const shipmentDetailCall = shipmentService.useGetShipmentDetailQuery({ id: id as string }, { skip: !id })

    useEffect(() => {
        if (shipmentDetailCall.isSuccess) {
            const result = shipmentDetailCall?.data?.data?.results?.[0] ?? null
            setShipmentDetails(result)
        }
        if (shipmentDetailCall.isError) notification.error({ message: 'Failed to fetch shipment details' })
    }, [shipmentDetailCall.isSuccess, shipmentDetailCall.isError, shipmentDetailCall.data])

    const headerUi = () => {
        return (
            <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h4 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                            <FiPackage className="text-blue-500" />
                            {shipmentDetails?.name || 'Unnamed Shipment'}
                            {shipmentDetails?.shipment_id && (
                                <span className="text-gray-400 text-base font-normal">({shipmentDetails?.shipment_id})</span>
                            )}
                        </h4>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mt-2">
                            <span className="flex items-center gap-1">
                                <FiUser className="text-gray-400" />
                                {shipmentDetails?.dispatched_by || 'N/A'}
                            </span>

                            <span className="flex items-center gap-1">
                                <FiCalendar className="text-gray-400" />
                                {shipmentDetails?.dispatch_date || 'No Date Found'}
                            </span>
                            {shipmentDetails?.brand && (
                                <div className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-sm font-medium">
                                    <FiTruck />
                                    {shipmentDetails.brand}
                                </div>
                            )}
                            {shipmentDetails?.awb_number && (
                                <div className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-sm font-medium">
                                    AWB: {shipmentDetails.awb_number}
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <Button variant="new" size="sm" icon={<FaUpload />} onClick={() => setShowAddCsv(true)}>
                            Upload Shipping Items
                        </Button>
                    </div>
                </div>
                <div className="my-5 border-t border-gray-100" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-xl hover:bg-gray-100 transition">
                        <p className="text-xs text-gray-400 uppercase tracking-wide mb-1 flex items-center gap-1">
                            <FiMapPin />
                            Origin
                        </p>
                        <p className="text-gray-700 font-medium">{shipmentDetails?.origin_address || 'N/A'}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl hover:bg-gray-100 transition">
                        <p className="text-xs text-gray-400 uppercase tracking-wide mb-1 flex items-center gap-1">
                            <FiMapPin />
                            Destination
                        </p>
                        <p className="text-gray-700 font-medium">{shipmentDetails?.delivery_address || 'N/A'}</p>
                    </div>
                </div>
            </div>
        )
    }

    const QuantityBoxes = () => {
        const stats = [
            {
                label: 'Total Quantity',
                value: shipmentDetails?.total_quantity,
                icon: <FiLayers className="text-xl" />,
                color: 'bg-blue-50 text-blue-600',
            },
            {
                label: 'Items Count',
                value: shipmentDetails?.items_count,
                icon: <FiPackage className="text-xl" />,
                color: 'bg-green-50 text-green-600',
            },
            {
                label: 'Upload Count',
                value: shipmentDetails?.upload_count,
                icon: <FiUpload className="text-xl" />,
                color: 'bg-purple-50 text-purple-600',
            },
            // {
            //     label: 'Total Box Count',
            //     value: shipmentDetails?.total_box_count,
            //     icon: <FiBox className="text-xl" />,
            //     color: 'bg-orange-50 text-orange-600',
            // },
            {
                label: 'Total Boxes',
                value: shipmentDetails?.box_count,
                icon: <FiBox className="text-xl" />,
                color: 'bg-pink-50 text-pink-600',
            },
            {
                label: 'Total Invoice',
                value: shipmentDetails?.total_invoice_value,
                icon: <FiBox className="text-xl" />,
                color: 'bg-pink-50 text-pink-600',
            },
        ]
        return (
            <div className="grid grid-cols-2 md:grid-cols-3 mt-6 lg:grid-cols-6 gap-4">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className="bg-gray-50 border border-gray-100 rounded-2xl p-4 shadow-lg hover:shadow-md transition-all duration-300"
                    >
                        <div className="flex justify-between">
                            <span>
                                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
                                <h3 className="text-xl font-semibold text-gray-800">{stat.value ?? 0}</h3>
                            </span>
                            <div className={`w-10 h-10 flex items-center justify-center rounded-lg mb-3 ${stat.color}`}>{stat.icon}</div>
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    return (
        <Spin spinning={shipmentDetailCall.isLoading}>
            <div className="p-6">
                <div>{headerUi()}</div>
                <div>{QuantityBoxes()}</div>
                <div>
                    <ShipmentDownload id={id as string} />
                </div>
                <div className="mt-12">
                    <h2 className="text-xl font-semibold text-gray-800">Shipment Items</h2>
                    <InwardMaterialModule />
                </div>
            </div>
            {showAddCsv && (
                <AddShipmentModal id={id as string} isOpen={showAddCsv} setIsOpen={setShowAddCsv} shipmentDetailCall={shipmentDetailCall} />
            )}
        </Spin>
    )
}

export default BrandShipmentDetails
