import { getApiErrorMessage } from '@/constants/generateErrorMessage'
import { masterShipmentService } from '@/store/services/masterShipmentService'
import { Shipment } from '@/store/types/masterShipment.types'
import { notification, Spin } from 'antd'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { FiUser, FiCalendar, FiMapPin, FiTruck, FiPackage, FiLayers, FiUpload, FiBox } from 'react-icons/fi'
import TabList from '@/components/ui/Tabs/TabList'
import TabNav from '@/components/ui/Tabs/TabNav'
import { Tabs } from '@/components/ui'
import ChildShipmentList from '../components/ChildShipmentList'
import MasterShipmentLineItems from '../components/MasterShipmentLineItems'

const MasterShipmentDetails = () => {
    const { id } = useParams()
    const [shipmentData, setShipmentData] = useState<Shipment>()
    const [activeTab, setActiveTab] = useState('child')
    const masterShipmentCall = masterShipmentService.useMasterShipmentDetailsQuery({ id: id as string }, { skip: !id })

    useEffect(() => {
        if (masterShipmentCall.isSuccess) {
            setShipmentData(masterShipmentCall?.data?.data)
        }
        if (masterShipmentCall.isError) {
            const errorMessageText = getApiErrorMessage(masterShipmentCall.error) || 'Failed to load data'
            notification.error({ message: errorMessageText })
        }
    }, [masterShipmentCall.isSuccess, masterShipmentCall.isError, masterShipmentCall?.data?.data, masterShipmentCall.error])

    const handleChange = (tab: string) => {
        setActiveTab(tab)
    }

    const headerUi = () => {
        return (
            <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h4 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                            <FiPackage className="text-blue-500" />
                            {shipmentData?.name || 'Unnamed Shipment'}
                            <span className="text-gray-400 text-base font-normal">({shipmentData?.shipment_id})</span>
                        </h4>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mt-2">
                            <span className="flex items-center gap-1">
                                <FiUser className="text-gray-400" />
                                {shipmentData?.dispatched_by || 'N/A'}
                            </span>

                            <span className="flex items-center gap-1">
                                <FiCalendar className="text-gray-400" />
                                {shipmentData?.dispatch_date || 'No Date Found'}
                            </span>
                        </div>
                    </div>
                    {shipmentData?.brand && (
                        <div className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-sm font-medium">
                            <FiTruck />
                            {shipmentData.brand}
                        </div>
                    )}
                    {shipmentData?.awb_number && (
                        <div className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-sm font-medium">
                            AWB: {shipmentData.awb_number}
                        </div>
                    )}
                </div>
                <div className="my-5 border-t border-gray-100" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-xl hover:bg-gray-100 transition">
                        <p className="text-xs text-gray-400 uppercase tracking-wide mb-1 flex items-center gap-1">
                            <FiMapPin />
                            Origin
                        </p>
                        <p className="text-gray-700 font-medium">{shipmentData?.origin_address || 'N/A'}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl hover:bg-gray-100 transition">
                        <p className="text-xs text-gray-400 uppercase tracking-wide mb-1 flex items-center gap-1">
                            <FiMapPin />
                            Destination
                        </p>
                        <p className="text-gray-700 font-medium">{shipmentData?.delivery_address || 'N/A'}</p>
                    </div>
                </div>
            </div>
        )
    }

    const QuantityBoxes = () => {
        const stats = [
            {
                label: 'Total Quantity',
                value: shipmentData?.total_quantity,
                icon: <FiLayers className="text-xl" />,
                color: 'bg-blue-50 text-blue-600',
            },
            {
                label: 'Items Count',
                value: shipmentData?.items_count,
                icon: <FiPackage className="text-xl" />,
                color: 'bg-green-50 text-green-600',
            },
            {
                label: 'Upload Count',
                value: shipmentData?.upload_count,
                icon: <FiUpload className="text-xl" />,
                color: 'bg-purple-50 text-purple-600',
            },
            {
                label: 'Total Box Count',
                value: shipmentData?.total_box_count,
                icon: <FiBox className="text-xl" />,
                color: 'bg-orange-50 text-orange-600',
            },
            {
                label: 'Total Boxes',
                value: shipmentData?.box_count,
                icon: <FiBox className="text-xl" />,
                color: 'bg-pink-50 text-pink-600',
            },
        ]

        return (
            <div className="grid grid-cols-2 md:grid-cols-3 mt-6 lg:grid-cols-5 gap-4">
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
        <Spin spinning={masterShipmentCall.isLoading || masterShipmentCall.isLoading}>
            <div>{headerUi()}</div>
            <div>{QuantityBoxes()}</div>
            <div className="flex mt-10">
                <Tabs defaultValue="child" onChange={handleChange}>
                    <TabList>
                        <TabNav value="child">
                            <span className="text-xl font-bold">Child Shipment ({shipmentData?.child_shipment?.length || 0})</span>
                        </TabNav>
                        <TabNav value="lineItems">
                            <span className="text-xl font-bold">Master Shipments Line Items</span>
                        </TabNav>
                    </TabList>
                </Tabs>
            </div>
            {activeTab === 'child' && <ChildShipmentList childShipments={shipmentData?.child_shipment || []} />}
            {activeTab === 'lineItems' && (
                <MasterShipmentLineItems id={(shipmentData?.id as number) || ''} shipment_number={shipmentData?.shipment_id as string} />
            )}
        </Spin>
    )
}

export default MasterShipmentDetails
