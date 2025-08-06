/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'

import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import { Field, Form, Formik, FieldProps } from 'formik'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import Papa from 'papaparse'
import {
    DeliveryOptions,
    form,
    genderOptions,
    groupLocation,
    headingGroup,
    LoyaltyArray,
    LoyaltyOptions,
    orderGroup,
    userProfileGroup,
} from './commonTypesGroup/userProfile'
import { useAppDispatch, useAppSelector } from '@/store'
import { FILTER_STATE } from '@/store/types/filters.types'
import { getAllFiltersAPI } from '@/store/action/filters.action'
import { notification } from 'antd'
import { MdDelete } from 'react-icons/md'
import { Checkbox, Spinner } from '@/components/ui'
import { AxiosError } from 'axios'

const AddGroup = () => {
    const filters = useAppSelector<FILTER_STATE>((state) => state.filters)
    const [spinner, setSpinner] = useState(false)
    const [csvFile, setCSVFile] = useState<any>()
    const [mobileNumbers, setMobileNumbers] = useState<string[]>([])
    const initialValue = {}

    const dispatch = useAppDispatch()
    useEffect(() => {
        dispatch(getAllFiltersAPI())
    }, [])

    const handleCSVFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null
        if (file) {
            setCSVFile(file)
            parseCSV(file)
        }
    }

    const parseCSV = (file: File) => {
        Papa.parse(file, {
            complete: (result) => {
                console.log('Parsed CSV Result:', result)
                const extractedMobileNumbers = result.data.map((row: any) => row.mobile).filter(Boolean)
                setMobileNumbers(extractedMobileNumbers)
                console.log('Mobile Numbers:', extractedMobileNumbers)
            },
            header: true,
            skipEmptyLines: true,
        })
    }

    const handleSubmit = async (values: any) => {
        try {
            setSpinner(true)
            const response = await axioisInstance.post(`/notification/groups`, form(values, csvFile, mobileNumbers))
            console.log(response.data)
            notification.success({
                message: 'success',
                description: response.data.message || 'Successfully added group',
            })

            console.log('finish')
        } catch (error) {
            if (error instanceof AxiosError) {
                notification.error({ message: error?.response?.data?.message || error?.response?.data?.data?.message || 'Failed to add' })
            }
        } finally {
            setSpinner(false)
        }
    }
    return (
        <div>
            <Formik
                enableReinitialize
                initialValues={initialValue}
                // validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ resetForm }) => (
                    <Form className="w-full p-6 bg-white rounded-xl shadow-xl space-y-8">
                        {/* Groups Section */}
                        <FormContainer className="space-y-6 p-6 bg-white rounded-lg shadow">
                            <h3 className="text-lg font-semibold text-gray-800">Groups</h3>
                            <FormContainer className="grid grid-cols-2 gap-6">
                                {headingGroup.map((item, key) => (
                                    <FormItem key={key} label={item.label} className={item.className}>
                                        <Field
                                            type={item.type}
                                            name={item.name}
                                            placeholder={item.placeholder}
                                            component={item?.type === 'checkbox' ? Checkbox : Input}
                                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </FormItem>
                                ))}
                            </FormContainer>
                            <FormItem label="CSV for User" className="flex flex-col gap-2">
                                <div className="flex items-center gap-4">
                                    <input
                                        type="file"
                                        accept=".csv"
                                        className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                        onChange={handleCSVFileChange}
                                    />
                                    <MdDelete
                                        className="text-xl text-red-500 cursor-pointer hover:text-red-700"
                                        onClick={() => {
                                            setMobileNumbers([])
                                            setCSVFile('')
                                            notification.info({ message: 'CSV file cleared' })
                                        }}
                                    />
                                </div>
                            </FormItem>
                        </FormContainer>

                        {/* Cart Section */}
                        <FormContainer className="p-6 bg-white rounded-lg shadow">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Cart</h3>
                            <div className="grid grid-cols-2 gap-6">
                                <FormItem label="All Open Cart" className="col-span-1">
                                    <Field
                                        type="checkbox"
                                        name="allOpenCart"
                                        component={Checkbox}
                                        className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                                    />
                                </FormItem>
                                <FormItem className="col-span-1 space-y-4">
                                    <div className="flex flex-col">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Cart Start</label>
                                        <Field
                                            type="date"
                                            name="cart_start"
                                            component={Input}
                                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Cart End</label>
                                        <Field
                                            type="date"
                                            name="cart_end"
                                            component={Input}
                                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </FormItem>
                            </div>
                        </FormContainer>

                        {/* User Section */}
                        <FormContainer className="p-6 bg-white rounded-lg shadow">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">User</h3>
                            <div className="grid grid-cols-2 gap-6">
                                {userProfileGroup.map((item, key) => (
                                    <FormItem key={key} label={item.label} className="space-y-4">
                                        <div className="flex flex-col">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">{item.label} Start</label>
                                            <Field
                                                type={item.type}
                                                name={item.start_name}
                                                component={Input}
                                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">{item.label} End</label>
                                            <Field
                                                type={item.type}
                                                name={item.end_name}
                                                component={Input}
                                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </FormItem>
                                ))}
                                <FormItem label="Gender" className="col-span-1">
                                    <Field name="gender">
                                        {({ field, form }: FieldProps<any>) => (
                                            <Select
                                                isMulti
                                                field={field}
                                                form={form}
                                                options={genderOptions}
                                                value={genderOptions.find((option) => option.value === field.value)}
                                                onChange={(newVal) => {
                                                    const newValues = newVal ? newVal.map((val) => val.value) : []
                                                    form.setFieldValue(field.name, newValues)
                                                }}
                                                className="w-full"
                                            />
                                        )}
                                    </Field>
                                </FormItem>
                            </div>
                        </FormContainer>

                        {/* Order Section */}
                        <FormContainer className="p-6 bg-white rounded-lg shadow">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Order</h3>
                            <div className="grid grid-cols-2 gap-6">
                                {orderGroup.map((item, key) => (
                                    <FormItem key={key} label={item.label} className="space-y-4">
                                        <div className="flex flex-col">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">{item.start_placeholder}</label>
                                            <Field
                                                type={item.type}
                                                name={item.start_name}
                                                component={Input}
                                                placeholder={item.start_placeholder}
                                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">{item.min_placeholder}</label>
                                            <Field
                                                type={item.type}
                                                name={item.end_name}
                                                component={Input}
                                                placeholder={item.min_placeholder}
                                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </FormItem>
                                ))}
                                <FormItem label="Delivery Type" className="col-span-1">
                                    <Field name="order_delivery_type">
                                        {({ field, form }: FieldProps<any>) => (
                                            <Select
                                                isMulti
                                                field={field}
                                                form={form}
                                                options={DeliveryOptions}
                                                value={DeliveryOptions.find((option) => option.value === field.value)}
                                                onChange={(newVal) => {
                                                    const newValues = newVal ? newVal.map((val) => val.value) : []
                                                    form.setFieldValue(field.name, newValues)
                                                }}
                                                className="w-full"
                                            />
                                        )}
                                    </Field>
                                </FormItem>
                            </div>
                        </FormContainer>

                        {/* Order Item Section */}
                        <FormContainer className="p-6 bg-white rounded-lg shadow">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Item</h3>
                            <div className="grid grid-cols-2 gap-6">
                                <FormItem label="Basket Size" className="space-y-4">
                                    <div className="flex flex-col">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Max Basket Size</label>
                                        <Field
                                            type="number"
                                            name="max_basket_size"
                                            placeholder="Max"
                                            component={Input}
                                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Min Basket Size</label>
                                        <Field
                                            type="number"
                                            name="min_basket_size"
                                            placeholder="Min"
                                            component={Input}
                                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </FormItem>
                                <FormItem label="Filters">
                                    <Field name="tag_filters">
                                        {({ field, form }: FieldProps<any>) => (
                                            <Select
                                                isMulti
                                                placeholder="Select Filter Tags"
                                                options={filters.filters}
                                                getOptionLabel={(option) => option.label}
                                                getOptionValue={(option) => option.value}
                                                onChange={(newVal) => {
                                                    const newValues = newVal ? newVal.map((val) => val.value) : []
                                                    form.setFieldValue(field.name, newValues)
                                                }}
                                                className="w-full"
                                            />
                                        )}
                                    </Field>
                                </FormItem>
                            </div>
                        </FormContainer>

                        {/* Loyalty Section */}
                        <FormContainer className="p-6 bg-white rounded-lg shadow">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Loyalty</h3>
                            <div className="grid grid-cols-2 gap-6">
                                <FormItem label="Loyalty" className="col-span-1">
                                    <Field name="loyalty">
                                        {({ field, form }: FieldProps<any>) => (
                                            <Select
                                                isMulti
                                                field={field}
                                                form={form}
                                                options={LoyaltyOptions}
                                                value={LoyaltyOptions.find((option) => option.value === field.value)}
                                                onChange={(newVal) => {
                                                    const newValues = newVal ? newVal.map((val) => val.value) : []
                                                    form.setFieldValue(field.name, newValues)
                                                }}
                                                className="w-full"
                                            />
                                        )}
                                    </Field>
                                </FormItem>
                                {LoyaltyArray.map((item, key) => (
                                    <FormItem key={key} label={item.label} className="space-y-4">
                                        <div className="flex flex-col">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">{item.start_placeholder}</label>
                                            <Field
                                                type={item.type}
                                                name={item.start_name}
                                                component={Input}
                                                placeholder={item.start_placeholder}
                                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">{item.min_placeholder}</label>
                                            <Field
                                                type={item.type}
                                                name={item.end_name}
                                                component={Input}
                                                placeholder={item.min_placeholder}
                                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </FormItem>
                                ))}
                            </div>
                        </FormContainer>

                        {/* Location Section */}
                        <FormContainer className="p-6 bg-white rounded-lg shadow">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Location</h3>
                            <div className="grid grid-cols-2 gap-6">
                                {groupLocation.map((item, key) => (
                                    <FormItem key={key} label={item.label}>
                                        <Field
                                            type={item.type}
                                            name={item.name}
                                            placeholder={item.placeholder}
                                            component={Input}
                                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </FormItem>
                                ))}
                            </div>
                        </FormContainer>

                        {/* Form Actions */}
                        <FormContainer className="flex justify-end gap-4 mt-8">
                            <Button
                                type="reset"
                                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                                onClick={() => resetForm()}
                            >
                                Reset
                            </Button>
                            <Button
                                variant="solid"
                                type="submit"
                                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
                            >
                                <span>{spinner && <Spinner size={20} color="white" />}</span>
                                Submit
                            </Button>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default AddGroup
