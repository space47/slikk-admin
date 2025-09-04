/* eslint-disable @typescript-eslint/no-explicit-any */
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'

type formData = {
    location: string
    sku: string
}

interface props {
    formData: formData
    skuWiseData: any[]
    setQualitySentInput: any
    setBatchNumberInput: any
    setSkuWiseData: any
    batchNumberInput: any
    company: any
    setFormData: any
    setCounter: (x: any) => number
}

const SkuDataInputs = ({ formData, setQualitySentInput, setBatchNumberInput, setSkuWiseData, company, setFormData, setCounter }: props) => {
    const [qcFailed, setQcFailed] = useState(false)
    const { document_number } = useParams()
    const handleAddSku = async () => {
        try {
            const response = await axioisInstance.get(`/goods/qualitycheck?grn_number=${document_number}&sku=${formData.sku}`)
            const dataToBeMatched =
                response?.data?.data?.results?.find(
                    (item: any) => item?.sku === formData.sku && item?.location?.toLowerCase() === formData.location?.toLowerCase(),
                ) || response?.data?.data?.results?.find((item: any) => item?.sku === formData.sku)

            if (response?.data?.data && response?.data?.data?.results?.length > 0) {
                const newSkuData = {
                    sku: formData.sku,
                    qc_passed: 1,
                    quantity_received: 1,
                    qc_failed: 0,
                    location: formData?.location || '',
                    document_number: dataToBeMatched?.document_number,
                    company_id: Number(company),
                    quantity_sent: dataToBeMatched?.quantity_sent || 1,
                    batch_number: dataToBeMatched?.batch_number ?? '',
                    id: dataToBeMatched?.id,
                }

                // Update state
                setSkuWiseData([newSkuData])

                // Call handleAddGrn with fresh skuData
                await handleAddGrn(newSkuData, dataToBeMatched?.sent_to_inventory, dataToBeMatched?.qc_done_by?.mobile)
            } else {
                notification.error({
                    message: 'Item not found in this GRN',
                })
            }
        } catch (error) {
            console.error('Error during API call:', error)
        }
    }

    const handleAddGrn = async (skuData: any, is_inventory: boolean, qcBy: string) => {
        let qc_failed = 0
        let qc_Set = 1
        if (qcFailed) {
            qc_failed = 1
            qc_Set = -1
        }

        const body = {
            sku: skuData?.sku || '',
            location: skuData?.location || '',
            quantity_sent: skuData?.quantity_sent || 1,
            quantity_received: qc_Set,
            qc_passed: qc_Set,
            qc_failed: qc_failed,
            action: 'add',
        }

        try {
            const response = await axioisInstance.patch(`/goods/qualitycheck/${skuData?.id}`, body)
            notification.success({
                message: response?.data?.message || 'Successfully Added',
            })
            setCounter((prev: number) => prev + 1)
        } catch (error) {
            notification.error({
                message: 'Failed to Add',
            })
            console.error('Error during API call:', error)
        }

        setFormData((prev: any) => ({
            ...prev,
            sku: '',
        }))
        setQualitySentInput('')
        setBatchNumberInput('')
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prevData: any) => ({
            ...prevData,
            [name]: value,
        }))
    }

    return (
        <div>
            <div className="mb-4">
                <label className="block text-gray-700">Location</label>
                <input
                    name="location"
                    type="text"
                    placeholder="Enter Location"
                    className="w-auto xl:w-1/6 border border-gray-300 rounded p-2"
                    value={formData.location}
                    onChange={handleInputChange}
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">Is Qc Failed</label>
                <input
                    name="qc_failed"
                    type="checkbox"
                    className="ml-2"
                    checked={qcFailed}
                    onChange={(e) => {
                        setQcFailed(e.target.checked)
                    }}
                />
            </div>
            <div className="grid grid-cols-4 gap-2">
                <div className="mb-4">
                    <label className="block text-gray-700">SKU</label>
                    <input
                        name="sku"
                        type="search"
                        placeholder="Enter SKU"
                        className="xl:w-[400px] border border-gray-300 rounded p-2"
                        value={formData.sku}
                        onChange={handleInputChange}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleAddSku()
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    )
}

export default SkuDataInputs
