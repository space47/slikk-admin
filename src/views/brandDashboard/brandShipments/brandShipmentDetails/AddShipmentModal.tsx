/* eslint-disable @typescript-eslint/no-explicit-any */
import { beforeUpload } from '@/common/beforeUpload'
import { Dialog, Upload } from '@/components/ui'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { errorMessage } from '@/utils/responseMessages'
import { notification } from 'antd'
import { AxiosError } from 'axios'
import React, { useState } from 'react'

interface Props {
    isOpen: boolean
    setIsOpen: (x: boolean) => void
    id: string
    shipmentDetailCall: any
}

const AddShipmentModal: React.FC<Props> = ({ isOpen, setIsOpen, id, shipmentDetailCall }) => {
    const [csvFileList, setCsvFileList] = useState<File[]>([])
    const [isUploading, setIsUploading] = useState(false)

    const handleCsvUpload = async () => {
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
            setIsOpen(false)
            shipmentDetailCall.refetch()
        } catch (error) {
            if (error instanceof AxiosError) errorMessage(error)
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)}>
            <div className="max-w-md mx-auto bg-white shadow-lg rounded-xl p-6 space-y-5">
                <div className="flex justify-between items-center border-b pb-3">
                    <h3 className="text-lg font-semibold text-gray-700">Upload CSV File</h3>
                </div>
                <div className="p-6 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition">
                    <div className="flex items-center justify-center">
                        <Upload
                            beforeUpload={beforeUpload}
                            fileList={csvFileList}
                            onChange={(files) => setCsvFileList(files)}
                            onFileRemove={(files) => setCsvFileList(files)}
                        />
                    </div>

                    <p className="text-xs text-gray-500 mt-2 text-center">Upload a CSV file containing bulk data</p>
                </div>
                <button
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleCsvUpload}
                    disabled={!csvFileList.length || isUploading}
                >
                    {isUploading ? 'Uploading...' : <>Upload File</>}
                </button>
            </div>
        </Dialog>
    )
}

export default AddShipmentModal
