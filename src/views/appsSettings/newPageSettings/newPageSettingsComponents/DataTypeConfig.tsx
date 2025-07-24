/* eslint-disable @typescript-eslint/no-explicit-any */
import { Checkbox, FormContainer, FormItem, Input, Select } from '@/components/ui'
import React from 'react'
import { Field, FieldProps } from 'formik'
// import FilterSelect from '@/views/sales/urlShortner/FilterSelect'
import { DatePicker } from 'antd'
import moment from 'moment'
import { useAppSelector } from '@/store'
import { DIVISION_STATE } from '@/store/types/division.types'
import CommonSelect from '../../pageSettings/CommonSelect'
import { dataTypeArray, dataTypeValidationArray } from '../../pageSettings/configurationCommon'
import { SubDataTypeArray } from '../../pageSettings/PageSettingsCommon'
import ComonFilterSelect from '@/common/ComonFilterSelect'
import BarcodeData from '../newPageSettingsUtils/BarcodeData'
import { SortArrays } from '../newPageSettingsUtils/newPageCommons'

interface DataTypesConfigProps {
    values: any
    setFilterId?: any
    filterId?: string
    setFieldValue?: any
    setBarcodeData?: any
    barcodeData: any
    isEdit?: boolean
}

const DataTypesConfig = ({ values, filterId, setFilterId, setFieldValue, setBarcodeData, barcodeData, isEdit }: DataTypesConfigProps) => {
    const divisions = useAppSelector<DIVISION_STATE>((state) => state.division)
    const formattedDivisions = divisions?.divisions?.map((item) => ({ label: item.name, value: item.name?.toLowerCase() }))

    console.log('filter Id', filterId)

    return (
        <div className="bg-gray-50">
            <FormContainer className="grid grid-cols-2 gap-3">
                <CommonSelect needClassName label="Data Types" name="data_type.type" options={dataTypeArray} className="w-full" />
                {values?.data_type?.type === 'banner' && (
                    <CommonSelect
                        needClassName
                        label="Child Data Types"
                        name="extra_info.child_data_type"
                        options={dataTypeArray}
                        className="w-full"
                    />
                )}
                {values?.data_type?.type === 'brands' && (
                    <>
                        <FormItem label="IS LOGO">
                            <Field type="checkbox" name="data_type.is_logo" component={Checkbox} />
                        </FormItem>
                    </>
                )}
                {['wishlist', 'purchases', 'searches', 'spotlight', 'products'].includes(values?.data_type?.type) && (
                    <FormItem label="Hide Info">
                        <Field type="checkbox" name="data_type.hide_info" component={Checkbox} />
                    </FormItem>
                )}
                {['categories', 'brands', 'purchases', 'searches', 'spotlight', 'products'].includes(values?.data_type?.type) &&
                    !values?.data_type.validation && (
                        <>
                            {dataTypeValidationArray?.map((item, key) => (
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
                            step={0.01}
                        />
                    </FormItem>
                )}
                <CommonSelect
                    needClassName
                    label="Sub Data Types"
                    name="data_type.sub_data_type"
                    options={SubDataTypeArray}
                    className="w-full"
                />
                <FormItem label="Page Size" className="col-span-1 w-full h-[80%]">
                    <Field type="number" name="extra_info.page_size" placeholder="Place Page Size" component={Input} min="0" step={0.01} />
                </FormItem>

                <FormItem label="Division Select">
                    <Field name="division_select">
                        {({ field, form }: FieldProps<any>) => {
                            console.log('field', field)
                            return (
                                <Select
                                    isClearable
                                    options={formattedDivisions}
                                    value={formattedDivisions.find((option) => option.value === field.value)}
                                    onChange={(option) => {
                                        const value = option ? option.value : ''
                                        form.setFieldValue(field.name, value)
                                    }}
                                    onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
                                />
                            )
                        }}
                    </Field>
                </FormItem>

                <div className="mb-4">
                    <ComonFilterSelect isEdit={isEdit ?? false} filterId={filterId} setFilterId={setFilterId} />
                </div>
                {/* sort_hightolow */}

                <CommonSelect label="Sort By" name="sort" options={SortArrays} />

                <FormItem label="Data Count" className="col-span-1 w-full h-[80%]">
                    <Field type="number" name="data_type.data_count" placeholder="Place Data Count" component={Input} min="0" step={0.01} />
                </FormItem>
                <FormItem label="Post" className="col-span-1 w-full h-[80%]">
                    <Field type="text" name="data_type.posts" placeholder="Place Posts" component={Input} min="0" step={0.01} />
                </FormItem>

                <FormItem label="Order Count" className="w-full">
                    <Field
                        type="number"
                        name="extra_info.order_count"
                        placeholder="Enter order count"
                        component={Input}
                        min="0"
                        step={0.01}
                    />
                </FormItem>
                <FormItem label="Min Order Value for Event Pass" className="w-full">
                    <Field
                        type="number"
                        name="extra_info.min_order_value_for_event_pass"
                        placeholder="Enter min order value for event pass"
                        component={Input}
                        min="0"
                        step={0.01}
                    />
                </FormItem>

                <FormItem label="Accent Color" className="col-span-1 w-full">
                    <Field type="text" name="extra_info.accent_color" placeholder="" component={Input} />
                </FormItem>
            </FormContainer>
            <div>
                <div className="p-2 ">
                    <BarcodeData setFieldValue={setFieldValue} values={values} barcodeData={barcodeData} setBarcodeData={setBarcodeData} />
                </div>
            </div>
        </div>
    )
}

export default DataTypesConfig
