/* eslint-disable @typescript-eslint/no-explicit-any */

import { Button } from '@/components/ui'
import { VendorDetails } from '@/store/types/vendor.type'
import React from 'react'
import { FaDownload, FaMapMarkerAlt, FaUser, FaEnvelope, FaPhone, FaBuilding, FaFilePdf } from 'react-icons/fa'

interface Props {
    sellerData: VendorDetails
}

const SellerDetailWarehouse: React.FC<Props> = ({ sellerData }) => {
    const handleDownload = (fileUrl: string, fileName: string) => {
        try {
            const link = document.createElement('a')
            link.href = fileUrl
            link.download = fileName || 'document'
            link.target = '_blank'
            link.rel = 'noopener noreferrer'
            link.click()
        } catch (error) {
            console.error('File download failed:', error)
        }
    }

    if (!sellerData?.gst_details?.length) {
        return (
            <div className="rounded-2xl bg-white shadow-md p-8 text-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                        <FaBuilding className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">No Warehouse Details</h3>
                    <p className="text-sm text-gray-500">This seller has not added any warehouse information yet.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {sellerData?.gst_details?.map((warehouse, index) => {
                const isEven = index % 2 === 0
                const gradientColor = isEven ? 'from-blue-500 via-indigo-500 to-purple-500' : 'from-emerald-500 via-teal-500 to-cyan-500'

                return (
                    <div
                        key={`warehouse-${warehouse.id}`}
                        className="group relative overflow-hidden rounded-2xl border-0 bg-white shadow-md hover:shadow-xl transition-all duration-300"
                    >
                        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradientColor}`}></div>
                        <div className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white px-6 py-4">
                            <div className="flex items-center gap-3">
                                <div
                                    className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${gradientColor} bg-opacity-10`}
                                >
                                    <FaBuilding className={`h-5 w-5 ${isEven ? 'text-blue-600' : 'text-emerald-600'}`} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {warehouse.warehouse_name || `Warehouse ${index + 1}`}
                                    </h3>
                                    <p className="text-xs text-gray-500">Warehouse Details & GST Information</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                <div className="rounded-xl bg-gray-50 p-4 hover:bg-gray-100/80 transition-colors duration-200">
                                    <div className="flex items-center gap-2 mb-2">
                                        <FaBuilding className="h-4 w-4 text-gray-500" />
                                        <span className="text-xs font-medium uppercase tracking-wider text-gray-500">Warehouse Name</span>
                                    </div>
                                    <p className="text-base font-medium text-gray-900">{warehouse.warehouse_name || 'N/A'}</p>
                                </div>
                                <div className="rounded-xl bg-gray-50 p-4 hover:bg-gray-100/80 transition-colors duration-200 md:col-span-2">
                                    <div className="flex items-center gap-2 mb-2">
                                        <FaMapMarkerAlt className="h-4 w-4 text-gray-500" />
                                        <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Warehouse Address
                                        </span>
                                    </div>
                                    <p className="text-base font-medium text-gray-900">{warehouse.warehouse_address || 'N/A'}</p>
                                </div>
                                <div className="rounded-xl bg-gray-50 p-4 hover:bg-gray-100/80 transition-colors duration-200">
                                    <div className="flex items-center gap-2 mb-2">
                                        <FaFilePdf className="h-4 w-4 text-gray-500" />
                                        <span className="text-xs font-medium uppercase tracking-wider text-gray-500">GSTIN</span>
                                    </div>
                                    <p className="text-base font-medium text-gray-900 font-mono">{warehouse.gstin || 'N/A'}</p>
                                </div>
                                <div className="rounded-xl bg-gray-50 p-4 hover:bg-gray-100/80 transition-colors duration-200">
                                    <div className="flex items-center gap-2 mb-2">
                                        <FaUser className="h-4 w-4 text-gray-500" />
                                        <span className="text-xs font-medium uppercase tracking-wider text-gray-500">POC Name</span>
                                    </div>
                                    <p className="text-base font-medium text-gray-900">{warehouse.poc_name || 'N/A'}</p>
                                </div>
                                <div className="rounded-xl bg-gray-50 p-4 hover:bg-gray-100/80 transition-colors duration-200">
                                    <div className="flex items-center gap-2 mb-2">
                                        <FaEnvelope className="h-4 w-4 text-gray-500" />
                                        <span className="text-xs font-medium uppercase tracking-wider text-gray-500">POC Email</span>
                                    </div>
                                    <p className="text-base font-medium text-gray-900">{warehouse.poc_email || 'N/A'}</p>
                                </div>
                                <div className="rounded-xl bg-gray-50 p-4 hover:bg-gray-100/80 transition-colors duration-200">
                                    <div className="flex items-center gap-2 mb-2">
                                        <FaPhone className="h-4 w-4 text-gray-500" />
                                        <span className="text-xs font-medium uppercase tracking-wider text-gray-500">POC Contact</span>
                                    </div>
                                    <p className="text-base font-medium text-gray-900">{warehouse.poc_contact_number || 'N/A'}</p>
                                </div>
                            </div>
                            <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50/50 p-4">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`flex h-12 w-12 items-center justify-center rounded-lg ${
                                                warehouse.gst_certificate ? 'bg-green-100' : 'bg-gray-200'
                                            }`}
                                        >
                                            <FaFilePdf
                                                className={`h-6 w-6 ${warehouse.gst_certificate ? 'text-green-600' : 'text-gray-400'}`}
                                            />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">GST Certificate</p>
                                            <p className={`text-sm ${warehouse.gst_certificate ? 'text-green-600' : 'text-red-500'}`}>
                                                {warehouse.gst_certificate ? 'Uploaded & Verified' : 'Not Uploaded'}
                                            </p>
                                        </div>
                                    </div>

                                    {warehouse.gst_certificate ? (
                                        <Button
                                            variant="twoTone"
                                            color="green"
                                            size="md"
                                            icon={<FaDownload />}
                                            onClick={() =>
                                                handleDownload(
                                                    `${warehouse.gst_certificate}`,
                                                    `GST_Certificate_${warehouse.warehouse_name || 'Warehouse'}`,
                                                )
                                            }
                                            className="rounded-full border-0 bg-green-50 px-6 hover:bg-green-100 hover:shadow-md transition-all duration-200"
                                        >
                                            Download Certificate
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="twoTone"
                                            color="gray"
                                            size="md"
                                            disabled
                                            className="rounded-full border-0 bg-gray-100 text-gray-400 cursor-not-allowed px-6"
                                        >
                                            Certificate Unavailable
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default SellerDetailWarehouse
