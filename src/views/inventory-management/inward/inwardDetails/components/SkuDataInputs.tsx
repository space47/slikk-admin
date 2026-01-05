/* eslint-disable @typescript-eslint/no-explicit-any */
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { errorMessage } from '@/utils/responseMessages'
import { notification } from 'antd'
import { AxiosError } from 'axios'
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'

type formData = {
    location: string
    sku: string
    barcode?: string
    skid?: string
    [key: string]: string | undefined
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
    setFailedQc: (x: any) => void
    setQcFailedData: (x: any) => void
}

const SkuDataInputs = ({
    formData,
    setQualitySentInput,
    setBatchNumberInput,
    setSkuWiseData,
    company,
    setFormData,
    setCounter,
    setFailedQc,
    setQcFailedData,
}: props) => {
    const [qcFailed, setQcFailed] = useState(false)
    const { grn_id } = useParams()

    const handleAddSku = async () => {
        try {
            let response = await axioisInstance.get(`/goods/qualitycheck?grn_id=${grn_id}&sku=${formData?.sku}`)
            let results = response?.data?.data?.results ?? response?.data?.results ?? []
            if (!results || results.length === 0) {
                response = await axioisInstance.get(`/goods/qualitycheck?grn_id=${grn_id}&barcode=${formData?.sku}`)
                results = response?.data?.data?.results ?? response?.data?.results ?? []
            }

            if (results && results.length > 0) {
                const dataToBeMatched = results[0]
                const newSkuData = {
                    sku: dataToBeMatched?.sku,
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
                setSkuWiseData([newSkuData])
                await handleAddGrn(newSkuData)
            } else {
                setFailedQc((prev: any) => {
                    const arr = Array.isArray(prev) ? prev : []
                    const idx = arr.findIndex((item) => item.sku === formData?.sku && item.location === (formData?.location ?? ''))

                    if (idx !== -1) {
                        const updated = [...arr]
                        const currentQty = Number(updated[idx]?.quantity_sent) || 0
                        updated[idx] = {
                            ...updated[idx],
                            quantity_sent: currentQty + 1,
                        }
                        return updated
                    }

                    localStorage.setItem(
                        `failed_${grn_id}`,
                        JSON.stringify([...arr, { sku: formData?.sku || '', location: formData?.location || '', quantity_sent: 1 }]),
                    )

                    return [
                        ...arr,
                        {
                            sku: formData?.sku || '',
                            location: formData?.location || '',
                            quantity_sent: 1,
                        },
                    ]
                })
                notification.error({ message: 'Item not found by SKU or Barcode in this GRN' })
            }
        } catch (error) {
            setFailedQc((prev: any) => {
                const arr = Array.isArray(prev) ? prev : []
                const idx = arr.findIndex((item) => item.sku === formData?.sku && item.location === (formData?.location ?? ''))
                if (idx !== -1) {
                    const updated = [...arr]
                    const currentQty = Number(updated[idx]?.quantity_sent) || 0
                    updated[idx] = {
                        ...updated[idx],
                        quantity_sent: currentQty + 1,
                    }
                    return updated
                }

                localStorage.setItem(
                    `failed_${grn_id}`,
                    JSON.stringify([...arr, { sku: formData?.sku || '', location: formData?.location || '', quantity_sent: 1 }]),
                )

                return [
                    ...arr,
                    {
                        sku: formData?.sku || '',
                        location: formData?.location || '',
                        quantity_sent: 1,
                    },
                ]
            })
            notification.error({
                message: 'No SKU or Barcode found',
            })
        }
    }

    const handleAddGrn = async (skuData: any) => {
        let qc_failed = 0
        let qc_Set = 1
        let qc_passed = 1
        if (qcFailed) {
            qc_failed = 1
            qc_Set = 1
            qc_passed = 0
        }
        const body = {
            sku: skuData?.sku || '',
            location: skuData?.location || '',
            quantity_received: qc_Set,
            qc_passed: qc_passed,
            qc_failed: qc_failed,
            action: 'add',
        }
        setQcFailedData({
            failed: qc_failed,
            set: qc_Set,
            passed: qc_passed,
        })

        try {
            const response = await axioisInstance.patch(`/goods/qualitycheck/${skuData?.id}`, body)
            notification.success({ message: response?.data?.message || 'Successfully Added' })
            setCounter((prev: number) => prev + 1)
        } catch (error: any) {
            setFailedQc((prev: any) => {
                const arr = Array.isArray(prev) ? prev : []
                const idx = arr.findIndex((item) => item.sku === formData?.sku && item.location === (formData?.location ?? ''))
                if (idx !== -1) {
                    const updated = [...arr]
                    const currentQty = Number(updated[idx]?.quantity_sent) || 0
                    updated[idx] = { ...updated[idx], quantity_sent: currentQty + 1 }
                    return updated
                }
                localStorage.setItem(
                    `failed_${grn_id}`,
                    JSON.stringify([...arr, { sku: formData?.sku || '', location: formData?.location || '', quantity_sent: 1 }]),
                )

                return [
                    ...arr,
                    {
                        sku: formData?.sku || '',
                        location: formData?.location || '',
                        quantity_sent: 1,
                    },
                ]
            })
            if (error instanceof AxiosError) {
                errorMessage(error)
            }
        }

        setFormData((prev: any) => ({
            ...prev,
            sku: '',
            barcode: '',
            skid: '',
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
        <div className="space-y-6 p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-md">
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
                <input
                    name="location"
                    type="text"
                    placeholder="Enter Location"
                    className="w-full max-w-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-400 outline-none"
                    value={formData.location}
                    onChange={handleInputChange}
                />
            </div>
            <div className="flex items-center space-x-3">
                <input
                    name="qc_failed"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={qcFailed}
                    onChange={(e) => setQcFailed(e.target.checked)}
                />
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Is QC Failed</label>
            </div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Sku/Barcode</label>
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-4 items-center">
                <div className="space-y-2 col-span-3">
                    <input
                        name="sku"
                        type="search"
                        placeholder={`Enter SKU/BARCODE `}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-400 outline-none"
                        value={formData?.sku || ''}
                        onChange={handleInputChange}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleAddSku()
                        }}
                    />
                </div>
            </div>
        </div>
    )
}

export default SkuDataInputs
