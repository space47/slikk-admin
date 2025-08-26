/* eslint-disable @typescript-eslint/no-explicit-any */
import { Checkbox, FormContainer, FormItem, Input, Select } from '@/components/ui'
import React, { useEffect } from 'react'
import { GET_REWARD_TYPE, OfferDiscountType, offersFormList } from './offersCommon'
import { Field, FieldArray, FieldProps } from 'formik'
import FullDateForm from '@/common/FullDateForm'
import CommonSelect from '@/views/appsSettings/pageSettings/CommonSelect'
import { useAppDispatch, useAppSelector } from '@/store'
import { companyStore } from '@/store/types/companyStore.types'
import { FaPlus, FaTrash } from 'react-icons/fa'
import { fetchCompanyStore } from '@/store/slices/companyStoreSlice/companyStore.slice'
import MultiFilterSelect from '@/common/MultipleFilterSelect'
import FullTimePicker from '@/common/FullTimePicker'

interface OfferFormsProps {
    buyFilterId: string | null
    getFilterId: string | null
    setBuyFilterId: (id: string | undefined) => void
    setGetFilterId: (id: string | undefined) => void
    values: any
}

const OfferForms = ({ buyFilterId, getFilterId, setBuyFilterId, setGetFilterId, values }: OfferFormsProps) => {
    const dispatch = useAppDispatch()
    const { storeResults } = useAppSelector((state: { companyStore: companyStore }) => state.companyStore)

    const handleSetBuyFilterId = (id: string) => {
        setBuyFilterId(id)
    }

    const handleSetGetFilterId = (id: string) => {
        setGetFilterId(id)
    }

    useEffect(() => {
        dispatch(fetchCompanyStore())
    }, [dispatch])

    return (
        <FormContainer className="">
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
                {offersFormList?.map((item, key) => {
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
                <FormItem label="Buy Filter" asterisk={true}>
                    <MultiFilterSelect setFilterId={handleSetBuyFilterId} filterId={buyFilterId as string} fieldName="buyFilter" />
                </FormItem>
                <FormItem label="Get Filter" asterisk={true}>
                    <MultiFilterSelect setFilterId={handleSetGetFilterId} filterId={getFilterId as string} fieldName="getFilter" />
                </FormItem>
            </FormContainer>
            <FormContainer className="grid grid-cols-2 gap-6 mt-7">
                <FullDateForm label="Start Date" name="start_date" fieldname="start_date" />
                <FullDateForm label="End Date" name="end_date" fieldname="end_date" />
            </FormContainer>
            <FormContainer className="grid grid-cols-2 gap-6 mt-7">
                <CommonSelect needClassName className="w-full" options={OfferDiscountType} name="discount_type" label="Discount Type" />
                <CommonSelect needClassName className="w-full" options={GET_REWARD_TYPE} name="get_reward_type" label="Get Reward Type" />
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
        </FormContainer>
    )
}

export default OfferForms
