/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dropdown } from '@/components/ui'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'

type formData = {
    location: string
    sku: string
    barcode?: string
    skid?: string
    [key: string]: string | undefined
}

const TypeOptionsArray = [
    { label: 'sku', value: 'sku' },
    { label: 'barcode', value: 'barcode' },
    { label: 'skid', value: 'skid' },
]

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
}: props) => {
    const [qcFailed, setQcFailed] = useState(false)
    const { document_number } = useParams()
    const [curremtSelectedPage, setCurrentSelectedPage] = useState(TypeOptionsArray[0])

    const handleProductSelect = (value: any) => {
        const selected = TypeOptionsArray.find((item) => item.value === value)
        if (selected) {
            setCurrentSelectedPage(selected)
        }
    }
    const handleAddSku = async () => {
        try {
            const selectedKey = curremtSelectedPage.value
            const selectedValue = formData[selectedKey] || ''
            const response = await axioisInstance.get(`/goods/qualitycheck?grn_number=${document_number}&${selectedKey}=${selectedValue}`)
            const dataToBeMatched =
                response?.data?.data?.results?.find((item: any) => item?.location?.toLowerCase() === formData.location?.toLowerCase()) ||
                response?.data?.data?.results?.find((item: any) => item?.[selectedKey] === selectedValue)

            console.log('response', dataToBeMatched)

            if (response?.data?.data && response?.data?.data?.results?.length > 0) {
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
                const results = response?.data?.data?.results ?? response?.data?.results ?? null

                if (Array.isArray(results) && results.length === 0) {
                    setFailedQc((prev: any) => {
                        const arr = Array.isArray(prev) ? prev : []
                        const idx = arr.findIndex((item) => item.sku === selectedValue && item.location === (formData?.location ?? ''))

                        if (idx !== -1) {
                            const updated = [...arr]
                            const currentQty = Number(updated[idx]?.quantity_sent) || 0
                            updated[idx] = {
                                ...updated[idx],
                                quantity_sent: currentQty + 1,
                            }
                            return updated
                        }

                        return [
                            ...arr,
                            {
                                sku: selectedValue || '',
                                location: formData?.location || '',
                                quantity_sent: 1,
                            },
                        ]
                    })
                }
                notification.error({
                    message: 'Item not found in this GRN',
                })
            }
        } catch (error) {
            console.error('Error during API call:', error)
        }
    }

    const handleAddGrn = async (skuData: any) => {
        let qc_failed = 0
        let qc_Set = 1
        if (qcFailed) {
            qc_failed = 1
            qc_Set = -1
        }

        console.log('here')

        const body = {
            sku: skuData?.sku || '',
            location: skuData?.location || '',
            quantity_received: qc_Set,
            qc_passed: qc_Set,
            qc_failed: qc_failed,
            action: 'add',
        }

        console.log('body')

        try {
            console.log('body')
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
            {/* Location */}
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

            {/* QC Failed */}
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

            {/* Dynamic Search + Dropdown */}
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-4 items-center">
                {/* Search */}
                <div className="space-y-2 col-span-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {curremtSelectedPage.label.toUpperCase()}
                    </label>
                    <input
                        name={curremtSelectedPage.value}
                        type="search"
                        placeholder={`Enter ${curremtSelectedPage.label}`}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-400 outline-none"
                        value={formData[curremtSelectedPage.value] || ''}
                        onChange={handleInputChange}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleAddSku()
                        }}
                    />
                </div>

                {/* Dropdown */}
                <div className="text-xl font-bold xl:mt-5">
                    <Dropdown
                        className="w-full  rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 px-4 py-2 text-xl  font-bold text-gray-800 dark:text-gray-200 shadow-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                        title={curremtSelectedPage?.value ? curremtSelectedPage.label : 'Select'}
                        onSelect={(val) => handleProductSelect(val)}
                    >
                        {TypeOptionsArray?.map((item, key) => (
                            <DropdownItem
                                key={key}
                                eventKey={item.value}
                                className="px-4 py-2 hover:bg-blue-100 dark:hover:bg-gray-700 cursor-pointer"
                            >
                                <span>{item.label}</span>
                            </DropdownItem>
                        ))}
                    </Dropdown>
                </div>
            </div>
        </div>
    )
}

export default SkuDataInputs
