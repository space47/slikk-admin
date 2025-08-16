/* eslint-disable @typescript-eslint/no-explicit-any */
import FullDateForm from '@/common/FullDateForm'
import { FormContainer, FormItem, Input } from '@/components/ui'
import { Field } from 'formik'
import React from 'react'
import { LockFormArray } from './productCommon'
import CommonFilterSelect from '@/common/ComonFilterSelect'

interface ProductLockCommonFormProps {
    isEdit: boolean
    filterId: any
    setFilterId: React.Dispatch<React.SetStateAction<any>>
    values: any
}

const ProductLockCommonForm = ({ isEdit, filterId, setFilterId, values }: ProductLockCommonFormProps) => {
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

                    {/* Common Filter */}
                    <CommonFilterSelect isCsv isSku isEdit={isEdit} filterId={filterId} setFilterId={setFilterId} values={values} />
                </div>
            </div>
        </div>
    )
}

export default ProductLockCommonForm
