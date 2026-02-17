/* eslint-disable @typescript-eslint/no-explicit-any */
import FormUploadFile from '@/common/FormUploadFile'
import { Button } from '@/components/ui'
import { VendorDetails } from '@/store/types/vendor.type'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { errorMessage, successMessage } from '@/utils/responseMessages'
import { Collapse } from 'antd'
import { AxiosError } from 'axios'
import { Formik } from 'formik'
import React from 'react'
import { FaDownload } from 'react-icons/fa'

interface Props {
    sellerData: VendorDetails
    editingSection: string | null
    setEditingSection: (x: string | null) => void
    refetch: any
}

const { Panel } = Collapse

const SellerDetailWarehouse: React.FC<Props> = ({ sellerData, editingSection, setEditingSection, refetch }) => {
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

    const handleWarehouse = async (values: any, warehouseId: number) => {
        const formData = new FormData()
        const existingDetails = sellerData?.gst_details || []
        const updatedDetails = existingDetails.map((warehouse: any) => {
            if (warehouse.id === warehouseId) {
                const updatedWarehouse = {
                    ...warehouse,
                    warehouse_name: values.warehouse_name,
                    warehouse_address: values.warehouse_address,
                    gstin: values.gstin,
                    poc_name: values.poc_name,
                    poc_email: values.poc_email,
                    poc_contact_number: values.poc_contact_number,
                    is_active: values.is_active,
                }
                if (values?.gst_certificate?.[0] instanceof File) {
                    const certKey = `cert_${warehouseId}`
                    formData.append(certKey, values.gst_certificate[0])
                    updatedWarehouse.gst_certificate = certKey
                } else {
                    updatedWarehouse.gst_certificate = warehouse.gst_certificate
                }

                return updatedWarehouse
            }
            return warehouse
        })

        formData.append('gst_details', JSON.stringify(updatedDetails))

        try {
            const res = await axioisInstance.patch(`/merchant/company/${sellerData.id}`, formData)
            successMessage(res)
            refetch()
            setEditingSection(null)
        } catch (error) {
            if (error instanceof AxiosError) errorMessage(error)
        }
    }

    return (
        <div>
            <Collapse accordion bordered={false} className="bg-transparent space-y-2">
                {sellerData?.gst_details?.map((warehouse, index) => {
                    return (
                        <Panel
                            key={`warehouse-${warehouse.id}`}
                            header={<span className="font-medium text-gray-800">#Warehouse {index + 1}</span>}
                            className="border border-gray-200 rounded-xl bg-white shadow-sm"
                        >
                            {editingSection === `warehouse-${warehouse.id}` ? (
                                <Formik
                                    initialValues={{
                                        warehouse_name: warehouse.warehouse_name || '',
                                        warehouse_address: warehouse.warehouse_address || '',
                                        gstin: warehouse.gstin || '',
                                        poc_name: warehouse.poc_name || '',
                                        poc_email: warehouse.poc_email || '',
                                        poc_contact_number: warehouse.poc_contact_number || '',
                                        is_active: warehouse.is_active ?? false,
                                        gstCertificateCopy: [],
                                    }}
                                    onSubmit={(values) => handleWarehouse(values, warehouse.id)}
                                >
                                    {({ handleChange, handleSubmit, values, setFieldValue }) => (
                                        <form onSubmit={handleSubmit}>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {Object.keys(values).map((key) => {
                                                    if (key === 'gstCertificateCopy') return null
                                                    if (key === 'gst_certificate') return null

                                                    return (
                                                        <div key={key} className="flex flex-col">
                                                            <label className="text-sm font-medium text-gray-600 mb-1 capitalize">
                                                                {key.replace(/_/g, ' ')}
                                                            </label>
                                                            {key === 'is_active' ? (
                                                                <div className="flex items-center gap-3 mt-1">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => setFieldValue('is_active', !values.is_active)}
                                                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition
                                                                            ${values.is_active ? 'bg-green-500' : 'bg-gray-300'}
                                                                        `}
                                                                    >
                                                                        <span
                                                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition
                                                                                ${values.is_active ? 'translate-x-6' : 'translate-x-1'}
                                                                            `}
                                                                        />
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <input
                                                                    name={key}
                                                                    value={(values as any)[key]}
                                                                    onChange={handleChange}
                                                                    className="border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                                                />
                                                            )}
                                                        </div>
                                                    )
                                                })}

                                                {/* Add FormUploadFile separately for GST certificate */}
                                                <div className="flex flex-col col-span-1 sm:col-span-2">
                                                    <label className="text-sm font-medium text-gray-600 mb-1">GST Certificate</label>
                                                    <FormUploadFile
                                                        asterisk
                                                        isEdit={true}
                                                        label="gst_certificate"
                                                        fileList={values?.gstCertificateCopy}
                                                        name="gst_certificate"
                                                        existingFile={
                                                            typeof warehouse.gst_certificate === 'string'
                                                                ? warehouse.gst_certificate
                                                                : undefined
                                                        }
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex justify-end gap-2 mt-6">
                                                <Button
                                                    variant="twoTone"
                                                    color="gray"
                                                    type="button"
                                                    onClick={() => setEditingSection(null)}
                                                >
                                                    Cancel
                                                </Button>
                                                <Button variant="accept" type="submit">
                                                    Save Changes
                                                </Button>
                                            </div>
                                        </form>
                                    )}
                                </Formik>
                            ) : (
                                <>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                            <span className="font-semibold text-gray-700">Warehouse Name</span>
                                            <p>{warehouse.warehouse_name || 'N/A'}</p>
                                        </div>

                                        <div>
                                            <span className="font-semibold text-gray-700">Warehouse Address</span>
                                            <p>{warehouse.warehouse_address || 'N/A'}</p>
                                        </div>

                                        <div>
                                            <span className="font-semibold text-gray-700">GSTIN</span>
                                            <p>{warehouse.gstin || 'N/A'}</p>
                                        </div>

                                        <div>
                                            <span className="font-semibold text-gray-700">POC Name</span>
                                            <p>{warehouse.poc_name || 'N/A'}</p>
                                        </div>

                                        <div>
                                            <span className="font-semibold text-gray-700">POC Email</span>
                                            <p>{warehouse.poc_email || 'N/A'}</p>
                                        </div>

                                        <div>
                                            <span className="font-semibold text-gray-700">POC Contact</span>
                                            <p>{warehouse.poc_contact_number || 'N/A'}</p>
                                        </div>

                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-gray-700">GST Certificate</span>
                                            <span className={`text-xs ${warehouse.gst_certificate ? 'text-green-600' : 'text-red-500'}`}>
                                                {warehouse.gst_certificate ? 'Uploaded' : 'Not Uploaded'}
                                            </span>
                                        </div>

                                        {warehouse.gst_certificate ? (
                                            <Button
                                                variant="twoTone"
                                                color="green"
                                                size="sm"
                                                icon={<FaDownload />}
                                                onClick={() => handleDownload(`${warehouse.gst_certificate}`, 'GST_Certificate')}
                                                className="rounded-full"
                                            >
                                                Download
                                            </Button>
                                        ) : (
                                            <Button variant="twoTone" color="gray" size="sm" disabled className="rounded-full">
                                                N/A
                                            </Button>
                                        )}
                                    </div>

                                    <Button
                                        variant="reject"
                                        size="sm"
                                        className="mt-4"
                                        onClick={() => setEditingSection(`warehouse-${warehouse.id}`)}
                                    >
                                        Update
                                    </Button>
                                </>
                            )}
                        </Panel>
                    )
                })}
            </Collapse>
        </div>
    )
}

export default SellerDetailWarehouse
