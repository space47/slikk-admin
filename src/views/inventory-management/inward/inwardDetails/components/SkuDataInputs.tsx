/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'
import React from 'react'
import { uniq } from 'lodash'

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
    setCounter: (x: any) => number
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
    setCounter,
}: props) => {
    const handleAddSku = () => {
        const { sku, location } = formData
        if (!sku.trim()) return

        const getSameData = getSkuData?.find((item) => item.sku === sku && item?.location?.toLowerCase() === location?.toLowerCase())

        const updatedData = skuWiseData.map((item) => {
            if (item.sku === sku) {
                return {
                    ...item,
                    qc_passed: item.qc_passed + 1,
                    quantity_received: item.quantity_received + 1,
                    qc_failed: item.quantity_received + 1 - (item.qc_passed + 1),
                    location: location || item.location,
                }
            }
            return item
        })

        if (getSameData) {
            updatedData[0] = {
                sku,
                qc_passed: getSameData.qc_passed + 1,
                quantity_received: getSameData.quantity_received + 1,
                qc_failed: getSameData.quantity_received + 1 - (getSameData.qc_passed + 1),
                location: getSameData?.location,
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
    }

    const handleAddGrn = async () => {
        const skuData = skuWiseData[0]
        console.log('formadta', !formData?.sku)
        const getSameData = getSkuData?.find((item) => item.sku === formData.sku)
        try {
            if (getSameData || !formData.sku) {
                const response = await axioisInstance.patch(`/goods/qualitycheck/${getSameData.id}`, skuData)
                notification.success({
                    message: response?.data?.message || 'Successfully Updated',
                })
                setCounter((prev: number) => prev + 1)
            } else {
                const response = await axioisInstance.post(`/goods/qualitycheck`, skuData)
                notification.success({
                    message: response?.data?.message || 'Successfully Added',
                })
                setCounter((prev: number) => prev + 1)
            }
        } catch (error) {
            notification.error({
                message: getSameData ? 'Failed to Update' : 'Failed to Add',
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

            <div className=" flex justify-end" onClick={handleAddGrn}>
                <Button variant="accept">Add</Button>
            </div>
        </div>
    )
}

export default SkuDataInputs
