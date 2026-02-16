/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormContainer, FormItem, Input, Upload } from '@/components/ui'
import React from 'react'
import { FormArray } from './markdownCommon'
import { Field, FieldProps } from 'formik'
import FullDateForm from '@/common/FullDateForm'
import CommonSelectByLabel from '@/common/CommonSelectByLabel'
import { beforeUpload } from '@/common/beforeUpload'
import CommonFilterSelect from '@/common/ComonFilterSelect'

interface props {
    values: any
    setProductCsvFile: React.Dispatch<React.SetStateAction<any>>
    filterId?: any
    setFilterId?: any
    isEdit?: boolean
}

const apply_Array = [
    { label: 'MRP', value: 'MRP' },
    { label: 'SP', value: 'SP' },
]
const discountType_Array = [
    { label: 'PERCENT OFF', value: 'PERCENTOFF' },
    { label: 'FLAT OFF', value: 'FLATOFF' },
    { label: 'FLAT PRICE', value: 'FLATPRICE' },
]

const MarkdownCommonForm = ({ values, setProductCsvFile, filterId, setFilterId, isEdit }: props) => {
    return (
        <div>
            <FormContainer className="grid grid-cols-2 gap-4">
                {FormArray.map((item, key) => {
                    return (
                        <FormItem key={key} label={item?.label}>
                            <Field
                                name={item?.name}
                                component={Input}
                                type={item?.type}
                                placeholder={item?.placeholder}
                                className="w-3/4"
                            />
                        </FormItem>
                    )
                })}
                <FullDateForm label="Start Date" name="start_date" fieldname="start_date" />
                <FullDateForm label="End Date" name="end_date" fieldname="end_date" />

                <CommonSelectByLabel label="Discount Type" name="discount_type" fieldname="discount_type" options={discountType_Array} />

                <CommonSelectByLabel label="Price Type" name="apply_on" fieldname="apply_on" options={apply_Array} />
            </FormContainer>
            <FormItem label="Product Filters File" className="grid mt-8 w-1/3 bg-gray-100 p-2">
                <Field name="productFiltersFile">
                    {({ form }: FieldProps<any>) => (
                        <>
                            <div className="font-semibold flex justify-start ">Upload Csv</div>
                            <Upload
                                beforeUpload={beforeUpload}
                                fileList={values.productFiltersFile}
                                className="flex justify-center mt-6"
                                onFileRemove={(files) => {
                                    form.setFieldValue('productFiltersFile', files)
                                }}
                                onChange={(files) => {
                                    form.setFieldValue('productFiltersFile', files)
                                    setProductCsvFile(files)
                                }}
                            />
                        </>
                    )}
                </Field>
            </FormItem>

            <div>
                <h3>Product Selection</h3>
            </div>

            <div className="items-start">
                <CommonFilterSelect isCsv isSku isEdit={isEdit} filterId={filterId} setFilterId={setFilterId} values={values} />
            </div>
        </div>
    )
}

export default MarkdownCommonForm
