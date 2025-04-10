/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormContainer, FormItem, Input } from '@/components/ui'
import React from 'react'
import CommonSelect from './CommonSelect'
import { Field, FieldProps } from 'formik'
import FilterSelect from '@/views/sales/urlShortner/FilterSelect'
import { SubDataTypeArray } from './PageSettingsCommon'
import { values } from 'lodash'
import { DatePicker } from 'antd'
import moment from 'moment'

const GenderArray = [
    { label: 'Men', value: 'men' },
    { label: 'Women', value: 'women' },
]

const dataTypeValidationArray = [
    { name: 'data_type.start_date', label: 'Start Date' },
    { name: 'data_type.end_date', label: 'End Date' },
]

const dataTypeArray = [
    { label: 'Default', value: 'Default' },
    { label: 'banner', value: 'banner' },
    { label: 'wishlist', value: 'wishlist' },
    { label: 'purchases', value: 'purchases' },
    { label: 'searches', value: 'searches' },
    { label: 'spotlight', value: 'spotlight' },
    { label: 'products', value: 'products' },
    { label: 'brands', value: 'brands' },
    { label: 'post', value: 'post' },
    { label: 'creator', value: 'creator' },
    { label: 'Sub categories', value: 'categories' },
]

interface DataTypesProps {
    handleAddFilter: any
    showAddFilter: any
    handleAddFilters: any
    handleRemoveFilter: any
    values: any
}

const DataTypes = ({ handleAddFilter, handleAddFilters, handleRemoveFilter, showAddFilter, values }: DataTypesProps) => {
    console.log('Is DataType', values?.data_type?.type)

    return (
        <FormContainer className="grid grid-cols-2 gap-3">
            <CommonSelect needClassName label="Data Types" name="data_type.type" options={dataTypeArray} className="w-2/3" />
            {values?.data_type?.type === 'brands' && (
                <>
                    <FormItem label="IS LOGO">
                        <Field type="checkbox" name="data_type.is_logo" component={Input} />
                    </FormItem>
                </>
            )}
            {['wishlist', 'purchases', 'searches', 'spotlight', 'products'].includes(values?.data_type?.type) && (
                <FormItem label="Hide Info">
                    <Field type="checkbox" name="data_type.hide_info" component={Input} />
                </FormItem>
            )}
            {['categories', 'brands', 'purchases', 'searches', 'spotlight', 'products'].includes(values?.data_type?.type) &&
                !values?.data_type.validation && (
                    <>
                        {dataTypeValidationArray.map((item, key) => (
                            <FormItem key={key} label={item.label}>
                                <Field name={item.name}>
                                    {({ field, form }: FieldProps) => (
                                        <DatePicker
                                            disabled={values?.data_type.validation}
                                            className="w-1/2"
                                            value={field.value ? moment(field.value, 'YYYY-MM-DD') : null}
                                            onChange={(value) => {
                                                form.setFieldValue(item.name, value ? value.format('YYYY-MM-DD') : '')
                                            }}
                                        />
                                    )}
                                </Field>
                            </FormItem>
                        ))}
                    </>
                )}
            {['categories', 'brands', 'purchases', 'searches', 'spotlight', 'products'].includes(values?.data_type?.type) && (
                <FormItem label="In Trend Duration(in Days)">
                    <Field
                        type="number"
                        placeholder="Enter Validation in Days"
                        className="w-1/2"
                        name="data_type.validation"
                        component={Input}
                        min="0"
                    />
                </FormItem>
            )}
            <CommonSelect
                needClassName
                label="Sub Data Types"
                name="data_type.sub_data_type"
                options={SubDataTypeArray}
                className="w-2/3"
            />

            <FormItem label="Filters" className="col-span-1 w-[60%] h-[80%]">
                <Field type="text" name="data_type.filters" placeholder="Place your header Text" component={Input} min="0" />
            </FormItem>

            <CommonSelect needClassName label="Division Select" options={GenderArray} name="division_select" className="w-1/2" />

            <FilterSelect
                handleAddFilter={handleAddFilter}
                showAddFilter={showAddFilter}
                handleAddFilters={handleAddFilters}
                handleRemoveFilter={handleRemoveFilter}
            />

            <FormItem label="Data Count" className="col-span-1 w-[60%] h-[80%]">
                <Field type="number" name="data_type.data_count" placeholder="Place Data Count" component={Input} min="0" />
            </FormItem>
        </FormContainer>
    )
}

export default DataTypes
