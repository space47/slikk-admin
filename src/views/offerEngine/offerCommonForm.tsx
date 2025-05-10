/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Checkbox, FormContainer, FormItem, Input, Select, Upload } from '@/components/ui'
import React, { useEffect, useState } from 'react'
import { offerFormArray } from './offerEngineCommon'
import { Field, FieldProps } from 'formik'
import { DatePicker } from 'antd'
import moment from 'moment'
import { useAppDispatch, useAppSelector } from '@/store'
import { FILTER_STATE } from '@/store/types/filters.types'
import { IoMdAddCircle } from 'react-icons/io'
import { MdCancel } from 'react-icons/md'
import { beforeUpload } from '@/common/beforeUpload'

const apply_offer_type_array = [
    { label: 'In Sets of Minimum Quantity', value: 'MIN_QTY_SETS' },
    { label: 'Greater than or Equal to Minimum Quantity', value: 'GTE_MIN_QTY' },
]
const apply_price_type_array = [
    { label: 'MOST EXPENSIVE', value: 'MOST_EXPENSIVE' },
    { label: 'LEAST EXPENSIVE', value: 'LEAST_EXPENSIVE' },
]
const offerType_array = [
    { label: 'PERCENT OFF', value: 'PERCENTOFF' },
    { label: 'FLAT OFF', value: 'FLATOFF' },
    { label: 'FLAT PRICE', value: 'FLATPRICE' },
    { label: 'BILL BUSTER', value: 'BILLBUSTER' },
    { label: 'BUY X GET Y', value: 'BXGY' },
]

const daysOfWeek_array = [
    { label: 'Monday', value: '1' },
    { label: 'Tuesday', value: '2' },
    { label: 'Wednesday', value: '3' },
    { label: 'Thursday', value: '4' },
    { label: 'Friday', value: '5' },
    { label: 'Saturday', value: '6' },
    { label: 'Sunday', value: '7' },
]

interface props {
    skuInput: any
    setSkuInput: any
    showAddFilter: any
    filters: any[]
    handleAddFilter: any
    handleAddFilters: any
    handleRemoveFilter: any
    values: any
    initialValue?: any
    editMode?: any
    handleRemoveImage?: any
}

const offerCommonForm = ({
    setSkuInput,
    skuInput,
    showAddFilter,
    filters,
    handleAddFilter,
    handleAddFilters,
    handleRemoveFilter,
    values,
    initialValue,
    editMode,
    handleRemoveImage,
}: props) => {
    return (
        <div className="grid grid-cols-2 gap-4">
            <FormContainer>
                {offerFormArray?.map((item, key) => {
                    return (
                        <FormItem key={key} label={item?.label}>
                            <Field
                                name={item?.name}
                                type={item?.type}
                                placeholder={`Enter ${item?.label}`}
                                component={item?.type === 'checkbox' ? Checkbox : Input}
                            />
                        </FormItem>
                    )
                })}
                <FormItem label="Days">
                    <div className="flex flex-col">
                        <Field name="days">
                            {({ field, form }: FieldProps<any>) => {
                                console.log('Field Value', field)

                                const selectedValue = daysOfWeek_array.find((option) => option.value === field.value)
                                console.log('Selected Value', selectedValue)
                                return (
                                    <Select
                                        isMulti
                                        placeholder="Discount Tags"
                                        options={daysOfWeek_array}
                                        getOptionLabel={(option) => option.label}
                                        getOptionValue={(option) => option.value}
                                        onChange={(newVal) => {
                                            const newValues = newVal ? newVal.map((val) => val.value) : []
                                            form.setFieldValue(field.name, newValues)
                                        }}
                                    />
                                )
                            }}
                        </Field>
                    </div>
                </FormItem>
                <FormItem label="apply_offer_type">
                    <Field name="apply_offer_type">
                        {({ form, field }: FieldProps<any>) => {
                            const selectedCompany = apply_offer_type_array.find((option) => option.label === field?.value)

                            return (
                                <div className="flex flex-col gap-1 items-center xl:items-baseline w-full max-w-md">
                                    <Select
                                        className="w-1/2"
                                        options={apply_offer_type_array}
                                        getOptionLabel={(option) => option.label}
                                        getOptionValue={(option) => option.value}
                                        value={selectedCompany || null}
                                        onChange={(newVal) => {
                                            form.setFieldValue('apply_offer_type', newVal)
                                        }}
                                    />
                                </div>
                            )
                        }}
                    </Field>
                </FormItem>
                <FormItem label="apply_price_type">
                    <Field name="apply_price_type">
                        {({ form, field }: FieldProps<any>) => {
                            const selectedCompany = apply_price_type_array.find((option) => option.label === field?.value)

                            return (
                                <div className="flex flex-col gap-1 items-center xl:items-baseline w-full max-w-md">
                                    <Select
                                        className="w-1/2"
                                        options={apply_price_type_array}
                                        getOptionLabel={(option) => option.label}
                                        getOptionValue={(option) => option.value}
                                        value={selectedCompany || null}
                                        onChange={(newVal) => {
                                            form.setFieldValue('apply_price_type', newVal)
                                        }}
                                    />
                                </div>
                            )
                        }}
                    </Field>
                </FormItem>
                <FormItem label="offer_type">
                    <Field name="offer_type">
                        {({ form, field }: FieldProps<any>) => {
                            const selectedCompany = offerType_array.find((option) => option.label === field?.value)

                            return (
                                <div className="flex flex-col gap-1 items-center xl:items-baseline w-full max-w-md">
                                    <Select
                                        className="w-1/2"
                                        options={offerType_array}
                                        getOptionLabel={(option) => option.label}
                                        getOptionValue={(option) => option.value}
                                        value={selectedCompany || null}
                                        onChange={(newVal) => {
                                            form.setFieldValue('offer_type', newVal)
                                        }}
                                    />
                                </div>
                            )
                        }}
                    </Field>
                </FormItem>

                <FormItem label="Start Date">
                    <Field name="start_date">
                        {({ field, form }: any) => (
                            <DatePicker
                                showTime
                                placeholder=""
                                value={field.value ? moment(field.value, 'YYYY-MM-DD HH:mm:ss') : null}
                                onChange={(value) => {
                                    form.setFieldValue('start_date', value ? value.format('YYYY-MM-DD HH:mm:ss') : '')
                                }}
                            />
                        )}
                    </Field>
                </FormItem>
                <FormItem label="End Date">
                    <Field name="end_date">
                        {({ field, form }: any) => (
                            <DatePicker
                                showTime
                                placeholder=""
                                value={field.value ? moment(field.value, 'YYYY-MM-DD HH:mm:ss') : null}
                                onChange={(value) => {
                                    form.setFieldValue('end_date', value ? value.format('YYYY-MM-DD HH:mm:ss') : '')
                                }}
                            />
                        )}
                    </Field>
                </FormItem>

                <div className="grid grid-cols-4 gap-2">
                    <div className="mb-4">
                        <label className="block text-gray-700">SKU</label>
                        <input
                            name="sku"
                            type="search"
                            placeholder="Enter SKU"
                            className="w-2/3 border border-gray-300 rounded p-2"
                            value={skuInput}
                            onChange={(e) => setSkuInput(e.target.value)}
                            // onKeyDown={(e) => {
                            //     if (e.key === 'Enter') {
                            //         handleAddSku()
                            //     }
                            // }}
                        />
                    </div>
                </div>

                <FormItem label="SEARCH STRINGS">
                    <FormContainer className="items-center mt-4">
                        <button onClick={handleAddFilter} type="button">
                            <IoMdAddCircle className="text-3xl text-green-500" />
                        </button>
                    </FormContainer>

                    {showAddFilter.map((_, index: any) => (
                        <FormItem key={index} className="flex  gap-2">
                            <div className="flex gap-3 items-center">
                                <Field name={`filtersAdd[${index}]`} key={index}>
                                    {({ field, form }: FieldProps<any>) => (
                                        <Select
                                            isMulti
                                            placeholder={`Filter Tags ${index + 1}`}
                                            options={filters}
                                            getOptionLabel={(option) => option.label}
                                            getOptionValue={(option) => option.value}
                                            onChange={(newVal) => {
                                                const newValues = newVal ? newVal.map((val) => val.value) : []
                                                form.setFieldValue(field.name, newValues)
                                            }}
                                            className="w-3/4"
                                        />
                                    )}
                                </Field>
                                <div className="">
                                    <button type="button" className="" onClick={() => handleRemoveFilter(index)}>
                                        <MdCancel className="text-xl text-red-500" />
                                    </button>
                                </div>
                            </div>
                        </FormItem>
                    ))}

                    {showAddFilter.length > 0 && (
                        <>
                            <Field>
                                {({ form }: FieldProps<any>) => (
                                    <Button variant="new" onClick={() => handleAddFilters(form.values)} type="button">
                                        Search Strings
                                    </Button>
                                )}
                            </Field>
                        </>
                    )}
                </FormItem>

                {editMode ? (
                    <FormContainer className="bg-gray-200 bg-opacity-40 flex justify-center flex-col w-[500px] items-center h-[160px] rounded-xl mb-2 overflow-scroll scrollbar-hide">
                        {initialValue.background_image ? (
                            <div className="flex flex-col items-center justify-center w-[150px]">
                                <img
                                    src={initialValue.background_image}
                                    alt={`Image `}
                                    className="w-[150px] h-[40px] flex object-contain "
                                />
                                <button className="text-red-500 text-md " onClick={() => handleRemoveImage('background_image')}>
                                    <MdCancel className="text-red-500 bg-none text-lg" />
                                </button>
                            </div>
                        ) : (
                            'No Image'
                        )}
                        <FormContainer className=" ">
                            <FormItem label="" className="grid grid-rows-2">
                                <Field name="image">
                                    {({ form }: FieldProps<any>) => (
                                        <>
                                            <div className="font-semibold flex justify-center">Image</div>
                                            <Upload
                                                beforeUpload={beforeUpload}
                                                fileList={values.image} // uploadedd the file
                                                className="flex justify-center"
                                                onFileRemove={(files) => form.setFieldValue('image', files)}
                                                onChange={(files) => form.setFieldValue('image', files)}
                                            />
                                        </>
                                    )}
                                </Field>
                            </FormItem>
                        </FormContainer>
                    </FormContainer>
                ) : (
                    <FormContainer className="bg-gray-200 bg-opacity-40 flex justify-center flex-col w-[500px] items-center h-[160px] rounded-xl mb-2 overflow-scroll scrollbar-hide">
                        <div className="font-semibold mb-1">Image</div>

                        <FormContainer className=" mt-5 ">
                            <FormItem label="" className="grid grid-rows-2">
                                <Field name="image">
                                    {({ field, form }: FieldProps<any>) => (
                                        <>
                                            <Upload
                                                beforeUpload={beforeUpload}
                                                fileList={values.image}
                                                className="items-center flex justify-center"
                                                onFileRemove={(files) => form.setFieldValue('image', files)}
                                                onChange={(files) => {
                                                    console.log('OnchangeFiles', files, field.name, values.image)
                                                    form.setFieldValue('image', files)
                                                }}
                                            />
                                        </>
                                    )}
                                </Field>
                            </FormItem>
                        </FormContainer>
                    </FormContainer>
                )}
            </FormContainer>
        </div>
    )
}

export default offerCommonForm
