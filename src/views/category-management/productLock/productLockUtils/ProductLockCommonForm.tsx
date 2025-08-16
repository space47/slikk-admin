/* eslint-disable @typescript-eslint/no-explicit-any */
import EasyTable from '@/common/EasyTable'
import FullDateForm from '@/common/FullDateForm'
import { FormContainer, FormItem, Input } from '@/components/ui'
import { Field } from 'formik'
import React, { useMemo, useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import { LockFormArray } from './productCommon'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import CommonFilterSelect from '@/common/ComonFilterSelect'

interface ProductLockCommonFormProps {
    isEdit: boolean
    filterId: any
    setFilterId: React.Dispatch<React.SetStateAction<any>>
    values: any
}

const ProductLockCommonForm = ({ isEdit, filterId, setFilterId, values }: ProductLockCommonFormProps) => {
    const [skuInput, setSkuInput] = useState('')

    const [skuSearchData, setSkuSearchData] = useState<any[]>([])
    const handleRemoveSku = (sku: string) => {
        setSkuSearchData((prev) => prev.filter((item) => item.sku !== sku))
    }
    const fetchSkuData = async () => {
        try {
            const response = await axioisInstance.get(`/merchant/products?sku=${skuInput}`)
            const data = response?.data?.data?.results

            setSkuSearchData((prev) => {
                const newData = Array.isArray(data) ? data : [data]
                return [...prev, ...newData.filter((item) => !prev.some((prevItem) => prevItem.sku === item.sku))]
            })
        } catch (error) {
            console.error(error)
        }
    }

    const handleAddSku = () => {
        fetchSkuData()
    }

    const columns = useMemo(
        () => [
            {
                header: 'SKU',
                accessorKey: 'sku',
                cell: ({ row }: any) => {
                    return <div>{row?.original?.sku}</div>
                },
            },
            { header: 'Barcode', accessorKey: 'barcode' },
            { header: 'Brand', accessorKey: 'brand' },
            { header: 'Category', accessorKey: 'category' },
            { header: 'Color', accessorKey: 'color' },
            { header: 'Size', accessorKey: 'size' },
            {
                header: 'Actions',
                cell: ({ row }: any) => (
                    <button className="text-red-500" onClick={() => handleRemoveSku(row.original.sku)}>
                        Remove
                    </button>
                ),
            },
        ],
        [skuSearchData],
    )

    console.log(
        'sku search data:',
        skuSearchData?.map((item) => item?.barcode),
    )

    return (
        <div className="space-y-8">
            {/* Lock Form Section */}
            <div className="bg-white shadow-md rounded-2xl p-6">
                <FormContainer className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {LockFormArray?.map((item, key) => (
                        <FormItem key={key} label={item?.label}>
                            <Field
                                name={item?.name}
                                component={Input}
                                type={item?.type}
                                placeholder={item?.placeholder}
                                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </FormItem>
                    ))}
                    <FullDateForm label="Start Date" name="start_date" fieldname="start_date" />
                    <FullDateForm label="End Date" name="end_date" fieldname="end_date" />
                </FormContainer>
            </div>

            {/* Product Selection Section */}
            <div className="bg-white shadow-md rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-6">Product Selection</h3>
                <div className="space-y-6">
                    {/* SKU Search */}
                    <div className="flex flex-col md:flex-row items-center gap-3">
                        <input
                            name="sku"
                            type="search"
                            placeholder="Enter SKU"
                            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            value={skuInput}
                            onChange={(e) => setSkuInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleAddSku()
                                }
                            }}
                        />
                        <button
                            onClick={handleAddSku}
                            className="bg-blue-600 hover:bg-blue-700 transition text-white px-4 py-2 rounded-xl flex items-center gap-2"
                        >
                            <FaSearch className="text-lg" /> Search
                        </button>
                    </div>

                    {/* SKU Table */}
                    {skuSearchData.length > 0 && (
                        <div className="w-full overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                            <EasyTable mainData={skuSearchData} columns={columns} overflow />
                        </div>
                    )}

                    {/* Common Filter */}
                    <CommonFilterSelect
                        isCsv
                        isEdit={isEdit}
                        filterId={filterId}
                        setFilterId={setFilterId}
                        barcodes={skuSearchData?.map((item) => item?.barcode)}
                        values={values}
                    />
                </div>
            </div>
        </div>
    )
}

export default ProductLockCommonForm
