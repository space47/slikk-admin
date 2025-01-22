/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormContainer, FormItem, Input } from '@/components/ui'
import React from 'react'
import { FormArray } from './markdownCommon'
import { Field } from 'formik'
import FullDateForm from '@/common/FullDateForm'
import CommonSelectByLabel from '@/common/CommonSelectByLabel'
import SearchStrings from '@/common/SearchStrings'

interface props {
    handleAddFilter: any
    showAddFilter: any
    handleAddFilters: any
    handleRemoveFilter: any
    filters: any
    values: any
    setCsvFile: any
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
                <SearchStrings
                    handleAddFilter={handleAddFilter}
                    showAddFilter={showAddFilter}
                    handleAddFilters={handleAddFilters}
                    handleRemoveFilter={handleRemoveFilter}
                    filters={filters}
                    values={values}
                    setCsvFile={setCsvFile}
                />
            </FormContainer>
        </div>
    )
}

export default MarkdownCommonForm
