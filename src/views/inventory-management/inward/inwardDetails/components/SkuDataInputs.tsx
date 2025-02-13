/* eslint-disable @typescript-eslint/no-explicit-any */
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'
import React from 'react'

type formData = {
    location: string
    sku: string
}

interface props {
    formData: formData
    getSkuData: any[]
    skuWiseData: any[]
    data: any
    setQualitySentInput: any
    setBatchNumberInput: any
    setSkuWiseData: any
    batchNumberInput: any
    company: any
    setFormData: any
}

const SkuDataInputs = ({
    formData,

    getSkuData,
    skuWiseData,
    data,
    setQualitySentInput,
    setBatchNumberInput,
    setSkuWiseData,
    batchNumberInput,
    company,
    setFormData,
}: props) => {
    const handleAddSku = async () => {
        const { sku, location } = formData

        if (!sku.trim()) return

        const getSameData = getSkuData?.find((item) => item.sku === sku)

        const updatedData = skuWiseData.map((item) => {
            console.log('check start')
            if (item.sku === sku) {
                return {
                    ...item,
                    qc_passed: item.qc_passed + 1,
                    quantity_received: item.quantity_received + 1,
                    qc_failed: item.quantity_received + 1 - (item.qc_passed + 1),
                    location: location || item.location,
                    quantity_sent: item.quantity_sent + 1,
                }
            }
            return item
        })

        if (getSameData) {
            updatedData[0] = {
                sku,
                qc_passed: getSameData?.qc_passed + 1,
                quantity_sent: getSameData?.quantity_sent + 1,
                quantity_received: getSameData?.quantity_received + 1,
                qc_failed: getSameData.quantity_received + 1 - (getSameData.qc_passed + 1),
                location: formData?.location ? [getSameData?.location, formData.location].filter(Boolean).join(',') : getSameData?.location,
            }
        }

        if (!updatedData.find((item) => item.sku === sku) && !getSameData) {
            updatedData[0] = {
                sku,
                qc_passed: 1,
                quantity_received: 1,
                qc_failed: 0,
                location: location || '',
                document_number: data?.document_number,
                company_id: Number(company),
                quantity_sent: 1,
                batch_number: batchNumberInput ?? '',
            }
        }

        setSkuWiseData(updatedData)

        if (getSameData) {
            try {
                const firstSku = updatedData[0]

                const response = await axioisInstance.patch(`/goods/qualitycheck/${getSameData?.id}`, firstSku)
                console.log('Response:', response.data)
                notification.success({
                    message: response?.data?.message || 'Successfully Updated',
                })
            } catch (error) {
                notification.error({
                    message: 'Failed to Update',
                })
                console.error('Error during API call:', error)
            }
        }
        if (!getSameData) {
            try {
                const firstSku = updatedData[0]

                const response = await axioisInstance.post(`/goods/qualitycheck`, firstSku)
                console.log('Response:', response.data)
                notification.success({
                    message: response?.data?.message || 'Successfully added',
                })
            } catch (error) {
                notification.error({
                    message: 'Failed to add',
                })
                console.error('Error during API call:', error)
            }
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
            <div className="grid grid-cols-4 gap-2">
                <div className="mb-4">
                    <label className="block text-gray-700">SKU</label>
                    <input
                        name="sku"
                        type="search"
                        placeholder="Enter SKU"
                        className="w-2/3 border border-gray-300 rounded p-2"
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
