/* eslint-disable @typescript-eslint/no-explicit-any */
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'
import React from 'react'
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

const SkuDataInputs = ({
    formData,
    skuWiseData,
    setQualitySentInput,
    setBatchNumberInput,
    setSkuWiseData,
    batchNumberInput,
    company,
    setFormData,
    setCounter,
}: props) => {
    const { document_number } = useParams()
    const handleAddSku = async () => {
        try {
            const response = await axioisInstance.get(`/goods/qualitycheck?grn_number=${document_number}&sku=${formData.sku}`)
            const datax = response?.data?.data?.results?.find(
                (item: any) => item?.sku === formData.sku && item?.location?.toLowerCase() === formData.location?.toLowerCase(),
            )

            if (response?.data?.data && response?.data?.data?.results?.length > 0) {
                const newSkuData = {
                    sku: formData.sku,
                    qc_passed: 1,
                    quantity_received: 1,
                    qc_failed: 0,
                    location: formData?.location || '',
                    document_number: datax?.document_number,
                    company_id: Number(company),
                    quantity_sent: datax?.quantity_sent || 1,
                    batch_number: datax?.batch_number ?? '',
                }

                // Update state
                setSkuWiseData([newSkuData])

                // Call handleAddGrn with fresh skuData
                await handleAddGrn(newSkuData, datax?.sent_to_inventory, datax?.qc_done_by?.mobile)
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
        const body = {
            document_number: document_number,
            company_id: company,
            sku: skuData?.sku || '',
            location: skuData?.location || '',
            quantity_sent: skuData?.quantity_sent || 1,
            quantity_received: 1,
            qc_passed: 1,
            qc_failed: 0,
            batch_number: skuData?.batch_number || '',
            sent_to_inventory: is_inventory || false,
            qc_done_by: qcBy || '',
            action: 'add',
        }

        try {
            const response = await axioisInstance.post(`/goods/qualitycheck`, body)
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
