/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormContainer, FormItem, Input, Upload } from '@/components/ui'
import React from 'react'
import { FormArray } from './markdownCommon'
import { Field, FieldProps } from 'formik'
import FullDateForm from '@/common/FullDateForm'
import CommonSelectByLabel from '@/common/CommonSelectByLabel'
import SearchStrings from '@/common/SearchStrings'
import { FaSearch } from 'react-icons/fa'
import EasyTable from '@/common/EasyTable'
import { beforeUpload } from '@/common/beforeUpload'

interface props {
    skuInput: string
    setSkuInput: React.Dispatch<React.SetStateAction<string>>
    handleAddFilter: any
    showAddFilter: any
    handleAddFilters: any
    handleRemoveFilter: any
    filters: any
    values: any
    setCsvFile: any
    handleAddSku: () => void
    skuSearchData: any[]
    columns: (
        | {
              header: string
              accessorKey: string
              cell: ({ row }: any) => JSX.Element
          }
        | {
              header: string
              accessorKey: string
              cell?: undefined
          }
        | {
              header: string
              cell: ({ row }: any) => JSX.Element
              accessorKey?: undefined
          }
    )[]
    setProductCsvFile: React.Dispatch<React.SetStateAction<any>>
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

const MarkdownCommonForm = ({
    handleAddFilter,
    showAddFilter,
    handleAddFilters,
    handleRemoveFilter,
    filters,
    values,
    setCsvFile,
    handleAddSku,
    skuSearchData,
    columns,
    skuInput,
    setSkuInput,
    setProductCsvFile,
}: props) => {
    return (
        <div className="">
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
                <br />
                <div className="mb-4 w-full gap-7">
                    <label className="block text-gray-700">SKU</label>
                    <div className="flex gap-2 items-center">
                        <div>
                            <input
                                name="sku"
                                type="search"
                                placeholder="Enter SKU"
                                className="w-full border border-gray-300 rounded p-2"
                                value={skuInput}
                                onChange={(e) => setSkuInput(e.target.value)}
                            />
                        </div>
                        <div>
                            <FaSearch className="text-2xl cursor-pointer" onClick={handleAddSku} />
                        </div>
                    </div>
                    <br />
                    <div className="xl:w-[1200px]">
                        <EasyTable mainData={skuSearchData} columns={columns} overflow />
                    </div>
                </div>
                <br />
                <br />
            </div>

            <div className="items-start">
                <SearchStrings
                    handleAddFilter={handleAddFilter}
                    showAddFilter={showAddFilter}
                    handleAddFilters={handleAddFilters}
                    handleRemoveFilter={handleRemoveFilter}
                    filters={filters}
                    values={values}
                    setCsvFile={setCsvFile}
                />
            </div>
        </div>
    )
}

export default MarkdownCommonForm
