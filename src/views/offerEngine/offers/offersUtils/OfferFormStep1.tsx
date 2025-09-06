/* eslint-disable @typescript-eslint/no-explicit-any */
import { Checkbox, FormContainer, FormItem, Input, Select } from '@/components/ui'
import { useAppDispatch, useAppSelector } from '@/store'
import { fetchCompanyStore } from '@/store/slices/companyStoreSlice/companyStore.slice'
import { companyStore } from '@/store/types/companyStore.types'
import { Field, FieldArray, FieldProps } from 'formik'
import React, { useEffect, useState } from 'react'
import { OfferFromList1, WEEKDAY_ARRAY } from './offersCommon'
import FullDateForm from '@/common/FullDateForm'
import { FaPlus, FaTrash } from 'react-icons/fa'
import FullTimePicker from '@/common/FullTimePicker'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'

interface props {
    values: any
}

const OfferFormStep1 = ({ values }: props) => {
    const dispatch = useAppDispatch()
    const { storeResults } = useAppSelector((state: { companyStore: companyStore }) => state.companyStore)
    const [groupDataToSend, setGroupDataToSend] = useState<any[]>([])

    const fetchGroupValue = async () => {
        try {
            const response = await axioisInstance.get(`/notification/groups?p=1&page_size=1000&is_active=true`)
            const data = response?.data?.data.results
            setGroupDataToSend(data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchGroupValue()
    }, [])

    useEffect(() => {
        dispatch(fetchCompanyStore())
    }, [dispatch])

    return (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <FormContainer className="grid grid-cols-3 md:grid-cols-2 gap-6 mb-6">
                <FormItem label="Store" className="col-span-1 w-full mb-6 bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <Field name="store">
                        {({ form, field }: FieldProps) => {
                            const selectedOptions = Array.isArray(field.value)
                                ? storeResults.filter((option) => field.value.includes(option.id))
                                : []

                            return (
                                <div className="w-full max-w-md">
                                    <Select
                                        isMulti
                                        className="w-full"
                                        options={storeResults}
                                        getOptionLabel={(option) => option?.code}
                                        getOptionValue={(option) => String(option?.id)}
                                        value={selectedOptions}
                                        onChange={(newVal) => {
                                            form.setFieldValue(
                                                'store',
                                                newVal.map((option: any) => option.id),
                                            )
                                        }}
                                    />
                                </div>
                            )
                        }}
                    </Field>
                </FormItem>
                <FormItem label="WeekDays" className="col-span-1 w-full mb-6 bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <Field name="weekday_number">
                        {({ form, field }: FieldProps) => {
                            const selectedOptions = Array.isArray(field.value)
                                ? WEEKDAY_ARRAY.filter((option) => field.value.includes(option.value))
                                : []

                            return (
                                <div className="w-full max-w-md">
                                    <Select
                                        isMulti
                                        className="w-full"
                                        options={WEEKDAY_ARRAY}
                                        getOptionLabel={(option) => option?.label}
                                        getOptionValue={(option) => String(option?.value)}
                                        value={selectedOptions}
                                        onChange={(newVal) => {
                                            form.setFieldValue(
                                                'weekday_number',
                                                newVal.map((option: any) => option.value),
                                            )
                                        }}
                                    />
                                </div>
                            )
                        }}
                    </Field>
                </FormItem>

                <FormItem label={'Group Ids'} className={'col-span-1 w-full mb-6 bg-gray-50 p-4 rounded-lg border border-gray-100'}>
                    <Field name="groupId">
                        {({ field, form }: FieldProps<any>) => {
                            return (
                                <Select
                                    isClearable
                                    options={groupDataToSend}
                                    value={groupDataToSend.find((option) => option.name === field.value)}
                                    getOptionLabel={(option: any) => option.name}
                                    getOptionValue={(option: any) => option.name}
                                    onChange={(option) => {
                                        const value = option ? option.value : ''
                                        form.setFieldValue(field.name, option)
                                        console.log('FIELD.NAME', value)
                                    }}
                                    onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
                                />
                            )
                        }}
                    </Field>
                    {values?.groupId && (
                        <div className="mt-4 px-4 py-2 rounded-md bg-blue-50 border border-blue-200 text-blue-800 font-medium shadow-sm w-fit">
                            Users: {values?.groupId?.user?.length || 0}
                        </div>
                    )}
                </FormItem>
            </FormContainer>

            {/* First Row of Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {OfferFromList1?.slice(0, 2)?.map((item, key) => (
                    <FormItem
                        label={item.label}
                        asterisk={item?.required}
                        key={key}
                        className="bg-gray-50 p-4 rounded-lg border border-gray-100"
                    >
                        <Field
                            name={item.name}
                            component={item.type === 'checkbox' ? Checkbox : Input}
                            placeholder={`Enter ${item.label}`}
                            type={item.type}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-shadow shadow-sm hover:shadow-md"
                        />
                    </FormItem>
                ))}
            </div>

            {/* Date Range Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <FullDateForm label="Start Date" name="start_date" fieldname="start_date" />
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <FullDateForm label="End Date" name="end_date" fieldname="end_date" />
                </div>
            </div>

            {/* Second Row of Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {OfferFromList1?.slice(2)?.map((item, key) => (
                    <FormItem
                        label={item.label}
                        asterisk={item?.required}
                        key={key}
                        className="bg-gray-50 p-4 rounded-lg border border-gray-100"
                    >
                        <Field
                            name={item.name}
                            component={item.type === 'checkbox' ? Checkbox : Input}
                            placeholder={`Enter ${item.label}`}
                            type={item.type}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-shadow shadow-sm hover:shadow-md"
                        />
                    </FormItem>
                ))}
            </div>

            {/* Daily Time Windows Section */}
            <FormItem label="Daily Time Windows" className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                <FieldArray name="daily_time_windows">
                    {({ push, remove }) => (
                        <div className="xl:w-[500px]">
                            <button
                                type="button"
                                className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mb-6 transition-colors shadow-sm hover:shadow-md"
                                onClick={() => push({ start: '', end: '' })}
                            >
                                <FaPlus size={16} /> Add Time Window
                            </button>

                            <div className="space-y-4">
                                {values?.daily_time_windows?.map((_, index: number) => (
                                    <div
                                        key={index}
                                        className="flex flex-col sm:flex-row gap-3 p-4 bg-white rounded-lg border border-gray-200 shadow-sm"
                                    >
                                        <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <FullTimePicker
                                                needClass
                                                customClass="w-full"
                                                label="Start Time"
                                                name={`daily_time_windows.${index}.start`}
                                                fieldname={`daily_time_windows.${index}.start`}
                                            />
                                            <FullTimePicker
                                                needClass
                                                customClass="w-full"
                                                label="End Time"
                                                name={`daily_time_windows.${index}.end`}
                                                fieldname={`daily_time_windows.${index}.end`}
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => remove(index)}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors self-center"
                                            aria-label="Remove time window"
                                        >
                                            <FaTrash size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {values?.daily_time_windows?.length > 0 && (
                                <p className="text-sm text-gray-500 mt-4">
                                    {values.daily_time_windows.length} time window{values.daily_time_windows.length !== 1 ? 's' : ''}{' '}
                                    configured
                                </p>
                            )}
                        </div>
                    )}
                </FieldArray>
            </FormItem>
        </div>
    )
}

export default OfferFormStep1
