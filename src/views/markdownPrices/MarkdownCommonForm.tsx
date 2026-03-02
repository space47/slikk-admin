/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, FormContainer, FormItem, Input, Upload } from '@/components/ui'
import React from 'react'
import { FormArray } from './markdownCommon'
import { Field, FieldProps } from 'formik'
import FullDateForm from '@/common/FullDateForm'

import { beforeUpload } from '@/common/beforeUpload'
import CommonFilterSelect from '@/common/ComonFilterSelect'
import { IoCloudUploadOutline } from 'react-icons/io5'
import CommonSelect from '../appsSettings/pageSettings/CommonSelect'

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
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-6 space-y-8">
                <div className="border border-gray-300 dark:border-gray-700 rounded-xl p-6 space-y-6">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Basic Information</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Enter core offer details and contribution values</p>
                    </div>

                    <FormContainer className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {FormArray.map((item, key) => (
                            <FormItem key={key} label={item?.label}>
                                <Field
                                    name={item?.name}
                                    component={Input}
                                    type={item?.type}
                                    placeholder={item?.placeholder}
                                    className="w-full"
                                />
                            </FormItem>
                        ))}
                    </FormContainer>
                </div>

                {/* OFFER CONFIGURATION SECTION */}
                <div className="border border-gray-300 dark:border-gray-700 rounded-xl p-6 space-y-6">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Offer Configuration</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Define validity period and discount application rules</p>
                    </div>

                    <FormContainer className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FullDateForm label="Start Date" name="start_date" fieldname="start_date" customCss="w-full" />
                        <FullDateForm label="End Date" name="end_date" fieldname="end_date" customCss="w-full" />
                        <CommonSelect label="Discount Type" name="discount_type" className="w-full" options={discountType_Array} />
                        <CommonSelect label="Price Type" name="apply_on" className="w-full" options={apply_Array} />
                    </FormContainer>
                </div>
            </div>

            <FormItem
                label="Product Filters File"
                className="border border-dotted border-blue-800 
               focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
               transition-all duration-200 bg-opacity-40 flex flex-col items-center rounded-xl mt-7 mb-5 p-4 overflow-auto scrollbar-hide"
            >
                <Field name="productFiltersFile">
                    {({ form }: FieldProps<any>) => (
                        <>
                            <a
                                download={'markdownPriceSample.csv'}
                                href="https://slikk-dev-assets-public.s3.ap-south-1.amazonaws.com/SampleFiles-Dashboard/MarkdownPrice+sample+file.csv"
                                className="flex bg-blue-500 text-center p-1 justify-center mr-1 font-extrabold text-white rounded-lg text-md hover:text-blue-200"
                            >
                                Click here to download sample file for the product filters
                            </a>
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
                            >
                                <div className=" text-center space-y-3">
                                    <div className="text-6xl mb-4 flex justify-center">
                                        <IoCloudUploadOutline />
                                    </div>
                                    <p className="font-semibold">
                                        <span className="text-gray-800 dark:text-white">
                                            Drop your catalog file here or click to browse
                                        </span>
                                    </p>
                                    <Button type="button" variant="blue" size="sm">
                                        Choose File
                                    </Button>
                                </div>
                            </Upload>
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
