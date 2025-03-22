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

const AddGroup = () => {
    const [csvFile, setCSVFile] = useState<any>()
    const filters = useAppSelector<FILTER_STATE>((state) => state.filters)
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
            const response = await axioisInstance.post(`/notification/groups`, form(values, csvFile, mobileNumbers))
            console.log(response.data)
            notification.success({
                message: 'success',
                description: response.data.message || 'Successfully added group',
            })

            console.log('finish')
        } catch (error) {
            console.log(error)
            notification.error({
                message: 'Failure',
                description: 'Failed to add group',
            })
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
                    <Form className="w-2/3">
                        <FormContainer>
                            <FormContainer>
                                <h3>Groups</h3>
                                <FormContainer className="grid grid-cols-2 gap-6">
                                    {headingGroup.map((item, key) => (
                                        <FormItem key={key} label={item.label} className={item.className}>
                                            <Field type={item.type} name={item.name} placeholder={item.placeholder} component={Input} />
                                        </FormItem>
                                    ))}
                                </FormContainer>
                                <FormItem label="CSV for User" className="flex gap-2">
                                    <div className="flex ">
                                        <input type="file" accept=".csv" onChange={handleCSVFileChange} />
                                        <span>
                                            <MdDelete className="text-xl cursor-pointer" onClick={() => setMobileNumbers([])} />
                                        </span>
                                    </div>
                                </FormItem>
                            </FormContainer>
                            <FormContainer>
                                <FormContainer className="w-1/2">
                                    <h3>Cart</h3>

                                    <FormItem label="All Open Cart">
                                        <Field
                                            type="checkbox"
                                            name="allOpenCart"
                                            component={Input}
                                            className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </FormItem>
                                    <FormItem className="col-span-1 w-full sm:w-1/2 space-y-2">
                                        <div className="flex flex-col">
                                            <label className="text-gray-700 font-semibold mb-1">Cart Start</label>
                                            <Field
                                                type="date"
                                                name="cart_start"
                                                component={Input}
                                                className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <label className="text-gray-700 font-semibold mb-1">Cart End</label>
                                            <Field
                                                type="date"
                                                name="cart_end"
                                                component={Input}
                                                className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </FormItem>
                                </FormContainer>
                            </FormContainer>
                            <h3>User:</h3> <br />
                            <div className="grid grid-cols-2 gap-4">
                                {userProfileGroup.map((item, key) => {
                                    return (
                                        <FormContainer key={key} className="space-y-4">
                                            <FormItem label={item.label} className="col-span-1 w-full sm:w-1/2 space-y-2">
                                                <div className="flex flex-col">
                                                    <label className="text-gray-700 font-semibold mb-1">{item.label} Start</label>
                                                    <Field
                                                        type={item.type}
                                                        name={item.start_name}
                                                        component={Input}
                                                        className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                                <div className="flex flex-col mt-4">
                                                    <label className="text-gray-700 font-semibold mb-1">{item.label} End</label>
                                                    <Field
                                                        type={item.type}
                                                        name={item.end_name}
                                                        component={Input}
                                                        className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                            </FormItem>
                                        </FormContainer>
                                    )
                                })}
                                <FormItem asterisk label="Gender" className="col-span-1 w-1/2">
                                    <Field name="gender">
                                        {({ field, form }: FieldProps<any>) => {
                                            return (
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
                                                />
                                            )
                                        }}
                                    </Field>
                                </FormItem>
                            </div>
                        </FormContainer>
                        {/* order................................................................................................. */}
                        <FormContainer>
                            <h3>Order:</h3> <br />
                            <FormContainer className="grid grid-cols-2 gap-4">
                                {orderGroup.map((item, key) => {
                                    return (
                                        <FormContainer key={key} className="space-y-4">
                                            <FormItem label={item.label} className="col-span-1 w-full sm:w-1/2 space-y-2">
                                                <div className="flex flex-col">
                                                    <label className="text-gray-700 font-semibold mb-1">{item.start_placeholder} </label>
                                                    <Field
                                                        type={item.type}
                                                        name={item.start_name}
                                                        component={Input}
                                                        placeholder={item.start_placeholder}
                                                        className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                                <div className="flex flex-col mt-4">
                                                    <label className="text-gray-700 font-semibold mb-1">{item.min_placeholder} </label>
                                                    <Field
                                                        type={item.type}
                                                        name={item.end_name}
                                                        component={Input}
                                                        placeholder={item.min_placeholder}
                                                        className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                            </FormItem>
                                        </FormContainer>
                                    )
                                })}
                                <FormItem asterisk label="Delivery Type" className="col-span-1 w-1/2">
                                    <Field name="order_delivery_type">
                                        {({ field, form }: FieldProps<any>) => {
                                            return (
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
                                                />
                                            )
                                        }}
                                    </Field>
                                </FormItem>
                            </FormContainer>
                        </FormContainer>
                        {/* OrderItem................................ */}
                        <FormContainer className="grid grid-cols-2 gap-10">
                            <h3>Order Item</h3> <br />
                            <FormItem label="Basket Size" className="col-span-1 w-full sm:w-1/2 space-y-2">
                                <div className="flex flex-col">
                                    <label className="text-gray-700 font-semibold mb-1">Max Basket Size</label>{' '}
                                    <Field
                                        type="number"
                                        name="max_basket_size"
                                        placeholder="Max"
                                        component={Input}
                                        className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-gray-700 font-semibold mb-1">Min Basket Size</label>
                                    <Field
                                        type="number"
                                        name="min_basket_size"
                                        placeholder="Min"
                                        component={Input}
                                        className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </FormItem>
                            <FormItem label="Filters">
                                <Field name="tag_filters">
                                    {({ field, form }: FieldProps<any>) => {
                                        return (
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
                                            />
                                        )
                                    }}
                                </Field>
                            </FormItem>
                        </FormContainer>
                        {/* Location */}
                        <FormContainer>
                            <h3>Loyalty:</h3>
                            <br />
                            <FormItem asterisk label="Loyalty" className="col-span-1 w-1/2">
                                <Field name="loyalty">
                                    {({ field, form }: FieldProps<any>) => {
                                        return (
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
                                            />
                                        )
                                    }}
                                </Field>
                            </FormItem>
                            <FormContainer className="grid grid-cols-2 gap-6">
                                {LoyaltyArray.map((item, key) => {
                                    return (
                                        <FormContainer key={key} className="space-y-4">
                                            <FormItem label={item.label} className="col-span-1 w-full sm:w-1/2 space-y-2">
                                                <div className="flex flex-col">
                                                    <label className="text-gray-700 font-semibold mb-1">{item.start_placeholder} </label>
                                                    <Field
                                                        type={item.type}
                                                        name={item.start_name}
                                                        component={Input}
                                                        placeholder={item.start_placeholder}
                                                        className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                                <div className="flex flex-col mt-4">
                                                    <label className="text-gray-700 font-semibold mb-1">{item.min_placeholder} </label>
                                                    <Field
                                                        type={item.type}
                                                        name={item.end_name}
                                                        component={Input}
                                                        placeholder={item.min_placeholder}
                                                        className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                            </FormItem>
                                        </FormContainer>
                                    )
                                })}
                            </FormContainer>
                        </FormContainer>

                        <FormContainer>
                            <h3>Location</h3> <br />
                            <FormContainer className="grid grid-cols-2 gap-10">
                                {groupLocation.map((item, key) => (
                                    <FormItem key={key} label={item.label}>
                                        <Field type={item.type} name={item.name} placeholder={item.placeholder} component={Input} />
                                    </FormItem>
                                ))}
                            </FormContainer>
                        </FormContainer>

                        <FormContainer className="flex justify-end mt-5">
                            <Button type="reset" className="mr-2 bg-gray-600" onClick={() => resetForm()}>
                                Reset
                            </Button>
                            <Button variant="solid" type="submit" className=" text-white">
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
