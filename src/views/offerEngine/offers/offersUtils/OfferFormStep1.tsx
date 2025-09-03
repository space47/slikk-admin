/* eslint-disable @typescript-eslint/no-explicit-any */
import { Checkbox, FormContainer, FormItem, Input, Select } from '@/components/ui'
import { useAppDispatch, useAppSelector } from '@/store'
import { fetchCompanyStore } from '@/store/slices/companyStoreSlice/companyStore.slice'
import { companyStore } from '@/store/types/companyStore.types'
import { Field, FieldArray, FieldProps } from 'formik'
import React, { useEffect } from 'react'
import { OfferFromList1 } from './offersCommon'
import FullDateForm from '@/common/FullDateForm'
import { FaPlus, FaTrash } from 'react-icons/fa'
import FullTimePicker from '@/common/FullTimePicker'

interface props {
    values: any
}

const OfferFormStep1 = ({ values }: props) => {
    const dispatch = useAppDispatch()
    const { storeResults } = useAppSelector((state: { companyStore: companyStore }) => state.companyStore)

    useEffect(() => {
        dispatch(fetchCompanyStore())
    }, [dispatch])

    return (
        <div>
            <FormItem label="Store">
                <Field name="store">
                    {({ form, field }: FieldProps) => {
                        const selectedStore = storeResults.find((option) => option.id === field.value?.id)

                        return (
                            <div className="flex flex-col gap-1 w-full max-w-md">
                                <Select
                                    className="w-full"
                                    options={storeResults}
                                    getOptionLabel={(option) => option.code}
                                    getOptionValue={(option) => option.id}
                                    value={selectedStore || null}
                                    onChange={(newVal) => {
                                        form.setFieldValue('store', newVal)
                                    }}
                                />
                            </div>
                        )
                    }}
                </Field>
            </FormItem>
            <FormContainer className="grid grid-cols-2 gap-6">
                {OfferFromList1?.slice(0, 2)?.map((item, key) => {
                    return (
                        <FormItem label={item.label} asterisk={item?.required} key={key}>
                            <Field
                                name={item.name}
                                component={item.type === 'checkbox' ? Checkbox : Input}
                                placeholder={`Enter ${item.label}`}
                                type={item.type}
                            />
                        </FormItem>
                    )
                })}
            </FormContainer>
            <FormContainer className="grid grid-cols-2 gap-6 mt-7">
                <FullDateForm label="Start Date" name="start_date" fieldname="start_date" />
                <FullDateForm label="End Date" name="end_date" fieldname="end_date" />
            </FormContainer>
            <FormContainer className="grid grid-cols-2 gap-6">
                {OfferFromList1?.slice(2)?.map((item, key) => {
                    return (
                        <FormItem label={item.label} asterisk={item?.required} key={key}>
                            <Field
                                name={item.name}
                                component={item.type === 'checkbox' ? Checkbox : Input}
                                placeholder={`Enter ${item.label}`}
                                type={item.type}
                            />
                        </FormItem>
                    )
                })}
            </FormContainer>
            <FormItem label="Daily Time Windows">
                <FieldArray name="daily_time_windows">
                    {({ push, remove }) => (
                        <div className="xl:w-[500px]">
                            <button
                                type="button"
                                className="flex items-center gap-1 p-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 mb-8"
                                onClick={() => push({ start_date: '', end_date: '' })}
                            >
                                <FaPlus size={18} /> Add
                            </button>
                            {values?.daily_time_windows?.map((_, index: number) => (
                                <div key={index} className="flex  gap-2 mb-2 ">
                                    <FullTimePicker
                                        needClass
                                        customClass="w-full"
                                        label="Start Date"
                                        name={`daily_time_windows.${index}.start`}
                                        fieldname={`daily_time_windows.${index}.start`}
                                    />
                                    <FullTimePicker
                                        needClass
                                        customClass="w-full"
                                        label="End Date"
                                        name={`daily_time_windows.${index}.end`}
                                        fieldname={`daily_time_windows.${index}.end`}
                                    />
                                    <button type="button" onClick={() => remove(index)} className="p-1 text-red-500 hover:text-red-700">
                                        <FaTrash size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </FieldArray>
            </FormItem>
        </div>
    )
}

export default OfferFormStep1
